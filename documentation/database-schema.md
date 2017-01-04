# Database Schema


#### Using JavaScript syntax highlighting so I leave weird things in the object without a syntax error in my editor
#### Also the highlighting is better

## What Is The Goal/Purpose of this database?
In addition to necessary data related to the Q&A aggregation this database will contain many unique convenience-related data for the user. Bubble should feel like a complete social network experience that leverages the Twitch API.

# Schema requirements
## Q&A
- `appConfig` node to contain configuration data for the application server
- `questions` node to contain questions

## Users
- `users` node to contain user data for users that have made actions that will write data to the database (bookmarking, etc)
- `users.<username>.bookmarks` node to contain the ID's of bookmarked users or questions
- `users.<sername>.userConfig` node to contain user specific options

```js
"bubble": {
  "appConfig": Object,
  "users": {
    <username>: {
      "questionsAsked": Number,
      "questionsAnswered": Number,
      "bookmarks": {
        "users": {
          <username>: {
            "username": <username>,
            "date": [date Object],
            "version": [version Object]
          }
        },
        "questions": {
          <questionID>: {
            "ID": <questionID>,
            "date": [date Object],
            "version": [version Object]
          }
        }
      }
      "userCOnfig": {
        "layoutOptions": {
          "colors": {
            "midGrey": String // hex code,
            "offWhite": String // hex code,
            "offBlack": String // hex code,
            "purple": String // hex code,
            "primary": String // hex code,
            "dim": String // hex code,
            "dimmer": String // hex code,
            "light": String // hex code,
            "allColors": String // hex code
          },
          "layout": String,
        }
        "profileOptions": {
          "streamFilter": "online"
        }
        "playerOptions": Object
      }
    }
  },
  "questions": {
    <questionID>: {
      "creator": <username>: String, //
      "receiver": <username>: String,
      "title": String or Number // If number it'll be 0. Firebase does not accept null as a value,
      "body": String, // minimum 30 characters
      "date": [date Object],
      "sentStatuses": [sent Object],
      "version": [version Object],
      "rating": {
        <username>: {
          "username": <username>,
          "upVote": Boolean
        }
      }
    }
  },
  "comments": {
    <commentID>: {
      "username": <username>,
      "questionID": <questionID>,
      "body": String,
      "reply": 0 || <commentID?,
      "rating": {
        <username>: {
          "username": <username>,
          "upVote": Boolean
        }
      },
      "date": [date Object],
      "sentStatuses": [sent Object],
      "version": [version Object]
    }
  },
  "polls": {
    <commentID>: {
      "username": <username>,
      "questionID": <questionID>,
      "body": String,
      "reply": 0 || <commentID?,
      "rating": {
        <username>: {
          "username": <username>,
          "upVote": Boolean
        }
      },
      "date": [date Object],
      "sentStatuses": [sent Object],
      "version": [version Object]
    }
  }
}
```

### Reusable data objects
#### `date` Object

```js
{
  "UTCTime": Number
}
```

#### `version` Object

```js
{
  "major": Number,
  "minor": Number,
  "patch": Number
}
```

#### `sentStatuses` Object

```js
{
  "email": Boolean,
  "notification": Boolean
}
```
