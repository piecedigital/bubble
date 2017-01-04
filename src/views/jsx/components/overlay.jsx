import React from "react";
import { AskQuestion } from "./question-tools.jsx";

export default React.createClass({
  displayName: "Overlay",
  render() {
    // console.log("overlay", this.props);
    const {
      auth,
      fireRef,
      overlay,
      askQuestion,
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
      </div>
    );
  }
})
