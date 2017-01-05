import React from "react";
import { ajax } from "../../../modules/ajax";
import firebase from "firebase";

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
      date: {
        "UTCTime": new Date().getTime()
      },
      sentStatuses: {
        "email": false,
        "notification": true
      },
      version: this.state.versionData,
      rating: {}
    };
    // console.log("question object:", questionObject);
    // write question to `questions` node
    let questionID = fireRef.root.push().getKey();
    // console.log(questionID);
    fireRef.questionsRef
    .child(questionID)
    .set(questionObject)
    .catch(e => console.error(e.val ? e.val() : e));
    // write question ID reference to user.<username>.questionsForMe
    fireRef.usersRef
    .child(`${to}/questionsForMe`)
    .set({
      [questionID]: true
    })
    .catch(e => console.error(e.val ? e.val() : e));
    // write question ID reference to user.<username>.questionsForThem
    fireRef.usersRef
    .child(`${from}/questionsForThem`)
    .set({
      [questionID]: true
    })
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
    if(!versionData) {
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
        <div className="separator-4-dimmer" />
        <div className="separator-4-dimmer" />
        <div className="separator-4-dimmer" />
        <div className="separator-4-dimmer" />
        <form onSubmit={this.submit}>
          <div className="section">
            <span className="label">To: </span>
            <span className="to">{to}</span>
          </div>
          <div className="separator-1-dimmer" />
          <div className="section">
            <label>
              <div className="label bold">Title/Intro</div>
              <input type="text" ref="title" className={`${this.state.validation["titleValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "title")}/>
              <div>{this.state.validation["titleCount"]}/<span className={`${this.state.validation["titleCount"] < this.state.validation["titleMin"] ? "color-red" : ""}`}>{this.state.validation["titleMin"]}</span>-<span className={`${this.state.validation["titleCount"] > this.state.validation["titleMax"] ? "color-red" : ""}`}>{this.state.validation["titleMax"]}</span></div>
            </label>
          </div>
          <div className="separator-1-dimmer" />
          <div className="section">
            <label>
              <div className="label bold">What Do You Have To Ask?</div>
              <textarea ref="body" className={`${this.state.validation["bodyValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "body")}/>
              <div>{this.state.validation["bodyCount"]}/<span className={`${this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : ""}`}>{this.state.validation["bodyMin"]}</span>-<span className={`${this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : ""}`}>{this.state.validation["bodyMax"]}</span></div>
            </label>
          </div>
          <button>Submit</button>
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
      date: {
        "UTCTime": new Date().getTime()
      },
      sentStatuses: {
        "email": false,
        "notification": true
      },
      version: this.state.versionData,
      rating: {}
    };
    // console.log("question object:", questionObject);
    // write question to `questions` node
    let questionID = fireRef.root.push().getKey();
    // console.log(questionID);
    fireRef.questionsRef
    .child(questionID)
    .set(questionObject)
    .catch(e => console.error(e.val ? e.val() : e));
    // write question ID reference to user.<username>.questionsForMe
    fireRef.usersRef
    .child(`${to}/questionsForMe`)
    .set({
      [questionID]: true
    })
    .catch(e => console.error(e.val ? e.val() : e));
    // write question ID reference to user.<username>.questionsForThem
    fireRef.usersRef
    .child(`${from}/questionsForThem`)
    .set({
      [questionID]: true
    })
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
    console.log(this.props);
    const {
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
    if(!versionData) {
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
            Question submitted to {to} successfully!
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
          <div className="separator-4-dimmer" />
          <div className="separator-4-dimmer" />
          <div className="separator-4-dimmer" />
          <div className="separator-4-dimmer" />
          <form onSubmit={this.submit}>
            <div className="section">
              <label>
                <div className="label bold">{questionData.title}</div>
                <div className="separator-1-dimmer" />
                <div className="label">{questionData.body}</div>
              </label>
            </div>
            <div className="separator-1-dimmer" />
            <div className="section">
              <label>
                <div className="label bold">What's Your Answer?</div>
                <textarea ref="body" className={`${this.state.validation["bodyValid"] ? " valid" : ""}`} onChange={this.validate.bind(null, "body")}/>
                <div>{this.state.validation["bodyCount"]}/<span className={`${this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : ""}`}>{this.state.validation["bodyMin"]}</span>-<span className={`${this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : ""}`}>{this.state.validation["bodyMax"]}</span></div>
              </label>
            </div>
            <button>Submit</button>
          </form>
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
