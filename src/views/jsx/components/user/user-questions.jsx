import React from "react";

export default React.createClass({
  displayName: "UserQuestions",
  getInitialState: () => ({
    questions: {},
    lastID: null
  }),
  getQuestions() {
    const {
      fireRef,
      userData,
      params,
    } = this.props;
    fireRef.usersRef
    .child(`${params.username}/questionsForMe`)
    .startAt(this.state.lastID)
    .limitToFirst(25)
    .once("value")
    .then(snap => {
      let questions = snap.val();
      // console.log("questions", questions);
      this.setState({
        questions,
        lastID: questions ? Object.keys(questions).pop() : null
      }, () => {
        console.log(this.state);
      });
    });
  },
  componentWillReceiveProps(nextProps) {
    // console.log("new props", this.props, nextProps);
    if(this.props.params.username !== nextProps.params.username) {
      this.setState({
        questions: {},
        lastID: null
      }, this.getQuestions);
    }
  },
  componentDidUpdate(prevProps) {
    const {
      fireRef,
      userData
    } = this.props;

    if(fireRef && prevProps.fireRef === null) {
      this.getQuestions();
    }
  },
  render() {
    return null;
  }
})
