package handler

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	FullName  string    `json:"full_name"`
	UpdatedAt *time.Time `json:"updated_at"`
	AvatarURL *string    `json:"avatar_url"`
	Website   *string    `json:"website"`
}