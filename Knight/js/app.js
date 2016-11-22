$(document).ready(function() {

// displaying login modal
$('#myModal').modal('show');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDGGznJOne1Hcc7r4s8q8DFqOsrOX78OiI",
    authDomain: "burpp-project-d026b.firebaseapp.com",
    databaseURL: "https://burpp-project-d026b.firebaseio.com",
    storageBucket: "burpp-project-d026b.appspot.com",
    messagingSenderId: "502802226183"
};
firebase.initializeApp(config);

var database = firebase.database();


//Creating variables for login
var nameInput = '';
var emailInput = '';

//Create login button
$('#login-btn').on('click', function() {

    nameInput = $('#namei').val().trim();
    emailInput = $('#emaili').val().trim();

    database.ref().push({
        nameInput: nameInput,
        emailInput: emailInput,

    });
    $("#myModal").modal('hide');
    return false;
});


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

    var config = {
        url: queryURL,
        method: 'GET'
    };
    console.log("url before query: " + queryURL);

    $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .done(function(response) {
            console.log(".done: " + response);

            $('.div-recipe-area').empty();

            for (var i = 0; i < response.hits.length; i++) {
                makeRecipeDiv(response, i);
            }
        });

    // Don't refresh the page!
    return false;
});

function makeRecipeDiv(response, i) {

var p = $('<h5>').text(response.hits[i].recipe.label);


    var divIndividualRecipe = $('<div class="panel panel-default div-recipe">');
    // divIndividualRecipe is a panel that contains a panel-heading and a panel-body
    var divHeading = $('<div class="panel-heading">');
    var divRecipeBody = $('<div class="panel-body div-recipe-panel-body">');
    // divRecipeBody contains an aside left and an aside right
    var asideLeft = $('<aside class="aside-left-image">');
    var asideRight = $('<aside class="aside-right-recipe-content">');

    // var p = $('<h5>').text(response.hits[i].recipe.label);


    var recipe = response.hits[i].recipe;

    var h = $('<h5>').text("Recipe: " + recipe.label);
    h.addClass("h5-title");
    divHeading.append(h);

    var recipeImage = $('<img>');
    recipeImage.addClass("img-food");
    recipeImage.attr('src', recipe.image);
    asideLeft.append(recipeImage);

    var hingr = $('<h5>').text("Ingredients: ");
    asideRight.append(hingr);

    var ingredientList = $('<ol>');


    for (var i = 0; i < recipe.ingredientLines.length; i++) {
        var li = $('<li>').text(recipe.ingredientLines[i]);
        ingredientList.append(li);
    }

    var originalURL = $("<a>").attr("href", recipe.url).attr("target", "_blank").text("Open Full recipe in new window.");

    asideRight.append(ingredientList);
    asideRight.append(originalURL);

    divRecipeBody.append(asideLeft);
    divRecipeBody.append(asideRight);

    divIndividualRecipe.append(divHeading).append(divRecipeBody);

    $(".div-recipe-area").append(divIndividualRecipe);
    //creating button to save recipes
    // var saveRecipeButton = $('<button>').text("Save Recipe");
    // asideRight.append(saveRecipeButton);

}
});









