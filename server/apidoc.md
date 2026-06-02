# Server API Documentation

Base URL: `http://localhost:8080`

Auth: Most protected routes require the `token` httpOnly cookie set by `/api/auth/login` or `/api/auth/register`.

---

## System

### GET /health

Request sample:
```bash
curl -i http://localhost:8080/health
```

Response sample:
```json
{
  "message": "Server is running"
}
```

---

## Auth

### POST /api/auth/register

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ava Patel",
    "email": "ava@example.com",
    "password": "secret123"
  }'
```

Response sample:
```json
{
  "token": "<jwt>",
  "user": {
    "_id": "6659f0b9c1f6b1c0d0a1b111",
    "name": "Ava Patel",
    "email": "ava@example.com",
    "role": "user",
    "isSuspended": false
  }
}
```

### POST /api/auth/login

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ava@example.com",
    "password": "secret123"
  }'
```

Response sample:
```json
{
  "token": "<jwt>",
  "user": {
    "_id": "6659f0b9c1f6b1c0d0a1b111",
    "name": "Ava Patel",
    "email": "ava@example.com",
    "role": "user",
    "isSuspended": false
  }
}
```

### POST /api/auth/logout

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/auth/logout \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "message": "Logged out successfully"
}
```

---

## Books

### GET /api/books

Request sample:
```bash
curl -i "http://localhost:8080/api/books?search=tokyo&category=Fiction,History&page=1&limit=12&sortBy=pricePerDay&order=asc&available=true"
```

Response sample:
```json
{
  "total": 2,
  "page": 1,
  "limit": 12,
  "books": [
    {
      "_id": "6659f3f7d5caa5c7cc0d1a11",
      "title": "Tokyo Drift",
      "author": "Kei Watanabe",
      "category": "Fiction",
      "rentPrice": 299,
      "pricePerDay": 20,
      "depositAmount": 149,
      "replacementCost": 999,
      "isAvailable": true,
      "unavailabilityReason": "",
      "averageRating": 4.2,
      "image": "https://example.com/cover.jpg"
    }
  ]
}
```

### GET /api/books/categories

Request sample:
```bash
curl -i http://localhost:8080/api/books/categories
```

Response sample:
```json
{
  "categories": ["Biography", "Fiction", "History"]
}
```

### GET /api/books/:id

Request sample:
```bash
curl -i http://localhost:8080/api/books/6659f3f7d5caa5c7cc0d1a11
```

Response sample:
```json
{
  "_id": "6659f3f7d5caa5c7cc0d1a11",
  "title": "Tokyo Drift",
  "author": "Kei Watanabe",
  "category": "Fiction",
  "rentPrice": 299,
  "pricePerDay": 20,
  "depositAmount": 149,
  "replacementCost": 999,
  "isAvailable": true,
  "averageRating": 4.2,
  "image": "https://example.com/cover.jpg"
}
```

---

## Profile

### GET /api/profile/me

Request sample:
```bash
curl -i http://localhost:8080/api/profile/me \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "_id": "6659f0b9c1f6b1c0d0a1b111",
  "user": {
    "_id": "6659f0b9c1f6b1c0d0a1b111",
    "name": "Ava Patel",
    "email": "ava@example.com",
    "role": "user",
    "isSuspended": false
  },
  "phone": "",
  "address": "",
  "city": "",
  "bio": "",
  "avatar": "",
  "dateOfBirth": null
}
```

### PUT /api/profile/me

Request sample:
```bash
curl -i -X PUT http://localhost:8080/api/profile/me \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "919876543210",
    "city": "Pune",
    "bio": "Weekend reader.",
    "avatar": "https://example.com/avatar.png",
    "address": "221B Baker Street, Pune",
    "dateOfBirth": "1999-05-01"
  }'
