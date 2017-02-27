import React from "react";
import SideTools from "./user/side-tools.jsx";
import VoteTool from "./vote-tool.jsx";
import { calculateRatings,
getQuestionData,
getAnswerData,
getRatingsData } from "../../../modules/client/helper-tools";
import loadData from "../../../modules/client/load-data";
import { Link, browserHistory as History } from "react-router";

const QuestionListItem = React.createClass({
  displayName: "QuestionListItem",
  getInitialState() {
    // console.log("ques", this.props.initState);
    let questionData = null, answerData = null;
    if(this.props.initState) {
      questionData = this.props.initState.userQuestions.questions[this.props.questionID];
      answerData = this.props.initState.userQuestions.answers[this.props.questionID];
    }
    return Object.assign({
      questionData,
      answerData,
      commentData: null,
      ratingsData: null,
      calculatedRatings: null
    });
  },
  newAnswer(snap) {
    const {
      questionID,
      fireRef
    } = this.props;
    const answerKey = snap.getKey();
    // console.log("new answer", answerKey, questionID);
    if(answerKey === questionID) {
      fireRef.answersRef
      .child(questionID)
      .once("value")
      .then(snap => {
        const answerData = snap.val();
        // console.log("got new answer", answerData);
        this._mounted ? this.setState({
          answerData
        }) : null;
      });
    }
  },
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
  },
  setupAnswerListeners() {
    const {
      questionID,
      fireRef,
      params
    } = this.props
    const { questionData } = this.state;

    // set listener for new question
    if(questionData) {
      const usersRefNode = fireRef.usersRef
      .child(`${questionData.receiverID}/answersFromMe`)
      .on("child_added", this.newAnswer);
    }
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
    this._mounted = true;
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

      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        userID: questionData.receiverID,
      })
      .then(methods => {
        methods
        .getUserByName()
        .then(data => {
          // console.log("feature data", data);
          const receiver = data.name;
          questionData.receiver = receiver;
          this._mounted ? this.setState({
            questionData
          }, this.setupAnswerListeners) : null;
        })
        .catch((e = null) => console.error(e));
      })
      .catch((e = null) => console.error(e));

    });
    // get answer data
    fireRef.answersRef
    .child(questionID)
    .once("value")
    .then(snap => {
      const answerData = snap.val();
      this._mounted ? this.setState({
        answerData
      }) : null;
    });

    this.setupOverlay();
  },
  componentWillUnmount() {
    delete this._mounted;
    const {
      questionID,
      fireRef
    } = this.props
    // remove listener on ratings data
    // answered question added
    if(this.state.questionData) {
      fireRef.usersRef
      .child(`${this.state.questionData.receiverID}/answersFromMe`)
      .off("child_added", this.newQuestion);
    }
  },
  render() {
    const {
      auth,
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
        <Link href={
          answerData ? (
            `/profile/${questionData.receiver || (userData ? userData._id : "")}/q/${questionID}`
          ) : (
            URL || `/profile/${questionData.receiver || ""}`
          )
        } to={
          answerData ? (
            {
              pathname: `/profile/${questionData.receiver || (userData ? userData._id : "")}/q/${questionID}`,
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
            questionID
          })
        ) : (
          popUpHandler.bind(null, "answerQuestion", {
            questionID,
          })
        )}>
          <div className="wrapper">
            <div className="info question">
              <div className="title">
                {questionData.title}
              </div>
              <div className="body">
                {questionData.body.substr(0, 30)}{questionData.body.length > 30 ? "..." : ""}
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
                  {...{
                    auth,
                    userData,
                    fireRef,
                    place: "question",
                    calculatedRatings,
                    questionID,
                    questionData
                  }} />
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
  getInitialState() {
    return Object.assign({
      initialLoad: false,
      paramUserID: null,
      questions: {},
      lastID: null,
      locked: true,
      lockedTop: true,
      loadData: false,
      queryLimit: this.props.pageOverride === "featured" ? 10 : 5
    }, this.props.initState ? this.props.initState.userQuestions || {} : {});
  },
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
    // console.log("tryna get questions", this.props.params, this.state.paramUserID);
    this.setState({
      loadingData: true
    }, () => {
      const { queryLimit, paramUserID } = this.state;
      const {
        fireRef,
        userData,
        params = {},
        pageOverride
      } = this.props;

      // if(!userData) return;
      // console.log("search params", params.username, userData, this.state.lastID);
      let refNode = fireRef;
      // for the featured component we want to get all recent questions
      if(pageOverride === "Featured") {
        refNode = refNode.answersRef;
      } else {
        // if we're on a profile we just want questions for a specific user
        // if we're on the signed in user's profile we'll get all questions for them
        // else, we'll get answered questions
        refNode = refNode.usersRef.child(`${paramUserID || (userData ? userData._id : undefined)}/${!userData || paramUserID && paramUserID !== userData._id ? "answersFromMe" : "questionsForMe"}`);
      }
      // console.log(this.state.lastID);
      if(this.state.lastID) {
        refNode = refNode.orderByKey().endAt(this.state.lastID || 0)
        .limitToLast(queryLimit+1);
      } else {
        refNode = refNode.orderByKey()
        .limitToLast(queryLimit);
        // console.log(refNode.toString());
      }
      refNode.once("value")
      .then(snap => {
        const questions = snap.val();
        const newQuestions = JSON.parse(JSON.stringify(this.state.questions));
        // console.log("questions", questions);
        this.setState({
          questions: Object.assign(newQuestions, questions),
          lastID: questions ? Object.keys(questions).pop() : null,
          loadingData: false
        }, () => {
          // console.log(this.state);
        });
      });
    });
  },
  xrefresh() {},
  refreshList() {
    // console.trace("refreshing list");
    this.setState({
      questions: {},
      lastID: null
    }, this.getQuestions);
  },
  gatherData() {
    this.getQuestions();
  },
  xapplyFilter() {},
  getParamUserID(cb) {
    const {
      params
    } = this.props;
    if(params && params.username) {
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        username: params.username
      })
      .then(methods => {
        methods
        .getUserID()
        .then(data => {
          // console.log("param user id data", data.users[0]._id);
          const paramUserID = data.users[0]._id;
          this.setState({
            paramUserID
          }, cb)
        })
        .catch((e = null) => console.error(e));
      })
      .catch((e = null) => console.error(e));
    }
  },
  componentWillReceiveProps(nextProps) {
    if(!this.props.pageOverride) {
      if(!this.state.initialLoad) {
        this.setState({
          initialLoad: true
        });
        this.refreshList();
      }

      if(this.props.params.username !== nextProps.params.username) {
        setTimeout(() => {

          this.getParamUserID(() => {
            this.refreshList();
          });

        });
      }
    }
  },
  componentDidMount(prevProps) {
    // console.log("mounted user quesions");
    const {
      fireRef,
      userData,
      params,
      pageOverride
    } = this.props;

    if(
      fireRef
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
    }

    this.getParamUserID();
  },
  componentWillUnmount() {
    console.log("unounting UserQuestions");
    // this.killListeners()
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
      location,
      fireRef,
      overlay,
      methods,
      pageOverride,

      initState
    } = this.props;
    // make an array of questions
    const list = questions ? Object.keys(questions).map(questionID => {
      return (
        <QuestionListItem key={questionID} userData={userData} questionID={questionID} location={location} params={params} fireRef={fireRef} auth={ auth } overlay={overlay} pageOverride={pageOverride} methods={methods} initState={initState} />
      );
    }) : null;
    if(pageOverride === "featured" && list.length === 0) return null;
    return (
      <div ref="root" className={`user-questions tool-assisted${locked ? " locked" : ""}`}>
        { !pageOverride ? (<div className={`title`}>Questions</div>) : null }
        {
          pageOverride === "featured" ? (
            <div className="section-title">
              Top Questions
            </div>
          ) : null
        }
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
