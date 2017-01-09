import React from "react";
import firebase from "firebase";
import VoteTool from "./vote-tool.jsx";
import { ajax } from "../../../modules/ajax";

export const AskQuestion = React.createClass({
  displayName: "AskQuestion",
  getInitialState: () => ({
    error: false,
    success: false,
    versionData: null,
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
      askQuestion: {
        to,
        from
      },
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
      myAuth: !!auth.access_token,
      creator: from,
      receiver: to,
      title: title.value,
      body: body.value,
      date: new Date().getTime(),
      sentStatuses: {
        "email": false,
        "notification": false
      },
      version: this.state.versionData
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
  componentDidMount() {
    // console.log("question tools mounted", this.props);
    ajax({
      url: "/get-version",
      success: (data) => {
        this.setState({
          versionData: JSON.parse(data)
        });
      },
      error: (err) => {
        console.error(err);
        this.setState({
          error: true
        });
      }
    })
  },
  render() {
    // console.log(this.props);
    const {
      fireRef,
      overlay,
      askQuestion: {
        to,
        from,
        body
      },
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      success,
      error,
      versionData
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

export const AnswerQuestion = React.createClass({
  displayName: "AnswerQuestion",
  getInitialState: () => ({
    error: false,
    success: false,
    versionData: null,
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
      answerQuestion: {
        questionData,
        answerData
      },
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      title,
      body,
    } = this.refs;
    let answerObject = {
      "myAuth": !!auth.access_token,
      "username": userData.name,
      "body": body.value,
      "questionID": questionData.questionID,
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
    .child(questionData.questionID)
    .setWithPriority(answerObject, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));
    // write answer reference to user account
    fireRef.usersRef
    .child(questionData.receiver)
    .child("answersFromMe")
    .child(questionData.questionID)
    .setWithPriority(answerObject.date, 0 - Date.now())
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
    // console.log("question tools mounted", this.props);
    ajax({
      url: "/get-version",
      success: (data) => {
        this.setState({
          versionData: JSON.parse(data)
        });
      },
      error: (err) => {
        console.error(err);
        this.setState({
          error: true
        });
      }
    })
  },
  render() {
    // console.log(this.props);
    const {
      fireRef,
      overlay,
      answerQuestion: {
        questionData,
        answerData,
      },
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      success,
      error,
      versionData
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

export const CommentTool = React.createClass({
  displayName: "CommentTool",
  getInitialState: () => ({
    error: false,
    success: false,
    versionData: null,
    validation: {
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

      commentID,
      viewQuestion: {
        questionData,
        answerData
      },
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      title,
      body,
    } = this.refs;

    let commentObject = {
      "myAuth": !!auth.access_token,
      "username": userData.name,
      // to be truthy only if this is a comment reply
      "reply": !!commentID,
      "commentID": commentID || null,
      //----------------------------------------
      "body": body.value,
      "questionID": questionData.questionID,
      "date": new Date().getTime(),
      "sentStatuses": {
        "email": false,
        "notification": false
      },
      "version": this.state.versionData,
    };
    if(!this.state.validation.bodyValid) return;
    // return console.log("comment object:", commentObject);
    // write answer to `answers` node
    fireRef.commentsRef
    .push()
    .setWithPriority(commentObject, 0 - Date.now())
    .catch(e => console.error(e.val ? e.val() : e));

    // close the pop up
    this.setState({
      success: true
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
    // console.log("question tools mounted", this.props);
    ajax({
      url: "/get-version",
      success: (data) => {
        this.setState({
          versionData: JSON.parse(data)
        });
      },
      error: (err) => {
        console.error(err);
        this.setState({
          error: true
        });
      }
    });
  },
  render() {
    const {
      fireRef,
      commentData,
    } = this.props;
    const {
      versionData
    } = this.state;
    if(!versionData || !fireRef) {
      return (
        <form onSubmit={this.submit}>
          <div className="section bold">
            Preparing Form...
          </div>
        </form>
      );
    }
    return (
      <form onSubmit={this.submit}>
        <div className="section bold">
          Leave a comment
        </div>
        <div className="section">
          <label>
            <textarea ref="body" className={`${this.state.validation["bodyValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "body")}/>
            <div>{this.state.validation["bodyCount"]}/<span className={`${this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : ""}`}>{this.state.validation["bodyMin"]}</span>-<span className={`${this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : ""}`}>{this.state.validation["bodyMax"]}</span></div>
          </label>
        </div>
        <div className="section">
          <button className="submit btn-default">Submit</button>
        </div>
      </form>
    );
  }
});

const CommentItem = React.createClass({
  displayName: "CommentItem",
  render() {
    const {
      commentID,
      commentData,
      voteToolData
    } = this.props;

    console.log("commentitem", commentID);
    return (
      <div className="section">
        <label className="comment">
          <div className="label"><p>{commentData.body}</p></div>
          {
            // <div className="tools">
            //   <div className="tool reply">
            //     Reply
            //   </div>
            // </div>
          }
        </label>
        {
          voteToolData ? (
            <label className="vote">
              <VoteTool {...Object.assign(voteToolData, { place: "comment", commentData, commentID })} />
            </label>
          ) : null
        }
      </div>
    );
  }
})

export const ViewQuestion = React.createClass({
  displayName: "ViewQuestion",
  getInitialState: () => ({
    comments: null
  }),
  newComment(snap) {
    const commentKey = snap.getKey();
    const commentData = snap.val();
    let newComments = JSON.parse(JSON.stringify(this.state.comments));
    // console.log("new comment", commentKey, commentData);
    this.setState({
      comments: Object.assign(newComments || {}, {
        [commentKey]: commentData
      })
    });
  },
  componentDidMount() {
    const {
      fireRef
    } = this.props;
    // console.log("yeah, view question mounted");
    fireRef.commentsRef
    .orderByChild("reply")
    .equalTo(false)
    .once("value")
    .then(snap => {
      this.setState({
        comments: snap.val()
      })
    })

    fireRef.commentsRef
    .orderByChild("reply")
    .equalTo(false)
    .on("child_added", this.newComment)
  },
  componentWillUnmount() {
    const {
      fireRef
    } = this.props;

    fireRef.commentsRef
    .orderByChild("reply")
    .equalTo(false)
    .off("child_added", this.newComment)
  },
  render() {
    // console.log(this.props);
    const {
      overlay,
      viewQuestion: {
        questionData,
        answerData,
        voteToolData
      },
      methods: {
        popUpHandler
      }
    } = this.props;
    const { comments } = this.state;
    const commentList = Object.keys(comments || {}).map(commentID => {
      const commentData = comments[commentID];
      return (
        <CommentItem key={commentID} commentID={commentID} commentData={commentData} voteToolData={voteToolData} />
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
              {
                voteToolData ? (
                  <label className="vote">
                    <VoteTool {...Object.assign(voteToolData, { place: "question" })} />
                  </label>
                ) : null
              }
            </div>
            <div className="separator-4-dim" />
            <div className="title sub">
              Answer:
            </div>
            <div className="section">
              <label>
                <div className="label"><p>{answerData.body}</p></div>
              </label>
              {
                voteToolData ? (
                  <label className="vote">
                    <VoteTool {...Object.assign(voteToolData, { place: "answer" })} />
                  </label>
                ) : null
              }
            </div>
            <div className="separator-4-dim" />
            <div className="title sub">
              Comments:
            </div>
            <div className="section">
              <label>
                <CommentTool {...this.props} />
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
