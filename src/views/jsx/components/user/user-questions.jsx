import React from "react";
import SideTools from "./side-tools.jsx";
import { Link } from "react-router";

const QuestionListItem = React.createClass({
  displayName: "QuestionListItem",
  getInitialState: () => ({ questionData: null }),
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
  },
  render() {
    const {
      questionID,
      params,
    } = this.props
    const {
      questionData
    } = this.state;

    if(!questionData) return null;

    const {
      title,
      body,
    } = questionData;
    return (
      <li className={`question-list-item`}>
        <Link to={{
          pathname: `profile/${params.username}/q/${questionID}`,
          state: {
            modal: true,
            returnTo: `profile/${params.username}`,
          }
        }}>
          <div className="wrapper">
            <div className="info">
              <div className="title">
                {title}
              </div>
              <div className="body">
                {body}
              </div>
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
    this.setState({
      loadingData: true
    }, () => {
      const {
        fireRef,
        userData,
        params,
      } = this.props;
      fireRef.usersRef
      .child(`${params.username}/questionsForMe`)
      .startAt(this.state.lastID)
      .limitToFirst(25)
      .once("value")
      .then(snap => {
        let questions = snap.val();
        // console.log("questions", questions);
        this.setState({
          questions,
          lastID: questions ? Object.keys(questions).pop() : null,
          loadingData: false
        }, () => {
          console.log(this.state);
        });
      });
    })
  },
  xrefresh() {
  },
  refreshList() {
    this.setState({
      questions: {},
      lastID: null
    }, this.getQuestions);
  },
  gatherData() {
    this.getQuestions();
  },
  xapplyFilter() {
  },
  componentWillReceiveProps(nextProps) {
    // console.log("new props", this.props, nextProps);
    if(this.props.params.username !== nextProps.params.username) {
      this.setState({
        questions: {},
        lastID: null
      }, this.getQuestions);
    }
  },
  componentDidUpdate(prevProps) {
    const {
      fireRef,
      userData
    } = this.props;

    if(fireRef && prevProps.fireRef === null) {
      this.getQuestions();
    }
  },
  render() {
    const {
      locked,
      lockedTop,
      loadingData,
      questions,
    } = this.state;
    const {
      params,
      fireRef
    } = this.props;
    // make an array of questions
    const list = questions ? Object.keys(questions).map(questionID => {
      return (
        <QuestionListItem key={questionID} questionID={questionID} params={params} fireRef={fireRef} />
      );
    }) : null;
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
