import React from "react";
import loadData from "../../../modules/load-data";
import { missingLogo } from "../../../modules/helper-tools";
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

// list item for recent question
const QuestionListItem = React.createClass({
  displayName: "feat-QuestionListItem",
  getInitialState: () => ({ ratingsData: null, calculatedRatings: null }),
  calculateRatings() {
    const { ratingsData } = this.state;
    const { userData } = this.props;
    let calculatedRatings = {};
    // don't continue if there is no ratings data
    if(!ratingsData) return;
    if(!userData) return setTimeout(this.calculateRatings, 100);

    calculatedRatings = {
      question: {
        upvotes: [],
        downvotes: [],
        overall: 0,
        myVote: false,
        for: true
      },
      answer: {
        upvotes: [],
        downvotes: [],
        overall: 0,
        myVote: false,
        for: true
      },
      comment: {
        upvotes: [],
        downvotes: [],
        overall: 0,
        myVote: false,
        for: true
      }
    };

    Object.keys(ratingsData || {}).map(vote => {
      const voteData = ratingsData[vote];
      const place = voteData.for;

      if(ratingsData[vote].upvote) calculatedRatings[place].upvotes.push(true);
      if(!ratingsData[vote].upvote) calculatedRatings[place].downvotes.push(true);
      if(voteData.username === userData.name) {
        calculatedRatings[place].myVote = voteData.upvote;
        calculatedRatings[place].for = voteData.for;
      }
    });
    ["question", "answer", "comment"].map(place => {
      calculatedRatings[place].upvotes = calculatedRatings[place].upvotes.length;
      calculatedRatings[place].downvotes = calculatedRatings[place].downvotes.length;
      calculatedRatings[place].overall = calculatedRatings[place].upvotes - calculatedRatings[place].downvotes;
    });

    this.setState({
      calculatedRatings
    });
  },
  componentDidMount() {
    // get ratings data
    // this.props.fireRef.ratingsRef
    // .child(this.props.questionID)
    // .once("value")
    // .then(snap => {
    //   const ratingsData = snap.val();
    //   this.setState({
    //     ratingsData
    //   }, () => {
    //     this.calculateRatings();
    //   });
    // });
  },
  render() {
    const {
      auth,
      userData,
      fireRef,
      questionID,
      data: {
        questionData,
        answerData
      },
      methods: {
        popUpHandler
      }
    } = this.props;
    return (
      <span>
        <li className={`question-list-item clickable home`}>
          <Link to={{
            pathname: `/profile/${questionData.receiver}/q/${questionID}`,
            // state: {
            //   modal: true,
            //   returnTo: `/`
            // }
          }} target="_blank" onClick={null
            // popUpHandler.bind(null, "viewQuestion", {
            //   questionData: Object.assign(questionData, { questionID }),
            //   answerData,
            //   voteToolData: {
            //     myAuth: auth && auth.access_token,
            //     userData: userData,
            //     fireRef: fireRef,
            //     place: "question",
            //     // calculatedRatings: calculatedRatings,
            //     questionData: questionData,
            //   }
            // })
          }>
            <div className="wrapper">
              <div className="info">
                <div className="title">
                  {questionData.body}
                </div>
                <div className={`separator-1-black`}></div>
                <div className="body">
                  {answerData.body}
                </div>
              </div>
            </div>
          </Link>
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
  getQuestions() {
    const {
      fireRef
    } = this.props;
    if(fireRef) {
      fireRef.answersRef
      .orderByKey()
      .limitToLast(10)
      .once("value")
      .then(snap => {
        const answers = snap.val();

        let questions = {};

        new Promise((resolve, reject) => {
          Object.keys(answers || {}).map((questionID, ind, arr) => {
            const answerData = answers[questionID];

            fireRef.questionsRef
            .child(questionID)
            .once("value")
            .then(snap => {
              const questionData = snap.val();
              questions[questionID] = {
                questionData,
                answerData
              };
              if(ind === (arr.length - 1)) {
                resolve()
              }
            });
          });
        })
        .then(() => {
          this.setState({
            questions
          });
        });
      });
    } else {
      setTimeout(this.getQuestions, 100);
    }
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
    this.getQuestions();
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
          questionsList.length > 0 ? (
            <div className="wrapper qna">
              <ul className="list">
              {
                questionsList.map((questionID, ind) => {
                  return (
                    <QuestionListItem
                    auth={auth}
                    userData={userData}
                    fireRef={fireRef}
                    key={ind}
                    questionID={questionID}
                    data={questions[questionID]}
                    methods={{ popUpHandler }}/>
                  );
                })
              }
              </ul>
            </div>
          ) : null
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