```

Response sample:
```json
{
  "message": "Profile updated",
  "profile": {
    "phone": "919876543210",
    "address": "221B Baker Street, Pune",
    "city": "Pune",
    "bio": "Weekend reader.",
    "avatar": "https://example.com/avatar.png",
    "dateOfBirth": "1999-05-01T00:00:00.000Z"
  }
}
```

### GET /api/profile/settings

Request sample:
```bash
curl -i http://localhost:8080/api/profile/settings \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "settings": {
    "emailOrderUpdates": true,
    "emailRecommendations": true,
    "pushFlashDeals": false,
    "smsDeliveryAlerts": true,
    "oneClickCheckout": false,
    "saveCardsForFasterCheckout": true,
    "defaultDeliveryType": "home",
    "twoFactorAuth": false,
    "allowNewDeviceLogin": true,
    "marketingPersonalization": true
  }
}
```

### PUT /api/profile/settings

Request sample:
```bash
curl -i -X PUT http://localhost:8080/api/profile/settings \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "emailRecommendations": false,
      "defaultDeliveryType": "pickup",
      "twoFactorAuth": true
    }
  }'
```

Response sample:
```json
{
  "message": "Account settings updated",
  "settings": {
    "emailOrderUpdates": true,
    "emailRecommendations": false,
    "pushFlashDeals": false,
    "smsDeliveryAlerts": true,
    "oneClickCheckout": false,
    "saveCardsForFasterCheckout": true,
    "defaultDeliveryType": "pickup",
    "twoFactorAuth": true,
    "allowNewDeviceLogin": true,
    "marketingPersonalization": true
  }
}
```

### POST /api/profile/avatar

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/profile/avatar \
  --cookie "token=<jwt>" \
  -F "avatar=@/path/to/avatar.png"
```

Response sample:
```json
{
  "message": "Avatar uploaded",
  "avatar": "http://localhost:8080/uploads/avatars/avatar.png"
}
```

---

## Payments

### GET /api/payments/methods

Request sample:
```bash
curl -i http://localhost:8080/api/payments/methods \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "customerId": "cus_123",
  "defaultPaymentMethodId": "pm_123",
  "methods": [
    {
      "id": "pm_123",
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2030,
      "funding": "credit",
      "country": "US"
    }
  ]
}
```

---

## Rentals

### GET /api/rentals/preview

Request sample:
```bash
curl -i "http://localhost:8080/api/rentals/preview?bookId=6659f3f7d5caa5c7cc0d1a11&rentalType=daily&rentalDuration=7" \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "allowed": true,
  "message": "",
  "pricing": {
    "totalRentPrice": 140,
    "depositAmount": 149,
    "total": 289
  }
}
```

### GET /api/rentals/my-rentals

Request sample:
```bash
curl -i "http://localhost:8080/api/rentals/my-rentals?page=1&limit=10&status=active" \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "total": 1,
  "alerts": [],
  "rentals": [
    {
      "_id": "665a0050b2efc2b97f0b2211",
      "book": {
        "_id": "6659f3f7d5caa5c7cc0d1a11",
        "title": "Tokyo Drift",
        "author": "Kei Watanabe",
        "image": "https://example.com/cover.jpg",
        "pricePerDay": 20,
        "depositAmount": 149,
        "isAvailable": false
      },
      "status": "active",
      "rentedAt": "2026-05-20T10:30:00.000Z",
      "dueDate": "2026-05-27T10:30:00.000Z"
    }
  ]
}
```

### GET /api/rentals/my

Request sample:
```bash
curl -i http://localhost:8080/api/rentals/my \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "total": 1,
  "alerts": [],
  "rentals": [
    {
      "_id": "665a0050b2efc2b97f0b2211",
      "book": {
        "_id": "6659f3f7d5caa5c7cc0d1a11",
        "title": "Tokyo Drift",
        "author": "Kei Watanabe",
        "image": "https://example.com/cover.jpg",
        "pricePerDay": 20,
        "depositAmount": 149,
        "isAvailable": false
      },
      "status": "active"
    }
  ]
}
```

### GET /api/rentals/all

Request sample:
```bash
curl -i "http://localhost:8080/api/rentals/all?page=1&limit=20&status=active" \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "total": 2,
  "rentals": [
    {
      "_id": "665a0050b2efc2b97f0b2211",
      "user": { "_id": "6659f0b9c1f6b1c0d0a1b111", "name": "Ava Patel", "email": "ava@example.com" },
      "book": { "_id": "6659f3f7d5caa5c7cc0d1a11", "title": "Tokyo Drift", "author": "Kei Watanabe", "image": "https://example.com/cover.jpg", "replacementCost": 999 },
      "status": "active"
    }
  ]
}
```

