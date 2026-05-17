package models

import "time"

type Item struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	Category    string    `gorm:"not null" json:"category"`
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"not null" json:"price"`
	Period      string    `json:"period"`
	Image       string    `gorm:"type:text" json:"image"`
	Rating      float64   `json:"rating"`
	Reviews     int       `json:"reviews"`
	Owner       string    `json:"owner"`
	OwnerID     uint      `json:"owner_id"`
	Available   bool      `gorm:"default:true" json:"available"`
	City        string    `gorm:"index" json:"city"`
	Pincode     string    `json:"pincode"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ItemResponse struct {
	ID       uint    `json:"id"`
	Image    string  `json:"image"`
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Price    string  `json:"price"`
	Period   string  `json:"period"`
	Rating   float64 `json:"rating"`
	Reviews  int     `json:"reviews"`
	Owner    string  `json:"owner"`
	City     string  `json:"city"`
}

type Review struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ItemID    uint      `gorm:"not null;index" json:"item_id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Rating    float64   `gorm:"not null" json:"rating"`
	Comment   string    `gorm:"type:text" json:"comment"`
	UserName  string    `json:"user_name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
