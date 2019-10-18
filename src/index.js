const $ = require('jquery')

// API Fetch Url
const movieAPIUrl = 'https://api.themoviedb.org/3/search/movie?api_key=bc60faa44c7061b671ee155a3b9e8c3c';
// First part of url for image
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
/**
 * require style imports
 */
const {getMovies} = require('./api.js');


function refreshMovies() {
    getMovies().then((movies) => {
        $('#loading').html('').css('display', 'none');
        $('.movies').html('');
        // Show add movie inputs on load
        $('.addMovieInputs').css('display', 'block').css('text-align', 'center');

        movies.forEach(({title, rating, id}) => {
            let movieItems = '';

            movieItems += `<div class="card">
                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-1">
                            <h4 class="card-title"> ${title}</h4>
                            <div class="mt-auto">
                                <div class="card-text ">
                                Rating: ${rating}
                                </div>
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-primary editBtn justify-content-end" data-toggle="modal" data-target="#exampleModal">
                                  Edit
                                </button>
                            </div>
                            <!-- Modal -->
                            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Edit Movie</h5>
                                             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p>Edit Movie Title</p>
                                        <!--input-->
                                            <input id="editTitle" class="form-control form-control-sm" type="text" value="" placeholder="Movie Title">
                                            <p class="edit-rating">Edit Movie Raiting</p>
                                        <!--Select-->
                                            <div class="input-group mb-3">
                                                <select class="custom-select editRating" >
                                                    <option value="0" selected>Choose...</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                            </div>
                                            </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-danger mr-auto btn-size" id="deleteMovieBtn">Delete Movie</button>
                                            <button type="button" class="btn btn-secondary btn-size" data-dismiss="modal">Close</button>
                                            <button type="button" id="saveEditBtn" class="btn btn-primary btn-size" data-dismiss="modal">Save changes</button>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>`;

            $('.movies').append(movieItems);
        });

        $('.editBtn').on('click', function () {
            let targetedMovieTitle = $(this).parents('.card-body').children('.card-title').text();

            // Adds movie title to the modal input value
            $('#editTitle').val(targetedMovieTitle.trim());


            function getIdNumber() {
                return fetch('api/movies').then(data => {
                    return data.json()
                })
                    .then(data => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].title === targetedMovieTitle.slice(1)) {
                                return data[i].id
                            }
                        }
                    });
            }
            // Disables delete button until id is available
            $('#deleteMovieBtn').addClass('disabled');
            $('#deleteMovieBtn').removeAttr('data-dismiss');
            getIdNumber().then(data => {
                let idNumber = data;
                $('#deleteMovieBtn').removeClass('disabled');
                $('#deleteMovieBtn').attr('data-dismiss','modal');
                $('#saveEditBtn').on('click', function () {
                    let movieTitle = $('#editTitle').val();
                    let movieRating = $('.editRating').val();
                    modify(movieTitle, movieRating, idNumber);

                });
                $('#deleteMovieBtn').on('click', function () {
                    deleteMovie(idNumber);
                })
            });
        })

    }) // End of GetMovies()
        .catch((error) => {
        });

} // End of refreshMovies


refreshMovies(); //Initial call

// Validate input from add new movie
$('.addMovieBtn').on('click', () => {

    if($('#movieTitle').val() === "" && $('#rating').val() === null){
        $('#movieTitle').css('border-color', 'red');
        $('#rating').css('border-color', 'red');
    }else if($('#movieTitle').val() === ""){
        console.log('null movie input ');
        $('#movieTitle').css('border-color', 'red')
    }else if($('#rating').val() === null ){
        $('#rating').css('border-color', 'red');
    }
    else{
        newMovie($('#movieTitle').val(), $('#rating').val());
        $('#movieTitle').css('border-color', '#CED4DA');
        $('#rating').css('border-color', '#CED4DA');

    }
});


// ======================== Movie Poster
// Gets movie poster img source
function movieSection(movies) {
    return movies.map((movie) => {
        if (movie.poster_path) { // Checking if movie poster is valid or null. Only display posters that have a URL.
            return `<img class="posterImage" src=${IMAGE_URL + movie.poster_path} data-movie-id=${movie.id}/>`;
        }

    })

}

//======== Add movie to DOM
function createMovieContainer(movies) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');  // Sets the class for movieElement

    const movieTemplate = `
        <section class="section">
            ${movieSection(movies)}
        </section>
<!--        <div class="content">-->
<!--            <p id="content-close">X</p>-->
<!--        </div>   -->
    `;

    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

// data is coming from fetch
function renderSearchMovies(data) {
    // data.results []
    // searchedMovies.innerHTML = ''; // Clears movies after each new movie search
    // console.log('Data: ', data);
    const movies = data.results; // returns results array from movie API
    const movieBlock = createMovieContainer(movies); // Returns movie div container
    $('#posters').append(movieBlock);  // appends movie div to DOM
    // posters.appendChild(movieBlock); // appends movie div to DOM
    console.log('Data from API: ', data);
    console.log("movies", movies);
    console.log("movieBlock inside fetch: ", movieBlock);
}


$('#findPoster').on('click', (event) => {
    event.preventDefault(); // Stop browser from reloading the page when the button is clicked.
    const searchValue = $('#movieTitle').val(); // Users value
    // Movie api url with users input as the query
    const urlWithSearchValue = movieAPIUrl + '&query=' + searchValue;
    console.log('Search button has been clicked!!!');
    // loadingScreen.style.display = 'block';// Show loading screen
    // setTimeout(function () {
    console.log(urlWithSearchValue);
    // ====== Fetch request ======
        fetch(urlWithSearchValue)
            .then((data) => data.json())
            .then((data) => {
                console.log("inside fetch", data);
                renderSearchMovies(data); // sends movie data to render HTML to send movie poster to DOM.
                // loadingScreen.style.display = 'none'; // Hide loading screen
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    // }, 1750);

    // searchInput.value = ''; // Clears the search input after the search btn has been clicked.
    console.log("Search Value:", searchValue);
});




function newMovie(movieTitle, movieRating) {

    const blogPost = {title: movieTitle, rating: movieRating};
    const url = '/api/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPost),
    };
    fetch(url, options)
        .then((data) => console.log('Post was successful', data)/* post was created successfully */)
        .catch((data) => console.log('Post unsuccessful', data) /* handle errors */);


    refreshMovies(); // Updates movies when submit is clicked
    $('#movieTitle').val(''); // Clears out the input
    $('#rating').val(''); // Clears out the drop down
} // End of newMovie()


function modify(movieTitle, movieRating, idNum) {
    const blogPost = {title: movieTitle, rating: movieRating};
    const url = `/api/movies/${idNum}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPost),
    };
    fetch(url, options)
        .then((data) => console.log('Post was successful', data)/* post was created successfully */)
        .catch((data) => console.log('Post unsuccessful', data) /* handle errors */);

    refreshMovies();
}


function deleteMovie(idNum) {

    const url = `/api/movies/${idNum}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },

    };
    fetch(url, options)
        .then((data) => console.log('Post was successful', data)/* post was created successfully */)
        .catch((data) => console.log('Post unsuccessful', data) /* handle errors */);

    refreshMovies();

}




