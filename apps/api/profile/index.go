package profile

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/agaaaptr/open-socmed/packages/go-common/database"
	"github.com/agaaaptr/open-socmed/packages/go-common/models"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

// UpdateProfileRequest defines the structure for incoming profile update data.
// This ensures that users can only update specific, allowed fields.
type UpdateProfileRequest struct {
	FullName  *string `json:"full_name"`
	Username  *string `json:"username"`
}

// ProfileHandler is the entry point for the /api/profile serverless function.
func Handler(w http.ResponseWriter, r *http.Request) {
	log.Printf("[DEBUG] Received request: %s %s", r.Method, r.URL.Path)

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		log.Println("[DEBUG] Responding to preflight CORS request.")
		w.WriteHeader(http.StatusOK)
		return
	}

	userID, err := validateToken(r)
	if err != nil {
		log.Printf("[DEBUG] Token validation failed: %v", err)
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}

	log.Printf("[DEBUG] Token validated successfully for user ID: %s", userID)

	db, err := database.GetDB()
	if err != nil {
		log.Printf("[ERROR] Failed to connect to database: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getProfile(w, r, userID, db)
	case http.MethodPut:
		updateProfile(w, r, userID, db)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProfile(w http.ResponseWriter, r *http.Request, userID string, db *gorm.DB) {
	var profile models.Profile
	if err := db.Where("id = ?", userID).First(&profile).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("[DEBUG] Profile not found for user ID: %s", userID)
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}
		log.Printf("[DEBUG] Database error in getProfile: %v", err)
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func updateProfile(w http.ResponseWriter, r *http.Request, userID string, db *gorm.DB) {
	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[DEBUG] Failed to decode request body in updateProfile: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Create a map from the request struct to only update non-nil fields.
	// This prevents accidentally overwriting existing data with empty values.
	updates := make(map[string]interface{})
	if req.FullName != nil {
		updates["full_name"] = *req.FullName
	}
	if req.Username != nil {
		updates["username"] = *req.Username
	}

	if len(updates) == 0 {
		log.Println("[DEBUG] No fields to update.")
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	if err := db.Model(&models.Profile{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
		log.Printf("[DEBUG] Database error in updateProfile: %v", err)
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	log.Printf("[DEBUG] Successfully updated profile for user ID: %s", userID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}

func validateToken(r *http.Request) (string, error) {
	jwtSecret := os.Getenv("SUPABASE_JWT_SECRET")
	if jwtSecret == "" {
		log.Println("[DEBUG] VALIDATION ERROR: SUPABASE_JWT_SECRET environment variable not set.")
		return "", fmt.Errorf("server configuration error: missing JWT secret")
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		log.Println("[DEBUG] VALIDATION ERROR: Missing Authorization header.")
		return "", fmt.Errorf("missing Authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		log.Printf("[DEBUG] VALIDATION ERROR: Invalid Authorization header format. Header was: %s", authHeader)
		return "", fmt.Errorf("invalid Authorization header format, must be 'Bearer <token>'")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		log.Printf("[DEBUG] VALIDATION ERROR: Failed to parse JWT token: %v. Token string: %s", err, tokenString)
		return "", fmt.Errorf("invalid token: %w", err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["sub"].(string)
		if !ok {
			log.Printf("[DEBUG] VALIDATION ERROR: 'sub' claim is missing or not a string. Claims: %v", claims)
			return "", fmt.Errorf("invalid token claims: 'sub' (user ID) is missing or not a string")
		}
		return userID, nil
	}

	log.Println("[DEBUG] VALIDATION ERROR: Token is invalid for an unknown reason.")
	return "", fmt.Errorf("invalid token")
}