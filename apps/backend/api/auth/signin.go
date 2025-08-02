package api

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	supabase "github.com/supabase-community/supabase-go"
)

type ResolveIdentifierRequest struct {
	Identifier string `json:"identifier"` // Can be email or username
}

type ResolveIdentifierResponse struct {
	Email string `json:"email,omitempty"`
	Error string `json:"error,omitempty"`
}

// Handler for /api/auth/signin
func SignInHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ResolveIdentifierRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY") // Use service role key for admin client

	if supabaseURL == "" || supabaseKey == "" {
		log.Printf("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")
		sendJSONError(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	client, err := supabase.NewClient(supabaseURL, supabaseKey, nil) // Pass nil for options
	if err != nil {
		log.Printf("Error creating Supabase client: %v", err)
		sendJSONError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var emailToReturn string

	// Simple check for email format
	if isValidEmail(req.Identifier) {
		emailToReturn = req.Identifier
	} else {
		// If not an email, assume it's a username and fetch associated email from profiles table
		var profiles []struct {
			Email string `json:"email"`
		}
		
		respBody, respStatus, err := client.From("profiles").Select("email", "exact=false", false).Eq("username", req.Identifier).Execute()
		if err != nil {
			log.Printf("Error fetching profile by username: %v", err)
			sendJSONError(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if respStatus != http.StatusOK {
			log.Printf("Supabase profiles query failed with status: %d, body: %s", respStatus, string(respBody))
			sendJSONError(w, "Invalid username or email", http.StatusUnauthorized)
			return
		}

		if err := json.Unmarshal(respBody, &profiles); err != nil {
			log.Printf("Error unmarshaling profiles response: %v", err)
			sendJSONError(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if len(profiles) == 0 || profiles[0].Email == "" {
			sendJSONError(w, "Invalid username or email", http.StatusUnauthorized)
			return
		}
		emailToReturn = profiles[0].Email
	}

	// Return the resolved email to the frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ResolveIdentifierResponse{
		Email: emailToReturn,
	})
}

// sendJSONError sends a JSON formatted error response
func sendJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ResolveIdentifierResponse{Error: message})
}

// isValidEmail is a simple helper to check for email format
func isValidEmail(email string) bool {
	// A more robust email validation regex should be used in production
	return len(email) > 3 && (strings.Contains(email, "@") && strings.Contains(email, "."))
}
