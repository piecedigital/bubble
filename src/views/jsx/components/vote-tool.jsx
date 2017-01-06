import React from "react";

export default React.createClass({
  displayName: "VoteTool",
  castVote(vote) {
    const {
      myAuth,
      userData,
      fireRef,
      place,
      questionData
    } = this.props;
    const voteData = {
      myAuth,
      "for": place,
      "username": questionData.creator,
      "upvote": vote
    };
    // return console.log("vote data:", voteData);
    // console.log("vote data:", voteData);
    fireRef.ratingsRef
    .child(questionData.questionID)
    .child(userData.name)
    .set(voteData);
  },
  render() {
    const {
      calculatedRatings
    } = this.props;
    // console.log("vote", this.props);
    // figure out whether the viewing user voted
    // and make a CSS class based on whether it's an up- or downvote
    const myVote = calculatedRatings.myVote === true ? " my-vote up" : calculatedRatings.myVote === false ? " my-vote down" : "";

    return (
      <div className="vote-tool" onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        <div className="wrapper">
          <div className={`upvote-btn${calculatedRatings.myVote ? myVote : ""}`} onClick={this.castVote.bind(null, true)}/>
          <div className="ratings">
            <div className="overall">{calculatedRatings.overall || 0}</div>
            <div className="ups-and-downs">
              <div className="up">{calculatedRatings.upvotes || 0}</div>
              /
              <div className="down">{calculatedRatings.downvotes || 0}</div>
            </div>
          </div>
          <div className={`downvote-btn${!calculatedRatings.myVote ? myVote : ""}`} onClick={this.castVote.bind(null, false)}/>
        </div>
      </div>
    );
  }
})
