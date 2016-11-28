$(document).ready(function() {
    // An 2 dimentional array of the firebase recipes for user if they are 
    // logged in. 
    // firebase[i][0] = recipe name
    // firebase[i][0] = recipe link
    var firebaseRecipes = [];

    //Creating variables for login
    var user = "";
    var email = "";
    var userLoggedIn = false;

    // Initialize Firebase
    // var config = {
    //     apiKey: "AIzaSyDGGznJOne1Hcc7r4s8q8DFqOsrOX78OiI",
    //     authDomain: "burpp-project-d026b.firebaseapp.com",
    //     databaseURL: "https://burpp-project-d026b.firebaseio.com",
    //     storageBucket: "burpp-project-d026b.appspot.com",
    //     messagingSenderId: "502802226183"
    // };
    // firebase.initializeApp(config);

    // Mikes database for development
    var config = {
        apiKey: "AIzaSyDBkWZlIkEEPy051GZpeWiividhJDMSNrw",
        authDomain: "child-9eadc.firebaseapp.com",
        databaseURL: "https://child-9eadc.firebaseio.com",
        storageBucket: "child-9eadc.appspot.com",
        messagingSenderId: "264082459609"
    };
    firebase.initializeApp(config);

    var dataRef = null;

    // displaying login modal
    $('#myModal').modal('show');

    // Food and Location Button Click
    $("#btn-food").on("click", function() {
        // Grabbed values from text boxes
        var fname = $("#food-search").val().trim();
        var loc = $("#location").val().trim();

        // UNCOMMENT THE 5 LINES BELOW TO QUERY YELP AND EDAMAM
        if (fname === '' || loc === '') {
            alert("Food and Location are both required");
        }
        yelpQuery(fname, loc, "10");
        edamamQuery(fname);

        // FOR DEVELOPMENT - Use JSON file instead of internet query
        // If you cannot connect to the edamam and yelp api, uncomment these
        // below
        //fakeYelpQuery(fname, loc, "10");
        //fakeEdamamQuery(fname);
        return false;
    });

    // Save Recipe Button Click
    $(document).on("click", ".btn-save-recipe", function() {
        // if the user is logged in we need to save the recipe in firebase
        // Grabbed values from text boxes
        var t = $(this);
        var url = $(this).data("recipe-link");
        var recipeName = $(this).data("recipe-name");

        if (recipeIsInFirebase(recipeName) === false) {
            addRecipe(recipeName, url)
                // Update the firebaseRecipes array from the database
            getFirebaseRecipes();
        } else {
            alert("Recipe has been previously saved in database.");
        }
        return false;
    });

    // Capture Log In Button Click
    $("#login-btn").on("click", function() {
        // open Database
        dataRef = firebase.database();
        user = $("#name-i").val().trim();
        email = $("#email-i").val().trim();
        firebase.auth().signInWithEmailAndPassword(email, user)
            .catch(function(error) {
                alert(error.message + "\nFirebase error.code: " + error.code);
                console.log(error);
            });
        console.log('$("#login-btn").on("click", function() ');
        // Don't refresh the page!
        return false;
    });

    // Capture Log Out Button Click
    $("#logout-btn").on("click", function() {
        firebase.auth().signOut();
        dataRef.goOffline();
        dataRef = null;
        user = "";
        email = "";
        // userLoggedIn = false; set in auth().onAuthStateChanged
        console.log('$("#logout-btn").on("click", function() ');
        // Don't refresh the page!
        return false;
    });

    // Capture New User Button Click
    $("#new-user-btn").on("click", function() {
        // open Database
        dataRef = firebase.database();
        user = $("#name-i").val().trim();
        email = $("#email-i").val().trim();
        firebase.auth().createUserWithEmailAndPassword(email, user)
            .catch(function(error) {
                alert(error.message + "\nFirebase error.code: " + error.code);
                console.log(error);
            });
        console.log('$("#new-user-btn").on("click", function() ');
        // Don't refresh the page!
        return false;
    });

    // Capture Login,logout, and new user Events
    firebase.auth().onAuthStateChanged(function(user_obj) {
        if (user_obj) {
            console.log(user_obj);
            // Log In
            if (dataRef) {
                $("#myModal").modal('hide');
                userLoggedIn = true;
                getFirebaseRecipes();
                $("#btn-show-recipes").show();
            }
        } else {
            userLoggedIn = false;
            $("#btn-show-recipes").hide();
        }
        console.log('firebase.auth().onAuthStateChanged(function(user_obj) ');
        // Don't refresh the page!
        return false;
    });

    // Capture Show Saved Recipes Button Click
    $("#btn-show-recipes").on("click", function() {
        $(".div-saved-recipes").empty();
        // Make panel heading
        var divSavedRecipeHeading = $('<div class="panel-heading">');
        divSavedRecipeHeading.html('<h3 class="panel-title">Saved Recipes</h3>');
        $(".div-saved-recipes").append(divSavedRecipeHeading);

        // Add panel contents
        var divSavedRecipeBody = $('<div class="panel-body div-saved-recipe-panel-body">');

        for (var i = 0; i < firebaseRecipes.length; i++) {
            var link = $('<a>');
            link.text(firebaseRecipes[i][0]);
            link.attr("href", firebaseRecipes[i][1]);
            // open recipe link in new tab
            link.attr("target", "_blank");
            divSavedRecipeBody.append(link);
            divSavedRecipeBody.append('<hr>');
        }
        $(".div-saved-recipes").append(divSavedRecipeBody);

        console.log('$("#btn-show-recipes").on("click", function() ');
        // Don't refresh the page!
        return false;
    });

    // If the recipe name is already in the firebase database, return true
    // If it is not, return false 
    function recipeIsInFirebase(recipeName) {
        for (var i = 0; i < firebaseRecipes.length; i++) {
            if (recipeName === firebaseRecipes[i][0]) {
                return true;
            }
        }
        return false;
    }

    // Clear the firebaseRecipes array and go to firebase and fill the
    // firebaseRecipes with the recipes stored in firebase
    function getFirebaseRecipes() {
        firebaseRecipes = [];
        dataRef.ref().on("value", function(snapshot) {
            console.log('value', snapshot.val());

            var query = firebase.database().ref("user/" + user).orderByKey();
            // For each recipe
            query.once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    // var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    firebaseRecipes.push([childData.recipe, childData.url]);
                });
            });
        }, function(errorObject) {
            console.log("The firebase read failed: " + errorObject.code);
        });
        console.log('("#get-data").on("click", function() ');
        // Don't refresh the page!
        return false;
    }

    function addRecipe(recipe, url) {
        // Code for the push
        var path = "user/" + user;
        dataRef.ref().child(path).push({
            recipe: recipe,
            url: url,
        });
        console.log('("#add-data").on("click", function() ');

        // Don't refresh the page!
        return false;
    }

    function edamamQuery(fname) {
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
                makeRecipeDivHeading();
                for (var i = 0; i < response.hits.length; i++) {
                    makeRecipeDiv(response, i);
                }
            });
    }

    function makeRecipeDivHeading() {
        var divRecipeHeading = $('<div class="panel-heading">');
        divRecipeHeading.html('<h3 class="panel-title">Edamam Recipes</h3>');
        $(".div-recipe-area").append(divRecipeHeading);
    }

    function makeRecipeDiv(response, i) {

        var divIndividualRecipe = $('<div class="panel panel-default div-recipe">');
        // divIndividualRecipe is a panel that contains a panel-heading and a panel-body
        var divHeading = $('<div class="panel-heading">');
        var divRecipeBody = $('<div class="panel-body div-recipe-panel-body">');
        // divRecipeBody contains an aside left and an aside right
        var asideLeft = $('<aside class="aside-left-image">');
        var asideRight = $('<aside class="aside-right-recipe-content">');

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
            //recipes.push(recipe.url);
        }

        var originalURL = $("<a>").attr("href", recipe.url).attr("target", "_blank").text("Open Full recipe in new window.");

        //btnId = 'id-save-recipe' + i.toString();
        //btnSaveRecipe = $('<button class="btn btn-default btn-save-recipe" id="' + btnId + '" type="submit">Save Recipe</button>');
        var btnSaveRecipe = $('<button class="btn btn-default btn-save-recipe" type="submit">Save Recipe</button>');
        btnSaveRecipe.attr("data-recipe-link", recipe.url);
        btnSaveRecipe.attr("data-recipe-name", recipe.label);

        asideRight.append(ingredientList);
        asideRight.append(originalURL);
        asideRight.append('<br><br>');
        asideRight.append(btnSaveRecipe);

        divRecipeBody.append(asideLeft);
        divRecipeBody.append(asideRight);

        divIndividualRecipe.append(divHeading).append(divRecipeBody);

        $(".div-recipe-area").append(divIndividualRecipe);
    }

    function yelpQuery(food, loc, num) {

        function cb(data) {
            makeYelpDiv(data);
        }
        // the callback function cb needs to be global, the following line does this
        window.cb = cb;

        var auth = {
            consumerKey: "3EYbFFuD4X44tV01t3Nbiw",
            consumerSecret: "a71F0PmRXr0O1vpRHiIyxaxepYI",
            accessToken: "z-WvclgEHnhaYrCTFVaTPUi5hbw36zxS",
            accessTokenSecret: "8uwuZ5AE3aQpwU3K_PYLXHEOeq4",
            serviceProvider: {
                signatureMethod: "HMAC-SHA1"
            }
        };

        var terms = food;
        var near = loc;
        var accessor = {
            consumerSecret: auth.consumerSecret,
            tokenSecret: auth.accessTokenSecret
        };

        var parameters = [];
        parameters.push(['term', terms]);
        parameters.push(['location', near]);
        parameters.push(['limit', num]);
        parameters.push(['callback', 'cb']);
        parameters.push(['oauth_consumer_key', auth.consumerKey]);
        parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters.push(['oauth_token', auth.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        var message = {
            'action': 'http://api.yelp.com/v2/search',
            'method': 'GET',
            'parameters': parameters,
            'dataType': 'jsonp'
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);

        $.ajax({
                'url': message.action,
                'data': parameterMap,
                'dataType': 'jsonp',
                'jsonpCallback': 'cb',
                'cache': true
            })
            .done(function(data, textStatus, jqXHR) {
                console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
            });
    }

    function makeYelpDivHeading() {
        var divYelpHeading = $('<div class="panel-heading">');
        divYelpHeading.html('<h3 class="panel-title">Yelp Restaurants</h3>');
        $(".div-yelp").append(divYelpHeading);
    }

    // Create div representing all of the businesses from the Yelp response
    // We take the javascript JSON object and 'i', the index number of the business in 
    // the (javascript JSON object).businesses[i]. See the html below this function 
    // to see the structure of the div that will be created
    function makeYelpDiv(jsJsonObj) {
        var str = JSON.stringify(jsJsonObj);
        $('.div-yelp').empty();
        makeYelpDivHeading();
        // For each business returned from the Yelp query
        for (var i = 0; i < jsJsonObj.businesses.length; i++) {
            // Get the individual business data
            var business = jsJsonObj.businesses[i];
            // Create a panel id for each restaurant panel
            var panelId = "collapse" + i.toString();

            // The primary div with a heading and collapsible panel
            var divYelpBusiness = $('<div class="panel panel-default div-yelp-business">');

            // 1.) create div-yelp-heading
            var divYelpHeading = $('<div class="panel-heading div-yelp-heading">');
            var h4 = $('<h4 class="panel-title">');
            var aStr = '<a data-toggle="collapse" href="#' + panelId + '">';
            var a = $(aStr);
            a.text(business.name);
            var rating = $('<img >');
            rating.attr("src", business.rating_img_url);
            var img_restaurant = $('<img >');
            img_restaurant.attr("src", business.image_url);

            h4.append(a);
            divYelpHeading.append(h4);
            divYelpHeading.append(rating);
            divYelpHeading.append('<br>');

            divYelpHeading.append(img_restaurant);
            divYelpBusiness.append(divYelpHeading);
            // 1.) div-yelp-heading complete and appended to div-yelp-business

            // 2.) create div collapse
            var divStr = '<div id="' + panelId + '" class="panel-collapse collapse">';
            var divCollapse = $(divStr);
            var divYelpBody = $('<div class="panel-body div-yelp-body">');
            // BEGIN DISPLAYED RESTAURANT DATA
            //divYelpBody.append(business.name);
            var phone = formatPhone(business.phone);

            divYelpBody.append(phone).append('<br>');
            if (business.neighborhoods !== undefined) {
                for (var j = 0; j < business.location.neighborhoods.length; j++) {
                    divYelpBody.append(business.location.neighborhoods[j]).append('<br>');
                }
            }
            for (var k = 0; k < business.location.display_address.length; k++) {
                divYelpBody.append(business.location.display_address[k]).append('<br>');
            }
            var strURL = $('<a>').attr("href", business.url).append("Yelp Link");
            divYelpBody.append(strURL);
            // END DISPLAYED RESTAURANT DATA

            divCollapse.append(divYelpBody);
            divYelpBusiness.append(divCollapse);
            // 2.) div collapse complete and appended to div-yelp-business

            $(".div-yelp").append(divYelpBusiness);
        }
    }

    /**
     *  Format phone numbers
     */
    function formatPhone(phonenum) {
        var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (regexObj.test(phonenum)) {
            var parts = phonenum.match(regexObj);
            var phone = "";
            if (parts[1]) {
                phone += "+1 (" + parts[1] + ") ";
            }
            phone += parts[2] + "-" + parts[3];
            return phone;
        } else {
            //invalid phone number
            return phonenum;
        }
    }
    // Dut to the recipe site edamam being down most of Thanksgiving day, 
    // I saved an edamam query and a yelp query as JSON strings and read
    // them to allow me to continue to develop without depending on these
    // sites responding. So I added 'fake' functions to simulate the 
    // responses
    function fakeEdamamQuery(fname) {
        var response = "";
        try {
            response = JSON.parse(edamam_str);
        } catch (err) {
            console.log(err.message);
            return;
        }

        $('.div-recipe-area').empty();
        makeRecipeDivHeading();
        for (var i = 0; i < response.hits.length; i++) {
            makeRecipeDiv(response, i);
        }
    }

    function fakeYelpQuery(food, loc, num) {
        var response = "";
        try {
            response = JSON.parse(yelp_str);
        } catch (err) {
            console.log(err.message);
            return;
        }
        makeYelpDiv(response);
    }
});
