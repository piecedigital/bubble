import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";

// components
let components = {
  // list item for streams matching the search
  StreamsListItem: React.createClass({
    displayName: "stream-ListItem",
    render() {
      // console.log(this.props);
      const {
        index,
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
            language
          }
        }
      } = this.props;
      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      return (
        <li className="stream" onClick={() => {
          appendStream(name)
        }}>
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
        </li>
      )
    }
  }),
  ChannelsListItem: React.createClass({
    displayName: "channel-ListItem",
    getInitialState: () => ({ streamData: null }),
    getStreamData() {
      const {
        data: {
          channel: {
            name
          }
        }
      } = this.props;
      // console.log(`getting stream data for ${name}`);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        username: name
      })
      .then(methods => {
        methods
        .getStreamByName()
        .then(data => {
          console.log(name, ", data:", data);
          this.setState({
            streamData: data
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    },
    componentDidMount() { this.getStreamData() },
    render() {
      if(!this.state.streamData) return null;
      // console.log(this.props);
      const {
        index,
        filter,
        methods: {
          appendStream
        },
        data: {
          channel: {
            mature,
            logo,
            name,
            language
          }
        }
      } = this.props;
      const {
        streamData: {
          stream
        }
      } = this.state;
      if(!stream) {
        if(filter === "all" || filter === "offline") {
          return (
            <li>
              <div className="image">
                <img src={logo} />
              </div>
              <div className="info">
                <div className="channel-name">
                  {name}
                </div>
                <div className="game">
                  {`Offline`}
                </div>
              </div>
            </li>
          );
        } else {
          return null;
        }
      }
      const {
        game,
        viewers,
        title,
        _id: id,
        preview,
      } = stream;
      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      if(filter === "all" || filter === "online") {
        return (
          <li onClick={() => {
            appendStream(name)
          }}>
            <div className="image">
              <img src={logo} />
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
          </li>
        );
      } else {
        return null;
      }
    }
  })
};


// primary section for the search component
export default React.createClass({
  displayName: "FollowedStreams",
  getInitialState() {
    return {
      requestOffset: 0,
      dataArray: [],
      filter: "all"
    }
  },
  gatherData(limit) {
    typeof limit === "number" ? limit = limit : limit = 25;
    console.log("gathering data");
    const {
      methods: {
        // loadData
      },
      location
    } = this.props;
    if(loadData) {
      let offset = this.state.requestOffset;
      this.setState({
        requestOffset: this.state.requestOffset + limit
      });
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        offset,
        limit: limit,
        stream_type: "all"
      })
      .then(methods => {
        methods
        .followedStreams()
        .then(data => {
          this.setState({
            dataArray: Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top || data.follows),
            component: `ChannelsListItem`
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  refresh() {
    this.state.dataArray.map(stream => {
      stream.ref.getStreamData();
    });
  },
  capitalize(string) {
    return string.toLowerCase().split(" ").map(word => word.replace(/^(\.)/, (_, l) => {
      return l.toUpperCase();
    })).join(" ");
  },
  applyFilter() {
    const filter = this.refs.filterSelect.value;
    console.log(filter);
    this.setState({
      filter
    });
  },
  refreshList(length) {
    if(length > 100) {
      this.gatherData(100);
      this.refreshList(length - 100);
    } else {
      this.gatherData(length);
    }
  },
  componentDidMount() { this.gatherData(); },
  render() {
    const {
      requestOffset,
      dataArray,
      component,
      filter
    } = this.state;
    const {
      data,
      methods: {
        appendStream,
        loadData
      }
    } = this.props;
    if(component) {
      const ListItem = components[component];
      return (
        <div className={`top-level-component general-page profile`}>
          <div className="wrapper">
            <ul className="list">
              {
                dataArray.map((itemData, ind) => {
                  return <ListItem ref={r => dataArray[ind].ref = r} key={itemData.channel.name} data={itemData} index={ind} filter={filter} methods={{
                    appendStream
                  }} />
                })
              }
            </ul>
          </div>
          <div className="tools">
            <div className="parent">
              <div className="scroll">
                <div className="btn-default refresh" onClick={this.refresh}>
                  Refresh Streams
                </div>
                <div className="btn-default load-more" onClick={this.gatherData}>
                  Load More
                </div>
                <div className="btn-default filters">
                  <div className="btn-default filter-status">
                    <span>
                      Show:
                    </span>
                    <select ref="filterSelect" onChange={this.applyFilter} defaultValue="all">
                      {
                        ["all", "online", "offline"].map(filter => {
                          return (
                            <option key={filter} value={filter}>{this.capitalize(filter)}</option>
                          );
                        })
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`top-level-component general-page profile`}>
          {`Loading followed streams...`}
        </div>
      );
    }
  }
})
