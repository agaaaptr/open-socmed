package searchusers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db   *gorm.DB
	once sync.Once
)

// Profile struct matches the public.profiles table
type Profile struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	FullName  string    `json:"full_name"`
	AvatarURL string    `json:"avatar_url"`
	Website   string    `json:"website"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Profile) TableName() string {
    return "public.profiles"
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

		dsn := os.Getenv("DIRECT_URL")
		if dsn == "" {
			dsn = os.Getenv("DATABASE_URL")
		}
		if dsn == "" {
			log.Fatal("FATAL: Neither DIRECT_URL nor DATABASE_URL environment variable is set")
		}

		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			PrepareStmt: false,
		})
		if err != nil {
			log.Fatalf("FATAL: Failed to connect to database: %v", err)
		}
	})
	if err != nil {
		return nil, err
	}
	return db,
	 nil
}

// GetDB returns the existing database connection pool
func GetDB() (*gorm.DB, error) {
	if db == nil {
		return Connect()
	}
	return db, nil
}

// Handler is the entry point for the Vercel serverless function
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Search query 'q' is required", http.StatusBadRequest)
		return
	}

	db, err := GetDB()
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	var users []Profile
	searchQuery := "%" + query + "%"

	result := db.Where("username ILIKE ? OR full_name ILIKE ?", searchQuery, searchQuery).Find(&users)
	if result.Error != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
