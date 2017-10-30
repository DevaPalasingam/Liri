var importKeys = require('./keys.js');

var Twitter = require('twitter');
var inquirer = require("inquirer");

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
		if (inquirerResponse.userInput === "my-tweets") {
			lastTweets();
		}
		else {
			console.log("I'm sorry, here are your options:")
			console.log("my-tweets");
			console.log("");
			liriStart();
		}
	});
}
// liriStart() ==============================================


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
  }
});
	
liriStart();

}
// lastTweets() ===============================================
