const apiKey = "173636afaae633b62ec1dc988aa67b35";
const apiUrl = "https://api.themoviedb.org/3";
const movieList = document.getElementById("movies");
const movieDetails = document.getElementById("movie-details");
const detailsContainer = document.getElementById("details");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const favoritesList = document.getElementById("favorites-list");
const addToFavoritesButton = document.getElementById("add-to-favorites");
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
  try {
    const populares = await fetch(
      `${apiUrl}/movie/popular?api_key=${apiKey}&language=us-EN`
    );
    const datos = await populares.json();
    displayMovies(datos.results);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

// Display movies
function displayMovies(movie) {
  movieList.innerHTML = ""; // Limpia la lista de películas
  movie.forEach((movie) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
    li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
    movieList.appendChild(li);
  });
}

// Show movie details
async function showMovieDetails(movieId) {
  try {
    const populares = await fetch(
      `${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=us-EN`
    );
    const movie = await populares.json();
    selectedMovieId = movie.id;
    detailsContainer.innerHTML = `
        <h3>${movie.title}</h3>
        <img src = "https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <p>${movie.release_date}</p>
        <p>${movie.vote_average}</p>
        `;
    movieDetails.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Search movies
searchButton.addEventListener("click", async () => {
  const query = searchInput.value;
  if (query) {
    try {
      const populares = await fetch(
        `${apiUrl}/search/movie?api_key=${apiKey}&language=us-EN&query=${encodeURIComponent(
          query
        )}`
      );
      const datos = await populares.json();
      displayMovies(datos.results);

    } catch (error) {
      console.error("Error searching movies:", error);
    }
  }
});

// Add movie to favorites
addToFavoritesButton.addEventListener("click", () => {
  if (selectedMovieId) {
    const favoriteMovie = {
      id: selectedMovieId,
      title: document.querySelector("#details h3").textContent,
    };
    if (!favoriteMovies.some((movie) => movie.id === selectedMovieId)) {
      favoriteMovies.push(favoriteMovie);
      localStorage.setItem("favorites", JSON.stringify(favoriteMovies)); // Guarda en localStorage
      displayFavorites(); // Muestra la lista actualizada de favoritos
    }
  }
});

// Display favorite movies
function displayFavorites() {
  favoritesList.innerHTML = ""; // Limpia la lista de favoritos
  favoriteMovies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = movie.title;
    favoritesList.appendChild(li);
  });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
