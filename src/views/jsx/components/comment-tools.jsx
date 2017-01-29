import React from "react";
import firebase from "firebase";
import { Link } from 'react-router';
import { calculateRatings,
getQuestionData,
getAnswerData,
getRatingsData,
getCommentsData } from "../../../modules/client/helper-tools";
import VoteTool from "./vote-tool.jsx";
import { ajax } from "../../../modules/client/ajax";

export const CommentTool = React.createClass({
  displayName: "CommentTool",
  getInitialState: () => ({
    error: false,
    success: false,
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
      versionData,
      // if question post
      questionID,
      questionData,
      // if poll post
      pollID,
      pollData,
      commentID,
      methods: {
        popUpHandler
      }
    } = this.props;
    const {
      title,
      body,
    } = this.refs;

    // if for a question post
    if(questionID) {
      let commentObject = {
        "username": userData.name,
        // to be truthy only if this is a comment reply
        "reply": !!commentID,
        "commentID": commentID || null,
        //----------------------------------------
        "body": body.value,
        questionID,
        "date": new Date().getTime(),
        "sentStatuses": {
          "email": false,
          "notification": false
        },
        "version": versionData,
      };
      if(!this.state.validation.bodyValid) return;
      console.log("comment object:", commentObject);
      // write answer to `answers` node
      fireRef.commentsRef
      .child(questionID)
      .push()
      .setWithPriority(commentObject, 0 - Date.now())
      .catch(e => console.error(e.val ? e.val() : e));
      body.value = "";

      // send notification
      // create notif obejct
      let notifObject = {
        type: "newQuestionComment",
        info: {
          sender: userData.name,
          questionID: questionID,
          questionURL: `/profile/${questionData.receiver}/q/${questionID}`
        },
        read: false,
        date: new Date().getTime(),
        version: versionData
      };
      // send notif
      // to creator
      if(questionData.creator !== userData.name) {
        fireRef.notificationsRef
        .child(questionData.creator)
        .push()
        .set(notifObject)
        .catch(e => console.error(e.val ? e.val() : e));
      }
      // to receiver
      if(questionData.receiver !== userData.name) {
        fireRef.notificationsRef
        .child(questionData.receiver)
        .push()
        .set(notifObject)
        .catch(e => console.error(e.val ? e.val() : e));
      }
    }

    // if for a poll post
    if(pollID) {
      let commentObject = {
        "username": userData.name,
        // to be truthy only if this is a comment reply
        "reply": !!commentID,
        "commentID": commentID || null,
        //----------------------------------------
        "body": body.value,
        pollID,
        "date": new Date().getTime(),
        "sentStatuses": {
          "email": false,
          "notification": false
        },
        "version": versionData,
      };
      if(!this.state.validation.bodyValid) return;
      console.log("comment object:", commentObject);
      // write answer to `answers` node
      fireRef.commentsRef
      .child(pollID)
      .push()
      .setWithPriority(commentObject, 0 - Date.now())
      .catch(e => console.error(e.val ? e.val() : e));
      body.value = "";

      // send notification
      // create notif obejct
      let notifObject = {
        type: "newPollComment",
        info: {
          sender: userData.name,
          pollID,
          pollURL: `/profile/${pollData.creator}/p/${pollID}`
        },
        read: false,
        date: new Date().getTime(),
        version: versionData
      };
      // send notif
      // to creator
      if(pollData.creator !== userData.name) {
        fireRef.notificationsRef
        .child(pollData.creator)
        .push()
        .set(notifObject)
        .catch(e => console.error(e.val ? e.val() : e));
      }
    }
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
  render() {
    const {
      fireRef,
      commentData,
      versionData,
      userData,
    } = this.props;
    if(!versionData || !fireRef) {
      return (
        <form onSubmit={this.submit}>
          <div className="section bold">
            Preparing Form...
          </div>
        </form>
      );
    }
    if(!userData) {
      return (
        <form onSubmit={this.submit}>
          <div className="section bold">
            Login to leave a comment
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

export const CommentItem = React.createClass({
  displayName: "CommentItem",
  render() {
    const {
      auth,
      fireRef,
      userData,
      // for question comments
      questionID,
      questionData,
      // for poll comments
      pollID,
      pollData,
      commentID,
      commentData,
    } = this.props;

    // console.log("commentitem", commentID);
    return (
      <div className="section">
        <label className="comment">
          <div className="label">
            <div className="label username"><Link to={`/profile/${commentData.username}`}>{commentData.username}</Link></div>
            <p>{commentData.body}</p>
            </div>
          {
            // <div className="tools">
            //   <div className="tool reply">
            //     Reply
            //   </div>
            // </div>
          }
        </label>
        <label className="vote">
          <VoteTool {...{ place: "comment", auth: auth, questionID, questionData, pollID, pollData, commentID, commentData, fireRef, userData }} />
        </label>
      </div>
    );
  }
})
