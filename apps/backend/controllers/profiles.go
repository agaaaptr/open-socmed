package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/agaaaptr/open-socmed/apps/backend/models"
)

func GetProfiles(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var profiles []models.Profile
		db.Find(&profiles)
		c.JSON(http.StatusOK, profiles)
	}
}

func CreateProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newProfile models.Profile
		if err := c.ShouldBindJSON(&newProfile); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		db.Create(&newProfile)
		c.JSON(http.StatusCreated, newProfile)
	}
}