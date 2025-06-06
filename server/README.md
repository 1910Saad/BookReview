# Book Review API Backend

This is a Node.js + Express + MongoDB backend for the Book Review application.

## Features
- User authentication (signup, login with JWT)
- Book CRUD (create, read, update, delete)
- Review CRUD (create, update, delete, linked to books and users)
- Search and pagination for books
- JWT-protected write operations

## Getting Started

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Set up MongoDB (local or Atlas) and update `.env` if needed.
3. Start the server:
   ```powershell
   node index.js
   ```
4. The API will run at http://localhost:5000

## API Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/books` — List/search books (with pagination)
- `POST /api/books` — Add a book (auth required)
- `PUT /api/books/:id` — Edit a book (auth, author only)
- `DELETE /api/books/:id` — Delete a book (auth, author only)
- `GET /api/books/:id` — Get book details (with reviews)
- `POST /api/books/:bookId/reviews` — Add review (auth)
- `PUT /api/books/:bookId/reviews/:reviewId` — Edit review (auth, owner only)
- `DELETE /api/books/:bookId/reviews/:reviewId` — Delete review (auth, owner only)

---

Connect this backend to your React frontend at http://localhost:5173.