### POST /api/rentals/reserve

Note: If the same user reserves the same book with the same rentalType and rentalDuration while the hold is active, the API returns the existing reservation (status 200) with the same payment clientSecret. If the same user tries different rental options, it returns 409.

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/rentals/reserve \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "6659f3f7d5caa5c7cc0d1a11",
    "rentalType": "daily",
    "rentalDuration": 7
  }'
```

Response sample:
```json
{
  "message": "Reservation created",
  "reservation": {
    "_id": "665a01caa2efc2b97f0b3344",
    "book": "6659f3f7d5caa5c7cc0d1a11",
    "rentalType": "daily",
    "rentalDuration": 7,
    "totalRentPrice": 140,
    "depositAmount": 149,
    "paymentAmount": 289,
    "paymentCurrency": "INR",
    "paymentIntentId": "pi_123",
    "expiresAt": "2026-05-31T12:40:00.000Z",
    "status": "reserved"
  },
  "payment": {
    "clientSecret": "pi_123_secret_abc",
    "amount": 289,
    "currency": "INR"
  }
}
```

### POST /api/rentals/create

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/rentals/create \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "6659f3f7d5caa5c7cc0d1a11",
    "rentalType": "weekly",
    "rentalDuration": 2
  }'
```

Response sample:
```json
{
  "message": "Reservation created",
  "reservation": {
    "_id": "665a01caa2efc2b97f0b3344",
    "book": "6659f3f7d5caa5c7cc0d1a11",
    "rentalType": "weekly",
    "rentalDuration": 2,
    "totalRentPrice": 280,
    "depositAmount": 149,
    "paymentAmount": 429,
    "paymentCurrency": "INR",
    "paymentIntentId": "pi_456",
    "expiresAt": "2026-05-31T12:40:00.000Z",
    "status": "reserved"
  },
  "payment": {
    "clientSecret": "pi_456_secret_def",
    "amount": 429,
    "currency": "INR"
  }
}
```

### POST /api/rentals/rent

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/rentals/rent \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "6659f3f7d5caa5c7cc0d1a11",
    "rentalType": "monthly",
    "rentalDuration": 1
  }'
```

Response sample:
```json
{
  "message": "Reservation created",
  "reservation": {
    "_id": "665a01caa2efc2b97f0b3344",
    "book": "6659f3f7d5caa5c7cc0d1a11",
    "rentalType": "monthly",
    "rentalDuration": 1,
    "totalRentPrice": 600,
    "depositAmount": 149,
    "paymentAmount": 749,
    "paymentCurrency": "INR",
    "paymentIntentId": "pi_789",
    "expiresAt": "2026-05-31T12:40:00.000Z",
    "status": "reserved"
  },
  "payment": {
    "clientSecret": "pi_789_secret_ghi",
    "amount": 749,
    "currency": "INR"
  }
}
```

### POST /api/rentals/:id/return

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/rentals/665a0050b2efc2b97f0b2211/return \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "condition": "good",
    "rating": 5,
    "reviewText": "Great read"
  }'
```

Response sample:
```json
{
  "message": "Return processed successfully",
  "returnSummary": {
    "rentalId": "665a0050b2efc2b97f0b2211",
    "returnedAt": "2026-05-31T12:55:00.000Z",
    "status": "returned",
    "condition": "good",
    "damageCharge": 0,
    "depositRefund": 149,
    "depositHeld": 0,
    "depositReleasedNow": 149
  }
}
```

### POST /api/rentals/return

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/rentals/return \
  --cookie "token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "rentalId": "665a0050b2efc2b97f0b2211",
    "condition": "major",
    "damagePercentage": 0.5,
    "adminNote": "Cover torn"
  }'
