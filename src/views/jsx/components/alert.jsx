import React from "react";

export default React.createClass({
  displayName: "Alert",
  closeOption() {
    this.props.methods.alertHandler(null);
  },
  cancelOption() {
    this.props.methods.alertHandler(null);
  },
  okayOption() {
    this.props.methods.alertHandler(null);
  },
  getLink(name) {
    switch (name) {
      case "twitter":
        let url = encodeURI(`https://twitter.com/share`+
          `?text=Come watch ${this.props.data.state.name} on Twitch!`+
          `&url=https://www.amorrius.net?ms=${this.props.data.state.name}`+
          `&hashtags=twitch,amorrius`+
          `&via=Amorrius`);
        return (
          <li className={`${name}`}>
            <a
              key={name}
              className={`twitter-share-button`}
              target="_blank"
              href={url}>
              Tweet
            </a>
          </li>
        );
        break;
      default:

    }
  },
  render() {
    const {
      data,
      methods: {
        alertHandler
      }
    } = this.props;

    // console.log(data);
    if(!data) return (
      <div className="alert" onClick={() => {
        alertHandler(null);
      }}>
        <div className="box" onClick={e => e.nativeEvent.stopImmediatePropagation()}>
          <div className="message">Problem Loading Alert</div>
          <ul className="links"></ul>
          <div className="options"></div>
        </div>
      </div>
    );

    const {
      message,
      options,

      links,
      inputData,
    } = data;

    const optionsList = options ? options.map(opt => {
      return (
        <button key={opt} onClick={this[`${opt}Option`]}>
          {opt}
        </button>
      );
    }) : ["close"];

    const linksList = links ? links.map(name => {
      return this.getLink(name);
    }) : [];

    return (
      <div className="alert open">
        <div className="backdrop" onClick={() => {
          alertHandler(null);
        }}></div>
        <div className="box" onClick={e => e.nativeEvent.stopImmediatePropagation()}>
          <div className="message">
            <span dangerouslySetInnerHTML={{ __html: message }} />
          </div>
          {
            inputData ? (
              <div className="input">
                <input type="text" value={inputData} onClick={e => e.target.select()} readOnly />
              </div>
            ) : null
          }
          <ul className="links">
            {linksList}
          </ul>
          <div className="options">
            {optionsList}
          </div>
        </div>
      </div>
    );
  }
});
