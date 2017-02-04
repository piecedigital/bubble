# Routes

<Route path="/search/:searchtype" page="search" component={SearchPage}>
</Route>

/ - Home page
/profile - the profile of the currently authorized/logged in user
/profile/:username - the profile of a specified username. Does not require authorization with Twitch
/profile/:username/:q/:postID - a post of some type. `postID` is the ID of the post. `q` stands for "query" in this instance, and could be equal to 3 things at this time:
    - "q" - the post is a question to be viewed
    - "a" - the post is a question to be answered
    - "p" - the post is a question to be viewed. A button will allow the user to vote on the poll if it's an option

/:page - subject to change. Can either be "streams" or "games". These will generate results for the current top stream and games.
/search/:searchType - the search results page showing the results of the search query given by the user. Currently the only thing searchable is streams but other searches will become available in the future.
