import React from "react";
import SideTools from "./side-tools.jsx";
import VoteTool from "../vote-tool.jsx";
import { Link, browserHistory as History } from "react-router";

const QuestionListItem = React.createClass({
  displayName: "QuestionListItem",
  getInitialState: () => ({ questionData: null, answerData: null, ratingsData: null, calculatedRatings: {} }),
  calculateRatings() {
    const { ratingsData } = this.state;
    const { userData } = this.props;
    // don't continue if there is no ratings data
    if(!ratingsData) return;
    if(!userData) return setTimeout(this.calculateRatings, 100);
    // console.log("calc", ratingsData);
    let calculatedRatings = {};
    calculatedRatings.upvotes = Object.keys(ratingsData).filter(vote => {
      return ratingsData[vote].upvote;
    }).length;
      calculatedRatings.downvotes = Object.keys(ratingsData).filter(vote => {
      return !ratingsData[vote].upvote;
    }).length * -1;
    calculatedRatings.overall = calculatedRatings.upvotes + calculatedRatings.downvotes;
    calculatedRatings.myVote = ratingsData.hasOwnProperty(userData.name) ? ratingsData[userData.name].upvote : null;
    this.setState({
      calculatedRatings
    });
  },
  newData(dleet, snap) {
    const ratingsKey = snap.getKey();
    const ratingsData = snap.val();
    console.log("shit changed", ratingsKey, ratingsData);
    let newData = JSON.parse(JSON.stringify(this.state.ratingsData));
    if(dleet) delete newData[ratingsKey];
    this.setState({
      ratingsData: Object.assign(newData || {}, dleet ? {} : {
        [ratingsKey]: ratingsData
      })
    }, () => {
      this.calculateRatings();
    });
  },
  checkIfOverlayNeeded() {},
  setupOverlay() {
    const {
      questionData,
      answerData
    } = this.state;
    const {
      userData,
      questionID,
      params,
      location,
      methods: {
        popUpHandler
      }
    } = this.props;

    if(!this.state.answerData) {
      console.log("no answer data", this.state);
      History.push({
        pathname: `/profile/${params.username || ""}`
      });
      return;
    }
    // set up pop up overlay for question view if at question URL
    if(params.questionID === questionID && !location.state || location.state && !location.state.modal) {
      History.push({
        pathname: `/profile/${params.username || userData.name}/q/${questionID}`,
        state: {
          modal: true,
          returnTo: `/profile/${params.username || ""}`,
        }
      });
      console.log("open pop ");
      popUpHandler("viewQuestion", {
        questionData: Object.assign(questionData, { questionID }),
        answerData
      });
    }
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname !== this.props.location.pathname) {
      this.setupOverlay();
    }
  },
  componentDidMount() {
    const {
      questionID,
      fireRef
    } = this.props

    // get question data
    fireRef.questionsRef
    .child(questionID)
    .once("value")
    .then(snap => {
      const questionData = snap.val();
      this.setState({
        questionData
      });
    });
    // get answer data
    fireRef.answersRef
    .child(questionID)
    .once("value")
    .then(snap => {
      const answerData = snap.val();
      this.setState({
        answerData
      }, () => {
        this.setupOverlay();
      });
    });
    // get ratings data
    fireRef.ratingsRef
    .child(questionID)
    .once("value")
    .then(snap => {
      const ratingsData = snap.val();
      this.setState({
        ratingsData
      }, () => {
        this.calculateRatings();
      });
    });
    // set listener on ratings data
    // rating added
    fireRef.ratingsRef
    .child(questionID)
    .on("child_added", this.newData.bind(null, null)),
    // rating changed
    fireRef.ratingsRef
    .child(questionID)
    .on("child_changed", this.newData.bind(null, null));
    // rating removed
    fireRef.ratingsRef
    .child(questionID)
    .on("child_removed", this.newData.bind(null, true));
  },
  componentWillUnmount() {
    const {
      questionID,
      fireRef
    } = this.props
    // remove listener on ratings data
    // rating added
    fireRef.ratingsRef
    .child(questionID)
    .off("child_added", this.newData),
    // rating changed
    fireRef.ratingsRef
    .child(questionID)
    .off("child_changed", this.newData);
    // rating removed
    fireRef.ratingsRef
    .child(questionID)
    .off("child_removed", this.newData);
  },
  render() {
    const {
      myAuth,
      userData,
      fireRef,
      questionID,
      params,
      methods: {
        popUpHandler
      }
    } = this.props
    const {
      questionData,
      answerData,
      calculatedRatings
    } = this.state;

    if(!questionData) return null;

    return (
      <li className={`question-list-item`}>
        <Link to={
          answerData ? (
            {
              pathname: `/profile/${params.username || userData.name}/q/${questionID}`,
              state: {
                modal: true,
                returnTo: `/profile/${params.username || ""}`,
              }
            }
          ) : (
            {
              pathname: `/profile/${params.username || ""}`
            }
          )
        } onClick={answerData ? (
          popUpHandler.bind(null, "viewQuestion", {
            questionData: Object.assign(questionData, { questionID }),
            answerData
          })
        ) : (
          popUpHandler.bind(null, "answerQuestion", {
            questionData: Object.assign(questionData, { questionID }),
            answerData
          })
        )}>
          <div className="wrapper">
            <div className="info question">
              <div className="title">
                {questionData.title}
              </div>
              <div className="body">
                {questionData.body}
              </div>
            </div>
            <div className="separator-4-black" />
            <div className="info answer">
              <div className={`${!answerData ? "bold" : ""}`}>
                {answerData ? answerData.body : [
                  answerData ? null : (
                    <div className="no-answer">!</div>
                  ), "Click here to Answer!"]}
              </div>
            </div>
          </div>
          <div className="wrapper votes">
            <div className="info question">
              <VoteTool
              myAuth={myAuth}
              userData={userData}
              fireRef={fireRef}
              place="question"
              calculatedRatings={calculatedRatings}
              questionData={questionData} />
            </div>
          </div>
        </Link>
      </li>
    );
  }
});

