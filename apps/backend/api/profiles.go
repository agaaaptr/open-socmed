package api

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/agaaaptr/open-socmed/apps/backend/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	// Load .env file (for local development)
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using environment variables")
	}

	// Database connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	var errDB error
	db, errDB = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if errDB != nil {
		log.Fatalf("Failed to connect to database: %v", errDB)
	}
}

// ProfilesHandler handles requests for /api/profiles
func ProfilesHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getProfiles(w, r)
	case http.MethodPost:
		createProfile(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProfiles(w http.ResponseWriter, r *http.Request) {
	var profiles []models.Profile
	db.Find(&profiles)
	json.NewEncoder(w).Encode(profiles)
}

func createProfile(w http.ResponseWriter, r *http.Request) {
	var newProfile models.Profile
	if err := json.NewDecoder(r.Body).Decode(&newProfile); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	db.Create(&newProfile)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newProfile)
}
