import React from "react";
import { browserHistory as History } from "react-router";
import { AskQuestion, AnswerQuestion, ViewQuestion } from "./question-tools.jsx";
import { ViewBookmarks } from "./bookmark-tools.jsx";
import { ViewNotifications } from "./notification-tools.jsx";

const components = {
  "askQuestion": AskQuestion,
  "answerQuestion": AnswerQuestion,
  "viewQuestion": ViewQuestion,
  "viewBookmarks": ViewBookmarks,
  "viewNotifications": ViewNotifications
};

export default React.createClass({
  displayName: "Overlay",
  render() {
    console.log("overlay", this.props);
    const {
      auth,
      userData,
      versionData,
      fireRef,
      overlay,
      overlayState,
      methods,
      params,
      location,
      methods: {
        popUpHandler
      }
    } = this.props;
    return (
      <div className={`overlay${overlay ? " open" : ""}`} onClick={popUpHandler.bind(null, "close")}>
        {
          function () {
            let Component = components[overlay] || null;
            // console.log(components, Component);
            return Component ? (
              <Component
              overlay={overlay}
              {...overlayState}
              fireRef={fireRef}
              versionData={versionData}
              auth={auth}
              params={params}
              location={location}
              userData={userData}
              methods={methods}/>
            ) : null
          }()
        }
      </div>
    );
  }
})
