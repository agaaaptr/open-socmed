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
	gorm.Model
	Username string `gorm:"unique"`
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
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("FATAL: Failed to connect to database: %v", err)
		}
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
