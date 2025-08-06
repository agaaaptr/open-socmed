package followers

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
}

func (Profile) TableName() string {
    return "public.profiles"
}

// Follow struct matches the public.follows table
type Follow struct {
	FollowerID uuid.UUID `gorm:"type:uuid;not null" json:"follower_id"`
}

func (Follow) TableName() string {
    return "public.follows"
}

// Connect initializes the database connection
func Connect() (*gorm.DB, error) {
	var err error
	once.Do(func() {
		if os.Getenv("VERCEL_ENV") == "" {
			err = godotenv.Load()
			if err != nil {
				log.Println("Warning: .env file not found")
			}
		}
		dsn := os.Getenv("DIRECT_URL")
		if dsn == "" {
			dsn = os.Getenv("DATABASE_URL")
		}
		if dsn == "" {
			log.Fatal("FATAL: Database URL not set")
		}
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{ PrepareStmt: false })
		if err != nil {
			log.Fatalf("FATAL: Failed to connect to database: %v", err)
		}
	})
	return db, err
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

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := r.URL.Query().Get("user_id")
	if userIDStr == "" {
		http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user_id format", http.StatusBadRequest)
		return
	}

	db, err := GetDB()
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	var followerIDs []uuid.UUID
	db.Model(&Follow{}).Where("following_id = ?", userID).Pluck("follower_id", &followerIDs)

	var followers []Profile
	if len(followerIDs) > 0 {
		if err := db.Where("id IN ?", followerIDs).Find(&followers).Error; err != nil {
			http.Error(w, "Failed to fetch follower profiles", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(followers)
}
