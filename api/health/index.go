package health

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Connect creates a new database connection for each request
// This approach is better for serverless functions to avoid prepared statement conflicts
func Connect() (*gorm.DB, error) {
	// Load .env file (for local development)
	if os.Getenv("VERCEL_ENV") == "" {
		err := godotenv.Load()
		if err != nil {
			log.Println("Warning: .env file not found, relying on environment variables")
		}
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable not set")
	}

	// Add connection parameters to avoid prepared statement issues
	if !strings.Contains(dsn, "statement_cache_mode") {
		separator := "?"
		if strings.Contains(dsn, "?") {
			separator = "&"
		}
		dsn += separator + "statement_cache_mode=describe"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt:                              false, // Disable prepared statements
		DisableForeignKeyConstraintWhenMigrating: true,  // Additional safety for serverless
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Configure connection pool for serverless environment
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %v", err)
	}

	// Minimal connection pooling for serverless
	sqlDB.SetMaxIdleConns(0)                   // No idle connections
	sqlDB.SetMaxOpenConns(1)                   // Only one connection at a time
	sqlDB.SetConnMaxLifetime(time.Second * 30) // Short connection lifetime

	log.Println("Database connection established successfully")
	return db, nil
}

// Handler handles requests for /api/health
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Create new database connection for this request
	db, err := Connect()
	if err != nil {
		log.Printf("[ERROR] Health check failed: database connection error: %v", err)
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
		return
	}

	// Ensure connection is closed after request completes
	defer func() {
		if sqlDB, err := db.DB(); err == nil {
			sqlDB.Close()
			log.Println("[DEBUG] Database connection closed")
		}
	}()

	// Test database connectivity with a simple query
	var result int
	if err := db.Raw("SELECT 1").Scan(&result).Error; err != nil {
		log.Printf("[ERROR] Health check failed: database query error: %v", err)
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
