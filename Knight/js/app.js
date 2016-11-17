 var a = 'chicago';
 var queryURL = "https://crossorigin.me/https://api.edamam.com/search?q=italian&app_id=e5ee4c7d&app_key=c8fc66f63a363261369faadc4fdd29ae&from=0&to=3&calories=gte%20591,%20lte%20722&health=alcohol-free";
 			//make a variable and get rid of search 'chicken'
            //ajax call with done function
	        $.ajax({
	            url: queryURL,
	            method: 'GET'
	        })
	        .done(function(response) {

	            console.log(response);
	            var results = response.data;
	        });

	   // "https://www.gstatic.com/firebasejs/3.6.1/firebase.js"
	   		//Need to add this to the HTML

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDGGznJOne1Hcc7r4s8q8DFqOsrOX78OiI",
    authDomain: "burpp-project-d026b.firebaseapp.com",
    databaseURL: "https://burpp-project-d026b.firebaseio.com",
    storageBucket: "burpp-project-d026b.appspot.com",
    messagingSenderId: "502802226183"
  };
  firebase.initializeApp(config);
