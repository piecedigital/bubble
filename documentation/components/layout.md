# layout.jsx

This is the root component for the entire app. It handles the navigation, pages that come into view, the player, etc.
Universal data exists here, such as version data. Immediate child components that require shared data or data obtained by another child or grand child will also exist here.

## Modules imported
- react
- react-router
- firebase
- dist/modules/client/ajax
- dist/views/jsx/components/player.jsx
- dist/views/jsx/components/overlay.jsx
- dist/views/jsx/components/nav.jsx
- dist/modules/client/load-data


## Methods
### "getInitialState"
### "getHashData"
  When the page loads it might be from the user authenticating with Twitch. This captures the data from the URL fragment to get the access token.
### "initFirebase"
  After getting Firebase configuration during `componentDidMount`, Initialize the app, then set in the state predefined Firebase reference nodes.
### "appendStream"
  Adds a stream to the player. It acknowledges 2 arguments: `username` and `displayName`. They are both the same but `username` is all lowercase, always. When appended the username is used as the key.
### "appendVOD"
  Similar to `appendStream` but it also acknowledges a 3rd argument: `id`. This is the ID of a VOD. When appended the ID is used as the key.
### "search"
  Simple URL push to a search query for the `search` view. It URI encodes the user's input.
### "spliceStream"
  The opposite of `appendStream` and `appendVOD`. It acknowledges 2 arguments: `username` and `id`. `id` is the ID of a VOD, which will be used to remove a VOD from the player, if present. If `id` is not present then `username` is used to remove.
### "clearPlayer"
  Clears the entire player of streams and VODs.
### "logout"
  Logs the user out.
### "togglePlayer"
  Change the shape of the player. Expand it or collapse it. When expanded it gives full view to the videos. When collapse everything is vertical, stacked, and squished to the side. The page layout also adjust, making enough space on the left side so that he player doesn't overlap the page.
### "panelsHandler"
  Because individual stream are nested within the player, this function exist to pass data to the player as a whole. Specifically, this passes data regarding streamer panels. Depending on the type of call it will either get panal data or close the panel entirely.
### "setLayout"
  Similar to the above, this tells the player what layout it needs to reorient itself in.
### "alertAuthNeeded"
  A simple alert that will tell the user that they need to authorize their Twitch account with the web app in order to access a feature.
### "popUpHandler"
  This handles most things related to the overlay UI, such as opening the view for viewing notifications, questions, polls, etc. Not all overlay UIs are URL based.
### "checkURL"
  Because `popUpHandler` is a method that's triggered manually, most of the, some views will not have the correct React Router state info when the user navigates via traditional means (I.E., the normal navigation buttons). This method handles those changes so that the experience is rather smooth and familiar.
### "componentDidMount"
  Does two things:
    1. Gets Firebase configuration
    2. Get the app version

  The web app version is nicely displayed at the bottom of the page.
### "componentWillUpdate"
  This does one thing at the moment, which is trigger `checkURL`
### "render"
  Must I explain this to you, fam? 🙄
