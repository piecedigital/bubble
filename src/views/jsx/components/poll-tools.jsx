import React from "react";
import firebase from "firebase";
import { Link } from 'react-router';
import {
  CommentTool,
  CommentItem
} from "./comment-tools.jsx";
// import VoteTool from "./vote-tool.jsx";
// import { ajax } from "../../../modules/ajax";

// poll creation related components
const ChoiceInput = React.createClass({
  displayName: "ChoiceInput",
  componentDidMount() {
    this.refs.input.focus();
  },
  render() {
    const {
      choiceID,
      choiceData,
      changeCB,
      removeCB,
    } = this.props;
    return (
      <div className="poll-choice">
        <input ref="input" type="text" value={choiceData} onChange={changeCB.bind(null, choiceID)}/>
        {
          choiceID > 1 ? (
            <span className="remove" onClick={removeCB.bind(null, choiceID)}>x</span>
          ) : null
        }
      </div>
    );
  }
});

export const MakePoll = React.createClass({
  displayName: "MakePoll",
  getInitialState: () => ({
    error: false,
    success: false,
    time: "Infinite",
    validation: {
      titleMin: 15,
      titleMax: 500,
      titleCount: 0,
      titleValid: false,
    },
    choices: ["", ""]
  }),
  submit(e) {
    e.preventDefault();
    const {
      auth,
      userData,
      fireRef,
      versionData,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      title,
      hours,
      minutes
    } = this.refs;

    const choices = {};

    this.state.choices.map((choiceData, choiceID) => {
      choices[`vote_${choiceID}`] = choiceData;
    });

    console.log(parseInt(hours.value), parseInt(minutes.value));

    const dateNow = Date.now();

    let pollObject = {
      auth: auth.access_token,
      title: title.value,
      creator: userData.name,
      choices,
      // "votes": {
      //   <username>: {
      //     "username": <username>,
      //     "vote": String (vote_<Number>)
      //   }
      // },
      endDate: (parseInt(hours.value) || parseInt(minutes.value)) ? dateNow + parseInt(hours.value) + parseInt(minutes.value) : null,
      date: dateNow,
      version: versionData
    };

    if(!this.state.validation.titleValid) return;
    console.log("poll object:", pollObject);
    // return console.log("poll object:", pollObject);

    // write question to `questions` node
    let pollID = fireRef.root.push().getKey();
    // console.log(pollID);
    fireRef.pollsRef
    .child(pollID)
    .set(pollObject)
    .catch(e => console.error(e.val ? e.val() : e));

    // close the pop up
    this.setState({
      success: true
    }, () => {
      setTimeout(() => {
        this.props.methods.popUpHandler("viewPoll", { pollID });
      }, 2000);
    });
  },
  validate(name, e) {
    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    let value = e.target.value;
    let thisMin = this.state.validation[`${name}Min`];
    let thisMax = this.state.validation[`${name}Max`];
    let thisValid = `${name}Valid`;
    let thisCount = `${name}Count`;
    this.setState({
      validation: Object.assign(this.state.validation, {
        [thisValid]: value.length >= thisMin && value.length <= thisMax,
        [thisCount]: value.length,
      })
    });
  },
  choiceInputChange(choiceID, e) {
    if(!e.target.value) return this.removeChoice(choiceID);
    const newChoices = JSON.parse(JSON.stringify(this.state.choices));
    newChoices[choiceID] = e.target.value;
    this.setState({
      choices: newChoices
    });
  },
  addChoice(e) {
    e.preventDefault();
    const newChoices = JSON.parse(JSON.stringify(this.state.choices));
    if(!newChoices[newChoices.length-1]) return;
    newChoices.push("");
    this.setState({
      choices: newChoices
    });
  },
  removeChoice(choiceID) {
    const newChoices = JSON.parse(JSON.stringify(this.state.choices));
    newChoices.splice(choiceID, 1);
    if(newChoices.length < 2) newChoices.push("");
    this.setState({
      choices: newChoices
    });
  },
  updateTimes() {
    const days = parseInt(this.refs.days.value) / (1000 * 60 * 60 * 24);
    const hours = parseInt(this.refs.hours.value) / (1000 * 60 * 60 );
    const minutes = parseInt(this.refs.minutes.value) / (1000 * 60);
    if(!days && !hours && !minutes) {
      this.setState({
        time: "Infinite"
      });
    } else {
      const part1 = days ? `${days} day${days > 1 ? "s" : ""}` : null;
      const part2 = hours ? `${hours} hour${hours > 1 ? "s" : ""}` : null;
      const part3 = minutes ? `${minutes} minute${minutes > 1 ? "s" : ""}` : null;
      let sentence = [];

      part1 ? sentence.push(part1) : null;
      part2 ? sentence.push(part2) : null;
      part3 ? sentence.push(part3) : null;
      sentence.length > 1 ? sentence.push(`and ${ sentence.pop() }`) : null;
      this.setState({
        time: sentence.join(", ")
      });
    }
  },
  render() {
    // console.log(this.props);
    const {
      fireRef,
      overlay,
      versionData,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      success,
      error,
      choices,
      time,
    } = this.state;
    const daysArray = new Uint8Array(8).map(() => true);
    const hoursArray = new Uint8Array(25).map(() => true);
    const minutesArray = new Uint8Array(60).map(() => true);
    let daysOptions = [], hoursOptions = [], minutesOptions = [];

    daysArray.map((_, ind) => {
      // console.log(_, ind);
      const elem = <option key={ind} value={(ind) * 1000 * 60 * 60 * 24}>{ind}</option>
      // console.log(elem);
      daysOptions.push(elem);
    });
    hoursArray.map((_, ind) => {
      // console.log(_, ind);
      const elem = <option key={ind} value={(ind) * 1000 * 60 * 60}>{ind}</option>
      // console.log(elem);
      hoursOptions.push(elem);
    });
    minutesArray.map((_, ind) => {
      // console.log(_, ind);
      const elem = <option key={ind} value={(ind) * 1000 * 60}>{ind}</option>
      // console.log(elem);
      minutesOptions.push(elem);
    });



    if(!versionData || !fireRef) {
      return (
        <div className={`overlay-ui-default make-poll${overlay === "makePoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Preparing form...
          </div>
        </div>
      );
    }
    if(error) {
      return (
        <div className={`overlay-ui-default make-poll${overlay === "makePoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            There was an issue preparing the form :(
          </div>
        </div>
      );
    } else
    if(success) {
      return (
        <div className={`overlay-ui-default make-poll${overlay === "makePoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Poll created successfully!
          </div>
        </div>
      );
    } else
    return (
      <div className={`overlay-ui-default make-poll${overlay === "makePoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Create A Poll
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="scroll">
          <form onSubmit={this.submit}>
            <div className="section">
              <label>
                <div className="label bold">Title/Intro</div>
                <input type="text" ref="title" className={`${this.state.validation["titleValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "title")}/>
                <div>{this.state.validation["titleCount"]}/<span className={`${this.state.validation["titleCount"] < this.state.validation["titleMin"] ? "color-red" : ""}`}>{this.state.validation["titleMin"]}</span>-<span className={`${this.state.validation["titleCount"] > this.state.validation["titleMax"] ? "color-red" : ""}`}>{this.state.validation["titleMax"]}</span></div>
              </label>
            </div>
            <div className="separator-1-dim" />
            <div className="section">
              <label>
                <div className="label bold">Add Choices</div>
                <div className="separator-1-dim" />
                <div className="section" />
                {
                  choices.map((choiceData, choiceID) => {
                    return (
                      <ChoiceInput key={choiceID} {...this.props} changeCB={this.choiceInputChange} removeCB={this.removeChoice} choiceID={choiceID} choiceData={choiceData} />
                    );
                  })
                }
                <div className="section column">
                  <div className="separator-1-dim" />
                </div>
                <button className="btn-default" onClick={this.addChoice} tabIndex="0">Add Choice</button>
              </label>
            </div>
            <div className="separator-1-dim" />
            <div className="section">
              <label>
                <div className="label bold">Set TIme Limit</div>
                <div className="separator-1-dim" />
                <div className="section">
                  <div className="label bold">Days: </div>
                  <select ref="days" onChange={this.updateTimes}>
                    {daysOptions}
                  </select>
                </div>
                <div className="section">
                  <div className="label bold">Hours: </div>
                  <select ref="hours" onChange={this.updateTimes}>
                    {hoursOptions}
                  </select>
                </div>
                <div className="section">
                  <div className="label bold">Minutes: </div>
                  <select ref="minutes" onChange={this.updateTimes}>
                    {minutesOptions}
                  </select>
                </div>
                <div className="section">
                  <div className="label">Time frame: {time}</div>
                </div>
              </label>
            </div>
            <div className="section">
              <button className="submit btn-default">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
});


// poll voting related components
const ChoiceOption = React.createClass({
  displayName: "ChoiceOption",
  vote() {
    const {
      fireRef,
      userData,
      pollID,
      choiceData: {
        choiceID
      },
      methods: {
        popUpHandler
      }
    } = this.props;

    console.log(this.props);
    fireRef.pollsRef
    .child(pollID)
    .child("votes")
    .child(userData.name)
    .set({
      username: userData.name,
      vote: choiceID
    });
    fireRef.usersRef
    .child(userData.name)
    .child("pollsParticipated")
    .child(pollID)
    .set(true);
    popUpHandler("viewPoll", { pollID });
  },
  render() {
    const {
      fireRef,
      userData,
      choiceData,
    } = this.props;

    return (
      <div className="section">
        <label className="choice">
          <div className="label">
            <div className="spread">
              <div className="text">{choiceData.text}</div>
              <div className="checkbox" onClick={this.vote}>&#x2714;</div>
            </div>
          </div>
        </label>
      </div>
    );
  }
});

export const VotePoll = React.createClass({
  displayName: "VotePoll",
  getInitialState: () => ({
    pollData: null,
  }),
  getPollData() {
    const {
      fireRef,
      userData,
      pollID,
      methods: {
        popUpHandler
      }
    } = this.props;

    fireRef.pollsRef
    .child(pollID)
    .once("value")
    .then(snap => {
      const pollData = snap.val();
      if(!pollData) return;
      if(pollData.votes && pollData.votes[userData.name]) {
        return popUpHandler("viewPoll", {
          pollID
        });
      }
      this.setState({
        pollData
      });
    });
  },
  componentDidMount() {
    this.getPollData();
  },
  render() {
    // console.log(this.props);
    const {
      auth,
      overlay,
      fireRef,
      pollID,
      userData,
      methods,
      methods: {
        popUpHandler
      }
    } = this.props;

    // console.log(this.state);
    const { pollData } = this.state;

    if(pollData) {
      return (
        <div className={`overlay-ui-default vote-poll${overlay === "votePoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
          <div className="title">
            <Link to={`/profile/${pollData.creator}`}>{pollData.creator}</Link>'s Poll: "{pollData.title}"
          </div>
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="scroll">
            <div className="title sub">
              Votes:
            </div>
            <div className="section">
              <label>
                <div className="label">
                  {
                    Object.keys(pollData.choices).map(choiceID => {
                      return (
                        <ChoiceOption
                          key={choiceID}
                          userData={userData}
                          fireRef={fireRef}
                          pollID={pollID}
                          choiceData={{
                          text: pollData.choices[choiceID],
                          choiceID
                        }} methods={methods} />
                      );
                    })
                  }
                </div>
              </label>
            </div>
            <div className="section">
              <label>
                <div className="label">
                  <div className="label bold">Copy Link</div>
                  <input type="test" value={`http://${location ? location.host : "localhost:8080"}/profile/${pollData.creator}/p/${pollID}`} onClick={e => e.target.select()} readOnly />
                </div>
              </label>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`overlay-ui-default vote-poll${overlay === "votePoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            No poll data
          </div>
        </div>
      );
    }
  }
});


// poll viewing related components
const ChoiceItem = React.createClass({
  displayName: "ChoiceItem",
  render() {
    const {
      auth,
      fireRef,
      userData,
      choiceData,
    } = this.props;
    // console.log("vote:", choiceData);
    if(!choiceData.calcData) return null;

    return (
      <div className="section">
        <label className="choice">
          <div className="label">
            <div className="gauge" style={{
              width: (100 * choiceData.calcData.percentage) + "%"
            }}/>
            <div className="spread">
              <div className="text">{choiceData.text}</div>
              <div className="number">{choiceData.calcData.votes} | {100 * choiceData.calcData.percentage}%</div>
            </div>
          </div>
        </label>
      </div>
    );
  }
});

export const ViewPoll = React.createClass({
  displayName: "ViewPoll",
  getInitialState: () => ({
    pollData: null,
    comments: null,
    calculatedData: {
      // <voteID>: Object
    }
  }),
  getPollData() {
    const {
      fireRef,
      pollID
    } = this.props;

    fireRef.pollsRef
    .child(pollID)
    .once("value")
    .then(snap => {
      const pollData = snap.val();
      if(!pollData) return;
      this.setState({
        pollData
      }, () => {
        if(pollData) {
          this.timeTicker();
          this.initVoteListener();
        }
      });
    });
  },
  timeTicker() {
    const { pollData } = this.state;
    // only initiate the ticker if the end time is finite
    if(pollData.endTime !== Infinity) {
      // this ticker will update the component every 1/10 of a second to update the vote button
      // if the current time surpasses the end time the user can no longer vote
      this.ticker = setInterval(() => {
        if(Date.now() >= pollData.endDate) {
          clearInterval(this.ticker);
        }
        this._mounted ? this.setState({}) : null;
      }, 100);
    }
  },
  initVoteListener() {
    const {
      userData,
      fireRef,
      pollID
    } = this.props;
    this.calculate();
    fireRef.pollsRef
    .child(pollID)
    .child("votes")
    .on("child_added", this.newVote);
  },
  newVote(snap) {
    const username = snap.getKey();
    const voteData = snap.val();

    // console.log("new vote", username, voteData);

    const newPollData = JSON.parse(JSON.stringify( this.state.pollData || {} ));

    newPollData.votes = newPollData.votes || {};
    newPollData.votes[username] = voteData;

    this.setState({
      pollData: newPollData
    }, this.calculate);
  },
  uninitListener() {
    const {
      userData,
      fireRef,
      pollID
    } = this.props;
    this.calculate();
    fireRef.pollsRef
    .child(pollID)
    .child("votes")
    .off("child_added", this.newVote);

    fireRef.commentsRef
    .child(this.props.pollID)
    .orderByChild("reply")
    .equalTo(false)
    .off("child_added", this.newComment)
  },
  calculate() {
    const {
      pollData
    } = this.state;
    let calculatedData = {};


    if(pollData.votes) {
      const votesArray = Object.keys(pollData.votes);
      votesArray.map(username => {
        const voteData = pollData.votes[username];
        if(!calculatedData[voteData.vote]) {
          calculatedData[voteData.vote] = {
            votes: 0,
            percentage: 0
          };
        }
        calculatedData[voteData.vote].votes += 1;
      });
      const totalVotes = votesArray.length;
      // console.log("calculated data", calculatedData);
      Object.keys(pollData.choices).map(choiceID => {
        if(!calculatedData[choiceID]) {
          calculatedData[choiceID] = {
            votes: 0,
            percentage: 0
          };
        } else {
          calculatedData[choiceID].percentage = calculatedData[choiceID].votes / totalVotes;
        }
      });
      this.setState({
        calculatedData
      });
    } else {
      Object.keys(pollData.choices).map(choiceID => {
        calculatedData[choiceID] = {
          votes: 0,
          percentage: 0
        };
      });
      this.setState({
        calculatedData
      });
    }
  },
  newComment(snap) {
    const commentKey = snap.getKey();
    const commentData = snap.val();
    let newComments = JSON.parse(JSON.stringify(this.state.comments));
    // console.log("new comment", commentKey, commentData);
    this.setState({
      comments: Object.assign({
        [commentKey]: commentData
      }, newComments || {})
    });
  },
  initCommentListener() {
    // console.log("initiating comment listener");
    const {
      pollID,
      fireRef
    } = this.props;

    fireRef.commentsRef
    .child(pollID)
    .orderByChild("reply")
    .equalTo(false)
    .on("child_added", this.newComment);
  },
  componentDidMount() {
    this._mounted = true;
    const {
      pollID,
      fireRef
    } = this.props;

    fireRef.commentsRef
    .child(pollID)
    .orderByChild("reply")
    .equalTo(false)
    .once("value")
    .then(snap => {
      const comments = snap.val();

      this.setState({
        comments
      }, this.initCommentListener);
    });

    this.getPollData();
  },
  componentWillUnmount() {
    delete this._mounted;
    this.uninitListener();
  },
  render() {
    // console.log(this.props);
    const {
      auth,
      overlay,
      fireRef,
      pollID,
      userData,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      calculatedData
    } = this.state;
    // console.log(this.state);
    const {
      pollData,
      comments
    } = this.state;


    if(pollData) {
      // create array of comment items
      const commentList = Object.keys(comments || {}).map(commentID => {
        const commentData = comments[commentID];
        return (
          <CommentItem auth={auth} key={commentID} commentID={commentID} commentData={commentData} pollID={pollID} pollData={pollData} fireRef={fireRef} userData={userData} />
        );
      });
      // console.log("date", Date.now(), pollData.endDate, Date.now() < pollData.endDate);
      return (
        <div className={`overlay-ui-default view-poll${overlay === "viewPoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
          <div className="title">
            <Link to={`/profile/${pollData.creator}`}>{pollData.creator}</Link>'s Poll: "{pollData.title}"
          </div>
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="scroll">
            <div className="title sub">
              Votes:
            </div>
            <div className="section">
              <label>
                <div className="label">
                  {
                    Object.keys(pollData.choices).map(choiceID => {
                      return (
                        <ChoiceItem key={choiceID} choiceData={{
                          text: pollData.choices[choiceID],
                          calcData: calculatedData[choiceID]
                        }} />
                      );
                    })
                  }
                </div>
              </label>
            </div>
            <div className="separator-4-dim" />
            <div className="section">
              <label>
                <div className="label">
                  <div className="label bold">Copy Link</div>
                  <input type="test" value={`http://${location ? location.host : "localhost:8080"}/profile/${pollData.creator}/p/${pollID}`} onClick={e => e.target.select()} readOnly />
                </div>
              </label>
            </div>
            <div className="separator-4-dim" />
            <div className="separator-4-dim" />
            <div className="section">
              {
                !userData ? "Login to vote!" :
                Date.now() >= pollData.endDate ? "Voting closed" :
                !pollData.votes ||
                !pollData.votes[userData.name] ? (
                  <button className="submit btn-default" onClick={popUpHandler.bind(null, "votePoll", { pollID })}>Vote On Poll</button>
                ) : "You've casted your vote!"
              }
            </div>
            <div className="title sub">
              Comments:
            </div>
            <div className="section">
              <label>
                <CommentTool {...this.props} pollData={pollData} />
              </label>
            </div>
            <div className="section">
              <label>
                <div className="label">{commentList.length > 0 ? commentList : "No comments"}</div>
              </label>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`overlay-ui-default view-poll${overlay === "viewPoll" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            No poll data
          </div>
        </div>
      );
    }
  }
})


// all polls viewing related components
const CreatedItem = React.createClass({
  displayName: "CreatedItem",
  getInitialState: () => ({
    pollData: null
  }),
  render() {
    const {
      pollID,
      pollData,
      locations,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      // pollData
    } = this.state;
    let completed, symbol = "&#x2716;";

    if(Date.now() >= pollData.endDate) {
      completed = "completed";
      symbol = "&#x2714";
    }

    return (
      <div className="poll-item">
        <label>
          <Link className="name" to={{
            pathname: `/profile/${pollData.creator}/p/${pollID}`,
            state: {
              modal: true,
              returnTo: location.pathname
            }
          }} onClick={e => {
            popUpHandler("viewPoll", {
              pollID
            });
          }}>{pollData.title}</Link><span className={completed} dangerouslySetInnerHTML={{ __html: symbol }}></span>
        </label>
      </div>
    );
  }
});

const ParticipatedItem = React.createClass({
  displayName: "ParticipatedItem",
  getInitialState: () => ({
    pollData: null
  }),
  componentDidMount() {
    const {
      pollID,
      fireRef
    } = this.props;

    fireRef.pollsRef
    .child(pollID)
    .once("value")
    .then(snap => {
      const pollData = snap.val();
      console.log("got poll data", pollData);
      this.setState({
        pollData
      });
    });
  },
  render() {
    const {
      pollID,
      locations,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      pollData,
    } = this.state;

    if(!pollData) return null;

    let completed, symbol = "&#x2716;";

    if(Date.now() >= pollData.endDate) {
      completed = "completed";
      symbol = "&#x2714";
    }

    return (
      <div className="participated-poll-item">
        <label>
          <Link className="name" to={{
            pathname: `/profile/${pollData.creator}/p/${pollID}`,
            state: {
              modal: true,
              returnTo: location.pathname
            }
          }} onClick={e => {
            popUpHandler("viewPoll", {
              pollID
            });
          }}>{pollData.title}</Link><span className={completed} dangerouslySetInnerHTML={{ __html: symbol }}></span>
        </label>
      </div>
    );
  }
});

export const ViewCreatedPolls = React.createClass({
  displayName: "ViewCreatedPolls",
  getInitialState: () => ({
    polls: null,
    participated: null,
    toggle: "created"
  }),
  componentDidMount() {
    const {
      fireRef,
      userData
    } = this.props;

    fireRef.pollsRef
    .orderByChild("creator")
    .equalTo(userData.name)
    .once("value")
    .then(snap => {
      const polls = snap.val();
      this.setState({
        polls
      });
    });
    fireRef.usersRef
    .child(userData.name)
    .child("pollsParticipated")
    .once("value")
    .then(snap => {
      const participated = snap.val();
      this.setState({
        participated
      });
    });
  },
  toggleView(toggle) {
    this.setState({
      toggle
    })
  },
  render() {
    const {
      fireRef,
      userData,
      methods,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      polls,
      participated,
      toggle
    } = this.state;

    const data = toggle === "created" ? polls : participated;
    // const data = polls;
    const Component = toggle === "created" ? CreatedItem : ParticipatedItem;
    // const Component = CreatedItem;

    const list = data ? Object.keys(data).map(pollID => {
      const thisData = data[pollID]
      return (
        <Component key={pollID} {...{
          fireRef,
          pollID,
          pollData: thisData,
          location,
          methods
        }} />
      );
    }) : [];

    return (
      <div className={`overlay-ui-default view-created-polls open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="tabs">
          <div className="asked" onClick={this.toggleView.bind(null, "created")}>Created</div>
          |
          <div className="answered" onClick={this.toggleView.bind(null, "voted On")}>Voted On</div>
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="title">
          Polls You've {toggle.replace(/^(.)/, (_, letter) => letter.toUpperCase())}
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="scroll">
          <div className="section">
            <div className="list">
              {list.length > 0 ? list : `You haven't ${toggle} any polls yet.`}
            </div>
          </div>
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="section">
            <button className="submit btn-default" onClick={popUpHandler.bind(null, "makePoll")}>Make New Poll</button>
          </div>
        </div>
      </div>
    );
  }
});
