import React from "react";

export default React.createClass({
  displayName: "Home",
  render() {
    return (
      <h1>Hello {this.props.data.who}</h1>
    )
  }
})
