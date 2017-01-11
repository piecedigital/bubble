import React from "react";
import { calculateRatings,
getQuestionData,
getAnswerData,
getRatingsData } from "../../../modules/helper-tools";

export default React.createClass({
  displayName: "VoteTool",
  getInitialState: () => ({
    ratings: null,
    calculatedRatings: null
  }),
  castVote(vote) {
    const {
      myAuth,
      userData,
      fireRef,
      place,
      questionID,
      commentID,
    } = this.props;
    const voteData = {
      myAuth,
      "for": place,
      "username": userData.name,
      "upvote": vote
    };
    // return console.log("vote data:", voteData);
    // console.log("vote data:", voteData);
    // check if the user has already voted
    getRatingsData(questionID, fireRef, null, ratingsData => {
      console.log(place);
      let votes = ratingsData;
      console.log(votes);
      // a node within voteType will be the ID of a rating or false
      let voteTypes = {
        question: false,
        answer: false,
        comment: false
      }
      // checks each rating for their place (for)
      Object.keys(votes || {}).map(ratingID => {
        const ratingData = votes[ratingID];
        if(place === "comment") {
          // console.log("comment IDs", ratingData.commentID, commentID, ratingData.commentID === commentID);
          voteTypes[ratingData.for] = commentID === ratingData.commentID ? ratingID : voteTypes[ratingData.for];
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
        .child(questionID)
        .push()
        .set(voteData);
      } else {
        fireRef.ratingsRef
        .child(questionID)
        .child(voteTypes[place])
        .update(voteData);
      }
    })
  },
  componentDidMount() {
    const {
      place,
      fireRef,
      userData,
      questionID,
      commentID,
    } = this.props;
    getRatingsData(questionID, fireRef, nodeRef => {
      return place === "comment" ? nodeRef.orderByChild("commentID")
      .equalTo(commentID) : nodeRef;
    }, ratingsData => {
      console.log("got ratings", ratingsData, questionID, commentID || "not a comment");
      this.setState({
        ratings: ratingsData
      }, ()=> {
        calculateRatings({
          ratingsData,
          userData
        }, calculatedRatings => {
          console.log("vote tool got calculated ratings", calculatedRatings);
          this.setState({
            calculatedRatings
          });
        });
      });
    });

    // listen on new ratings
    // const refNode = this.props.fireRef.ratingsRef
    // .child(this.props.questionID)
    // .orderByChild("commentID")
    // .equalTo(this.props.commentID);
    // refNode.on("child_added", snap => {
    //   const ratingsKey = snap.getKey();
    //   const ratingsData = snap.val();
    //   console.log("got unique ratings", ratingsKey, ratingsData);
    //   const newRatings = JSON.parse(JSON.stringify(this.state.ratings || {}));
    //   this.setState({
    //     ratings: Object.assign(newRatings || {}, {
    //       [ratingsKey]: ratingsData
    //     })
    //   }, () => {
    //     calculateRatings.bind(null, calculatedRatings => {
    //       this.setState({
    //         uniqueCommentRatings: calculatedRatings
    //       });
    //     });
    //   });
    // });
    // refNode.on("child_changed", snap => {
    //   const ratingsKey = snap.getKey();
    //   const ratingsData = snap.val();
    //   console.log("got unique ratings", ratingsKey, ratingsData);
    //   const newRatings = JSON.parse(JSON.stringify(this.state.ratings || {}));
    //   this.setState({
    //     ratings: Object.assign(newRatings || {}, {
    //       [ratingsKey]: ratingsData
    //     })
    //   }, () => {
    //     calculateRatings.bind(null, calculatedRatings => {
    //       this.setState({
    //         uniqueCommentRatings: calculatedRatings
    //       });
    //     });
    //   });
    // });
  },
  render() {
    const {
      place,
      commentID
    } = this.props;
    const {
      ratings,
      calculatedRatings
    } = this.state;
    // console.log("wher eis itsatfds", ratings);
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

    // console.log("vote tools", place, usedRatings);

    // figure out whether the viewing user voted
    // and make a CSS class based on whether it's an up- or downvote
    const myVote = calculatedRatings[place].for === place ? (
      calculatedRatings[place].myVote === true ? " my-vote up" : calculatedRatings[place].myVote === false ? " my-vote down" : ""
    ) : "";

    return (
      <div className="vote-tool" onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        <div className="wrapper">
          <div className={`upvote-btn${calculatedRatings[place].myVote ? myVote : ""}`} onClick={this.castVote.bind(null, true)}/>
          <div className="ratings">
            <div className="overall">{calculatedRatings[place].overall || 0}</div>
            <div className="ups-and-downs">
              <div className="up">{calculatedRatings[place].upvotes || 0}</div>
              /
              <div className="down">{calculatedRatings[place].downvotes || 0}</div>
            </div>
          </div>
          <div className={`downvote-btn${!calculatedRatings[place].myVote ? myVote : ""}`} onClick={this.castVote.bind(null, false)}/>
        </div>
      </div>
    );
  }
})
