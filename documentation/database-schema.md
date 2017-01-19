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
  "authIDs": {
    <username>: <Twitch auth ID>
  },
  "users": {
    <username>: {
      "questionsAsked": Number,
      "questionsAnswered": Number,
      "questionsForMe": {
        <questionID>: true
      },
      "questionsForThem": {
        <questionID>: true
      },
      "answersFromMe": {
        <questionID>: true
      },
      "notifications": {
        <notificationID>: {
          "notifType": String ("askedNewQuestion" || "newCommentToQuestion" || "newCommentToAnswer" || "taggedInAnswer" || "taggedInComment"),
          "nodeDataID": String, // ID of question, answer, or comment, depending on the `notifType`
          "date": [date Number],
          "sent": [sentStatuses Object],
          "version": [version Object],
        }
      },
      "bookmarks": {
        "users": {
          <username>: {
            "username": <username>,
            "date": [date Number],
            "version": [version Object]
          }
        },
        "questions": {
          <questionID>: {
            "ID": <questionID>,
            "date": [date Number],
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
  "notifications": {
    <username>: {
      <notifID>: {
        "type": String ("newQuestion" || "newAnswer" || "newQuestionComment" || "questionUpvote" || "answerUpvote" || "commentUpvote"),
        "info": {
          "sender": <username>, // the person that caused the notification to be sent
          "questionID": <questionID>,
          "questionURL": String
        },
        "read": Boolean,
        "date": [date Object],
        "version": [version Object]
      }
    }
  },
  "questions": {
    <questionID>: {
      "myAuth": <auth token>,
      "creator": <username>: String, //
      "receiver": <username>: String,
      "title": String or Number // If number it'll be 0. Firebase does not accept null as a value,
      "body": String, // minimum 30 characters
      "AMA": String (<AMAID>) || null,
      "date": [date Number],
      "sentStatuses": [sentStatuses Object],
      "version": [version Object]
    }
  },
  "answers": {
    <questionID>: {
      "myAuth": <auth token>,
      "username": <username>,
      "questionID": <questionID>
      "body": String, // minimum 30 characters
      "date": [date Number],
      "sentStatuses": [sentStatuses Object],
      "version": [version Object]
    }
  },
  "ratings": {
    <questionID>: {
      <ratingID>: {
        "myAuth": <auth token>,
        "for": String ("question" || "answer" || "comment"),
        "commentID": <commentID>, // won't exist for non-comments
        "username": <username>,
        "upvote": Boolean
      }
    }
  },
  "comments": {
    <questionID>: {
      <commentID>: {
        "myAuth": <auth token>,
        "username": <username>,
        "questionID": <questionID>,
        "body": String,
        "reply": true || false,
        "commentID": <commentID? || null,
        "date": [date Number],
        "sentStatuses": [sentStatuses Object],
        "version": [version Object]
      }
    }
  },
  "polls": {
    <pollID>: {
      "auth": <auth token>,
      "creator": <username>,
      "title": String,
      "choices": {
        vote_<Number>: String
      },
      "votes": {
        <username>: {
          "username": <username>,
          "vote": String (vote_<Number>)
        }
      },
      "date": [date Number],
      "version": [version Object]
    }
  },
  "AMAs": {
    <AMAID>: {
      "auth": <auth token>,
      "creator": <username>,
      "associatedQuestions": {
        <questionID>: true
      },
      "date": [date Number],
      "version": [version Object]
    }
  }
}
```

### Reusable data objects
#### `date` Number

```js
Number (UTCTime)
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

Extra stuff:

#### `voteToolData` Object

```js
{
  "myAuth": <auth token>,
  "userData": <userData>,
  "fireRef": <fireRef>,
  "place": "question",
  "calculatedRatings": <calculatedRatings>,
  "questionData": <questionData>,
}
```
