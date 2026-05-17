package models

import "time"

type Rental struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ItemID    uint      `gorm:"not null" json:"item_id"`
	RenterID  uint      `gorm:"not null" json:"renter_id"`
	OwnerID   uint      `gorm:"not null" json:"owner_id"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `gorm:"default:'active'" json:"status"` // active, completed, cancelled
	TotalCost float64   `json:"total_cost"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type RentalRequest struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ItemID    uint      `gorm:"not null;index" json:"item_id"`
	RenterID  uint      `gorm:"not null" json:"renter_id"`
	OwnerID   uint      `gorm:"not null" json:"owner_id"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `gorm:"default:'pending'" json:"status"` // pending, approved, rejected
	Message   string    `gorm:"type:text" json:"message"`
	RenterName string   `json:"renter_name"`
	ItemName  string    `json:"item_name"`
	RentalID  uint      `json:"rental_id"` // Links to rental when approved
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Message struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	RentalRequestID uint  `gorm:"not null;index" json:"rental_request_id"`
	SenderID     uint      `gorm:"not null" json:"sender_id"`
	ReceiverID   uint      `gorm:"not null" json:"receiver_id"`
	SenderName   string    `json:"sender_name"`
	Content      string    `gorm:"type:text" json:"content"`
	IsRead       bool      `gorm:"default:false" json:"is_read"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Wishlist struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	ItemID    uint      `gorm:"not null" json:"item_id"`
	CreatedAt time.Time `json:"created_at"`
}
