# Movie Review Platform

## Project Overview
This project is a movie review platform where users can:
- Browse trending movies
- Search movies
- View and submit reviews
- Login/Signup for authentication

> Note: Some advanced features (watchlist, React conversion, trailers, user profiles) are still pending.

---

## Features Implemented
- Trending movies listing using TMDB API
- Search movies by title
- Individual movie review pages with:
  - Display existing reviews
  - Add new review
  - Edit/Delete reviews
- User authentication: login/signup
- Dark/Light mode toggle
- Responsive layout with CSS

---

## Project Structure
frontend/
├── index.html # Home / trending movies
├── movie.html # Reviews page
├── login.html # User login page
├── signup.html # User signup page
├── new/
│ ├── script.js # Handles movie listing, search
│ ├── movie.js # Handles reviews page (fetch, CRUD)
│ └── style.css # Styling
backend/
├── index.js # Express server setup
├── routes/ # API routes for movies, reviews, users
├── models/ # MongoDB schemas
├── controllers/ # API logic


---

## Setup Instructions

### Backend
1. Install dependencies:
```bash
cd backend
npm install
npm run dev
