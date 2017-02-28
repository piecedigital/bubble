import React from "react";
import firebase from "firebase";

// poll creation related components

export const Feedback = React.createClass({
  displayName: "MakePoll",
  getInitialState: () => ({
    validation: {
      nameMin: 3,
      nameMax: 60,
      nameCount: 0,
      nameValid: false,

      emailRegex: new RegExp("^([a-z0-9]*)(\\.[a-z0-9]*)?(@[a-z0-9]*\\.[a-z0-9]*)(\\.[a-z0-9]*)?"),
      emailValid: true,

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
      versionData,
      methods: {
        popUpHandler
      }
    } = this.props;

    const feedback = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      title: this.refs.title.value,
      body: this.refs.body.value,
      date: Date.now(),
      version: versionData
    }

    // return console.log(feedback);
    if(
      this.state.validation.nameValid &&
      this.state.validation.emailValid &&
      this.state.validation.titleValid &&
      this.state.validation.bodyValid
    ) {
      let ref = fireRef
      .feedbackRef
      .push()
      .set(feedback);
    } else {
      return;
    }

    // close the pop up
    this.setState({
      success: true
    }, () => {
      setTimeout(() => {
        this.props.methods.popUpHandler("close");
      }, 2000);
    });
  },
  validate(name, e) {
    // name will be the same as a referenced element
    // the name will be used to be validated, matched with a variable "suffix"
    if(name === "email") {
      let value = e.target.value;
      let thisRegex = this.state.validation[`${name}Regex`];
      let thisValid = `${name}Valid`;
      this.setState({
        validation: Object.assign(this.state.validation, {
          [thisValid]: !value || !!value.match(thisRegex),
        })
      }, () => {
        // console.log(name, this.state.validation[thisValid])
      });
    } else {
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
      }, () => {
        // console.log(name, this.state.validation[thisCount], this.state.validation[thisValid], thisMin, thisMax)
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

    if(!versionData || !fireRef) {
      return (
        <div className={`overlay-ui-default feedback${overlay === "feedback" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Preparing form...
          </div>
        </div>
      );
    }
    if(error) {
      return (
        <div className={`overlay-ui-default feedback${overlay === "feedback" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            There was an issue preparing the form :(
          </div>
        </div>
      );
    } else
    if(success) {
      return (
        <div className={`overlay-ui-default feedback${overlay === "feedback" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
          <div className="title">
            Your feedback was submitted successfully!
          </div>
        </div>
      );
    } else
    return (
      <div className={`overlay-ui-default feedback${overlay === "feedback" ? " open" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="close" onClick={popUpHandler.bind(null, "close")}>x</div>
        <div className="title">
          Submit Your Feedback
        </div>
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="separator-4-dim" />
        <div className="scroll">
          <form onSubmit={this.submit}>
            <div className="section">
              <label>
                <div className="label bold">Name</div>
                <input type="text" ref="name" className={`${this.state.validation["nameValid"] ? "valid" : "invalid"}`} onChange={this.validate.bind(null, "name")}/>
                <div>{this.state.validation["nameCount"]}/<span className={`${this.state.validation["nameCount"] < this.state.validation["nameMin"] ? "color-red" : ""}`}>{this.state.validation["nameMin"]}</span>-<span className={`${this.state.validation["nameCount"] > this.state.validation["nameMax"] ? "color-red" : ""}`}>{this.state.validation["nameMax"]}</span></div>
              </label>
            </div>
            <div className="separator-1-dim" />
            <div className="section">
              <label>
                <div className="label bold">email (optional)</div>
                <input type="text" ref="email" className={`${this.state.validation["emailValid"] ? "valid" : "invalid"}`} onChange={this.validate.bind(null, "email")}/>
              </label>
            </div>
            <div className="separator-1-dim" />
            <div className="section">
              <label>
                <div className="label bold">Title/Intro</div>
                <input type="text" ref="title" className={`${this.state.validation["titleValid"] ? "valid" : "invalid"}`} onChange={this.validate.bind(null, "title")}/>
                <div>{this.state.validation["titleCount"]}/<span className={`${this.state.validation["titleCount"] < this.state.validation["titleMin"] ? "color-red" : ""}`}>{this.state.validation["titleMin"]}</span>-<span className={`${this.state.validation["titleCount"] > this.state.validation["titleMax"] ? "color-red" : ""}`}>{this.state.validation["titleMax"]}</span></div>
              </label>
            </div>
            <div className="separator-1-dim" />
            <div className="section">
              <label>
                <div className="label bold">What's Your Feedback?</div>
                <textarea ref="body" className={`${this.state.validation["bodyValid"] ? "valid" : "invalid"}`} onChange={this.validate.bind(null, "body")}/>
                <div>{this.state.validation["bodyCount"]}/<span className={`${this.state.validation["bodyCount"] < this.state.validation["bodyMin"] ? "color-red" : ""}`}>{this.state.validation["bodyMin"]}</span>-<span className={`${this.state.validation["bodyCount"] > this.state.validation["bodyMax"] ? "color-red" : ""}`}>{this.state.validation["bodyMax"]}</span></div>
              </label>
            </div>
            <div className="separator-1-dim" />
            <div className="section">
              <button className="submit btn-default">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
});
