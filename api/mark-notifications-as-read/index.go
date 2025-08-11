package marknotificationsasread

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db   *gorm.DB
	once sync.Once
)

// Notification struct (minimal, only for GORM update)
type Notification struct {
	IsRead bool `gorm:"column:is_read"`
}

func (Notification) TableName() string {
	return "public.notifications"
}

// Connect initializes the database connection
func Connect() (*gorm.DB, error) {
	var err error
	once.Do(func() {
		if os.Getenv("VERCEL_ENV") == "" {
			err = godotenv.Load()
			if err != nil {
				log.Println("Warning: .env file not found, relying on environment variables")
			}
		}
		dsn := os.Getenv("DIRECT_URL") // Use DIRECT_URL for direct connection
		if dsn == "" {
			dsn = os.Getenv("DATABASE_URL") // Fallback to DATABASE_URL if DIRECT_URL is not set
		}
		if dsn == "" {
			log.Fatal("FATAL: Neither DIRECT_URL nor DATABASE_URL environment variable is set")
		}
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			PrepareStmt: false, // Disable prepared statement caching for serverless environment
		})
		if err != nil {
			log.Fatalf("FATAL: Failed to connect to database: %v", err)
		}

		sqlDB, err := db.DB()
		if err != nil {
			log.Fatalf("FATAL: Failed to get underlying sql.DB: %v", err)
		}
		sqlDB.SetMaxIdleConns(1) // Keep very few idle connections
		sqlDB.SetMaxOpenConns(1) // Limit total open connections
		sqlDB.SetConnMaxLifetime(time.Minute) // Short lifetime

		log.Println("Database connection successful and pool established.")
	})
	if err != nil {
		return nil, err
	}
	return db, nil
}

// GetDB returns the database connection pool
func GetDB() (*gorm.DB, error) {
	if db == nil {
		return Connect()
	}
	return db, nil
}

// Handler is the entry point for the Vercel serverless function
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, err := validateToken(r)
	if err != nil {
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	db, err := GetDB()
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	// Update all unread notifications for the recipient to is_read = true
	result := db.Model(&Notification{}).Where("recipient_user_id = ? AND is_read = ?", userID, false).Update("is_read", true)
	if result.Error != nil {
		http.Error(w, "Failed to mark notifications as read", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": fmt.Sprintf("%d notifications marked as read", result.RowsAffected)})
}

func validateToken(r *http.Request) (uuid.UUID, error) {
	jwtSecret := os.Getenv("SUPABASE_JWT_SECRET")
	if jwtSecret == "" {
		return uuid.Nil, fmt.Errorf("server configuration error")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return uuid.Nil, fmt.Errorf("missing Authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid token: %w", err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		sub, ok := claims["sub"].(string)
		if !ok {
			return uuid.Nil, fmt.Errorf("invalid token claims: 'sub' is missing or not a string")
		}
		userID, err := uuid.Parse(sub)
		if err != nil {
			return uuid.Nil, fmt.Errorf("invalid user ID in token")
		}
		return userID, nil
	}

	return uuid.Nil, fmt.Errorf("invalid token")
}
