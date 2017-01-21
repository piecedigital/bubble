import React from "react";
import firebase from "firebase";
import { Link } from 'react-router';
// import { calculateRatings,
// getQuestionData,
// getAnswerData,
// getRatingsData,
// getCommentsData } from "../../../modules/helper-tools";
// import VoteTool from "./vote-tool.jsx";
// import { ajax } from "../../../modules/ajax";

// poll creation related components
const ChoiceInput = React.createClass({
  displayName: "ChoiceInput",
  render() {
    const {
      choiceID,
      choiceData,
      changeCB,
      removeCB,
    } = this.props;
    return (
      <div className="poll-choice">
        <input type="text" value={choiceData} onChange={changeCB.bind(null, choiceID)}/>
        {
          choiceID !== 0 ? (
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
    validation: {
      titleMin: 15,
      titleMax: 500,
      titleCount: 0,
      titleValid: false,
    },
    choices: [""]
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
    } = this.refs;

    const choices = {};

    this.state.choices.map((choiceData, choiceID) => {
      choices[`vote_${choiceID}`] = choiceData;
    });

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
      date: new Date().getTime(),
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
        this.props.methods.popUpHandler("close")
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
  addChoice() {
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
    if(newChoices.length === 0) newChoices.push("");
    this.setState({
      choices: newChoices
    });
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
    } = this.state;
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
              <div className="btn-default" onClick={this.addChoice}>Add Choice</div>
            </label>
          </div>
          <div className="section">
            <button className="submit btn-default">Submit</button>
          </div>
        </form>
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
        if(pollData) this.initListener();
      });
    });
  },
  initListener() {
    const {
      userData,
      fireRef,
      pollID
    } = this.props;
    this.calculate();
    fireRef.pollsRef
    .child(pollID)
    .child("votes")
    .on("child_added", snap => {
      const username = snap.getKey();
      const voteData = snap.val();

      // console.log("new vote", username, voteData);

      const newPollData = JSON.parse(JSON.stringify( this.state.pollData || {} ));

      newPollData.votes[username] = voteData;

      this.setState({
        pollData: newPollData
      }, this.calculate);
    });
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
      console.log(calculatedData);
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
  componentDidMount() {
    console.log("mounted view");
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
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      calculatedData
    } = this.state;
    // console.log(this.state);
    const { pollData } = this.state;

    if(pollData) {
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
  componentDidMount() {
    // const {
    //   pollID,
    //   fireRef
    // } = this.props;
    // fireRef.pollsRef
    // .child(pollID)
    // .once("value")
    // .then(snap => {
    //   const pollData = snap.val();
    //
    //   this.setState({
    //     pollData
    //   });
    // });
  },
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
            popUpHandler("viewQuestion", {
              questionID
            });
          }}>{pollData.title}</Link><span className="answered">&#x2714;</span>
        </label>
      </div>
    );
  }
});

const AnswerItem = React.createClass({
  displayName: "AnswerItem",
  getInitialState: () => ({
    questionData: null
  }),
  componentDidMount() {
    const {
      questionID,
      fireRef
    } = this.props;
    getQuestionData(questionID, fireRef, null, questionData => {
      console.log("got question data");
      this.setState({
        questionData
      });
    });
  },
  render() {
    const {
      questionID,
      answerData,
      locations,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      questionData
    } = this.state;

    if(!questionData) return null;

    return (
      <div className="answer-item">
        <label>
          <Link className="name" to={{
            pathname: `/profile/${questionData.receiver}/q/${questionID}`,
            state: {
              modal: true,
              returnTo: location.pathname
            }
          }} onClick={e => {
            popUpHandler("viewQuestion", {
              questionID
            });
          }}>{questionData.title}</Link><span className="answered">&#x2714;</span>
        </label>
      </div>
    );
  }
});

export const ViewCreatedPolls = React.createClass({
  displayName: "ViewCreatedPolls",
  getInitialState: () => ({
    polls: null,
    toggle: "asked"
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
      toggle
    } = this.state;

    // const data = toggle === "asked" ? questionData : answerData;
    const data = polls;
    // const Component = toggle === "asked" ? QuestionItem : AnswerItem;
    const Component = CreatedItem;

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
        {
          // <div className="tabs">
          //   <div className="asked" onClick={this.toggleView.bind(null, "asked")}>Asked</div>
          //   |
          //   <div className="answered" onClick={this.toggleView.bind(null, "answered")}>Answered</div>
          // </div>
        }
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="title">
          polls You've {toggle.replace(/^(.)/, (_, letter) => letter.toUpperCase())}
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="section">
          <div className="list">
          {list.length > 0 ? list : "You haven't created any polls yet."}
          </div>
        </div>
      </div>
    );
  }
});
