package handler

import (
	"encoding/json"
	"log"
	"net/http"

	
)

// Handler handles requests for /api/health
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check database connection
	_, err := GetDB()
	if err != nil {
		log.Printf("[ERROR] Health check failed: database connection error: %v", err)
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
