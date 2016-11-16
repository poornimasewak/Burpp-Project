 var a = 'chicago';
 var queryURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAZ-hvbSlP3mny8PzPV_FHMlvZX6OIEDwM&callback=initMap";
  
            //ajax call with done function
	        $.ajax({
	            url: queryURL,
	            method: 'GET'
	        }).done(function(response) {

	            console.log(response);
	        });