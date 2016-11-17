import React from "react";

const Panel = React.createClass({
  displayName: "Panel",
  render() {
    const {
      data
    } = this.props;
    console.log("PANEL", data);
    return (
      <div className="panel">
        One Panel
      </div>
    );
  }
});

export default React.createClass({
  displayName: "StreamPanels",
  render() {
    const {
      panelData
    } = this.props;

    return (
      <div className="stream-panels">
        <div className="wrapper">
          <div className="list">
            {
              panelData.map(data => (
                <Panel data={data} />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
});
