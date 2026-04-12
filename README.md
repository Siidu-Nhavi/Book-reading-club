# 📚 Book Reading Club

A full-stack web application for book enthusiasts to catalog, rent, review, and discuss books within a community. Built with modern web technologies for a seamless user experience.

## 📖 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Team Members](#team-members)

---

## ✨ Features

### User Management
- User registration and authentication with JWT
- Secure password hashing with bcrypt
- User profile management and avatars
- Role-based access control (Admin/User)

### Book Catalog
- Browse comprehensive book collection with filtering and search
- Detailed book information (title, author, description, category)
- Multiple book categories for organization
- Book rating and review system
- Hero section with featured books

### Book Rental System
- Rent books with rental duration tracking
- View active and past rental history
- Return books functionality
- Rental deposit management

### Community & Reviews
- Write and read book reviews
- Rating system for books
- Delete personal reviews
- Community engagement features

### Dashboard
- User dashboard with rental overview
- Admin dashboard for content management
- Navigation between different sections
- Profile management interface

### UI/UX
- Responsive design with Material-UI components
- Consistent styling and design tokens
- Protected routes for authenticated users
- Error handling and user-friendly notifications

---

## 🛠 Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **Vite** 8.0.1 - Build tool and dev server
- **React Router Dom** 7.13.1 - Client-side routing
- **Material-UI (MUI)** 9.0.0 - Component library
- **Emotion** 11.14.0 - CSS-in-JS styling
- **Formik** 2.4.9 - Form state management
- **ESLint** 9.39.4 - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MongoDB** with **Mongoose** 9.3.1 - Database and ODM
- **JWT** 9.0.3 - Authentication tokens
- **bcryptjs** 3.0.3 - Password hashing
- **dotenv** 17.3.1 - Environment configuration
- **Nodemon** 3.1.14 - Development auto-reload

---

## 📁 Project Structure

```
Book-reading-club/
├── frontend/                      # React frontend application
│   ├── src/
│   │   ├── api/                  # API client modules
│   │   │   ├── admin.api.js
│   │   │   ├── auth.api.js
│   │   │   ├── books.api.js
│   │   │   ├── profile.api.js
│   │   │   ├── rentals.api.js
│   │   │   ├── reviews.api.js
│   │   │   └── client.js         # Axios instance
│   │   ├── components/           # React components
│   │   │   ├── books/           # Book-related components
│   │   │   ├── common/          # Shared components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── landing/         # Landing page components
│   │   │   └── shared/          # Miscellaneous components
│   │   ├── context/             # React Context for state
│   │   │   ├── auth-context.js
│   │   │   └── AuthContext.jsx
│   │   ├── data/                # Static data files
│   │   │   ├── dashboardNav.js
│   │   │   └── navLinks.js
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useBookById.js
│   │   │   ├── useBooks.js
│   │   │   ├── useDashboardOverview.js
│   │   │   └── useDebounce.js
│   │   ├── layouts/             # Layout components
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── BookDetailPage.jsx
│   │   │   ├── BooksCatalogPage.jsx
│   │   │   ├── CommunityPage.jsx
│   │   │   ├── dashboard/       # Dashboard pages
│   │   │   └── auth/            # Authentication pages
│   │   ├── styles/              # Global CSS and tokens
│   │   │   ├── global.css
│   │   │   └── tokens.css
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── server/                        # Express backend application
│   ├── controllers/              # Route handlers
│   │   ├── auth/                # Authentication controllers
│   │   │   ├── login.js
│   │   │   ├── register.js
│   │   │   └── logout.js
│   │   ├── books/               # Book controllers
│   │   │   ├── getAllBook.js
│   │   │   ├── getBook.js
│   │   │   └── getBookCategories.js
│   │   ├── renting/             # Rental controllers
│   │   │   ├── rentBook.js
│   │   │   ├── returnBook.js
│   │   │   └── getMyRentals.js
│   │   ├── reviews/             # Review controllers
│   │   │   ├── createReview.js
│   │   │   ├── deleteReview.js
│   │   │   └── getBookReviews.js
│   │   └── user/                # User controllers
│   │       ├── getCurrentUser.js
│   │       └── updateProfile.js
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Rental.js
│   │   ├── Review.js
│   │   └── Profile.js
│   ├── routes/                  # Express routes
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── profile.js
│   │   ├── rentals.js
│   │   └── reviews.js
│   ├── middleware/              # Express middleware
│   │   └── auth.js
│   ├── config/                  # Configuration files
│   │   └── db.js
│   ├── init/                    # Database initialization
│   │   ├── index.js
│   │   ├── sampleUsers.json
│   │   ├── sampleReviews.json
│   │   └── updated_main.csv
│   ├── utils/                   # Utility functions
│   │   └── security.js
│   ├── server.js                # Entry point
│   └── package.json
│
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** (npm comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Book-reading-club
```

