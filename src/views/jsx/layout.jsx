import React from "react";

export default React.createClass({
  displayName: "Home",
  render() {
    return (
      <div>
        <nav>NAVIGATION ELEMENT</nav>
        {
          this.props.children && React.cloneElement(this.props.children)
        }
      </div>
    )
  }
});
