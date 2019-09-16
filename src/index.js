const $ = require('jquery');
/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');


getMovies().then(firstAPIResp => {
  // firstAPIResp

  getMovieData(firstAPIResp);

  function getMovieData(firstAPIResp){
    console.log(firstAPIResp);

    firstAPIResp.forEach(({title, rating, id}) => {
      console.log('XXXXX' + title);
      //       // Open Movie API
      fetch(`http://www.omdbapi.com/?t=${title}&apikey=8efa939f`)
          .then(data => data.json() )
          .then(movies => {
            console.log(movies);
            console.log(movies.Poster, typeof movies.Poster);
            let moviePosterImg = movies.Poster;
            let moviePlot = movies.Plot;
            let movieBoxOffice = movies.BoxOffice
            let movieItems = '';
            // movieItems += `<img class="w-75 max-width: 250px" src="${movies.Poster}" alt="">`;

            // $('.posterBox').append(movieItems);

            // Send movie data to movies api Fetch function
            const blogPost = {title: title, rating: rating, poster: moviePosterImg, plot: moviePlot, boxOffice: movieBoxOffice};
            const url = `/api/movies/${id}`;
            const options = {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(blogPost),
            };
            fetch(url, options)
                .then( (data) => console.log('Post was successful', data)/* post was created successfully */)
                .catch( (data) => console.log('Post unsuccessful', data) /* handle errors */);
          }); // end of .then movies
    }); // end of forEach
  } // end of getMovieData function
});



refreshMovies(); //Initial call

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
      .then( (data) => console.log('Post was successful', data)/* post was created successfully */)
      .catch( (data) => console.log('Post unsuccessful', data) /* handle errors */);

 setTimeout(function () {
   refreshMovies(); // Updates movies when new movie is submitted
 }, 4000);

  window.location.reload(); // reload page
  $('#movieTitle').val(''); // Clears out the input
  $('#rating').val(''); // Clears out the drop down
} // End of newMovie()

$('.addMovieBtn').on('click',() => newMovie($('#movieTitle').val(), $('#rating').val()) );



  function modify(movieTitle, movieRating, idNum){
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
        .then( (data) => console.log('Post was successful', data)/* post was created successfully */)
        .catch( (data) => console.log('Post unsuccessful', data) /* handle errors */);

    refreshMovies();
  }


function deleteMovie(idNum){

  const url = `/api/movies/${idNum}`;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },

  };
  fetch(url, options)
      .then( (data) => console.log('Post was successful', data)/* post was created successfully */)
      .then(  refreshMovies() )
      .catch( (data) => console.log('Post unsuccessful', data) /* handle errors */);


}


