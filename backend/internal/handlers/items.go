package handlers

import (
	"net/http"
	"strconv"
	"quickrent/internal/database"
	"quickrent/internal/models"

	"github.com/gin-gonic/gin"
)

func GetItems(c *gin.Context) {
	var items []models.Item

	if err := database.DB.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// GetItemsByCity fetches items from a specific city
func GetItemsByCity(c *gin.Context) {
	city := c.Query("city")
	if city == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "city parameter is required"})
		return
	}

	var items []models.Item
	// Fetch items matching the city OR items with empty city (fallback)
	if err := database.DB.Where("(city = ? OR city = '') AND available = ?", city, true).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch items"})
		return
	}

	// If no items found by city, fetch all available items as fallback
	if len(items) == 0 {
		if err := database.DB.Where("available = ?", true).Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch items"})
			return
		}
	}

	c.JSON(http.StatusOK, items)
}

func GetItemByID(c *gin.Context) {
	id := c.Param("id")

	var item models.Item
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	c.JSON(http.StatusOK, item)
}

func CreateItem(c *gin.Context) {
	var item models.Item

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	item.OwnerID = userID.(uint)

	// Fetch owner details
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user details"})
		return
	}

	item.Owner = user.Name
	item.City = user.City
	item.Pincode = user.Pincode
	item.Latitude = user.Latitude
	item.Longitude = user.Longitude
	item.Available = true  // Explicitly set available to true

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create item"})
		return
	}

	c.JSON(http.StatusCreated, item)
}

func UpdateItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	userID, _ := c.Get("user_id")
	if item.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "not authorized to update this item"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update item"})
		return
	}

	c.JSON(http.StatusOK, item)
}

func DeleteItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	userID, _ := c.Get("user_id")
	if item.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "not authorized to delete this item"})
		return
	}

	if err := database.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "item deleted successfully"})
}

func SearchItems(c *gin.Context) {
	query := c.Query("q")
	city := c.Query("city")
	var items []models.Item

	dbQuery := database.DB

	if city != "" {
		dbQuery = dbQuery.Where("city = ?", city)
	}

	if err := dbQuery.Where("(name LIKE ? OR category LIKE ?) AND available = ?", "%"+query+"%", "%"+query+"%", true).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// CreateReview creates a review for an item
func CreateReview(c *gin.Context) {
	itemIDStr := c.Param("id")
	itemID, err := strconv.ParseUint(itemIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item id"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	var review models.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review.ItemID = uint(itemID)
	review.UserID = userID.(uint)

	// Fetch user name
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user details"})
		return
	}
	review.UserName = user.Name

	if err := database.DB.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create review"})
		return
	}

	// Update item rating
	updateItemRating(uint(itemID))

	c.JSON(http.StatusCreated, review)
}

// GetReviews fetches all reviews for an item
func GetReviews(c *gin.Context) {
	itemIDStr := c.Param("id")
	itemID, err := strconv.ParseUint(itemIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item id"})
		return
	}

	var reviews []models.Review
	if err := database.DB.Where("item_id = ?", uint(itemID)).Order("created_at DESC").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

// updateItemRating updates the average rating for an item
func updateItemRating(itemID uint) {
	var reviews []models.Review
	var avgRating float64
	var count int64

	database.DB.Where("item_id = ?", itemID).Find(&reviews).Count(&count)

	if count > 0 {
		var sum float64
		for _, review := range reviews {
			sum += review.Rating
		}
		avgRating = sum / float64(count)
	}

	database.DB.Model(&models.Item{}).Where("id = ?", itemID).Updates(map[string]interface{}{
		"rating":  avgRating,
		"reviews": count,
	})
}
