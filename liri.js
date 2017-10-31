var importKeys = require("./keys.js");

var Twitter = require("twitter");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

liriStart();








// liriStart() - starting prompt for liri
function liriStart() {
	inquirer.prompt([
		{
			type: "input",
			message: "What can I do for you?",
			name: "userInput"
		}
	]).then(function(inquirerResponse) {

		// this line will take the input words into an array
		var checkString = inquirerResponse.userInput.split(" ");

		if (checkString[0] === "my-tweets") {
			lastTweets();
		}

		else if (checkString[0] === "do-what-it-says") {
			doIt();
		}
		
		//checks for spotify-this-song and input song. If no song is input, will default to "The Sign"
		else if (checkString[0] === "spotify-this-song") {
			//this checks if user input a song
			if(checkString.length > 1) {
				//if user put in a song, this will splice out the initial command and then will put additional words in an array
				var sendString = checkString.splice(1);
				//this will then concat those additional words back together
				var inputSong = concat(sendString);
				spotifySearch(inputSong);
			}
			//if no input song was put in, will default to "The Sign"
			else {
				spotifySearch("The Sign")
			}
		}

		//checks for movie-this and input movie. If no movie is input, will default to "Mr. Nobody"
		else if (checkString[0] === "movie-this") {
			if(checkString.length > 1) {
				//if user put in a movie, this will splice out the initial command and then will put additional words in an array
				var sendString = checkString.splice(1);
				//this will then concat those additional words back together
				var inputMovie = concatPlus(sendString);
				movieLookup(inputMovie);
			}
			//if no input movie was put in, will default to "Mr. Nobody"
			else {
				movieLookup("mr+nobody");
			}
		}

		
		else if (checkString[0] === "goodbye") {
			liriEnd();
		}
		
		else {
			console.log("");
			console.log("I'm sorry, here are your options:")
			console.log("");
			console.log("my-tweets");
			console.log("spotify-this-song <insert song name>");
			console.log("movie-this <insert movie name>");
			console.log("do-what-it-says");
			console.log("goodbye");
			console.log("");
			liriStart();
		}
	});
}
// liriStart() ==============================================


// doIt() - this function will read the random.txt and do whatever is written in it
function doIt() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			console.log(err);
			return;
		}

		//splits input data into command and if there's a parameter
		data = data.split(",");
		

		// if a parameter was given, this will remove the quotes around it
		if(data.length > 1) {
			data[1] = data[1].substring(1, data[1].length-1);
		}



		// =================================================
		// this section of code was copied from the liriStart() function

		if (data[0] === "my-tweets") {
			lastTweets();
		}

		else if (data[0] === "do-what-it-says") {
			doIt();
		}
		
		//checks for spotify-this-song and input song. If no song is input, will default to "The Sign"
		else if (data[0] === "spotify-this-song") {
			//this checks if user input a song
			if(data.length > 1) {
				//if user put in a song, this will splice out the initial command and then will put additional words in an array
				var sendString = data[1];
				spotifySearch(sendString);
			}
			//if no input song was put in, will default to "The Sign"
			else {
				spotifySearch("The Sign")
			}
		}

		//checks for movie-this and input movie. If no movie is input, will default to "Mr. Nobody"
		else if (data[0] === "movie-this") {
			if(data.length > 1) {
				//if user put in a movie, this will splice out the initial command and then will put additional words in an array
				var sendString = data[1];
				//console.log("sendString movie: " + sendString);
				//this will then concat those additional words back together
				var inputMovie = sendString.split(' ').join('+');
				//console.log("inputMovie: " + inputMovie);
				movieLookup(inputMovie);
			}
			//if no input movie was put in, will default to "Mr. Nobody"
			else {
				movieLookup("mr+nobody");
			}
		}

		
		else if (data[0] === "goodbye") {
			liriEnd();
		}
		// this section of code was copied from the liriStart() function
		// ================================================

	});
}
// doIt() ==============================================



//liriEnd() - ends the program
function liriEnd() {
	console.log("Goodbye");
	process.exit();
}
//liriEnd() =================================================



// lastTweets() - prints the last 20 tweets
function lastTweets() {

var client = new Twitter({
		consumer_key: importKeys.twitterKeys.consumer_key,
		consumer_secret: importKeys.twitterKeys.consumer_secret,
		access_token_key: importKeys.twitterKeys.access_token_key,
		access_token_secret: importKeys.twitterKeys.access_token_secret
	});


var params = {screen_name: 'ChickenTrashcan'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  	if (!error) {
	  	for(var i = 0; i < 20; i ++) {
	  		console.log("");
	  		console.log(tweets[i].text);
	  	}
	  	console.log("");

	  	liriStart();
  	}
});



}
// lastTweets() ===============================================


// spotifySearch() - looks up song info on spotify
function spotifySearch(userInput) {
	var spotify = new Spotify({
	id: importKeys.spotifyKeys.id,
	secret: importKeys.spotifyKeys.secret
	});

	spotify.search({ type: 'track', query: userInput }, function(err, data) {
	  	if (err) {
	    return console.log('Error occurred: ' + err);
	  	}
	 
	 	for(var i = 0; i < data.tracks.items.length && i < 20; i++) {
	 		console.log("");
	 		console.log(data.tracks.items[i].artists[0].name);
	 		console.log(data.tracks.items[i].name);
	 		console.log(data.tracks.items[i].preview_url);
	 		console.log(data.tracks.items[i].album.name);
	 	}

	 	console.log("");
	 	liriStart();
		 
	});

}
// spotifySearch() ==========================================


//movieLookup()
function movieLookup(userInput) {
	var movieUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=full&apikey=" + importKeys.omdbapiKey;

	request(movieUrl, function (error, response, body) {
	if (!error) {
		var movieInfo = JSON.parse(body);

		// checks to see if the api found the input movie
		if(movieInfo.Response === "False") {
			console.log("Movie not found");
			console.log("");
		}

		else {
			console.log("Title: " + movieInfo.Title);
			console.log("Year: " + movieInfo.Year);
			
			if(movieInfo.Ratings.length > 1) {

			console.log("IMDB Rating: " + movieInfo.Ratings[0].Value);
			console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
			}



			console.log("Country: " + movieInfo.Country);
			console.log("Language: " + movieInfo.Language);
			console.log("Plot: " + movieInfo.Plot);
			console.log("Actors: " + movieInfo.Actors);
			console.log("");
		}
		liriStart();
	}
});
}
//movieLookup() =============================================


//concat(array) - takes an input array of strings and then concats them into one string
function concat (array) {
	//if only one word was given, then just returns that word
	if (array.length === 1) {
		return array[0];
	}

	var newString = array[0];

	//will create a new string that concats the different words in the array with " " in between them
	for(var i = 1; i < array.length; i++) {
		newString = newString.concat(" ");
		newString = newString.concat(array[i]);
	}

	return newString;
}
//concat(array) ===========================================

//concatPlus(array) - takes an input array of strings and then concats them into one string with "+" in between each word
function concatPlus (array) {
	//if only one word was given, then just returns that word
	if (array.length === 1) {
		return array[0];
	}

	var newString = array[0];

	//will create a new string that concats the different words in the array with " " in between them
	for(var i = 1; i < array.length; i++) {
		newString = newString.concat("+");
		newString = newString.concat(array[i]);
	}

	return newString;
}
//concatPlus(array) ===========================================