```

Response sample:
```json
{
  "message": "Return processed successfully",
  "returnSummary": {
    "rentalId": "665a0050b2efc2b97f0b2211",
    "returnedAt": "2026-05-31T12:55:00.000Z",
    "status": "returned",
    "condition": "major",
    "damageCharge": 499.5,
    "depositRefund": 0,
    "depositHeld": 149,
    "depositReleasedNow": 0
  }
}
```

---

## Reviews

### GET /api/reviews/book/:bookId

Request sample:
```bash
curl -i "http://localhost:8080/api/reviews/book/6659f3f7d5caa5c7cc0d1a11?page=1&limit=10&sortBy=rating"
```

Response sample:
```json
{
  "averageRating": 4.2,
  "total": 2,
  "reviews": [
    {
      "user": { "name": "Ava Patel" },
      "rating": 5,
      "reviewText": "Loved it",
      "isVerified": true,
      "createdAt": "2026-05-20T10:30:00.000Z"
    }
  ]
}
```

### POST /api/reviews

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/reviews \
  --cookie "token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "6659f3f7d5caa5c7cc0d1a11",
    "rentalId": "665a0050b2efc2b97f0b2211",
    "rating": 5,
    "reviewText": "Great read"
  }'
```

Response sample:
```json
{
  "message": "Review submitted",
  "review": {
    "_id": "665a06f7b2efc2b97f0b4455",
    "rating": 5,
    "isVerified": true
  }
}
```

### DELETE /api/reviews/:id

Request sample:
```bash
curl -i -X DELETE http://localhost:8080/api/reviews/665a06f7b2efc2b97f0b4455 \
  --cookie "token=<jwt>"
```

Response sample:
```json
{
  "message": "Review deleted"
}
```

---

## Admin

### GET /api/admin/dashboard

Request sample:
```bash
curl -i http://localhost:8080/api/admin/dashboard \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "totalBooks": 120,
  "totalUsers": 560,
  "activeRentals": 35,
  "totalReviews": 210,
  "suspendedUsers": 3
}
```

### GET /api/admin/books

Request sample:
```bash
curl -i "http://localhost:8080/api/admin/books?search=history&page=1&limit=10&sortBy=newest" \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "books": [{ "_id": "6659f3f7d5caa5c7cc0d1a11", "title": "Tokyo Drift" }],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### POST /api/admin/books

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/admin/books \
  --cookie "token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tokyo Drift",
    "author": "Kei Watanabe",
    "category": "Fiction",
    "rentPrice": 299,
    "isbn": "9780000000000",
    "publisher": "Northwind",
    "yearPublished": 2024,
    "description": "A fast-paced story",
    "image": "https://example.com/cover.jpg"
  }'
```

Response sample:
```json
{
  "message": "Book added successfully",
  "book": {
    "_id": "6659f3f7d5caa5c7cc0d1a11",
    "title": "Tokyo Drift",
    "author": "Kei Watanabe",
    "category": "Fiction",
    "rentPrice": 299
  }
}
```

### PUT /api/admin/books/:id

Request sample:
```bash
curl -i -X PUT http://localhost:8080/api/admin/books/6659f3f7d5caa5c7cc0d1a11 \
  --cookie "token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tokyo Drift (Updated)",
    "rentPrice": 349
  }'
```

Response sample:
```json
{
  "message": "Book updated successfully",
  "book": {
    "_id": "6659f3f7d5caa5c7cc0d1a11",
    "title": "Tokyo Drift (Updated)",
    "rentPrice": 349
  }
}
```

### DELETE /api/admin/books/:id

Request sample:
```bash
curl -i -X DELETE http://localhost:8080/api/admin/books/6659f3f7d5caa5c7cc0d1a11 \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "message": "Book deleted successfully",
  "book": {
    "_id": "6659f3f7d5caa5c7cc0d1a11",
    "title": "Tokyo Drift"
  }
}
```

### GET /api/admin/users

Request sample:
```bash
curl -i "http://localhost:8080/api/admin/users?search=ava&page=1&limit=10&role=all&status=active" \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "users": [{ "_id": "6659f0b9c1f6b1c0d0a1b111", "name": "Ava Patel", "email": "ava@example.com" }],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### PUT /api/admin/users/:id/suspend

Request sample:
```bash
curl -i -X PUT http://localhost:8080/api/admin/users/6659f0b9c1f6b1c0d0a1b111/suspend \
  --cookie "token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "isSuspended": true
  }'
