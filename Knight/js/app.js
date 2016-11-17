 var a = 'chicago';
 var queryURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAZ-hvbSlP3mny8PzPV_FHMlvZX6OIEDwM&callback=initMap";
  // var queryURL = "https://developers.zomato.com/api/v2.1/cities=chicago&user-key=2fb021c464c36ea4538d72f0ab37aee4&limit=10";
            //ajax call with done function
	        $.ajax({
	            url: queryURL,
	            method: 'GET'
	        }).done(function(response) {

	            console.log(response);
	        });