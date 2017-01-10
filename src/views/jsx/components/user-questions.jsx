import React from "react";
import SideTools from "./user/side-tools.jsx";
import VoteTool from "./vote-tool.jsx";
import { Link, browserHistory as History } from "react-router";

const QuestionListItem = React.createClass({
  displayName: "QuestionListItem",
  getInitialState: () => ({ questionData: null, answerData: null, commentData: null, ratingsData: null, calculatedRatings: null }),
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
  newQuestion(snap) {
    const {
      questionID,
      fireRef
    } = this.props;
    const answerKey = snap.getKey();
    console.log("new answer", answerKey, questionID);
    if(answerKey === questionID) {
      fireRef.answersRef
      .child(questionID)
      .once("value")
      .then(snap => {
        const answerData = snap.val();
        console.log("got new answer", answerData);
        this.setState({
          answerData
        });
      });
    }
  },
  newRating(dleet, snap) {
    const ratingsKey = snap.getKey();
    const ratingsData = snap.val();
    // console.log("shit changed", ratingsKey, ratingsData);
    let newData = JSON.parse(JSON.stringify(this.state.ratingsData));
    if(dleet) delete newData[ratingsKey];
    this.setState({
      ratingsData: Object.assign(newData || {}, dleet ? {} : {
        [ratingsKey]: ratingsData
      })
    }, () => {
      this.calculateRatings();
      if(this.props.overlay === "viewQuestion") {
        setTimeout(this.setupOverlay, 100)
      }
    });
  },
  checkIfOverlayNeeded() {},
  setupOverlay() {
    if(this.props.pageOverride === "featured") return;
    const {
      questionData,
      answerData,
      calculatedRatings
    } = this.state;
    const {
      myAuth,
      fireRef,
      userData,
      questionID,
      params,
      location,
      methods: {
        popUpHandler
      }
    } = this.props;

    // set up pop up overlay for question view if at question URL
    if(params.questionID === questionID && !location.state || location.state && !location.state.modal) {
      History.push({
        pathname: `/profile/${params.username || userData.name}/q/${questionID}`,
        state: {
          modal: true,
          returnTo: `/profile/${params.username || ""}`,
        }
      });
      // console.log("open pop ");
      popUpHandler("viewQuestion", {
        questionData: Object.assign(questionData, { questionID }),
        answerData,
        voteToolData: {
          myAuth: myAuth,
          userData: userData,
          fireRef: fireRef,
          place: "question",
          calculatedRatings: calculatedRatings,
          questionData: questionData,
        }
      });
    }
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname !== this.props.location.pathname) {
      this.setupOverlay();
    }
  },
  setupAnswerListeners() {
    const {
      questionID,
      fireRef,
      params
    } = this.props

    // set listener for new question
    const usersRefNode = fireRef.usersRef
    .child(`${this.state.questionData.receiver}/answersFromMe`)
    .on("child_added", this.newQuestion);
  },
  setupRatingsListeners() {
    const {
      questionID,
      fireRef,
      params
    } = this.props

    // set listener on ratings data
    // rating added
    fireRef.ratingsRef
    .child(questionID)
    .on("child_added", this.newRating.bind(null, null)),
    // rating changed
    fireRef.ratingsRef
    .child(questionID)
    .on("child_changed", this.newRating.bind(null, null));
    // rating removed
    fireRef.ratingsRef
    .child(questionID)
    .on("child_removed", this.newRating.bind(null, true));
  },
  componentDidMount() {
    const {
      questionID,
      fireRef,
      params,
      pageOverride
    } = this.props

    // get question data
    fireRef.questionsRef
    .child(questionID)
    .once("value")
    .then(snap => {
      const questionData = snap.val();
      this.setState({
        questionData
      }, this.setupAnswerListeners);
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
        if(!pageOverride) {
          // do a possible page redirect if pageOverride is not present
          if(params.questionID === questionID && !answerData) {
            console.log("no answer data", questionID, this.state);
            History.push({
              pathname: `/profile/${questionData.receiver || ""}`
            });
          }

        }
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
        this.setupOverlay();
      });
    });
    // set listener on ratings data
    // rating added
    fireRef.ratingsRef
    .child(questionID)
    .on("child_added", this.newRating.bind(null, null)),
    // rating changed
    fireRef.ratingsRef
    .child(questionID)
    .on("child_changed", this.newRating.bind(null, null));
    // rating removed
    fireRef.ratingsRef
    .child(questionID)
    .on("child_removed", this.newRating.bind(null, true));
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
    .off("child_added", this.newRating),
    // rating changed
    fireRef.ratingsRef
    .child(questionID)
    .off("child_changed", this.newRating);
    // rating removed
    fireRef.ratingsRef
    .child(questionID)
    .off("child_removed", this.newRating);
    // question added
    if(this.state.questionData) {
      fireRef.usersRef
      .child(`${this.state.questionData.receiver}/answersFromMe`)
      .off("child_added", this.newQuestion);
    }
  },
  render() {
    const {
      myAuth,
      userData,
      fireRef,
      questionID,
      params = {},
      location,
      pageOverride,
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
    if(pageOverride && !answerData) return null;

    const URL = pageOverride === "featured" ? `/` : null;

    return (
      <li className={`question-list-item ${pageOverride}`}>
        <Link to={
          answerData ? (
            {
              pathname: `/profile/${questionData.receiver || userData.name}/q/${questionID}`,
              state: {
                modal: true,
                returnTo: URL || `/profile/${questionData.receiver || ""}`,
              }
            }
          ) : (
            {
              pathname: URL || `/profile/${questionData.receiver || ""}`
            }
          )
        } onClick={answerData ? (
          popUpHandler.bind(null, "viewQuestion", {
            questionData: Object.assign(questionData, { questionID }),
            answerData,
            voteToolData: {
              myAuth: myAuth,
              userData: userData,
              fireRef: fireRef,
              place: "question",
              calculatedRatings: calculatedRatings,
              questionData: questionData,
            }
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
                    <div key="no" className="no-answer">!</div>
                  ), "Click here to Answer!"]}
              </div>
            </div>
          </div>
          {
            !pageOverride ? (
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
            ) : <div className="separator-4-dim" />
          }
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
    queryLimit: 1
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
    console.log("tryna get questions", this.props);
    this.setState({
      loadingData: true
    }, () => {
      const { queryLimit } = this.state;
      const {
        fireRef,
        userData,
        params = {},
      } = this.props;
      if(!userData) return;
      console.log("search params", params.username, userData.name, this.state.lastID);
      let refNode = fireRef.usersRef
      .child(`${params.username || userData.name}/${params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"}`);
      if(this.state.lastID) {
        refNode = refNode.orderByKey().endAt(this.state.lastID || 0)
        .limitToLast(queryLimit+1);
      } else {
        refNode = refNode.orderByKey()
        .limitToLast(queryLimit);
      }
      refNode.once("value")
      .then(snap => {
        const questions = snap.val();
        const newQuestions = JSON.parse(JSON.stringify(this.state.questions));
        console.log("questions", questions);
        this.setState({
          questions: Object.assign(newQuestions, questions),
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
  newAnswer(snap) {
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
    });
  },
  componentWillReceiveProps(nextProps) {
    if(this.props.params) {
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
    }
  },
  componentDidMount(prevProps) {
    console.log("mounted user quesions");
    const {
      fireRef,
      userData,
      params,
      pageOverride
    } = this.props;

    if(
      fireRef && userData
    ) {
      this.getQuestions();
    }

    // set listener on questions or answers
    if(pageOverride === "featured") {
      fireRef.answersRef
      .orderByKey()
      .limitToFirst(10)
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
      // fireRef.usersRef
      // .child(`${params.username || userData.name}/${params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"}`)
      // .on("child_added", this.newAnswer);
    }
  },
  componentWillUnmount() {
    console.log("unounting question");
    const {
      fireRef,
      userData,
      params = {}
    } = this.props;
    fireRef.usersRef
    .child(`${params.username || userData.name}/${params.username && params.username !== userData.name ? "answersFromMe" : "questionsForMe"}`)
    .off("child_added", this.newAnswer);
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
      overlay,
      methods,
      pageOverride
    } = this.props;
    // make an array of questions
    const list = questions ? Object.keys(questions).map(questionID => {
      return (
        <QuestionListItem key={questionID} userData={userData} questionID={questionID} location={location} params={params} fireRef={fireRef} myAuth={ auth ? !!auth.access_token : false} overlay={overlay} pageOverride={pageOverride} methods={methods} />
      );
    }) : null;
    return (
      <div ref="root" className={`user-questions tool-assisted${locked ? " locked" : ""}`}>
        { !pageOverride ? (<div className={`title`}>Questions</div>) : null }
        <div className="wrapper">
          <div className="list">
            {list}
          </div>
        </div>
        {
          !pageOverride ? (
            <SideTools
            refresh={this.refresh}
            refreshList={this.refreshList}
            gatherData={this.gatherData}
            applyFilter={this.applyFilter}
            locked={locked}
            lockedTop={lockedTop}
            loadingData={loadingData}
            />
          ) : null
        }
      </div>
    );
  }
})
