# Load Data

Various functions for fetching data from the Twitch API. When `loadData` is called it returns an object with various functions for fetching Twitch data (or the app server). For each of these they require specific data to be passed to the `loadData` function:

- **getFirebaseConfig**
`none`

- **getUserID**
```js
{
  username: String <username>,
  usernameList: Array [<usernam>,...]
}
```

Choose one. If `username` is used one username will be fetched. If `usernameList` is list all of these names (up to 100) will be fetched.

- **featured**
`none`

- **topGames**
`none`

- **topStreams**
`none`

- **getUserByName**
- **getChannelByName**
- **getStreamByName**
- **getVideos**
```js
{
  username: String <username>
}
```

It can also use `userID` if the user ID is already had.


- **getCurrentUser**
`none`

- **getFollowStatus**
- **getSubscriptionStatus**
```js
{
  username: String <username>,
  target: String <username>
}
```

This is to find out if `username` is following/subscribed to `target`

- **getPanels**
- **getHostingByName**
- **followedStreams**
- **followingStreams**
```js
{
  username: String <username>
}
```

Gets stream panels for `username`

- **getVODData**
```js
{
  id: String <video ID>
}
```

- **followStream**
- **unfollowStream**
```js
{
  username: String <username>,
  target: String <username>
}
```

`username` follows `target`

- **searchChannels**
- **searchStreams**
- **searchGames**
```js
{
  q: String
}
```

Any search query.
