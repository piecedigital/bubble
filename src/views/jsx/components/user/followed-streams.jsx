import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";
import FollowButton from "../follow.jsx";

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
          appendStream.call(null, name, displayName);
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
    followCallback(follow) {
      if(follow) {
        // following channel
        if(typeof this.props.methods.addToDataArray === "function") this.props.methods.addToDataArray(this.props.index);
      } else {
        // unfollowing channel
        if(typeof this.props.methods.removeFromDataArray === "function") this.props.methods.removeFromDataArray(this.props.index);
      }
    },
    appendStream(name, display_name) {
      this.props.methods.appendStream(name, display_name);
    },
    componentDidMount() { this.getStreamData() },
    render() {
      if(!this.state.streamData) return null;
      // console.log(this.props);
      const {
        auth,
        index,
        filter,
        userData,
        data: {
          channel: {
            mature,
            logo,
            name,
            display_name,
            language
          }
        }
      } = this.props;
      const {
        streamData: {
          stream
        }
      } = this.state;

      let hoverOptions = (
        <div className={`hover-options`}>
          <FollowButton name={userData.name} targetName={name} targetDisplay={display_name} auth={auth} callback={this.followCallback}/>
          {
            stream ? (
              <div className="append-stream">
                <a href="#" onClick={this.appendStream.bind(this, name, display_name)}>Watch Stream</a>
              </div>
            ) : null
          }
        </div>
      );

      if(!stream) {
        if(filter === "all" || filter === "offline") {
          return (
            <li className={`channel-list-item`}>
              <div className="wrapper">
                <div className="image">
                  <img src={logo} />
                </div>
                <div className="info">
                  <div className={`live-indicator offline`} />
                  <div className="channel-name">
                    {name}
                  </div>
                  <div className="game">
                    {`Offline`}
                  </div>
                </div>
                {hoverOptions}
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
          <li className={`channel-list-item`} onClick={() => {
            appendStream(name, display_name)
          }}>
            <div className="wrapper">
              <div className="image">
                <img src={logo} />
              </div>
              <div className="info">
                <div className={`live-indicator online`} />
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
      limit: 25,
      dataArray: [],
      filter: "all"
    }
  },
  gatherData(limit) {
    typeof limit === "number" ? limit = limit : limit = this.state.limit || 25;
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
  removeFromDataArray(index) {
    var newDataArray = JSON.parse(JSON.stringify(this.state.dataArray));
    newDataArray.splice(parseInt(index), 1);
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
  refreshList(reset, _, length = this.state.dataArray.length) {
    console.log(reset, length, arguments);
    this.setState({
      requestOffset: reset ? 0 : this.state.requestOffset,
      dataArray: reset ? [] : this.state.dataArray
    }, () => {
      if(length > 100) {
        this.gatherData(100);
        this.refreshList(false, length - 100);
      } else {
        this.gatherData(length);
      }
    });
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
      auth,
      data,
      userData,
      methods: {
        appendStream,
        loadData
      }
    } = this.props;
    if(component) {
      const ListItem = components[component];
      return (
        <div className={`general-page profile`}>
          <div className={`title`}>Followed Channels</div>
          <div className="wrapper">
            <ul className="list">
              {
                dataArray.map((itemData, ind) => {
                  return <ListItem ref={r => dataArray[ind].ref = r} key={itemData.channel.name} data={itemData} userData={userData} index={ind} filter={filter} auth={auth} methods={{
                    appendStream,
                    removeFromDataArray: this.removeFromDataArray
                  }} />
                })
              }
            </ul>
          </div>
          <div className="tools">
            <div className="parent">
              <div className="scroll">
                <div className="option btn-default refresh" onClick={this.refresh}>
                  Refresh Streams
                </div>
                <div className="option btn-default refresh" onClick={this.refreshList.bind(this, true)}>
                  Refresh Listing
                </div>
                <div className="option btn-default load-more" onClick={this.gatherData}>
                  Load More
                </div>
                <div className="option btn-default filters">
                  <div className="filter-status">
                    <label htmlFor="filter-select">
                      Show
                    </label>
                    <select id="filter-select" className="" ref="filterSelect" onChange={this.applyFilter} defaultValue="all">
                      {
                        ["all", "online", "offline"].map(filter => {
                          return (
                            <option key={filter} value={filter}>Show {this.capitalize(filter)}</option>
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
