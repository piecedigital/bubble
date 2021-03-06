import React from "react";
import { calculateRatings,
getQuestionData,
getAnswerData,
getRatingsData,
listenOnNewRatings } from "../../../modules/client/helper-tools";

export default React.createClass({
  displayName: "VoteTool",
  getInitialState: () => ({
    ratings: null,
    calculatedRatings: null
  }),
  castVote(vote) {
    const {
      auth,
      userData,
      fireRef,
      place,
      // questions
      questionID,
      questionData,
      // polls
      pollID,
      pollData,
      commentID,
      commentData
    } = this.props;
    const voteData = {
      "for": place,
      "userID": userData._id,
      "upvote": vote
    };
    // return console.log("vote data:", voteData);
    // console.log("vote data:", voteData);
    // check if the user has already voted
    fireRef.ratingsRef
    // get ratings for question or poll content
    .child(questionID || pollID)
    .once("value")
    .then(snap => {
      const ratingsData = snap.val();
      // console.log(place);
      let votes = ratingsData;
      // console.log(votes);
      // a node within voteType will be the ID of a rating or false
      let voteTypes = {
        question: false,
        answer: false,
        comment: false
      }
      // checks each rating for their place (for)
      Object.keys(votes || {}).map(ratingID => {
        const ratingData = votes[ratingID];
        if(ratingData.userID !== userData._id) return;
        if(place === "comment") {
          // console.log("comment IDs", ratingData.commentID, commentID, ratingData.commentID === commentID);
          voteTypes[ratingData.for] = (commentID === ratingData.commentID) ? ratingID : voteTypes[ratingData.for];
        } else {
          voteTypes[ratingData.for] = ratingID;
        }
      });
      // adds rating if one doesn't already exist for the typet
      // updates it if it does
      if(place === "comment") {
        voteData.commentID = commentID;
      }
      if(!voteTypes[place]) {
        fireRef.ratingsRef
        .child(questionID || pollID)
        .push()
        .set(voteData);
      } else {
        fireRef.ratingsRef
        .child(questionID || pollID)
        .child(voteTypes[place])
        .update(voteData);
      }

      // depending on the `place` determines what kind of rating notification this is
      const placeObject = {
        "question": "questionUpvote",
        "answer": "answerUpvote",
        "comment": "commentUpvote",
      };
      // depending on the `place` gets the username of the question creator, receiver, or commenter
      const receiverObject = {
        "question": questionID ? questionData.creatorID : null,
        "answer": questionID ? questionData.receiverID : null,
        "comment": commentData ? commentData.userID : null,
      };

      // send notification
      // create notif obejct
      // console.log("creating object");
      let notifObject = {
        type: placeObject[place],
        info: {
          sender: userData._id,
          questionID: questionID || null,
          pollID: pollID || null,
          commentID: commentID || null,
          postURL: `/profile/${receiverObject[place]}/${questionID ? "q" : "p"}/${questionID || pollID}`
        },
        read: false,
        date: new Date().getTime(),
      };
      // console.log("sending object");
      // send notif
      if(receiverObject[place] !== userData._id) {
        if(voteData.upvote) {
          // check if the user already sent an upvote notification
          fireRef.notificationsRef
          .child(receiverObject[place])
          .orderByChild("type")
          .equalTo(placeObject[place])
          .once("value")
          .then(snap => {
            const notifs = snap.val();
            let dupe = false;
            Object.keys(notifs || {}).map(notifID => {
              const notifData = notifs[notifID];
              if(questionID) {
                if(notifData.info.questionID === questionID) dupe = true;
                if(notifData.info.commentID) dupe = (notifData.info.commentID === commentID) ? true : false;
              }
              if(pollID) {
                if(notifData.info.pollID === pollID) dupe = true;
                if(notifData.info.commentID) dupe = (notifData.info.commentID === commentID) ? true : false;
              }
            });

            // don't send a notification if it would be a duplicate
            if(dupe) return;

            fireRef.notificationsRef
            .child(receiverObject[place])
            .push()
            .set(notifObject)
            .catch(e => console.error(e.val ? e.val() : e));
          });
        }
      }
    })
  },
  newRating(snap) {
    const { place, commentID } = this.props;
    if(!snap) return;
    const key = snap.getKey();
    const val = snap.val();
    // console.log("new rating", key, val, commentID);
    // console.log(this.props);
    if(place === "comment" && val.commentID !== commentID) return;
    const ratings = Object.assign(this.state.ratings || {}, {
      [key]: val
    });
    this.setState({
      ratings
    }, this.calc);
  },
  getInitialRatings() {
    const {
      place,
      fireRef,
      userData,
      questionID,
      pollID,
      commentID,
      commentData
    } = this.props;
    // console.log("init new comment", commentID);
    fireRef.ratingsRef
    // get ratings for question or poll content
    .child(questionID || pollID)
    .once("value")
    .then(snap => {
      const ratingsData = snap.val();
      // console.log("got ratings", ratingsData, questionID, commentID || "not a comment");
      Object.keys(ratingsData || {}).map(ratingID => {
        const voteData = ratingsData[ratingID];
        if(voteData.commentID !== commentID) delete ratingsData[ratingID];
      });
      this.setState({
        ratings: ratingsData
        // callback to calculate the ratings
      }, this.calc.bind(null, true));
    });
  },
  // calculates ratings
  calc(first) {
    const {
      userData,
    } = this.props;
    // console.log("calculation", this.state.ratings, this.props.commentID);
    calculateRatings({
      ratingsData: this.state.ratings,
      userData
    }, calculatedRatings => {
      // console.log("vote tool got calculated ratings", calculatedRatings);
      this.setState({
        calculatedRatings
        // starts listener to listen for new ratings
      }, first ? this.initListener : null);
    });
  },
  // listen for new ratings
  initListener() {
    const {
      place,
      fireRef,
      questionID,
      pollID,
      commentID,
    } = this.props;
    this.killRatingsWatch = listenOnNewRatings(questionID || pollID, fireRef, null, this.newRating);
  },
  componentDidMount() {
    const {
      questionID,
      pollID,
      fireRef
    } = this.props;

    const temp = snap => {
      if(
        snap.getKey() === questionID ||
        snap.getKey() === pollID
      ) {
        fireRef.ratingsRef
        .off("child_added", temp);

        // get the initial bulk of ratings and/or initialize listeners
        this.getInitialRatings();
      }
    };

    fireRef.ratingsRef
    .on("child_added", temp);
  },
  componentWillUnmount() {
    // kill ratings listener on unmount
    if(typeof this.killRatingsWatch === "function") this.killRatingsWatch(this.newRating);
  },
  render() {
    const {
      place,
      userData,
      commentID
    } = this.props;
    const {
      ratings,
      calculatedRatings
    } = this.state;
    // place === "comment" ? console.log("wher eis itsatfds", this.props) : null;
    if(
      !calculatedRatings || !calculatedRatings[place]
    ) return (
      <div className="vote-tool" onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        <div className="wrapper">
          <div className={`upvote-btn`} onClick={this.castVote.bind(null, true)}/>
          <div className="ratings">
            <div className="overall">0</div>
            <div className="ups-and-downs">
              <div className="up">0</div>
              /
              <div className="down">0</div>
            </div>
          </div>
          <div className={`downvote-btn`} onClick={this.castVote.bind(null, false)}/>
        </div>
      </div>
    );

    // console.log("vote tools", place, calculatedRatings);

    // figure out whether the viewing user voted
    // and make a CSS class based on whether it's an up- or downvote
    const myVote = calculatedRatings[place].for === place ? (
      calculatedRatings[place].myVote === true ? " my-vote up" : calculatedRatings[place].myVote === false ? " my-vote down" : ""
    ) : "";

    return (
      <div className={"vote-tool " + commentID} onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        <div className="wrapper">
          {
            userData ? (
              <div className={`upvote-btn${calculatedRatings[place].myVote ? myVote : ""}`} onClick={this.castVote.bind(null, true)}/>
            ) : null
          }
          <div className="ratings">
            <div className="overall">{calculatedRatings[place].overall || 0}</div>
            <div className="ups-and-downs">
              <div className="up">{calculatedRatings[place].upvotes || 0}</div>
              /
              <div className="down">{calculatedRatings[place].downvotes || 0}</div>
            </div>
          </div>
          {
            userData ? (
              <div className={`downvote-btn${!calculatedRatings[place].myVote ? myVote : ""}`} onClick={this.castVote.bind(null, false)}/>
            ) : null
          }
        </div>
      </div>
    );
  }
})
