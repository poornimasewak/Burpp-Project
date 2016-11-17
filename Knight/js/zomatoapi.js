 var a = 'chicago';
 var queryURL = "https://crossorigin.me/https://api.edamam.com/search?q=chicken&app_id=e5ee4c7d&app_key=c8fc66f63a363261369faadc4fdd29ae&from=0&to=3&calories=gte%20591,%20lte%20722&health=alcohol-free";
;
            //ajax call with done function
	        $.ajax({
	            url: queryURL,
	            method: 'GET'
	        })
	        .done(function(response) {

	            console.log(response);
	            var results = response.data;
	        });