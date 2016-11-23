import React from "react";
import { Link } from 'react-router';

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
    if(callback) callback(this.refs.input.value, false);
    toggleCallback(commandValue)
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
      default:
        this.setState({
          navOpen: !this.state.navOpen
        });
    }
  },
  componentDidMount() {
    this.refs.nav.addEventListener("mouseleave", () => {
      console.log("leave");
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
      authData,
      userData,
      url,
      methods: {
        logout,
        appendStream,
        search
      }
    } = this.props;
    return (
      <nav ref="nav" className={`${navOpen ? "open" : ""}`}>
        <div>
          <span className="inputs">
            <SlideInput ref="addInput" commandValue="add" symbol="+" open={addOpen} placeholder="Add a stream to the Player" callback={(value, bool) => {
              this.toggleNav("close");
              appendStream(value, undefined, bool);
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
          <Link className="nav-item" to={"/"} onClick={this.toggleNav.bind(null, "close")}>Home</Link>
          <Link className="nav-item" to={"/streams"} onClick={this.toggleNav.bind(null, "close")}>Streams</Link>
          <Link className="nav-item" to={"/games"} onClick={this.toggleNav.bind(null, "close")}>Games</Link>
          {
            authData && authData.access_token ? (
              <span className="auth">
                { userData ? <Link className="nav-item" to={`/Profile`} onClick={this.toggleNav.bind(null, "close")}>Profile</Link> : null }
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
