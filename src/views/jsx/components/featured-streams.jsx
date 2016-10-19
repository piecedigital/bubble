import React from "react";
import loadData from "../../../modules/load-data";

// list item for featured streams
const ListItem = React.createClass({
  displayName: "feat-ListItem",
  render() {
    const {
      index,
      methods: {
        displayStream
      },
      data: {
        stream,
        stream: {
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
      }
    } = this.props;
    let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
    return (
      <li className={`stream-list-item`} onClick={() => {
        displayStream(index)
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
            {`Live with "${game || null}", streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
          </div>
        </div>
      </li>
    )
  }
});

// the displayed stream of the feature streams
const FeaturedStream = React.createClass({
  displayName: "FeaturedStream",
  getInitialState() {
    return {
      displayName: "",
      bio: ""
    }
  },
  fetchUserData() {
    this.setState({
      // displayName: "",
      // bio: ""
    }, () => {
      const {
        data: {
          stream: {
            channel: {
              name,
              logo
            }
          }
        }
      } = this.props;
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        username: name
      })
      .then(methods => {
        methods
        .getUserByName()
        .then(data => {
          // console.log("feature data", data);
          this.setState({
            displayName: data.display_name,
            bio: data.bio
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    });
  },
  componentDidMount() { this.fetchUserData() },
  componentWillReceiveProps() { this.fetchUserData() },
  render() {
    const {
      methods: {
        appendStream
      },
      data: {
        stream: {
          channel: {
            name
          }
        }
      }
    } = this.props;
    const {
      displayName,
      bio
    } = this.state;
    return (
      <div className="featured-stream">
        <div className="stream">
          <iframe src={`https://player.twitch.tv/?channel=${name}`} frameBorder="0" scrolling="no" />
        </div>
        {
          displayName ? (
            <div className="stream-info">
              <div className="display-name">
                {displayName}
              </div>
              <div className="bio">
                {bio}
              </div>
              <div className="watch" onClick={() => {
                appendStream.call(null, name, displayName);
              }}>
                {"watch this stream"}
              </div>
            </div>
          ) : (
            <div className="stream-info">
              {"Loading channel info..."}
            </div>
          )
        }
      </div>
    );
  }
});

// primary section for the featured component
export default React.createClass({
  displayName: "FeaturedStreams",
  getInitialState() {
    return {
      requestOffset: 0,
      dataArray: [],
      featuredStreamIndex: 0
    }
  },
  displayStream(index) {
    this.setState({
      featuredStreamIndex: index
    });
  },
  componentDidMount() {
    const {
      methods: {
        loadData,
        appendStream
      }
    } = this.props;
    if(loadData) {
      loadData.call(this, e => {
        console.error(e.stack);
      })
      .then(methods => {
        methods
        .featured()
        .then(data => {
          // console.log(data);
          this.setState({
            offset: this.state.requestOffset + 25,
            dataArray: Array.from(this.state.dataArray).concat(data.featured)
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  render() {
    const {
      requestOffset,
      dataArray
    } = this.state;
    const {
      methods: {
        appendStream,
        loadData
      }
    } = this.props
    return (
      <div className="featured-streams">
        {
          dataArray.length > 0 ? (
            <FeaturedStream data={dataArray[this.state.featuredStreamIndex]} methods={{
              appendStream,
              loadData
            }} />
          ) : null
        }
        <div className="wrapper">
          <ul className="list">
            {
              dataArray.map((itemData, ind) => {
                return <ListItem key={ind} index={ind} data={itemData} methods={{
                  appendStream,
                  displayStream: this.displayStream
                }} />
              })
            }
          </ul>
        </div>
      </div>
    );
  }
})
