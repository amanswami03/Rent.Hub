package main

import (
	"log"
	"os"
	"quickrent/internal/database"
	"quickrent/internal/handlers"
	"quickrent/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	log.Println("Database initialized successfully")

	// Initialize Gin router
	router := gin.Default()

	// Apply middleware
	router.Use(middleware.CORSMiddleware())

	// Public routes
	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/signup", handlers.Signup)
		authGroup.POST("/login", handlers.Login)
	}

	// Items routes (public read, private write)
	itemsGroup := router.Group("/api/items")
	{
		itemsGroup.GET("", handlers.GetItems)
		itemsGroup.GET("/city", handlers.GetItemsByCity)
		itemsGroup.GET("/:id", handlers.GetItemByID)
		itemsGroup.GET("/search", handlers.SearchItems)
		itemsGroup.POST("", middleware.AuthMiddleware(), handlers.CreateItem)
		itemsGroup.PUT("/:id", middleware.AuthMiddleware(), handlers.UpdateItem)
		itemsGroup.DELETE("/:id", middleware.AuthMiddleware(), handlers.DeleteItem)
		itemsGroup.POST("/:id/reviews", middleware.AuthMiddleware(), handlers.CreateReview)
		itemsGroup.GET("/:id/reviews", handlers.GetReviews)
	}

	// Wishlist routes (protected)
	wishlistGroup := router.Group("/api/wishlist")
	wishlistGroup.Use(middleware.AuthMiddleware())
	{
		wishlistGroup.POST("", handlers.AddToWishlist)
		wishlistGroup.GET("", handlers.GetWishlist)
		wishlistGroup.DELETE("/:id", handlers.RemoveFromWishlist)
	}

	// Rental routes (protected)
	rentalGroup := router.Group("/api/rentals")
	rentalGroup.Use(middleware.AuthMiddleware())
	{
		rentalGroup.POST("", handlers.RentItem)                                    // Create rental request
		rentalGroup.GET("", handlers.GetMyRentals)                                 // Get active rentals
		rentalGroup.GET("/requests/incoming", handlers.GetIncomingRentalRequests)  // Requests from others
		rentalGroup.GET("/requests/outgoing", handlers.GetOutgoingRentalRequests)  // Requests I sent
		rentalGroup.POST("/requests/:id/approve", handlers.ApproveRentalRequest)   // Approve request
		rentalGroup.POST("/requests/:id/reject", handlers.RejectRentalRequest)     // Reject request
	}

	// Messages routes (protected)
	messagesGroup := router.Group("/api/messages")
	messagesGroup.Use(middleware.AuthMiddleware())
	{
		messagesGroup.POST("", handlers.SendMessage)                     // Send message
		messagesGroup.GET("/rental-request/:id", handlers.GetRentalRequestMessages) // Get messages for rental request
	}

	// User account routes (protected)
	userGroup := router.Group("/api/user")
	userGroup.Use(middleware.AuthMiddleware())
	{
		userGroup.GET("/profile", handlers.GetUserProfile)  // Get logged-in user profile
		userGroup.GET("/my-items", handlers.GetMyItems)     // Get items listed by user
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Starting server on :" + port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