export default React.createClass({
  displayName: "UserQuestions",
  getInitialState: () => ({
    questions: {},
    lastID: null,
    locked: true,
    lockedTop: true,
    loadData: false,
  }),
  scrollEvent(e) {
    setTimeout(() => {
      let {
        root,
        tools
      } = this.refs;
      if(root && tools) {
        let trueRoot = document.body.querySelector(".react-app .root");
        // console.log("root", root.offsetTop + root.offsetHeight);
        // console.log("trueRoot", trueRoot.scrollTop);
        const bottom = (root.offsetTop + root.offsetHeight) - tools.offsetHeight  - (16 * 4.75);
        // console.log("bottom", bottom);

        // lock the tools menu to the top of it's parent
        // if the top of the page root is higher than or equal to the top of the app root
        if(trueRoot.scrollTop <= root.offsetTop) {
          this.setState({
            locked: true,
            lockedTop: true,
          });
        } else
        // lock the tools menu to the bottom of it's parent
        // if the top of the page root is lower than or equal to the top of the app root
        if(trueRoot.scrollTop >= bottom) {
          this.setState({
            locked: true,
            lockedTop: false,
          });
        } else {
          // don't lock anything; fix it to the page scrolling
          this.setState({
            locked: false,
            lockedTop: false,
          });
        }
      }
    }, 200);
  },
  getQuestions() {
    // console.log("tryna get questions", this.props);
    this.setState({
      loadingData: true
    }, () => {
      const {
        fireRef,
        userData,
        params,
      } = this.props;
      if(!userData) return;
      fireRef.usersRef
      .child(`${params.username || userData.name}/${params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"}`)
      .startAt(this.state.lastID)
      .limitToFirst(25)
      .once("value")
      .then(snap => {
        let questions = snap.val();
        console.log("questions", questions);
        this.setState({
          questions,
          lastID: questions ? Object.keys(questions).pop() : null,
          loadingData: false
        }, () => {
          // console.log(this.state);
        });
      });
    })
  },
  xrefresh() {},
  refreshList() {
    this.setState({
      questions: {},
      lastID: null
    }, this.getQuestions);
  },
  gatherData() {
    this.getQuestions();
  },
  xapplyFilter() {},
  componentWillReceiveProps(nextProps) {
    const last = this.props.params.username,
    curr = nextProps.params.username,
    signedIn = this.props.userData.name;
    if(last || curr) {
      if(
        last !== signedIn &&
        curr !== signedIn &&
        last !== curr
      ) {
        this.setState({
          questions: {},
          lastID: null
        }, this.getQuestions);
      }
    }
  },
  componentDidMount(prevProps) {
    const {
      fireRef,
      userData,
      params
    } = this.props;

    if(
      fireRef && userData
    ) {
      this.getQuestions();
    }

    // set listener on questions or answers
    fireRef.usersRef
    .child(`${params.username || userData.name}/${params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"}`)
    .on("child_added", snap => {
      let questionKey = snap.getKey();
      let questionData = snap.val();
      console.log("new question", questionKey, questionData);
      let newQuestions = JSON.parse(JSON.stringify(this.state.questions || {}));

      this.setState({
        questions: Object.assign(newQuestions, {
          [questionKey]: questionData
        }),
        lastID: questionKey,
        loadingData: false
      }, () => {
        // console.log(this.state);
      });
    });
  },
  componentWillUnmount() {
    console.log("unounting question");
  },
  render() {
    const {
      locked,
      lockedTop,
      loadingData,
      questions,
    } = this.state;
    const {
      auth,
      userData,
      params,
      fireRef,
      methods
    } = this.props;
    // make an array of questions
    const list = questions ? Object.keys(questions).map(questionID => {
      return (
        <QuestionListItem key={questionID} userData={userData} questionID={questionID} location={location} params={params} fireRef={fireRef} myAuth={ auth ? !!auth.access_token : false} methods={methods} />
      );
    }).reverse() : null;
    return (
      <div ref="root" className={`user-questions tool-assisted${locked ? " locked" : ""}`}>
        <div className={`title`}>Questions</div>
        <div className="wrapper">
          <div className="list">
            {list}
          </div>
        </div>
        <SideTools
        refresh={this.refresh}
        refreshList={this.refreshList}
        gatherData={this.gatherData}
        applyFilter={this.applyFilter}
        locked={locked}
        lockedTop={lockedTop}
        loadingData={loadingData}
        />
      </div>
    );
  }
})
