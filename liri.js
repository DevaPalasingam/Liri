var importKeys = require('./keys.js');

var Twitter = require("twitter");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");

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
		
		//checks for spotify-this-song and input song. If no song is input, will default to "The Sign"
		else if (checkString[0] === "spotify-this-song") {
			if(checkString.length > 1) {
				var sendString = checkString.splice(1);
				var inputSong = concat(sendString);
				spotifySearch(inputSong);
			}
			else {
				spotifySearch("The Sign")
			}
		}
		
		else if (checkString[0] === "goodbye") {
			liriEnd();
		}
		
		else {
			console.log("I'm sorry, here are your options:")
			console.log("my-tweets");
			console.log("spotify-this-song <insert song name>");
			console.log("goodbye");
			console.log("");
			liriStart();
		}
	});
}
// liriStart() ==============================================


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
	 
	 	for(var i = 0; i < 20; i++) {
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


//concat(array) - takes an input array of strings and then concats them into one string
function concat (array) {
	if (array.length === 1) {
		return array[0];
	}

	var newString = array[0];

	for(var i = 1; i < array.length; i++) {
		newString = newString.concat(" ");
		newString = newString.concat(array[i]);
	}

	return newString;
}
//concat(array) ===========================================