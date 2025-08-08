package timeline

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	db        *gorm.DB
	once      sync.Once
	jwtSecret []byte
)

type Post struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Content   string    `gorm:"not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`
	User      Profile   `gorm:"foreignKey:UserID" json:"user"`
}

type Profile struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	Username  string    `json:"username"`
	FullName  string    `json:"full_name"`
	AvatarURL string    `json:"avatar_url"`
}

func (Profile) TableName() string {
	return "profiles"
}

func Connect() (*gorm.DB, error) {
	var err error
	once.Do(func() {
		if os.Getenv("VERCEL_ENV") == "" {
			err = godotenv.Load("../../.env")
			if err != nil {
				log.Println("Warning: .env file not found, relying on environment variables")
			}
		}

		dsn := os.Getenv("DATABASE_URL")
		if dsn == "" {
			log.Fatal("FATAL: DATABASE_URL environment variable is not set")
		}

		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			PrepareStmt: false,
			Logger:      logger.Default.LogMode(logger.Silent),
		})
		if err != nil {
			log.Fatalf("FATAL: Failed to connect to database: %v", err)
		}

		jwtSecret = []byte(os.Getenv("SUPABASE_JWT_SECRET"))
		if len(jwtSecret) == 0 {
			log.Fatal("FATAL: SUPABASE_JWT_SECRET environment variable is not set")
		}
	})
	if err != nil {
		return nil, err
	}
	return db, err
}

func GetDB() (*gorm.DB, error) {
	if db == nil {
		return Connect()
	}
	return db, nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	db, err := GetDB()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getTimeline(w, r, db)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getTimeline(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tokenString := authHeader[len("Bearer "):]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Token"})
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Token Claims"})
		return
	}
	userIDStr, ok := claims["sub"].(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid User ID in Token"})
		return
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid User ID Format"})
		return
	}
	var posts []Post
	// Fetch posts from users that the current user is following
	if err := db.Preload("User").
		Joins("JOIN follows ON posts.user_id = follows.following_id").
		Where("follows.follower_id = ?", userID).
		Order("posts.created_at DESC").
		Distinct("posts.id").
		Find(&posts).Error; err != nil {
		log.Printf("Error fetching timeline: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Failed to fetch timeline", "error": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}
