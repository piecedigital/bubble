import React from "react";
import Featured from "./components/featured-streams.jsx";
import Games from "./components/top-games.jsx";

export default React.createClass({
  displayName: "Home",
  getInitialState() {
    return {}
  },
  render() {
    const {
      methods: {
        loadData,
        appendStream
      }
    } = this.props;
    return (
      <div className="home-page">
        <Featured methods={{
          appendStream,
          loadData
        }} />
        <Games methods={{
          loadData
        }}/>
      </div>
    );
  }
})
