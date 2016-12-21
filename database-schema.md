# Database Schema


### Using JavaScript syntax highlighting so I leave weird things in the object without a syntax error in my editor
### Also the highlighting is better

```js
"bubble": {
  "config": {

  },
  "users": {
    <username>: {
      "questionsAsked": Number,
      "questionsAnswered": Number
    }
  },
  "questions": {
    "askedBy": <username>: String,
    "askedFor": <username>: String,
    "title": String or Number // If number it'll be 0. Firebase does not accept null as a value,
    "body": String // minimum 30 characters
  }
}
```
