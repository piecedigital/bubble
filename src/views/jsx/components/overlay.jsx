import React from "react";
import { AskQuestion, AnswerQuestion, ViewQuestion } from "./question-tools.jsx";

export default React.createClass({
  displayName: "Overlay",
  render() {
    // console.log("overlay", this.props);
    const {
      auth,
      fireRef,
      overlay,
      askQuestion,
      answerQuestion,
      viewQuestion,
      methods,
      methods: {
        popUpHandler
      }
    } = this.props;
    return (
      <div className={`overlay${overlay ? " open" : ""}`} onClick={popUpHandler.bind(null, "close")}>
        <AskQuestion
        overlay={overlay}
        askQuestion={askQuestion}
        fireRef={fireRef}
        auth={auth}
        methods={methods}/>
        <AnswerQuestion
        overlay={overlay}
        answerQuestion={answerQuestion}
        fireRef={fireRef}
        auth={auth}
        methods={methods}/>
      </div>
    );
  }
})
