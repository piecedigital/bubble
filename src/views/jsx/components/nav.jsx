import React from "react";
import { Link } from 'react-router';
import Notifications from "./notifications.jsx";

const SlideInput = React.createClass({
  displayName: "SlideInput",
  submit(e) {
    e.preventDefault();
    const {
      callback,
      commandValue,
      methods: {
        toggleCallback
      }
    } = this.props;
    let { value } = this.refs.input;
    value.replace(/\s/g, "");
    if(callback) callback(value, false);
    toggleCallback(commandValue);
    this.refs.input.value = "";
  },
  render() {
    const {
      open,
      commandValue,
      symbol,
      placeholder,
      methods: {
        focusCallback,
        toggleCallback,
      }
    } = this.props;
    return (
      <div className={`nav-item input${open ? " open" : ""}`} onClick={focusCallback.bind(null, commandValue)}>
        <div title={placeholder} className="symbol" onClick={toggleCallback.bind(null, commandValue)}>{symbol}</div>
        <form title={placeholder} onSubmit={this.submit}>
          <input placeholder={placeholder} ref="input" type="text"/>
        </form>
      </div>
    );
  }
})

export default React.createClass({
  displayName: "Nav",
  getInitialState: () => ({ addOpen: false, searchOpen: false, navOpen: false }),
  focusInput(input) {
    switch (input) {
      case "add":
        this.refs.addInput.refs.input.focus();
        break;
      case "search":
        this.refs.searchInput.refs.input.focus();
        break;
    }
  },
  toggleInput(input) {
    switch (input) {
      case "add":
        this.setState({
          addOpen: !this.state.addOpen,
          searchOpen: false,
        });
        break;
      case "search":
        this.setState({
          addOpen: false,
          searchOpen: !this.state.searchOpen,
        });
        break;
      default:
        this.setState({
          addOpen: false,
          searchOpen: false
        });
    }
  },
  toggleNav(state) {
    switch (state) {
      case "close":
      this.setState({
        navOpen: false
      });
      break;
      case "open":
        this.setState({
          navOpen: true
        });
      break;
      default:
        this.setState({
          navOpen: !this.state.navOpen
        });
    }
  },
  componentDidMount() {
    this.refs.nav.addEventListener("mouseenter", () => {
      // console.log("enter");
      this.toggleNav("open");
    }, false);
    this.refs.nav.addEventListener("mouseleave", () => {
      // console.log("leave");
      this.toggleNav("close");
    }, false);
  },
  render() {
    const {
      addOpen,
      searchOpen,
      navOpen,
    } = this.state
    const {
      auth,
      fireRef,
      authData,
      userData,
      url,
      methods: {
        logout,
        decideStreamAppend,
        search,
        popUpHandler
      }
    } = this.props;
    return (
      <nav ref="nav" className={`${navOpen ? "open" : ""}`}>
        <div>
          <h1 className="web-name">
            <Link href={"http://amorrius.net"} to={"http://amorrius.net"}>Amorrius</Link>
          </h1>
          <span className="inputs">
            <SlideInput ref="addInput" commandValue="add" symbol="+" open={addOpen} placeholder="Add a stream to the Player" callback={(value, bool) => {
              this.toggleNav("close");
              decideStreamAppend(value, undefined, bool);
            }} methods={{
              focusCallback: this.focusInput,
              toggleCallback: this.toggleInput,
            }} />
              <SlideInput ref="searchInput" commandValue="search" symbol="S" open={searchOpen} placeholder="Search Twitch" callback={(value, bool) => {
              this.toggleNav("close");
              search(value, undefined, bool);
            }} methods={{
              focusCallback: this.focusInput,
              toggleCallback: this.toggleInput,
            }} />
          </span>
          <Link className="nav-item" href={"/"} to={"/"} onClick={this.toggleNav.bind(null, "close")}>Home</Link>
          <Link className="nav-item" href={"/streams"} to={"/streams"} onClick={this.toggleNav.bind(null, "close")}>Streams</Link>
          <Link className="nav-item" href={"/games"} to={"/games"} onClick={this.toggleNav.bind(null, "close")}>Games</Link>
          {
            authData && authData.access_token ? (
              <span className="auth">
                { userData ? (
                  <div className="nav-item with-submenu" onClick={this.toggleNav}>
                    My Stuff
                    <div className="submenu">
                      <Link key="profile" className="nav-item" href={`/profile/${userData.name}`} to={`/profile/${userData.name}`} onClick={this.toggleNav.bind(null, "close")}>Profile</Link>
                      <a key="notifications" className="nav-item" href={`#`} onClick={() => {
                        this.toggleNav("close");
                        popUpHandler("viewNotifications");
                      }}><span>Notifications</span><Notifications
                        auth={auth}
                        fireRef={fireRef}
                        userData={userData}/></a>
                      <a key="bookmarks" className="nav-item" href={`#`} onClick={() => {
                        this.toggleNav("close");
                        popUpHandler("viewBookmarks");
                      }}>Bookmarks</a>
                      <a key="questions" className="nav-item" href={`#`} onClick={() => {
                        this.toggleNav("close");
                        popUpHandler("viewAskedQuestions");
                      }}>Questions</a>
                      <a key="polls" className="nav-item" href={`#`} onClick={() => {
                        this.toggleNav("close");
                        popUpHandler("viewCreatedPolls");
                      }}>Polls</a>
                      <a key="gamequeue" className="nav-item" href={`#`} onClick={() => {
                        this.toggleNav("close");
                        popUpHandler("viewGameQueue", { queueHost: userData.name });
                      }}>Game Queue</a>
                    </div>
                    <Notifications
                      auth={auth}
                      fireRef={fireRef}
                      userData={userData}/>
                  </div>
                ) : null }
                <a className="nav-item" href="#" onClick={() => {
                  logout();
                  this.toggleNav("close");
                }}>Disconnect</a>
              </span>
            ) : (
              <a className="nav-item login" href={url} onClick={this.toggleNav.bind(null, "close")}>Connect to Twitch</a>
            )
          }
        </div>
        <span className="mobile-nav" onClick={this.toggleNav.bind(null, "toggle")}>
          <span/>
        </span>
      </nav>
    );
  }
})
