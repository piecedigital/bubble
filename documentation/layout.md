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
### "alertAuthNeeded"
### "setLayout"
### "popUpHandler"
### "checkURL"
### "componentDidMount"
### "componentDidUpdate"
### "componentWillUpdate"
### "componentWillReceiveProps"
### "render"