#### 2. Install Backend Dependencies
```bash
cd server
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-reading-club
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

For MongoDB Atlas connection:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/book-reading-club
```

---

## ▶️ Running the Application

### Development Mode

#### Start the Backend Server
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000` with auto-reload enabled via nodemon.

#### Start the Frontend Development Server
In another terminal:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or another available port).

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend Server
```bash
cd server
npm start
```

### Database Initialization

To seed the database with sample data:
```bash
cd server
npm run seed:all
```

This will load sample users, books, and reviews from the JSON files in the `init` directory.

### Other Useful Commands

**Backend:**
- `npm run init` - Initialize database with sample data
- `npm run backfill:schema` - Run schema migration scripts

**Frontend:**
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: { message: "Logged out successfully" }
```

### Book Endpoints

#### Get All Books
```
GET /api/books?page=1&limit=10&category=Fiction&search=Harry

Response: { books, total, pages }
```

#### Get Book by ID
```
GET /api/books/:id

Response: { book, reviews, rating }
```

#### Get Categories
```
GET /api/books/categories

Response: { categories }
```

### Rental Endpoints

#### Rent a Book
```
POST /api/rentals/rent
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_id",
  "rentalDays": 7
}

Response: { rental }
```

#### Get My Rentals
```
GET /api/rentals/my-rentals
Authorization: Bearer <token>

Response: { rentals }
```

#### Return a Book
```
POST /api/rentals/return/:rentalId
Authorization: Bearer <token>

Response: { message: "Book returned successfully" }
```

### Review Endpoints

#### Get Book Reviews
```
GET /api/reviews/book/:bookId

Response: { reviews }
```

#### Create Review
```
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_id",
  "rating": 5,
  "comment": "Great book!"
}

Response: { review }
```

#### Delete Review
```
DELETE /api/reviews/:reviewId
Authorization: Bearer <token>

Response: { message: "Review deleted" }
```

### User Profile Endpoints

#### Get Current User
```
GET /api/profile/me
Authorization: Bearer <token>

Response: { user, profile }
```

#### Update Profile
```
PUT /api/profile/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Book lover",
  "avatar": "avatar_url",
  "preferences": {}
}

Response: { profile }
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/user),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  title: String,
  author: String,
  description: String,
  isbn: String,
  category: String,
  imageUrl: String,
  rating: Number,
  totalCopies: Number,
  availableCopies: Number,
  createdAt: Date
}
```

### Rental Model
```javascript
{
  userId: ObjectId (ref: User),
  bookId: ObjectId (ref: Book),
  rentalDate: Date,
  returnDate: Date,
  dueDate: Date,
  status: String (active/returned/overdue),
  depositAmount: Number
}
```

### Review Model
```javascript
{
  userId: ObjectId (ref: User),
  bookId: ObjectId (ref: Book),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Model
```javascript
{
  userId: ObjectId (ref: User),
  bio: String,
  avatar: String,
  preferences: Object,
  joinDate: Date
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards
- Follow ESLint rules for frontend code
- Write meaningful commit messages
- Document complex functions
- Test your changes before submitting

---

## 👥 Team Members

- **Yash Basargekar** - Developer
- **Tushar Patil** - Developer
- **Siddu Nhavi** - Developer

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📧 Support

For support, email support@bookreadingclub.com or open an issue in the repository.

---

**Happy Reading! 📖✨**
