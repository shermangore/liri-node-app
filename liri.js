// All my requirements
let keys = require('./keys.js');
let fs = require("fs");
let twit = require("twit");
let request = require("request");
let Spotify = require("node-spotify-api");

// Variables to hold all my llaves
let c_key = keys.twitterKeys.consumer_key;
let c_secret = keys.twitterKeys.consumer_secret;
let t_key = keys.twitterKeys.access_token_key;
let t_secret = keys.twitterKeys.access_token_secret;
let spot_key = keys.spotifyKeys.client_id;
let spot_secret = keys.spotifyKeys.client_secret;

// Variables to hold the CLI parameters
let cmd = process.argv[2];
let option1 = process.argv[3];

bonusMe(option1 != null ? option1 + " - " + cmd : cmd);

// Look at the initial CLI parameter and execute code based on that parameter
switch (cmd) {
    case "my-tweets":
        // This will show your last 20 tweets and when they were created at in your terminal/bash window.
        getTweets();

        break;
    case "spotify-this-song":
        // This will show the following information about the song in your terminal/bash window
        //  - Artist(s)
        //  - The song's name
        //  - A preview link of the song from Spotify
        //  - The album that the song is from
        // If no song is provided then your program will default to "The Sign" by Ace of Base.
        // You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.
        if (option1) {
            getSongInfo(option1);

        } else {
            getSongInfo();
        }
        break;
    case "movie-this":
        // This will output the following information to your terminal/bash window:
        //  - Title of the movie.
        //  - Year the movie came out.
        //  - IMDB Rating of the movie.
        //  - Rotten Tomatoes Rating of the movie.
        //  - Country where the movie was produced.
        //  - Language of the movie.
        //  - Plot of the movie.
        //  - Actors in the movie.
        // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        // You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `40e9cece`.
        getMovieInfo(option1);

        break;
    case "do-what-it-says":
        // Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
        // It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
        // Feel free to change the text in that document to test out the feature for other commands.

        fs.readFile("random.txt", "utf8", function(error, data) {
            // Check for errors
            if (error) {
                console.log(error);
            }
            
            // Get the file contents and split it
            let arrStr = data.split(",");

            // create variables to store the individual components of the instructions
            let command = arrStr[0] ? arrStr[0].trim() : "";
            let param = arrStr[1] ? arrStr[1].trim() : "";

            // Check the command portion of the instructions and execute the appropriate code
            switch(command) {
                case "my-tweets":
                    getTweets();

                    break;
                case "spotify-this-song":
                    getSongInfo(param);

                    break;
                case "movie-this":
                    getMovieInfo(param);

                    break;
            }
        });

        break;
    default:
        console.log("Your instructions could not be understood.  Please check random.txt and try again.")
        break;
}

// Function to get the last 20 tweets
function getTweets() {
    let params = {
        user_id: 2535798182,
        lang: 'en',
        include_rts: false,
        exclude_replies: true,
        count: 20
    }
    
    // Instantiate a new twitter object and set the keys
    let twitter = new twit(keys.twitterKeys);

    // Get tweets
    twitter.get(
        'statuses/user_timeline', 
        params, 
        function(err, data) {
            if (!err) {
                for (let i = 0; i < data.length; i++) {
                    // Write it out, write it out
                    console.log(`Created: ${data[i].created_at} | ${data[i].text}`);
                }
            }
        }
    );
}

// Function to get spotify data
function getSongInfo(songName) {
    // Instantiate new Spotify object and set keys
    let spot = new Spotify({
        id: spot_key,
        secret: spot_secret
    });

    // Search for song
    if (songName) {
        spot.search({
            type: 'track',
            query: songName,
			limit: 1
        }, function(err, data) {
            if (err) {
                //  Oh no, doge caught an error
                return console.log(`Oops, much bad, so error - ${err}`);
            }
            // Write out the info, yo
            console.log(`Artist: ${data.tracks.items[0].album.artists[0].name}`);
            console.log(`Song Name: ${data.tracks.items[0].album.name}`);
            console.log(`Preview: ${data.tracks.items[0].external_urls.spotify}`); // Fix this to display info
            console.log(`Album: ${data.tracks.items[0].album.name}`); // Fix this also
        });
    } else {
        spot.search({
            type: 'track',
            query: 'The Sign',
            limit: 10
        }, function(err, data) {
            if (err) {
                //  Oh no, doge caught an error
                return console.log(`Oops, much bad, so error - ${err}`);
            }
            for(let i = 0; i < data.tracks.items.length; i++) {
                if (data.tracks.items[i].album.artists[0].name == 'Ace of Base') {
                    // Write out the info, yo
                    console.log(`Artist: ${data.tracks.items[i].album.artists[0].name}`);
                    console.log(`Song Name: ${data.tracks.items[i].name}`);
                    console.log(`Preview: ${data.tracks.items[i].external_urls.spotify}`);
                    console.log(`Album: ${data.tracks.items[i].name}`);
                }
            }
        });
    }
}

// Function to get OMDB info via RequestJS
function getMovieInfo(movieName) {
    // Variable to store the dynamically created URL
    let queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&r=json&apikey=40e9cece`;

    // Use RequestJS to get the web page
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // Write out 1st two pieces of info
            console.log("Movie Title " + JSON.parse(body).Title);
            console.log("Movie Released in " + JSON.parse(body).Year);

            // Loop through the Ratings node to get the IMDB and Rotten Tomato ratings
            for (let i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
                    console.log("IMDB Rating ", JSON.parse(body).Ratings[i].Value);
                } else if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes Rating ", JSON.parse(body).Ratings[i].Value);
                }
            }

            // Put the rest on (digital) paper!
            console.log("Country Produced ", JSON.parse(body).Country);
            console.log("Language ", JSON.parse(body).Language);
            console.log("Plot ", JSON.parse(body).Plot);
            console.log("Actors ", JSON.parse(body).Actors);
        }
    });
}

/*
### BONUS
 * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
 
 * Make sure you append each command you run to the `log.txt` file. 
 
 * Do not overwrite your file each time you run a command.
*/
function bonusMe(blah) {
    fs.appendFile('log.txt', blah + "\r\n", (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}
