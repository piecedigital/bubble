import React from "react";
import loadData from "../../modules/load-data";
import { ListItemHoverOptions } from "./components/hover-options.jsx";
// components
let components = {};

// list item for streams matching the search
components.StreamsListItem = React.createClass({
  displayName: "stream-ListItem",
  render() {
    // console.log(this.props);
    const {
      auth,
      index,
      userData,
      methods: {
        appendStream
      },
      data: {
        game,
        viewers,
        title,
        _id: id,
        preview,
        channel: {
          mature,
          logo,
          name,
          display_name,
          language
        }
      }
    } = this.props;
    let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
    let hoverOptions = <ListItemHoverOptions auth={auth} stream={true} name={name} display_name={display_name} userData={userData} clickCallback={appendStream} />;

    return (
      <li className={`stream-list-item search`}>
        <div className="wrapper">
          <div className="image">
            <img src={preview.medium} />
          </div>
          <div className="info">
            <div className="channel-name">
              {name}
            </div>
            <div className="title">
              {title}
            </div>
            <div className="game">
              {`Live with "${game}"`}
            </div>
            <div className="viewers">
              {`Streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
            </div>
          </div>
          {hoverOptions}
        </div>
      </li>
    )
  }
})

// primary section for the search component
export default React.createClass({
  displayName: "SearchPage",
  getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    }
  },
  gatherData(limit, offset, callback) {
    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    const {
      params,
      location
    } = this.props;
    if(loadData) {
      let capitalType = params.searchtype.replace(/^(.)/, (_, letter) => {
        return letter.toUpperCase();
      });
      let searchType = `search${capitalType}`;
      this._mounted ? this.setState({
        requestOffset: this.state.requestOffset + 25
      }) : null;
      console.log(this);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        query: location.query.q,
        offset,
        limit: 25
      })
      .then(methods => {
        methods
        [searchType]()
        .then(data => {
          this._mounted ? this.setState({
            // offset: this.state.requestOffset + 25,
            dataArray: Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games),
            component: `${capitalType}ListItem`
          }) : null;
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  refreshList(reset, length, offset) {
    length = length || this.state.dataArray.length;
    offset = offset || 0;
    console.log(reset, length, offset);
    let requestOffset = reset ? 0 : offset;
    let obj = {};
    if(reset) obj.dataArray = [];
    this._mounted ? this.setState(obj, () => {
      if(length > 100) {
        this.gatherData(100, offset, this.refreshList.bind(this, false, length - 100, requestOffset + 100));
      } else {
        this.gatherData(length, offset);
      }
    }) : null;
  },
  componentDidMount() {
    this._mounted = true;
    this.gatherData();
  },
  componentWillUnmount() {
    delete this._mounted;
  },
  render() {
    const {
      requestOffset,
      dataArray,
      component
    } = this.state;
    const {
      auth,
      data,
      methods: {
        appendStream,
        loadData
      },
      location
    } = this.props;
    if(component) {
      const ListItem = components[component];
      return (
        <div className="top-level-component search-page">
          <div className="general-page">
            <div className="wrapper">
              <ul className="list">
                {
                  dataArray.map((itemData, ind) => {
                    return <ListItem auth={auth} key={ind} data={itemData} index={ind} methods={{
                      appendStream
                    }} />
                  })
                }
              </ul>
            </div>
            <div className="tools">
              <div className="parent">
                <div className="scroll">
                  <div className="option btn-default refresh" onClick={() => this.refreshList(true)}>
                    Refresh Listing
                  </div>
                  <div className="btn-default load-more" onClick={this.gatherData}>
                    Load More
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="search-page">
          {`Loading streams for ${location ? location.query.q || location.query.query : data.query.q || data.query.query}...`}
        </div>
      );
    }
  }
})
