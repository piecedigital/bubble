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
    if(callback) callback(this.refs.input.value);
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
  getInitialState: () => ({ addOpen: false, searchOpen: false }),
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
  render() {
    const {
      addOpen,
      searchOpen,
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
      <nav>
        <div>
          <SlideInput ref="addInput" commandValue="add" symbol="+" open={addOpen} placeholder="Add a stream to the Player" callback={appendStream} methods={{
            focusCallback: this.focusInput,
            toggleCallback: this.toggleInput,
          }} />
          <SlideInput ref="searchInput" commandValue="search" symbol="S" open={searchOpen} placeholder="Search Twitch" callback={search} methods={{
            focusCallback: this.focusInput,
            toggleCallback: this.toggleInput,
          }} />
          <Link className="nav-item" to={"/"}>Home</Link>
          <Link className="nav-item" to={"/streams"}>Streams</Link>
          <Link className="nav-item" to={"/games"}>Games</Link>
          {
            authData && authData.access_token ? (
              <span>
                { userData ? <Link className="nav-item" to={`/Profile`}>Profile</Link> : null }
                <a className="nav-item" href="#" onClick={logout}>Disconnect</a>
              </span>
            ) : (
              <a className="nav-item login" href={url}>Connect to Twitch</a>
            )
          }
        </div>
      </nav>
    );
  }
})