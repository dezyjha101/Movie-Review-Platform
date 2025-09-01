const API_BASE = "http://localhost:5000/api";
const movieId = new URLSearchParams(window.location.search).get("id");

// Load movie details + reviews
async function loadMovie() {
  try {
    const res = await fetch(`${API_BASE}/movies/${movieId}`);
    const movie = await res.json();

    document.getElementById("movie-details").innerHTML = `
      <h2>${movie.title}</h2>
      <p>${movie.description || "No description"}</p>
    `;

    loadReviews();
  } catch (err) {
    console.error("Error loading movie:", err);
  }
}

// Load reviews
async function loadReviews() {
  try {
    const res = await fetch(`${API_BASE}/movies/${movieId}/reviews`);
    const reviews = await res.json();

    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = "";

    if (reviews.length === 0) {
      reviewList.innerHTML = "<p>No reviews yet.</p>";
    } else {
      reviews.forEach(r => {
        const div = document.createElement("div");
        div.classList.add("review");
        div.innerHTML = `<p>${r.text}</p><small>by ${r.user?.name || "Anonymous"}</small>`;
        reviewList.appendChild(div);
      });
    }
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
}

// Add review
async function addReview() {
  const text = document.getElementById("reviewText").value.trim();
  if (!text) return alert("Please write something!");

  try {
    const token = localStorage.getItem("token"); // stored after login
    if (!token) {
      alert("You must be logged in to post a review.");
      return;
    }

    const res = await fetch(`${API_BASE}/movies/${movieId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to post review");
      return;
    }

    document.getElementById("reviewText").value = "";
    loadReviews();
  } catch (err) {
    console.error("Error posting review:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMovie();
  document.getElementById("submitReview").addEventListener("click", addReview);
});
