package checkusername

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db   *gorm.DB
	once sync.Once
)

// Profile represents the user profile model

type Profile struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	FullName  *string   `json:"full_name"`
	UpdatedAt *time.Time `json:"updated_at"`
	AvatarURL *string   `json:"avatar_url"`
	Website   *string   `json:"website"`
}

func Connect() (*gorm.DB, error) {
	var err error
	once.Do(func() {
		if os.Getenv("VERCEL_ENV") == "" {
			err = godotenv.Load()
			if err != nil {
				log.Println("Warning: .env file not found, relying on environment variables")
			}
		}
		dsn := os.Getenv("DATABASE_URL")
		if dsn == "" {
			log.Fatal("FATAL: DATABASE_URL environment variable not set")
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

func GetDB() (*gorm.DB, error) {
	if db == nil {
		return Connect()
	}
	return db,
	nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	username := r.URL.Query().Get("username")
	if username == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Username is required"})
		return
	}

	db, err := GetDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Database connection error"})
		return
	}

	var profile Profile
	result := db.Where("username = ?", username).First(&profile)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]bool{"available": true})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Database query error"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"available": false})
}
