import React from "react";

const Panel = React.createClass({
  displayName: "Panel",
  render() {
    const {
      data
    } = this.props;
    console.log("PANEL", data);
    let content = (
      <div className="wrapper">
        {
          data.data.title || "Fake Title" ? (
            <div className="pad">
              <div className="title">
                {data.data.title || "Fake Title"}
              </div>
            </div>
          ) : null
        }
        {
          data.data.image ? (
            data.data.link ? (
              <a href={data.data.link}>
                <div className="image">
                  <img src={data.data.image} />
                </div>
              </a>
            ) : (
              <div className="image">
                <img src={data.data.image} />
              </div>
            )
          ) : null
        }
        <div className="pad">
          {
            data.html_description ? (
              <div className="description" dangerouslySetInnerHTML={{ __html: data.html_description }} />
            ) : null
          }
        </div>
      </div>
    );
    return (
      <div className="panel">
        {content}
      </div>
    );
  }
});

export default React.createClass({
  displayName: "StreamPanels",
  render() {
    const {
      panelData,
      methods: {
        panelsHandler
      }
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
          <div className="tools">
            <div className="option btn-default close" onClick={panelsHandler}>Close</div>
          </div>
        </div>
      </div>
    );
  }
});
