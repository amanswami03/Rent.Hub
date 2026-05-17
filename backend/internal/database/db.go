package database

import (
	"fmt"
	"quickrent/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() error {
	dsn := "host=localhost user=postgres password=postgres dbname=renthub port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = db

	// Auto migrate tables
	err = DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Rental{},
		&models.RentalRequest{},
		&models.Message{},
		&models.Wishlist{},
		&models.Review{},
	)

	if err != nil {
		return fmt.Errorf("failed to migrate tables: %w", err)
	}

	return nil
}

func GetDB() *gorm.DB {
	return DB
}
