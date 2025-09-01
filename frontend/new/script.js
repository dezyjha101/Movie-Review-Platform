const API_BASE = "http://localhost:5000/api";

// Fetch all movies from backend
async function fetchMovies() {
  try {
    const res = await fetch(`${API_BASE}/movies`);
    const movies = await res.json();

    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    movies.forEach(movie => {
      const div = document.createElement("div");
      div.classList.add("movie-card");

      div.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.description || "No description available"}</p>
        <button onclick="goToMovie('${movie._id}')">View Reviews</button>
      `;

      movieList.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

// Redirect to movie page with ID
function goToMovie(id) {
  window.location.href = `movie.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();

  // search
  document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    const res = await fetch(`${API_BASE}/movies?search=${query}`);
    const movies = await res.json();

    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    movies.forEach(movie => {
      const div = document.createElement("div");
      div.classList.add("movie-card");

      div.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.description || "No description available"}</p>
        <button onclick="goToMovie('${movie._id}')">View Reviews</button>
      `;

      movieList.appendChild(div);
    });
  });
});
