// Titles: https://omdbapi.com/?s=thor&page=1&apikey=5cc4677d
// details: https://www.omdbapi.com/?i=tt3896198&apikey=5cc4677d

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=5cc4677d`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let i in movies){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[i].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[i].Poster != "N/A")
            moviePoster = movies[i].Poster;
        else 
            moviePoster = "./images/image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=5cc4677d`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "./images/image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info text-start ms-3 ">
        <h3 class = "movie-title">${details.Title}</h3>
        <p class="text-secondary text-capitalize text-secondary">${details.Type} &#x2022; ${details.Year} &#x2022; ${details.Runtime}</p>
        <ul class = "movie-misc-info">
            ${(details.Ratings[0])? `<li class ="rated imdb ms-0"> <a href="https://www.imdb.com/title/${details.imdbID}/"> IMBD </a> <br>${details.Ratings[0].Value}</li>`: ''}
            ${(details.Ratings[1])? `<li class ="rated rotten"> <a href="https://www.rottentomatoes.com"> ${details.Ratings[1].Source} </a> <br>${details.Ratings[1].Value}</li>` : ''}  
      </ul>

        <p class = "released"><b>Release Date:</b> ${details.Released}</p>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Director:</b> ${details.Director}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "country language"><b>Country:</b> ${details.Country}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});