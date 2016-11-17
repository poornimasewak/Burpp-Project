$(document).ready(function() {

    // Capture Button Click
    $("#btn-food").on("click", function() {
        // Grabbed value from text boxes
        fname = $("#food-search").val().trim();
        console.log("food: " + fname);

        // The following 4 variables are in the order they need to be 
        // concatenated in var queryURL
        var crossoriginURL = "https://crossorigin.me/";
        var edamamURL = "https://api.edamam.com/search?";
        var search = "q=" + fname;
        var keys = "&app_id=e5ee4c7d&app_key=c8fc66f63a363261369faadc4fdd29ae";

        var queryURL = crossoriginURL + edamamURL + search + keys;

        var config = { url: queryURL, method: 'GET' };
        console.log("url before query: " + queryURL);

        $.ajax({ url: queryURL, method: 'GET' })
            .done(function(response) {
                console.log(".done: " + response);

                for (var i = 0; i < response.hits.length; i++) {
                    console.log(response.hits[i].recipe.label);
                    console.log(response.hits[i].recipe.image);

                    var recipeDiv = $('<div class="recipe">');

                    var p = $('<h5>').text("Name: " + response.hits[i].recipe.label);

                    var recipeImage = $('<img>');
                    recipeImage.attr('src', response.hits[i].recipe.image);
                    recipeImage.attr('float', 'left');

                    recipeDiv.append(p);
                    recipeDiv.append(recipeImage);

                    $('.div-recipe-area').append(recipeDiv);
                }
            });

        // Don't refresh the page!
        return false;
    });

});

