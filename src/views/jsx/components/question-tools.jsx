import React from "react";
import firebase from "firebase";
import { Link } from 'react-router';
import { calculateRatings,
getQuestionData,
getAnswerData,
getRatingsData,
getCommentsData } from "../../../modules/client/helper-tools";
import VoteTool from "./vote-tool.jsx";
import {
  CommentTool,
  CommentItem
} from "./comment-tools.jsx";
import { ajax } from "../../../modules/client/ajax";

// for asking a question
export const AskQuestion = React.createClass({
  displayName: "AskQuestion",
  getInitialState: () => ({
    error: false,
    success: false,
    validation: {
      titleMin: 3,
      titleMax: 60,
      titleCount: 0,
      titleValid: false,
      bodyMin: 30,
      bodyMax: 2000,
      bodyCount: 0,
      bodyValid: false
    }
  }),
  submit(e) {
    e.preventDefault();
    const {
      auth,
      fireRef,
      overlay,
      versionData,
      to,
      from,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      title,
      body,
    } = this.refs;
    let questionObject = {
      // true if `access_token` exists
      creator: from,
      receiver: to,
      title: title.value,
      body: body.value,
      date: new Date().getTime(),
      sentStatuses: {
        "email": false,
        "notification": false
      },
      version: versionData
    };

    if(!this.state.validation.titleValid && !this.state.validation.bodyValid) return;
    // console.log("question object:", questionObject);
    // write question to `questions` node
    let questionID = fireRef.root.push().getKey();
    // console.log(questionID);
    fireRef.questionsRef
    .child(questionID)
    .setWithPriority(questionObject, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));

    // send notification
    // create notif obejct
    let notifObject = {
      type: "newQuestion",
      info: {
        sender: from,
        questionID: questionID,
        questionURL: `/profile/${to}/a/${questionID}`
      },
      read: false,
      date: new Date().getTime(),
      version: versionData
    };
    // send notif
    fireRef.notificationsRef
    .child(to)
    .push()
    .set(notifObject)
    .catch(e => console.error(e.val ? e.val() : e));
    // write question ID reference to user.<username>.questionsForMe
    fireRef.usersRef
    .child(`${to}/questionsForMe/${questionID}`)
    .setWithPriority(questionObject.date, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));
    // write question ID reference to user.<username>.questionsForThem
    fireRef.usersRef
    .child(`${from}/questionsForThem/${questionID}`)
    .setWithPriority(questionObject.date, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));

    // close the pop up
    this.setState({
      success: true
    }, () => {
      setTimeout(() => {
        this.props.methods.popUpHandler("close")
      }, 2000)
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
  componentWillReceiveProps(nextProps) {
    if(nextProps.overlay === "askQuestion" && this.props.overlay !== "askQuestion") this.setState({
      success: false
    });
  },
  render() {
    // console.log(this.props);
    const {
      fireRef,
      overlay,
      versionData,
      to,
      from,
      body,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      success,
      error,
    } = this.state;
    if(!versionData || !fireRef) {
      return (
        <div className={`overlay-ui-default ask-question${overlay === "askQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Preparing form...
          </div>
        </div>
      );
    }
    if(error) {
      return (
        <div className={`overlay-ui-default ask-question${overlay === "askQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            There was an issue preparing the form :(
          </div>
        </div>
      );
    } else
    if(success) {
      return (
        <div className={`overlay-ui-default ask-question${overlay === "askQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Question submitted to {to} successfully!
          </div>
        </div>
      );
    } else
    return (
      <div className={`overlay-ui-default ask-question${overlay === "askQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Ask {to} A Question
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <form onSubmit={this.submit}>
          <div className="section">
            <span className="label">To: </span>
            <span className="to">{to}</span>
          </div>
          <div className="separator-1-dim" />
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
              <div className="label bold">What Do You Have To Ask?</div>
              <textarea ref="body" className={`${this.state.validation["bodyValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "body")}/>
              <div>{this.state.validation["bodyCount"]}/<span className={`${this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : ""}`}>{this.state.validation["bodyMin"]}</span>-<span className={`${this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : ""}`}>{this.state.validation["bodyMax"]}</span></div>
            </label>
          </div>
          <div className="section">
            <button className="submit btn-default">Submit</button>
          </div>
        </form>
      </div>
    );
  }
})

// for answering a question
export const AnswerQuestion = React.createClass({
  displayName: "AnswerQuestion",
  getInitialState: () => ({
    error: false,
    success: false,
    versionData: null,
    questionData: null,
    validation: {
      titleMin: 3,
      titleMax: 60,
      titleCount: 0,
      titleValid: false,
      bodyMin: 30,
      bodyMax: 2000,
      bodyCount: 0,
      bodyValid: false
    }
  }),
  submit(e) {
    e.preventDefault();
    const {
      auth,
      userData,
      fireRef,
      overlay,
      questionID,
      versionData,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      questionData
    } = this.state;
    const {
      title,
      body,
    } = this.refs;
    let answerObject = {
      "username": userData.name,
      "body": body.value,
      "questionID": questionID,
      "date": new Date().getTime(),
      "sentStatuses": {
        "email": false,
        "notification": false
      },
      "version": this.state.versionData,
    };
    if(!this.state.validation.bodyValid) return;
    // return console.log("question object:", answerObject);
    // write answer to `answers` node
    fireRef.answersRef
    .child(questionID)
    .setWithPriority(answerObject, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));
    // write answer reference to user account
    fireRef.usersRef
    .child(questionData.receiver)
    .child("answersFromMe")
    .child(questionID)
    .setWithPriority(answerObject.date, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));

    // send notification
    // create notif obejct
    let notifObject = {
      type: "newAnswer",
      info: {
        sender: userData.name,
        questionID: questionID,
        questionURL: `/profile/${userData.name}/q/${questionID}`
      },
      read: false,
      date: new Date().getTime(),
      version: versionData
    };
    // send notif
    fireRef.notificationsRef
    .child(questionData.creator)
    .push()
    .set(notifObject)
    .catch(e => console.error(e.val ? e.val() : e));

    // close the pop up
    this.setState({
      success: true
    }, () => {
      setTimeout(() => {
        this.props.methods.popUpHandler("close")
      }, 2000)
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
  componentDidMount() {
    const {
      questionID,
      fireRef,
      methods: {
        popUpHandler
      }
    } = this.props;
    getQuestionData(questionID, fireRef, null, questionData => {
      console.log("got question data", questionData);
      getAnswerData(questionID, fireRef, null, answerData => {
        console.log("got answer data", answerData);

        if(answerData) {
          popUpHandler("viewQuestion", {
            questionID
          });
        } else {
          this.setState({
            questionData
          });
        }
      });
    })
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
    } = this.props;
    const {
      success,
      error,
      questionData
    } = this.state;
    if(!versionData || !fireRef) {
      return (
        <div className={`overlay-ui-default answer-question${overlay === "answerQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Preparing form...
          </div>
        </div>
      );
    }
    if(error) {
      return (
        <div className={`overlay-ui-default answer-question${overlay === "answerQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            There was an issue preparing the form :(
          </div>
        </div>
      );
    } else
    if(success) {
      return (
        <div className={`overlay-ui-default answer-question${overlay === "answerQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Question submitted to {questionData.creator} successfully!
          </div>
        </div>
      );
    } else
    if(questionData) {
      return (
        <div className={`overlay-ui-default answer-question${overlay === "answerQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
          <div className="title">
            Answer {questionData.creator}'s Question To You
          </div>
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="scroll">
            <form onSubmit={this.submit}>
              <div className="section">
                <label>
                  <div className="label title bold">{questionData.title}</div>
                  <div className="separator-1-black" />
                  <div className="label body"><p>{questionData.body}</p></div>
                </label>
              </div>
              <div className="separator-4-dim" />
              <div className="section">
                <label>
                  <div className="label bold">What's Your Answer?</div>
                  <textarea ref="body" className={`${this.state.validation["bodyValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "body")}/>
                  <div>{this.state.validation["bodyCount"]}/<span className={`${this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : ""}`}>{this.state.validation["bodyMin"]}</span>-<span className={`${this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : ""}`}>{this.state.validation["bodyMax"]}</span></div>
                </label>
              </div>
              <div className="section">
                <button className="submit btn-default">Submit</button>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`overlay-ui-default answer-question${overlay === "answerQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            No question data
          </div>
        </div>
      );
    }
  }
})

// for viewing a question
export const ViewQuestion = React.createClass({
  displayName: "ViewQuestion",
  getInitialState: () => ({
    questionData: null,
    answerData: null,
    comments: null
  }),
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
  initListener() {
    // console.log("initiating comment listener");
    const {
      questionID,
      fireRef
    } = this.props;

    fireRef.commentsRef
    .child(questionID)
    .orderByChild("reply")
    .equalTo(false)
    .on("child_added", this.newComment);
  },
  componentDidMount() {
    const {
      questionID,
      fireRef
    } = this.props;

    // console.log("viewing", this.props);

    // get question data
    getQuestionData(questionID, fireRef, null, questionData => {
      this.setState({
        questionData
      });
    });
    getAnswerData(questionID, fireRef, null, answerData => {
      this.setState({
        answerData
      });
    });
    getCommentsData(questionID, fireRef, refNode => {
      return refNode.orderByChild("reply")
      .equalTo(false);
    }, commentsData => {
      // console.log("got commentsData", commentsData);
      this.setState({
        comments: commentsData
      }, this.initListener);
    });
  },
  componentWillUnmount() {
    const {
      fireRef
    } = this.props;

    fireRef.commentsRef
    .child(this.props.questionID)
    .orderByChild("reply")
    .equalTo(false)
    .off("child_added", this.newComment)
  },
  render() {
    // console.log(this.props);
    const {
      auth,
      overlay,
      fireRef,
      questionID,
      userData,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      questionData,
      answerData,
    } = this.state;
    const { comments } = this.state;
    const commentList = Object.keys(comments || {}).map(commentID => {
      const commentData = comments[commentID];
      return (
        <CommentItem auth={auth} key={commentID} commentID={commentID} commentData={commentData} questionID={questionID} questionData={questionData} fireRef={fireRef} userData={userData} />
      );
    });

    if(questionData && answerData) {
      return (
        <div className={`overlay-ui-default view-question${overlay === "viewQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
          <div className="title">
            {questionData.creator}'s Question To {questionData.receiver}
          </div>
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="separator-4-dim" />
          <div className="scroll">
            <div className="title sub">
              Question:
            </div>
            <div className="section">
              <label>
                <div className="label title bold">{questionData.title}</div>
                <div className="separator-1-black" />
                <div className="label">{questionData.body}</div>
              </label>
              <label className="vote">
                <VoteTool {...{ place: "question", auth: auth, questionID, questionData, fireRef, userData }} />
              </label>
            </div>
            <div className="separator-4-dim" />
            <div className="title sub">
              Answer:
            </div>
            <div className="section">
              <label>
                <div className="label"><p>{answerData.body}</p></div>
              </label>
              <label className="vote">
                <VoteTool {...{ place: "answer", auth: auth, questionID, questionData, fireRef, userData }} />
              </label>
            </div>
            <div className="separator-4-dim" />
            <div className="title sub">
              Comments:
            </div>
            <div className="section">
              <label>
                <CommentTool {...this.props} questionData={questionData} />
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
        <div className={`overlay-ui-default view-question${overlay === "viewQuestion" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            No question data
          </div>
        </div>
      );
    }
  }
})


// for viewing a list of created questions
const QuestionItem = React.createClass({
  displayName: "QuestionItem",
  getInitialState: () => ({
    answerData: null
  }),
  componentDidMount() {
    const {
      questionID,
      fireRef
    } = this.props;
    getAnswerData(questionID, fireRef, null, answerData => {
      console.log("got answer data");
      this.setState({
        answerData
      });
    });
  },
  render() {
    const {
      questionID,
      questionData,
      locations,
      methods: {
        popUpHandler
      }
    } = this.props;

    const {
      answerData
    } = this.state;

    return (
      <div className="question-item">
        {
          answerData ? (
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
          ) : (
            <label>
              <a className="name" href="#">{questionData.title}</a><span className="">&#x2716;</span>
            </label>
          )
        }
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

export const ViewAskedQuestions = React.createClass({
  displayName: "ViewAskedQuestions",
  getInitialState: () => ({
    questionData: null,
    answerData: null,
    toggle: "asked"
  }),
  componentDidMount() {
    const {
      fireRef,
      userData
    } = this.props;

    fireRef.questionsRef
    .orderByChild("creator")
    .equalTo(userData.name)
    .once("value")
    .then(snap => {
      const questionData = snap.val();
      this.setState({
        questionData
      });
    });
    fireRef.answersRef
    .orderByChild("username")
    .equalTo(userData.name)
    .once("value")
    .then(snap => {
      const answerData = snap.val();
      this.setState({
        answerData
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
      questionData,
      answerData,
      toggle
    } = this.state;

    const data = toggle === "asked" ? questionData : answerData;
    const Component = toggle === "asked" ? QuestionItem : AnswerItem;

    const list = data ? Object.keys(data).map(questionID => {
      const thisData = data[questionID]
      return (
        <Component key={questionID} {...{
          fireRef,
          questionID,
          questionData: thisData,
          AnswerData: thisData,
          location,
          methods
        }} />
      );
    }) : [];

    return (
      <div className={`overlay-ui-default view-questions open`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="tabs">
          <div className="asked" onClick={this.toggleView.bind(null, "asked")}>Asked</div>
          |
          <div className="answered" onClick={this.toggleView.bind(null, "answered")}>Answered</div>
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="title">
          Questions You've {toggle.replace(/^(.)/, (_, letter) => letter.toUpperCase())}
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="section">
          <div className="list">
          {list.length > 0 ? list : "You haven't asked any questions yet."}
          </div>
        </div>
      </div>
    );
  }
});
