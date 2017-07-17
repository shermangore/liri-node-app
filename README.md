# liri-node-app
LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

# Instructions
### You can perform any of the following searches
1) Get the last ten (10) tweets from my Twitter account
2) Do a spotify search for a specific song or a song of our choice
3) Search OMDB for a specific movie or a movie of our choice
4) Or, you can let us decide what to search

### For Twitter Search:
    * Enter the following command: ```node liri.js my-tweets```

### For Spotify Search:
    1) To specify a song, enter the following command: ```node liri.js spotify-this-song "[song name]"```
        a) Example Search: ```node liri.js spotify-this-song "Back in Black"```
    2) To search a song of our choosing, enter the following command: ```node liri.js spotify-this-song```

### For OMDB Search:
    1) To specify a movie, enter the following command: ```node liri.js movie-this "[movie name]"```
        a) Example Search: ```node liri.js movie-this "Ferris Bueller's Day Off"```
    2) To search a movie of our choosing, enter the following command: ```node liri.js movie-this```
    
### To Run a Search of Our Choosing:
    * Enter the following command: ```node liri.js do-what-it-says```