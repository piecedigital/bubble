# Routes

<Route path="/search/:searchtype" page="search" component={SearchPage}>
</Route>

/ - Home page

/about - info about the app

/tos,
/terms,
/terms-of-service - terms of service for the app

/profile - the profile of the currently authorized/logged in user

/profile/:username - the profile of a specified username. Does not require authorization with Twitch

/profile/:username/:q/:postID - a post of some type. `postID` is the ID of the post. `q` stands for "query" in this instance, and could be equal to 3 things at this time:
    - "q" - the post is a question to be viewed
    - "a" - the post is a question to be answered
    - "p" - the post is a question to be viewed. A button will allow the user to vote on the poll if it's an option

/:page - subject to change. Can either be "streams" or "games". These will generate results for the current top stream and games.

/search/:searchType - the search results page showing the results of the search query given by the user. Currently the only thing searchable is streams but other searches will become available in the future.

/streams - a listing of all live streams, starting at the top

/games - a listing of all games, starting at the most viewed

/get-test-data - this is just a test

/get-firebase-config - returns firebase configuration data to the end user

/get-auth-token - returns an authentication token to the user. Because users don't login via firebase we need to make sure they're logging in to the app with the correct credentials. Can't let everyone connect from their own server

/get-version - get the current version of the app (config variable)

/get-panels/:username - gets stream panel data (not a kraken api)

/get-host/:userID - gets hosting info of a channel (not a kraken api)
