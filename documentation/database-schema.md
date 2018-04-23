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
- `users.<userID>.bookmarks` node to contain the ID's of bookmarked users or questions
- `users.<sername>.userConfig` node to contain user specific options

```js
"bubble": {
  "appConfig": Object,
  "authIDs": {
    <userID>: <Twitch auth ID>
  },
  "users": {
    <userID>: {
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
      "pollsParticipated": {
        <pollID>: true
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
          <userID>: {
            "userID": <userID>,
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
    <userID>: {
      <notifID>: {
        "type": String ("newQuestion" || "newAnswer" || "newQuestionComment" || "questionUpvote" || "answerUpvote" || "commentUpvote"),
        "info": {
          "sender": <userID>, // the person that caused the notification to be sent
          "questionID": <questionID>,
          ["questionURL" || "pollURL"]: String
        },
        "read": Boolean,
        "date": [date Object],
        "version": [version Object]
      }
    }
  },
  "questions": {
    <questionID>: {
      "creatorID": <userID>: String, //
      "receiverID": <userID>: String,
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
      "userID": <userID>,
      "questionID": <questionID>
      "body": String, // minimum 30 characters
      "date": [date Number],
      "sentStatuses": [sentStatuses Object],
      "version": [version Object]
    }
  },
  "ratings": {
    <questionID || pollID>: {
      <ratingID>: {
        "for": String ("question" || "answer" || "comment"),
        "commentID": <commentID>, // won't exist for non-comments
        "userID": <userID>,
        "upvote": Boolean
      }
    }
  },
  "comments": {
    <questionID || pollID>: {
      <commentID>: {
        "userID": <userID>,
        "questionID": <questionID>, // if this is a comment for a question
        "pollID": <pollID>, // if this is a comment for a poll
        "body": String,
        "reply": true || false,
        "commentID": <commentID> || null, // String or null, depending on whether this is a reply or not
        "date": [date Number],
        "sentStatuses": [sentStatuses Object],
        "version": [version Object]
      }
    }
  },
  "polls": {
    <pollID>: {
      "creatorID": <userID>,
      "title": String,
      "choices": {
        vote_<Number>: String
      },
      "votes": {
        <userID>: {
          "userID": <userID>,
          "vote": String (vote_<Number>)
        }
      },
      "endDate": Number,
      "date": Number,
      "version": [version Object]
    }
  },
  "gameQueues": {
    <userID>: {
      "title": String,
      "game": String,
      "subOnly": Boolean,
      "rank": String,
      "queueLimit": Number,
      "queueOpen": Boolean,
      "platform": String ("PC/Steam" || "PC/Uplay" || "PC/Origin" || "PS4/PSN" || "XBox/XBL" || "Wii/NN"), // text will be flattened as values for simplification
      "queue": {
        <userID>: {
          "gamerID": String,
          "date": Number
        }
      },
      "notes": {
        <userID>: String, // optional. edited by queue hoster
      },
      "nowPlaying": {
        <userID>: Object // same as queue user object
      },
      "alreadyPlayed": {
        <userID>: Object // same as queue user object
      },
      "date": Number,
      "version": [version Object]
    }
  }
  "AMAs": {
    <AMAID>: {
      "creatorID": <userID>,
      "associatedQuestions": {
        <questionID>: true
      },
      "date": [date Number],
      "version": [version Object]
    }
  }
  "syncLobby": {
    <lobbyID>: {
      "hostID": <userID>,
      "videoType": String ("yt", "ttv"),
      "videoLink": String, // full required for now
      "videoState": {
        "time": Number,
        "playing": Boolean
      }
      "chatMessages": {
        <msgID>: String
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
  "userData": <userData>,
  "fireRef": <fireRef>,
  "place": "question",
  "calculatedRatings": <calculatedRatings>,
  "questionData": <questionData>,
}
```
