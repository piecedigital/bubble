import React from "react";
import { browserHistory as History } from "react-router";
import { AskQuestion, AnswerQuestion, ViewQuestion, ViewAskedQuestions } from "./question-tools.jsx";
import { ViewBookmarks } from "./bookmark-tools.jsx";
import { ViewNotifications } from "./notification-tools.jsx";
import { MakePoll, VotePoll, ViewPoll, ViewCreatedPolls } from "./poll-tools.jsx";
import { ViewGameQueue } from "./game-queue-tools.jsx";
import { ViewSyncLobby } from "./sync-lobby-tools.jsx";
import { Feedback } from "./feedback-tools.jsx";
import { StreamReorderer } from "./stream-reorder-tools.jsx";

const components = {
  "askQuestion": AskQuestion,
  "answerQuestion": AnswerQuestion,
  "viewQuestion": ViewQuestion,
  "viewAskedQuestions": ViewAskedQuestions,
  "viewBookmarks": ViewBookmarks,
  "viewNotifications": ViewNotifications,
  "makePoll": MakePoll,
  "votePoll": VotePoll,
  "viewPoll": ViewPoll,
  "viewCreatedPolls": ViewCreatedPolls,
  "viewGameQueue": ViewGameQueue,
  "viewSyncLobby": ViewSyncLobby,
  "feedback": Feedback,
  "streamReorderer": StreamReorderer,
};

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
      streamersInPlayer,
      streamOrderMap,
      params,
      location,
      methods,
      methods: {
        popUpHandler,
      }
    } = this.props;
    let Component = components[overlay] || null;
    // console.log(overlay, components, Component);
    if(!fireRef) return null;
    if(!userData) {
      // with the correct case we wont require the user to be logged in
      switch (overlay) {
        case "viewQuestion":
        case "viewPoll":
        case "viewGameQueue":
        case "viewSyncLobby":
        case "feedback":
        case "streamReorderer":
          Component = Component;
        break;
        default:
          Component = null;
      }
    }
    return (
      <div className={`overlay${Component ? " open" : ""}`} onClick={popUpHandler.bind(null, "close")}>
        {
          function () {
            return Component ? (
              <Component
                auth={auth}
                overlay={overlay}
                {...overlayState}
                fireRef={fireRef}
                versionData={versionData}
                streamersInPlayer={streamersInPlayer}
                streamOrderMap={streamOrderMap}
                params={params}
                location={location}
                userData={userData}
                methods={methods} />
            ) : null
          }()
        }
      </div>
    );
  }
})
