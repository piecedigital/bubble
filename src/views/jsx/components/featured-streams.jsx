import React from "react";
import loadData from "../../../modules/load-data";
import { missingLogo } from "../../../modules/helper-tools";
import UserQuestions from "./user-questions.jsx";
import { Link } from 'react-router';

// list item for featured streams
const StreamListItem = React.createClass({
  displayName: "feat-StreamListItem",
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
      <span>
        <li className={`stream-list-item clickable home`} onClick={() => {
          displayStream(index)
        }}>
          <div className="wrapper">
            <div className="image">
              <img src={preview.medium || missingLogo} />
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
          </div>
        </li>
        <div className={`separator-4-dim`}></div>
      </span>
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
            name,
            logo
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
          <iframe src={`https://player.twitch.tv/?channel=${name}&muted=true`} frameBorder="0" scrolling="no" allowFullScreen />
        </div>
        {
          displayName ? (
            <div className="stream-info">
              <div className="image">
                <img src={logo} alt={`profile image of ${displayName || name}`} />
              </div>
              <div className="text">
                <div className="display-name">
                  <Link to={`/profile/${name}`} >{displayName}</Link>
                </div>
                <div className="to-channel">
                  <a href={`https://www.twitch.tv/${name}`} target="_black" rel="nofollow">Visit on Twitch</a>
                </div>
                <div className={`separator-1-1`}></div>
                <a href="#" className="watch" onClick={() => {
                  appendStream.call(null, name, displayName);
                }}>
                {"Watch in Player"}
                </a>
                <div className={`separator-1-1`}></div>
              </div>
              <div className="text">
                <div className="bio">
                  {bio}
                </div>
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
      streamDataArray: [],
      questions: {},
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
      fireRef,
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
            streamDataArray: Array.from(this.state.streamDataArray).concat(data.featured)
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
      streamDataArray,
      questions,
    } = this.state;
    const {
      auth,
      userData,
      fireRef,
      methods: {
        appendStream,
        loadData,
        popUpHandler
      }
    } = this.props
    const questionsList = Object.keys(questions);
    return (
      <div className="featured-streams">
        {
          fireRef ? (
            <UserQuestions {...this.props} pageOverride="featured" />
          ) : null
        }
        {
          // questionsList.length > 0 ? (
          //   <div className="wrapper qna">
          //     <ul className="list">
          //     {
          //       questionsList.map((questionID, ind) => {
          //         return (
          //           <QuestionListItem
          //           auth={auth}
          //           userData={userData}
          //           fireRef={fireRef}
          //           key={ind}
          //           questionID={questionID}
          //           data={questions[questionID]}
          //           methods={{ popUpHandler }}/>
          //         );
          //       })
          //     }
          //     </ul>
          //   </div>
          // ) : null
        }
        {
          streamDataArray.length > 0 ? (
            <FeaturedStream data={streamDataArray[this.state.featuredStreamIndex]} methods={{
              appendStream,
              loadData
            }} />
          ) : null
        }
        <div className="wrapper">
          <ul className="list">
            {
              streamDataArray.map((itemData, ind) => {
                return <StreamListItem key={ind} index={ind} data={itemData} methods={{
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
