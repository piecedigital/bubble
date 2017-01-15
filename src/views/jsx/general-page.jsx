import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../modules/load-data";
import { ListItemHoverOptions } from "./components/hover-options.jsx";

// components
let components = {
  // list item for streams matching the search
  StreamsListItem: React.createClass({
    displayName: "stream-ListItem",
    render() {
      // console.log(this.props);
      const {
        auth,
        fireRef,
        userData,
        index,
        methods: {
          appendStream
        },
        data: {
          game,
          viewers,
          title,
          _id: id,
          preview,
          channel: {
            mature,
            logo,
            name,
            display_name,
            language
          }
        }
      } = this.props;
      // let viewersString = viewers.toString().split("").reverse().join("").replace(/(\d{3})/g, function(_, group) {
      //   console.log(arguments)
      //   return `${group},`;
      // }).replace(/,$/, "").split("").reverse().join("");

      // let viewersString = viewers.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2') // https://www.livecoding.tv/efleming969/

      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      let hoverOptions = <ListItemHoverOptions auth={auth} fireRef={fireRef} stream={true} name={name} display_name={display_name} userData={userData} clickCallback={appendStream} />;

      return (
        <li className={`stream-list-item`}>
          <div className="wrapper">
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
                {`Live with "${game}"`}
              </div>
              <div className="viewers">
                {`Streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
              </div>
            </div>
            {hoverOptions}
          </div>
        </li>
      )
    }
  }),
  GamesListItem: React.createClass({
    displayName: "games-ListItem",
    render() {
      // console.log(this.props);
      const {
        index,
        methods: {
          appendStream
        },
        data: {
          game: {
            name,
            box,
            _id: id
          },
          viewers,
          channels
        }
      } = this.props;
      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      let channelsString = channels.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/

      return (
        <li className={`game-list-item`}>
          <div className="wrapper">
            <Link to={`/search/streams?q=${encodeURIComponent(name)}`}>
              <div className="image">
                <img src={box ? box.medium : ""} />
              </div>
              <div className="info">
                <div className="game-name">
                  {name}
                </div>
                <div className="count">
                  {`${channelsString} streaming to ${viewersString} viewer${viewers > 1 ? "s" : ""}`}
                </div>
              </div>
            </Link>
          </div>
        </li>
      )
    }
  })
};

// primary section for the search component
export default React.createClass({
  displayName: "StreamsPage",
  getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    }
  },
  gatherData() {
    const {
      methods: {
        // loadData
      },
      params,
      location
    } = this.props;
    if(loadData) {
      let capitalType = params.page.replace(/^(.)/, (_, letter) => {
        return letter.toUpperCase();
      });
      let searchType = `top${capitalType}`;
      let offset = this.state.requestOffset;
      this.setState({
        requestOffset: this.state.requestOffset + 25
      });
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        offset,
        limit: 25
      })
      .then(methods => {
        methods
        [searchType]()
        .then(data => {
          this.setState({
            // offset: this.state.requestOffset + 25,
            dataArray: Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top),
            component: `${capitalType}ListItem`
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  componentDidMount() { this.gatherData(); },
  componentWillReceiveProps(nextProps) {
    console.log("updated");
    if(this.props.params.page !== nextProps.params.page) {
      setTimeout(() => {
        this.setState({
          dataArray: [],
          requestOffset: 0
        }, () => {
          this.gatherData();
        });
      });
    }
  },
  render() {
    const {
      requestOffset,
      dataArray,
      component
    } = this.state;
    const {
      auth,
      fireRef,
      userData,
      data,
      methods: {
        appendStream,
        loadData
      },
      params
    } = this.props;

    if(component) {
      const ListItem = components[component];
      return (
        <div className={`top-level-component ${params ? params.page : data.page}`}>
          <div className="general-page">
            <div className="wrapper">
              <ul className="list">
                {
                  dataArray.map((itemData, ind) => {
                    return (
                      <ListItem
                      key={ind}
                      fireRef={fireRef}
                      auth={auth}
                      userData={userData}
                      data={itemData}
                      index={ind}
                      methods={{
                        appendStream
                      }} />
                    );
                  })
                }
              </ul>
            </div>
            <div className="tools">
              <div className="parent">
                <div className="scroll">
                  <div className="btn-default load-more" onClick={this.gatherData}>
                    Load More
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`top-level-component general-page ${params ? params.page : data.page}`}>
          {`Loading ${params ? params.page : data.page}...`}
        </div>
      );
    }
  }
})