function refreshMovies(){

getData(); // Run getData function :)

function getData(movieTitle) {
  let firstAPICall = fetch("/api/movies");
  let secondAPICall = fetch(`http://www.omdbapi.com/?t=${movieTitle}&apikey=8efa939f`);

  Promise.all([firstAPICall, secondAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(finalVals => {

        $('#loading').html('').css('display', 'none'); // Turns off loading spinner on load
        $('.movies').html('');
        // Show add movie inputs on load
        $('.addMovieInputs').css('display', 'block').css('text-align', 'center');

        let firstAPIResp = finalVals[0];
        let secondAPIResp = finalVals[1];
        // renderHTML(firstAPIResp, secondAPIResp);
        console.log(firstAPIResp);
        console.log(secondAPIResp);
        let counter = 0;

        // getMovieData(firstAPIResp);
        //
        // function getMovieData(firstAPIResp){
        //   console.log(firstAPIResp);
        //
        //       firstAPIResp.forEach(({title, rating, id}) => {
        //         console.log('XXXXX' + title);
        //         //       // Open Movie API
        //         fetch(`http://www.omdbapi.com/?t=${title}&apikey=8efa939f`)
        //             .then(data => data.json() )
        //             .then(movies => {
        //               console.log(movies);
        //               console.log(movies.Poster, typeof movies.Poster);
        //               let moviePosterImg = movies.Poster;
        //               let moviePlot = movies.Plot;
        //               let movieBoxOffice = movies.BoxOffice
        //               let movieItems = '';
        //           // movieItems += `<img class="w-75 max-width: 250px" src="${movies.Poster}" alt="">`;
        //
        //               // $('.posterBox').append(movieItems);
        //
        //               // Send movie data to movies api Fetch function
        //               const blogPost = {title: title, rating: rating, poster: moviePosterImg, plot: moviePlot, boxOffice: movieBoxOffice};
        //               const url = `/api/movies/${id}`;
        //               const options = {
        //                 method: 'PUT',
        //                 headers: {
        //                   'Content-Type': 'application/json',
        //                 },
        //                 body: JSON.stringify(blogPost),
        //               };
        //               fetch(url, options)
        //                   .then( (data) => console.log('Post was successful', data)/* post was created successfully */)
        //                   .catch( (data) => console.log('Post unsuccessful', data) /* handle errors */);
        //             }); // end of .then movies
        //       }); // end of forEach
        // } // end of getMovieData function


        setTimeout(function(){

        firstAPIResp.forEach(({title, rating, poster, plot, boxOffice, id}) => {
          // console.log('🔥🔥',title, rating, id);
          console.log(secondAPIResp.Poster);
          let moviePosterImg = firstAPIResp.poster;
          let movieItems = '';
          // getData(title); // Calls the getData function and send the movie title from the loop.
          console.log(rating);
          console.log(poster);
          console.log(plot);
          console.log(boxOffice);
          console.log(moviePosterImg);
          counter++;


          movieItems += `<div class="card">
                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-1">
                            <h4 class="card-title"> ${title}</h4>
                            <div class="card-text">
                            Rating: ${rating}
                            </div>
                            <div class="posterBox"><img class="filmPosterImg w-75 max-width: 250px" src="${poster}" alt=""></div>
                            <p class="movie-boxOffice">Box Office: ${boxOffice}</p>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary editBtn justify-content-end mt-auto" data-toggle="modal" data-target="#exampleModal">
                              Edit Movie
                            </button>
                            
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
                                    <p>Edit Movie Raiting</p>
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
                                    <button type="button" class="btn btn-danger mr-auto deleteMovieBtn" id="deleteMovieBtn" data-dismiss="modal" >Delete Movie</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" id="saveEditBtn" class="btn btn-primary saveEditBtn" data-dismiss="modal">Save changes</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                        </div>  
                    </div>`;

          $('.movies').append(movieItems);
          // console.log(title, rating, id);

          $('.editBtn').on('click', function () {

            console.log('🔥🔥🔥🔥🔥');
            // Grabs movie title from card user clicks on
            let targetedMovieTitle = $(this).parents('.card-body').children('.card-title').text();

            // Adds movie title to the modal input value
            $('#editTitle').val(targetedMovieTitle);


            function getIdNumber() {
              return fetch('api/movies').then(data => {
                return data.json()})
                  .then(data => {
                    for(let i = 0; i < data.length; i++){
                      if(data[i].title === targetedMovieTitle.slice(1)){
                        return data[i].id
                      }
                    }
                  });
            }

            getIdNumber().then( data => {
              let idNumber = data;

              $('.saveEditBtn').on('click', function () {
                console.log('save edit button was pushed 🔥🔥');
                let movieTitle = $('#editTitle').val();
                let movieRating = $('.editRating').val();
                console.log(movieRating);
                modify(movieTitle, movieRating, idNumber);

                setTimeout(function () {
                  refreshMovies();

                }, 2000)

                // getData();

              });
              $('.deleteMovieBtn').on('click', function () {
                deleteMovie(idNumber);

              })
            });
          }); // End .endBtn click function
          console.log(`The loop ran : ${counter}`);
        }); // End movies.forEach
        }, 500);// end of time out

      }); // End of GetData promise .then

} // End of getData function
} // End of refreshMovies function

// getData();
// refreshMovies();  // First time calling refreshMovies()

$('.refreshBtn').on('click', function () {
  refreshMovies()

});