```

Response sample:
```json
{
  "message": "User suspended successfully",
  "user": {
    "_id": "6659f0b9c1f6b1c0d0a1b111",
    "isSuspended": true
  }
}
```

### PUT /api/admin/users/:id/role

Request sample:
```bash
curl -i -X PUT http://localhost:8080/api/admin/users/6659f0b9c1f6b1c0d0a1b111/role \
  --cookie "token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

Response sample:
```json
{
  "message": "User role updated to admin",
  "user": {
    "_id": "6659f0b9c1f6b1c0d0a1b111",
    "role": "admin"
  }
}
```

### GET /api/admin/rentals

Request sample:
```bash
curl -i "http://localhost:8080/api/admin/rentals?status=active&page=1&limit=10&search=ava" \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "rentals": [
    {
      "_id": "665a0050b2efc2b97f0b2211",
      "user": { "name": "Ava Patel", "email": "ava@example.com" },
      "book": { "title": "Tokyo Drift", "author": "Kei Watanabe", "image": "https://example.com/cover.jpg" },
      "status": "active"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### PUT /api/admin/rentals/:id/force-return

Request sample:
```bash
curl -i -X PUT http://localhost:8080/api/admin/rentals/665a0050b2efc2b97f0b2211/force-return \
  --cookie "token=<admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "damageLevel": "minor",
    "damageCost": 200,
    "adminNote": "Pages warped"
  }'
```

Response sample:
```json
{
  "message": "Rental forced returned successfully",
  "rental": {
    "_id": "665a0050b2efc2b97f0b2211",
    "status": "returned"
  },
  "returnSummary": {
    "rentalId": "665a0050b2efc2b97f0b2211",
    "returnedAt": "2026-05-31T12:55:00.000Z",
    "status": "returned",
    "condition": "minor",
    "damageCharge": 249.75,
    "depositRefund": 0,
    "depositHeld": 149,
    "depositReleasedNow": 0
  }
}
```

### GET /api/admin/reviews

Request sample:
```bash
curl -i "http://localhost:8080/api/admin/reviews?page=1&limit=10&minRating=4" \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "reviews": [
    {
      "_id": "665a06f7b2efc2b97f0b4455",
      "user": { "name": "Ava Patel", "email": "ava@example.com" },
      "book": { "title": "Tokyo Drift", "author": "Kei Watanabe" },
      "rating": 5
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### DELETE /api/admin/reviews/:id

Request sample:
```bash
curl -i -X DELETE http://localhost:8080/api/admin/reviews/665a06f7b2efc2b97f0b4455 \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "message": "Review deleted successfully",
  "review": {
    "_id": "665a06f7b2efc2b97f0b4455",
    "user": { "name": "Ava Patel" },
    "book": { "title": "Tokyo Drift" }
  }
}
```

### GET /api/admin/reviews/stats

Request sample:
```bash
curl -i http://localhost:8080/api/admin/reviews/stats \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "totalReviews": 210,
  "averageRating": 4.1,
  "ratingDistribution": [
    { "_id": 1, "count": 3 },
    { "_id": 2, "count": 8 },
    { "_id": 3, "count": 40 },
    { "_id": 4, "count": 90 },
    { "_id": 5, "count": 69 }
  ]
}
```

---

## Cron

### POST /api/cron/check-overdue

Request sample:
```bash
curl -i -X POST http://localhost:8080/api/cron/check-overdue \
  --cookie "token=<admin-jwt>"
```

Response sample:
```json
{
  "message": "Overdue check completed",
  "processedCount": 2,
  "results": []
}
```

---

## Stripe Webhook

### POST /webhook

Request sample:
```bash
curl -i -X POST http://localhost:8080/webhook \
  -H "Stripe-Signature: <sig>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_123",
    "type": "payment_intent.succeeded",
    "data": { "object": { "id": "pi_123" } }
  }'
```

Response sample:
```json
{
  "received": true
}
```
