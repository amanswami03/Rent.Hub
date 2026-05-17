package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	City      string    `json:"city"`
	Pincode   string    `json:"pincode"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type SignupRequest struct {
	Name            string  `json:"name" binding:"required"`
	Email           string  `json:"email" binding:"required,email"`
	Password        string  `json:"password" binding:"required,min=6"`
	ConfirmPassword string  `json:"confirmPassword" binding:"required,min=6"`
	City            string  `json:"city"`
	Pincode         string  `json:"pincode"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
