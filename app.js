"use strict"
$(document).ready(function() {

    // Stores all movie objects
    var movies = [
        // {title: "Parasite", year: "2019", runtime: "2h 12min", genre: "Drama, Triller", poster: ""}
    ];
    

// Executes function when document is ready
    (function() {
    // Creates card that will contain movie details fetched from the API 
    var card = '';
    card += "<div class='card'>";
        card += "<div class='banner'>";
        card += "</div>";
        card += "<div class='info'>";
            card += "<p><span>Title: </span><em id='movie-title'></em></p>";
            card += "<p><span>Year: </span><em id='movie-year'></em></p>";
            card += "<p><span>Runtime: </span><em id='movie-runtime'></em></p>";
            card += "<p><span>Genre: </span><em id='movie-genre'></em></p>";
            card += "<a class='add-movie'>Add movie</a>";
        card += "</div>";
    card += "</div>";
    $("#movie").append(card);

     // Creates modal that contains movie details
    var modal = '';
    modal += "<div class='modal-card'>";
    modal += "<a id='close-modal' href='#'><i class='fas fa-times close-modal'></i></a>";
   
    modal += "<div class='modal-info'>";
    modal += "<div id='modal-img'>";
    // modal += "<img id='modal-img' class='img' src='img/parasite.jpg'>";
    modal += "</div>";
    modal += "<p id='modal-title'></p>";
    modal += "<p id='modal-year'></p>";
    modal += "<p id='modal-runtime'></p>";
    modal += "<p id='modal-genre'></p>";
    modal += "</div>";
    modal += "</div>";
    $("#modal").append(modal);
    })(jQuery);

    // API KEY 
    var apiKey = '635293c0';
   
    // Event listener for search bar
    $(".search-bar").on('keypress',function(e) {
        // Get search value from user
        var search_bar = $(".search-bar").val();
       // Search for movie if user presses the 'Enter' key  
        if(e.which == 13) {
        // Checks user enters no value
        if (search_bar.trim() == "") { 
            error("Invalid input");
        }
        else {
            // Build the URL based on the search term
            var url_omdb = 'http://www.omdbapi.com/?apikey=' + apiKey + '&t=' + search_bar;

            //jQuery ajax method to fetch data from API
            $.ajax({
                url: url_omdb,
                beforeSend : function() {
                    // $("#movie").append("<h1 class='load'>Laoding...</h1>").hide().fadeIn(300);
                   console.log('loading...');
                },
                dataType: 'json',
                type: 'get',
                success: function(data) {
                   
                    if(data.Response == "True") {

                        // Display card with data fetched
                        $("#movie div").css("display", "block");
                        // Display 'connection lost' image if a poster cannot be retrived
                        if (data.Poster == 'N/A') {
                            $(".banner").css("background-image", "url(img/connectionLost.jpg)");
                        }
                        else {
                            $(".banner").css("background-image", "url(" + data.Poster + ")");
                        }
                       
                        $("#movie-title").text(data.Title);
                        $("#movie-year").text(data.Year);
                        $("#movie-runtime").text(data.Runtime);
                        $("#movie-genre").text(data.Genre);
                        enableButton();
                    }
                    else {
                        // Display error message if data cannot be fetched
                        $(".card").remove();
                        error("No movie found");
                    }

                    
                   
                },
    
                error: function(){
                    // Display error message if there's a connection error
                    error("Connection error");
                }
    
            });
           e.preventDefault();
        }


        }

        });

     // Event listener for add button in the card
    $(".add-movie").click(function(e) {
        // Get movie details from card
        var movie_title = $("#movie-title").text();
        var movie_year = $("#movie-year").text();
        var movie_runtime = $("#movie-runtime").text();
        var movie_genre = $("#movie-genre").text();
        var movie_poster = $(".banner").css("background-image");

        var newItem = '';
        
        // If valid, add movie details to the movies array and the list in the UI
        if (isValid(movie_title)) {
           
            // Create movie object containing movie details
            var movieObj = {
                title: movie_title,
                year: movie_year,
                runtime: movie_runtime,
                genre: movie_genre,
                poster: movie_poster
            }
            // Add movie object to movies array
            movies.push(movieObj);

            // Create new list item of movie and add to the UI
            newItem += "<tr>";
            newItem += "<td title='" + movie_title + "'>" + "<span class='movie-title'>" + movie_title + " " + "(" + movie_year +"</span>" + ")" + "</td>";
            newItem += "<td> <a class='btn-view' href='#'>View</a> <a class='btn-remove' href='#'><i class='fas fa-times deleteEmp'></i></a></td>";
            newItem += "</tr>";

            $("tbody").append(newItem);
            disableButton();

            // Show message if user has added 5 movies 
            if (movies.length == 5) {
                banner("Nomination list complete!");
            }
            else {
                // Show message if user adds a movie
                banner("movie added");
            }
            
            
        }

        else {

        }


        e.preventDefault();
    });

    // Event listener for remove button in the list
    $(document.body).on("click", ".btn-remove", function(e){

        // Get title
        var title = $(this).parent().prev().attr('title');

        // Loop through movies array and delete movie 
        for(var i = 0; i < movies.length; i++) {
            if (movies[i].title === title) {
                movies.splice(i, 1);
            }
           }
       
        // Delete movie from UI 
        $(this).parent().parent().remove();

        // Show message that movie was deleted
        banner("movie removed");
        enableButton();

        e.preventDefault();
    });

    // Event listener for view button in the list
    $(document.body).on("click", ".btn-view", function(e){

        // Get title
        var title = $(this).parent().prev().attr('title');

        // Loop through array and find movie object
        // Get movie details from movie object then diplay in the modal (UI)
        for(var i = 0; i < movies.length; i++) {
            if (movies[i].title === title) {
                $("#modal-title").text(movies[i].title);
                $("#modal-year").text(movies[i].year);
                $("#modal-runtime").text(movies[i].runtime);
                $("#modal-genre").text(movies[i].genre);
                $("#modal-img").css("background-image",  movies[i].poster);
               

                $("#modal").css("display", "flex");
            }
           }

        e.preventDefault();
    });

    // Event listener for close button in the modal
    $(document.body).on("click", "#close-modal", function(e){
        // Closes the modal
        $("#modal").css("display", "none");
       
        

        e.preventDefault();
    });

    // UTILITY FUNCTIONS

    // Check if it's valid to add movie to array and list in the UI
    function isValid(movieTitle) {

        // Checks if array is full
        if (movies.length >= 5) {
            return false
        }

        if (movies.length > 0) {
           for(var i = 0; i < movies.length; i++) {
            // Checks if movie is already in the array
            if (movies[i].title === movieTitle) {
                return false;
            }
           }
        }

        return true;
    }

    // Display banner with message
    function banner(message) {
        $(".insert-banner").append("<p class='message'>" + message + "</p>").hide().fadeIn(300);

        // Removes banner after 1.5sec
        setTimeout(function () {
            $(".message").fadeOut(300);
        }, 1500);
    }

    // Disables button
    function disableButton() {
        $(".add-movie").addClass("disabled");
    }

    // Enables button
    function enableButton() {
        var enable = true;
        var movie_title = $("#movie-title").text();
        for(var i = 0; i < movies.length; i++) {
            // Checks if movie is in array already or if array is full
            if (movies[i].title == movie_title || movies.length == 5) {
                enable = false;
            }
           }

        // If valid, enables button
        if (enable) {
            $(".add-movie").removeClass("disabled");
        }
        else {
            disableButton();
        }
    }

    // Display error message as text
    function error(errorMessage) {
        $("#movie").append("<h1 class='error'>" + errorMessage + "</h1>").hide().fadeIn(300);
        setTimeout(function () {
            $(".error").fadeOut(300);
        }, 1500);
    }
        
   
}); // end ready