import React from "react";

export default React.createClass({
  displayName: "SideTools",
  capitalize(string) {
    return string.toLowerCase().split(" ").map(word => word.replace(/^(\.)/, (_, l) => {
      return l.toUpperCase();
    })).join(" ");
  },
  render() {
    const {
      refresh,
      refreshList,
      gatherData,
      applyFilter,
      loadingData,
      locked,
      lockedTop
    } = this.props;
    return (
      <div ref="tools" className={`tools${lockedTop ? " locked-top" : locked ? " locked" : ""}`}>
        <div className="parent">
          <div className="scroll">
            {
              refresh ? (
                <div className="option btn-default refresh" onClick={refresh}>
                  Refresh Streams
                </div>
              ) : null
            }
            {
              refreshList ? (
                <div className="option btn-default refresh" onClick={() => refreshList(true)}>
                  Refresh Listing
                </div>
              ) : null
            }
            {
              gatherData ? (
                <div className={`option btn-default load-more${loadingData ? " bg-color-dimmer not-clickable" : ""}`} onClick={loadingData ? null : gatherData}>
                  {loadingData ? "Loading More" : "Load More"}
                </div>
              ) : null
            }
            {
              applyFilter ? (
                <div className="option btn-default filters">
                  <div className="filter-status">
                    <label htmlFor="filter-select">
                      Show
                    </label>
                    <select id="filter-select" className="" ref="filterSelect" onChange={applyFilter} defaultValue="all">
                      {
                        ["all", "online", "offline"].map(filter => {
                          return (
                            <option key={filter} value={filter}>Show {capitalize(filter)}</option>
                          );
                        })
                      }
                    </select>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
})
