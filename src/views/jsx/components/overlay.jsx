import React from "react";
import { browserHistory as History } from "react-router";
import { AskQuestion, AnswerQuestion, ViewQuestion } from "./question-tools.jsx";

export default React.createClass({
  displayName: "Overlay",
  render() {
    console.log("overlay", this.props);
    const {
      auth,
      userData,
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
        {
          function () {
            let Component = null
            switch (overlay) {
              case "askQuestion":
                Component = AskQuestion
                break;
              case "answerQuestion":
                Component = AnswerQuestion
                break;
              case "viewQuestion":
                Component = ViewQuestion
                break;
              default:
                Component = null
            }
            return Component ? (
              <Component
              overlay={overlay}
              askQuestion={askQuestion}
              answerQuestion={answerQuestion}
              viewQuestion={viewQuestion}
              fireRef={fireRef}
              auth={auth}
              userData={userData}
              methods={methods}/>
            ) : null
          }()
        }
      </div>
    );
  }
})
