package handlers

import (
	"net/http"
	"strconv"
	"time"
	"quickrent/internal/database"
	"quickrent/internal/models"

	"github.com/gin-gonic/gin"
)

func AddToWishlist(c *gin.Context) {
	var wishlist models.Wishlist

	if err := c.ShouldBindJSON(&wishlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	wishlist.UserID = userID.(uint)

	if err := database.DB.Create(&wishlist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add to wishlist"})
		return
	}

	c.JSON(http.StatusCreated, wishlist)
}

func GetWishlist(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var wishlists []models.Wishlist

	if err := database.DB.Where("user_id = ?", userID).Find(&wishlists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch wishlist"})
		return
	}

	c.JSON(http.StatusOK, wishlists)
}

func RemoveFromWishlist(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var wishlist models.Wishlist
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&wishlist).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "wishlist item not found"})
		return
	}

	if err := database.DB.Delete(&wishlist).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to remove from wishlist"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "removed from wishlist"})
}

func RentItem(c *gin.Context) {
	var req struct {
		ItemID    uint      `json:"item_id" binding:"required"`
		StartDate time.Time `json:"start_date" binding:"required"`
		EndDate   time.Time `json:"end_date" binding:"required"`
		Message   string    `json:"message"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	renterID := userID.(uint)

	// Fetch item to get owner
	var item models.Item
	if err := database.DB.First(&item, req.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	// Prevent renting own item
	if item.OwnerID == renterID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot rent your own item"})
		return
	}

	// Fetch renter user info
	var renter models.User
	if err := database.DB.First(&renter, renterID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch renter details"})
		return
	}

	// Create rent request
	rentalRequest := models.RentalRequest{
		ItemID:     req.ItemID,
		RenterID:   renterID,
		OwnerID:    item.OwnerID,
		StartDate:  req.StartDate,
		EndDate:    req.EndDate,
		Message:    req.Message,
		RenterName: renter.Name,
		ItemName:   item.Name,
		Status:     "pending",
	}

	if err := database.DB.Create(&rentalRequest).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create rental request"})
		return
	}

	c.JSON(http.StatusCreated, rentalRequest)
}

func GetMyRentals(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var rentals []models.Rental

	if err := database.DB.Where("renter_id = ?", userID).Find(&rentals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch rentals"})
		return
	}

	c.JSON(http.StatusOK, rentals)
}

// Get rental requests for owner (requests to rent their items)
func GetIncomingRentalRequests(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var requests []models.RentalRequest

	if err := database.DB.Where("owner_id = ?", userID).Order("created_at DESC").Find(&requests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch requests"})
		return
	}

	c.JSON(http.StatusOK, requests)
}

// Get rental requests made by renter
func GetOutgoingRentalRequests(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var requests []models.RentalRequest

	if err := database.DB.Where("renter_id = ?", userID).Order("created_at DESC").Find(&requests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch requests"})
		return
	}

	c.JSON(http.StatusOK, requests)
}

// Approve rental request and create active rental
func ApproveRentalRequest(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var rentalRequest models.RentalRequest
	if err := database.DB.First(&rentalRequest, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "request not found"})
		return
	}

	// Verify owner is approving
	if rentalRequest.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "not authorized"})
		return
	}

	// Create rental
	rental := models.Rental{
		ItemID:    rentalRequest.ItemID,
		RenterID:  rentalRequest.RenterID,
		OwnerID:   rentalRequest.OwnerID,
		StartDate: rentalRequest.StartDate,
		EndDate:   rentalRequest.EndDate,
		Status:    "active",
		TotalCost: 0, // Set based on item price and days
	}

	// Get item price
	var item models.Item
	if err := database.DB.First(&item, rentalRequest.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	days := int(rentalRequest.EndDate.Sub(rentalRequest.StartDate).Hours() / 24)
	if days < 1 {
		days = 1
	}
	rental.TotalCost = float64(days) * item.Price

	if err := database.DB.Create(&rental).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create rental"})
		return
	}

	// Update rental request
	rentalRequest.Status = "approved"
	rentalRequest.RentalID = rental.ID
	database.DB.Save(&rentalRequest)

	// Mark item as unavailable
	database.DB.Model(&item, ).Update("available", false)

	c.JSON(http.StatusOK, gin.H{"message": "rental approved", "rental": rental})
}

// Reject rental request
func RejectRentalRequest(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var rentalRequest models.RentalRequest
	if err := database.DB.First(&rentalRequest, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "request not found"})
		return
	}

	// Verify owner is rejecting
	if rentalRequest.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "not authorized"})
		return
	}

	rentalRequest.Status = "rejected"
	if err := database.DB.Save(&rentalRequest).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "rental request rejected"})
}

// Send message in a rental request conversation
func SendMessage(c *gin.Context) {
	var req struct {
		RentalRequestID uint   `json:"rental_request_id" binding:"required"`
		Content         string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	senderID := userID.(uint)

	// Get rental request
	var rentalRequest models.RentalRequest
	if err := database.DB.First(&rentalRequest, req.RentalRequestID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "rental request not found"})
		return
	}

	// Determine receiver (other party)
	var receiverID uint
	if rentalRequest.RenterID == senderID {
		receiverID = rentalRequest.OwnerID
	} else if rentalRequest.OwnerID == senderID {
		receiverID = rentalRequest.RenterID
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "not part of this conversation"})
		return
	}

	// Get sender name
	var sender models.User
	if err := database.DB.First(&sender, senderID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
		return
	}

	message := models.Message{
		RentalRequestID: req.RentalRequestID,
		SenderID:        senderID,
		ReceiverID:      receiverID,
		SenderName:      sender.Name,
		Content:         req.Content,
	}

	if err := database.DB.Create(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send message"})
		return
	}

	c.JSON(http.StatusCreated, message)
}

// Get messages for a rental request
func GetRentalRequestMessages(c *gin.Context) {
	rentalRequestIDStr := c.Param("id")
	rentalRequestID, _ := strconv.ParseUint(rentalRequestIDStr, 10, 32)

	var messages []models.Message
	if err := database.DB.Where("rental_request_id = ?", rentalRequestID).Order("created_at ASC").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch messages"})
		return
	}

	// Mark messages as read
	userID, _ := c.Get("user_id")
	database.DB.Model(&models.Message{}).Where("rental_request_id = ? AND receiver_id = ?", rentalRequestID, userID).Update("is_read", true)

	c.JSON(http.StatusOK, messages)
}

// Get my listed items
func GetMyItems(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var items []models.Item

	if err := database.DB.Where("owner_id = ?", userID).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// Get user profile (for account page)
func GetUserProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
