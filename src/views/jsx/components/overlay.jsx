import React from "react";
import { browserHistory as History } from "react-router";
import { AskQuestion, AnswerQuestion, ViewQuestion } from "./question-tools.jsx";
import { ViewBookmarks } from "./bookmark-tools.jsx";

export default React.createClass({
  displayName: "Overlay",
  render() {
    // console.log("overlay", this.props);
    const {
      auth,
      userData,
      versionData,
      fireRef,
      overlay,
      overlayState,
      methods,
      params,
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
              case "viewBookmarks":
                Component = ViewBookmarks
                break;
              default:
                Component = null
            }
            return Component ? (
              <Component
              overlay={overlay}
              {...overlayState}
              fireRef={fireRef}
              versionData={versionData}
              auth={auth}
              params={params}
              userData={userData}
              methods={methods}/>
            ) : null
          }()
        }
      </div>
    );
  }
})
