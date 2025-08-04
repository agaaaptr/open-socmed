package handler

import (
	"log"
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

// Connect initializes the database connection.
// It's designed to be called once to prevent connection leaks.
func Connect() (*gorm.DB, error) {
	var err error
	once.Do(func() {
		// Load .env file (for local development)
		if os.Getenv("VERCEL_ENV") == "" { // Simple check if not in Vercel
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

// GetDB returns the existing database connection pool.
// If the connection hasn't been established, it will be initialized.
func GetDB() (*gorm.DB, error) {
	if db == nil {
		return Connect()
	}
	return db, nil
}
