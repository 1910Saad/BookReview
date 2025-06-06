# Book Review Application

A full-stack application for managing and reviewing books.

## Features

- User authentication (sign up, log in)
- Add books (by the book's author)
- Add, edit, and delete reviews (by the review's author)
- Search and pagination for books
- View book details with reviews
- Modern UI

## Project Structure

```
BookReview/
│
├── client/                   # React frontend
│   ├── src/
|   |   ├── assets/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (BookList, BookDetails, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── server/                   # Node.js/Express/MongoDB backend
│   ├── models/               # Mongoose models (User, Book, Review)
│   ├── routes/               # Express routes (auth, books, reviews)
│   ├── middleware/           # Authentication middleware
│   ├── controllers/          # Route controllers
│   ├── index.js              # Entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Backend

1. Install dependencies:
   ```sh
   cd server
   npm install
   ```
2. Configure your `.env` file with MongoDB URI and JWT secret.
3. Start the backend:
   ```sh
   node index.js
   ```

### Frontend

1. Install dependencies:
   ```sh
   cd client
   npm install
   ```
2. Start the frontend:
   ```sh
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the `server` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
