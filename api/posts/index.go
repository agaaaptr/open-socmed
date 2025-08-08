package posts

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
)

var (
	db          *gorm.DB
	once        sync.Once
	jwtSecret   []byte
)

type Post struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Content   string    `gorm:"not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`
	User      Profile   `gorm:"foreignKey:UserID" json:"user"`
}

type Profile struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
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
			err = godotenv.Load("../../.env") // Assuming .env is at project root
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

		jwtSecret = []byte(os.Getenv("SUPABASE_JWT_SECRET"))
		if len(jwtSecret) == 0 {
			log.Fatal("FATAL: SUPABASE_JWT_SECRET environment variable not set")
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
	return db, nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	db, err := GetDB()
	if err != nil {
		http.Error(w, "Failed to connect to database", http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodPost:
		createPost(w, r, db)
	case http.MethodDelete:
		deletePost(w, r, db)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func deletePost(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	postIDStr := r.URL.Query().Get("id") // Assuming post ID is passed as 'id' query param
	if postIDStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Post ID is required"})
		return
	}

	postID, err := uuid.Parse(postIDStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Post ID format"})
		return
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Authorization header required"})
		return
	}
	tokenString := authHeader[len("Bearer "):]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid token claims"})
		return
	}

	userIDStr, ok := claims["sub"].(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid user ID in token"})
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid user ID format"})
		return
	}

	var post Post
	result := db.First(&post, "id = ?", postID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"message": "Post not found"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Database query error", "error": result.Error.Error()})
		return
	}

	if post.UserID != userID {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"message": "You are not authorized to delete this post"})
		return
	}

	if err := db.Delete(&post).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Failed to delete post", "error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Post deleted successfully"})
}



func createPost(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Authorization header required"})
		return
	}
	tokenString := authHeader[len("Bearer "):]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid token claims"})
		return
	}

	userIDStr, ok := claims["sub"].(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid user ID in token"})
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid user ID format"})
		return
	}

	var post Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid request body"})
		return
	}

	if post.Content == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Post content cannot be empty"})
		return
	}

	post.UserID = userID
	post.ID = uuid.New()

	if err := db.Create(&post).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Failed to create post", "error": err.Error()})
		return
	}

	// To return the created post with user info
	if err := db.Preload("User").First(&post, "id = ?", post.ID).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Failed to retrieve created post", "error": err.Error()})
		return
	}


	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}