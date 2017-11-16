import React from "react";
import loadData from "../../../modules/client/load-data";
// import { makeTime } from "../../../modules/client/helper-tools";
// import BookmarkButton from "./bookmark-btn.jsx";
// import UserQuestions from "./user-questions.jsx";
import { Link } from 'react-router';
import {
  browserNotification as notification,
  missingLogo,
  CImg,
  makeTime
} from "../../../modules/client/helper-tools";
import { ListItemHoverOptions } from "./hover-options.jsx";

let currentNotifs = 0;

export const StreamListItem = React.createClass({
  displayName: "feat-StreamListItem",
  render() {
    const {
      auth,
      userData,
      versionData,
      fireRef,
      index,
      homepage,
      methods: {
        displayStream,
        appendStream
      },
      data,
      data: {
        stream,
      }
    } = this.props;
    let game, viewers, title, id, preview, mature, logo, name, display_name, language;
    if(stream) {
      ({
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
      } = stream)
    } else {
      ({
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
      } = data);
    }

    let viewersString = viewers.toLocaleString("en"); // http://www.livecoding.tv/earth_basic/
    let hoverOptions = !homepage ? <ListItemHoverOptions auth={auth} fireRef={fireRef} stream={true} name={name} display_name={display_name} userData={userData} clickCallback={appendStream} versionData={versionData} /> : null;

    return (
      <li className={`stream-list-item${homepage ? " clickable home" : ""}`} onClick={() => {
        if(typeof displayStream === "function") displayStream(index)
      }}>
        <div className="wrapper">
          <div className="image">
            <CImg
              style={{
                width: 215,
                height: 121
              }}
              src={preview.medium || missingLogo}
            />
          </div>
          <div className="info">
            <div className="channel-name">
              {name}
            </div>
            <div className={`separator-1-7`}></div>
            <div className="title">
              {title}
            </div>
            <div className="game">
              {`Live with "${game || null}", streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
            </div>
          </div>
          {hoverOptions}
        </div>
      </li>
    )
  }
});

export const ChannelListItem = React.createClass({
  displayName: "channel-ListItem",
  getInitialState: () => ({ streamData: null }),
  getStreamData() {
    const {
      data
    } = this.props;
    const {
      name,
      display_name
    // } = data.channel || data.user;
    } = data;
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
        // console.log(name, ", data:", data);
        // if(name === "spawnofodd") console.log(data);
        this.setState({
          streamData: data
        });
      })
      .catch(e => console.error(e ? e.stack : e) );
    })
    .catch(e => console.error(e ? e.stack : e));
  },
  followCallback(follow) {
    console.log(this.props);
    if(this.props.follow === "IFollow") {
      if(follow) {
        // following channel
        if(typeof this.props.methods.addToDataObject === "function") this.props.methods.addToDataObject(this.props.data.name);
      } else {
        // unfollowing channel
        if(typeof this.props.methods.removeFromDataObject === "function") this.props.methods.removeFromDataObject(this.props.data.name);
      }
    }
  },
  appendStream(name, display_name) {
    this.props.methods.appendStream(name, display_name);
  },
  notify() {
    const {
      data,
      params,
      userData
    } = this.props;
    // I wouldn't care to receive desktop notifications regarding someone elses followings
    // this should keep that from happening
    if((params && userData) && (params.username !== userData.name)) console.log("not my follows, not my interest");
    if((params && userData) && (params.username !== userData.name)) return;
    const {
      name,
      display_name
    } = data || data;
    const timeout = 2;
    // setTimeout(() => {
    //   notification({
    //     type: "stream_online",
    //     channelName: display_name,
    //     timeout,
    //     callback: () => {
    //       this.appendStream(name, display_name);
    //     }
    //   });
    // }, (timeout * 1000) * (multiplier % 3));
    const action = notification.bind(this, {
      type: "stream_online",
      channelName: display_name,
      timeout,
      callback: () => {
        this.appendStream(name, display_name);
      },
      finishCB: () => {
        currentNotifs--;
      }
    });
    if(currentNotifs < 3) {
      console.log("Notifying now:", name, ", ahead:", currentNotifs);
      currentNotifs++;
      action();
    } else {
      const multiplier = Math.floor(currentNotifs / 3);
      const time = (2000 * multiplier) + 700;
      console.log("Queuing notify:", name, "; ahead:", currentNotifs, "; time:", time, "; multiplier:", multiplier);
      currentNotifs++;
      setTimeout(() => {
        action();
      }, time);
    }

    // this.props.methods.notify(name, display_name);
  },
  componentWillUpdate(_, nextState) {
    // console.log(this.state.streamData, nextState.streamData);
    if(!this.state.streamData || this.state.streamData && this.state.streamData.stream === null && nextState.streamData && nextState.streamData.stream !== null) {
      // console.log(this.state.streamData.stream !== nextState.streamData.stream);
      if(this.props.userData && nextState.streamData && nextState.streamData.stream && this.props.follow === "IFollow") {
        this.notify();
      }
    }
  },
  componentDidMount() { this.getStreamData() },
  render() {
    // console.log(this.state, this.props);
    if(!this.state.streamData) return null;
    // console.log(this.props.data);
    const {
      auth,
      fireRef,
      index,
      filter,
      userData,
      versionData,
      data
    } = this.props;
    const {
      mature,
      logo,
      name,
      display_name,
      language
    } = data || data;
    const {
      streamData: {
        stream
      }
    } = this.state;

    let hoverOptions = <ListItemHoverOptions
    auth={auth}
    fireRef={fireRef}
    stream={stream}
    name={name}
    display_name={display_name}
    userData={userData}
    versionData={versionData}
    callback={this.followCallback}
    clickCallback={this.appendStream} />;

    if(!stream) {
      if(filter === "all" || filter === "offline") {
        return (
          <li className={`channel-list-item null`}>
            <div className="wrapper">
              <div className="image">
                <CImg
                  for="channel-list-item"
                  src={logo || missingLogo} />
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
    let viewersString = viewers.toLocaleString("en"); // http://www.livecoding.tv/earth_basic/
    if(filter === "all" || filter === "online") {
      return (
        <li className={`channel-list-item`}>
          <div className="wrapper">
            <div className="image">
              <CImg
                for="channel-list-item"
                src={logo || missingLogo} />
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
});

export const VideoListItem = React.createClass({
  displayName: "video-ListItem",
  getInitialState: () => ({ time: null }),
  readableDate(givenDate) {
    const date = new Date(givenDate);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let hours = date.getHours();
    const dayHalf = hours > 12 ? "PM" : "AM";
    hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()} - ${hours}:${minutes} ${dayHalf}`;
  },
  componentDidMount() {
    this.setState({
      time: makeTime(this.props.data.length)
    })
  },
  render() {
    // console.log(this.props);
    const {
      auth,
      fireRef,
      versionData,
      index,
      userData,
      methods: {
        appendVOD
      },
      data: {
        preview,
        animated_preview,
        title,
        game,
        recorded_at,
        broadcast_type,
        // url,
        _id: id,
        length,
        channel: {
          name,
          display_name
        }
      }
    } = this.props;
    const {
      time
    } = this.state;

    let hoverOptions = <ListItemHoverOptions
    auth={auth}
    fireRef={fireRef}
    userData={userData}
    versionData={versionData}
    vod={id}
    name={name}
    display_name={display_name}
    clickCallback={appendVOD} />;

    return (
      <li className="video-list-item">
        <div className="wrapper">
          <div className="image">
            <CImg
              for="video-list-item"
              style={{
                width: 136,
                height: 102
              }}
              src={preview.template.replace("{width}", 136).replace("{height}", 102)} />
          </div>
          <div className="info">
            <div className="time">
              {time ? time.formatted : time}
            </div>
            <div className="channel-name">
              {name}
            </div>
            <div className="title">
              "{title}"
            </div>
            <div className="game">
              {`${broadcast_type} of "${game}"`}
            </div>
            <div className="date">
              {this.readableDate(recorded_at)}
            </div>
          </div>
          {hoverOptions}
        </div>
      </li>
    )
  }
});

export const GameListItem = React.createClass({
  displayName: "games-ListItem",
  render() {
    // console.log(this.props);
    const {
      index,
      methods: {
        appendStream
      },
      data: {
        game: {
          name,
          box,
          _id: id
        },
        viewers,
        channels
      }
    } = this.props;
    let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
    let channelsString = channels.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/

    return (
      <li className={`game-list-item`}>
        <div className="wrapper">
          <Link to={`/search/streams?q=${encodeURIComponent(name)}`}>
            <div className="image">
              <CImg
                style={{
                  width: 168,
                  height: 235,
                }}
                src={box ? box.medium : ""} />
            </div>
            <div className="info">
              <div className="game-name">
                {name}
              </div>
              <div className="count">
                {`${channelsString} streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
              </div>
            </div>
          </Link>
        </div>
      </li>
    )
  }
})

export const SearchGameListItem = React.createClass({
  displayName: "searchGames-ListItem",
  render() {
    // console.log(this.props);
    const {
      index,
      methods: {
        appendStream
      },
      data: {
        name,
        box,
        _id: id,
        popularity
      }
    } = this.props;

    return (
      <li className={`game-list-item`}>
        <div className="wrapper">
          <Link to={`/search/streams?q=${encodeURIComponent(name)}`}>
            <div className="image">
              <CImg
                style={{
                  width: 168,
                  height: 235,
                }}
                src={box ? box.medium : ""} />
            </div>
            <div className="info">
              <div className="game-name">
                {name}
              </div>
              <div className="count">
                {`Popularity: ${popularity}`}
              </div>
            </div>
          </Link>
        </div>
      </li>
    )
  }
})
