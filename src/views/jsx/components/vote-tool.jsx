import React from "react";

export default React.createClass({
  displayName: "VoteTool",
  getInitialState: () => ({
    ratings: null,
    uniqueCommentRatings: null
  }),
  calculateRatings() {
    const { ratings } = this.state;
    const { userData } = this.props;
    let calculatedRatings = {};


    calculatedRatings = {
      comment: {
        upvotes: [],
        downvotes: [],
        overall: 0,
        myVote: false,
        for: true
      }
    };

    Object.keys(ratings || {}).map(vote => {
      const voteData = ratings[vote];
      const place = voteData.for;

      if(ratings[vote].upvote) calculatedRatings[place].upvotes.push(true);
      if(!ratings[vote].upvote) calculatedRatings[place].downvotes.push(true);
      if(voteData.username === userData.name) {
        calculatedRatings[place].myVote = voteData.upvote;
        calculatedRatings[place].for = voteData.for;
      }
    });
    ["comment"].map(place => {
      calculatedRatings[place].upvotes = calculatedRatings[place].upvotes.length;
      calculatedRatings[place].downvotes = calculatedRatings[place].downvotes.length;
      calculatedRatings[place].overall = calculatedRatings[place].upvotes - calculatedRatings[place].downvotes;
    });

    this.setState({
      uniqueCommentRatings: calculatedRatings
    });
  },
  castVote(vote) {
    const {
      myAuth,
      userData,
      fireRef,
      place,
      questionData,
      commentID,
      commentData,
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
    // gets data for answers and questions
    fireRef.ratingsRef
    .child(questionData.questionID)
    .orderByChild("username")
    .equalTo(userData.name)
    .once("value")
    .then(snap => {
      console.log(place);
      let votes = snap.val();
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
        .child(questionData.questionID)
        .push()
        .set(voteData);
      } else {
        fireRef.ratingsRef
        .child(questionData.questionID)
        .child(voteTypes[place])
        .update(voteData);
      }
    })
  },
  componentDidMount() {
    if(this.props.place === "comment") {
      this.props.fireRef.ratingsRef
      .child(this.props.questionData.questionID)
      .orderByChild("commentID")
      .equalTo(this.props.commentID)
      .once("value")
      .then(snap => {
        const ratings = snap.val();
        console.log("got ratings", ratings, this.props.commentID);
        this.setState({
          ratings
        }, this.calculateRatings)
      });

      // listen on new ratings
      const refNode = this.props.fireRef.ratingsRef
      .child(this.props.questionData.questionID)
      .orderByChild("commentID")
      .equalTo(this.props.commentID);
      refNode.on("child_added", snap => {
        const ratingsKey = snap.getKey();
        const ratingsData = snap.val();
        console.log("got unique ratings", ratingsKey, ratingsData);
        const newRatings = JSON.parse(JSON.stringify(this.state.ratings || {}));
        this.setState({
          ratings: Object.assign(newRatings || {}, {
            [ratingsKey]: ratingsData
          })
        }, this.calculateRatings)
      });
      refNode.on("child_changed", snap => {
        const ratingsKey = snap.getKey();
        const ratingsData = snap.val();
        console.log("got unique ratings", ratingsKey, ratingsData);
        const newRatings = JSON.parse(JSON.stringify(this.state.ratings || {}));
        this.setState({
          ratings: Object.assign(newRatings || {}, {
            [ratingsKey]: ratingsData
          })
        }, this.calculateRatings)
      });
    }
  },
  render() {
    const {
      place,
      commentID,
      calculatedRatings
    } = this.props;
    const {
      ratings,
      uniqueCommentRatings
    } = this.state;
    // console.log("wher eis itsatfds", ratings);
    if(
      !calculatedRatings || !calculatedRatings[place] ||
      place === "comment" && !uniqueCommentRatings
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

    let usedRatings = place === "comment" ? uniqueCommentRatings : calculatedRatings;
    // console.log("vote tools", place, usedRatings);

    // figure out whether the viewing user voted
    // and make a CSS class based on whether it's an up- or downvote
    const myVote = usedRatings[place].for === place ? (
      usedRatings[place].myVote === true ? " my-vote up" : usedRatings[place].myVote === false ? " my-vote down" : ""
    ) : "";

    return (
      <div className="vote-tool" onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}>
        <div className="wrapper">
          <div className={`upvote-btn${usedRatings[place].myVote ? myVote : ""}`} onClick={this.castVote.bind(null, true)}/>
          <div className="ratings">
            <div className="overall">{usedRatings[place].overall || 0}</div>
            <div className="ups-and-downs">
              <div className="up">{usedRatings[place].upvotes || 0}</div>
              /
              <div className="down">{usedRatings[place].downvotes || 0}</div>
            </div>
          </div>
          <div className={`downvote-btn${!usedRatings[place].myVote ? myVote : ""}`} onClick={this.castVote.bind(null, false)}/>
        </div>
      </div>
    );
  }
})
