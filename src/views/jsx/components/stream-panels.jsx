import React from "react";

const Panel = React.createClass({
  displayName: "Panel",
  componentDidMount() {
    const { description: elem } = this.refs;

    // links in stream pannels don't open in a new tab, unless they are a panel link
    if(elem) {
      elem.addEventListener("click", e => {
        e.preventDefault();
        if( e.target.tagName.match(/a/i) ) {
          window.open(e.target.href, "_blank");
        }
      });
    }
  },
  render() {
    const {
      data
    } = this.props;
    // console.log("PANEL", data);
    let content = (
      <div className="wrapper">
        {
          data.data.title ? (
            <div className="pad">
              <div className="title">
                {data.data.title}
              </div>
            </div>
          ) : null
        }
        {
          data.data.image ? (
            data.data.link ? (
              <a href={data.data.link} rel="nofollow" target="_blank">
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
              <div ref="description" className="description" dangerouslySetInnerHTML={{ __html: data.html_description }} />
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
      <div className={`stream-panels${ panelData.length > 0 ? "" : " empty"}`}>
        <div className="wrapper">
          <div className="list">
            {
              panelData.map((data, ind) => (
                <Panel key={ind} data={data} />
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
