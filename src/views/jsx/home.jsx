import React from "react";
import Featured from "./components/featured-streams.jsx";
import Games from "./components/top-games.jsx";

export default React.createClass({
  displayName: "Home",
  getInitialState() {
    // console.log("home", this.props.initState);
    return {}
  },
  render() {
    const {
      auth,
      userData,
      fireRef,
      versionData,

      initState,
      methods: {
        loadData,
        appendStream,
        popUpHandler
      }
    } = this.props;
    return (
      <div className="top-level-component home-page">
        <Featured
        auth={auth}
        userData={userData}
        fireRef={fireRef}
        versionData={versionData}
        initState={initState}
        methods={{
          appendStream,
          loadData,
          popUpHandler
        }} />
        <div className={`separator-4-black`}></div>
        <Games methods={{
          loadData
        }}/>
      </div>
    );
  }
})
