import React from "react";
import { Link } from 'react-router';
import loadData from "../../modules/client/load-data";
import { ListItemHoverOptions } from "./components/hover-options.jsx";
import { CImg } from "../../modules/client/helper-tools";
import {
  StreamListItem,
  // ChannelListItem,
  VideoListItem,
  // SearchGameListItem
} from "./components/list-items.jsx";

// components
let searchComponents = {};

searchComponents.StreamsListItem = {
  name: "Stream",
  comp: StreamListItem,
};
// searchComponents.ChannelsListItem = {
//   name: "Channel",
//   comp: ChannelListItem,
// };
searchComponents.VideosListItem = {
  name: "Video",
  comp: VideoListItem,
};
// searchComponents.GamesListItem = {
//   name: "Game",
//   comp: SearchGameListItem,
// };

// primary section for the search component
export default React.createClass({
  displayName: "SearchPage",
  getInitialState() {
    return {
      requestOffset: 0,
      // dataArray: [],
      StreamsListItem: [],
      // ChannelsListItem: [],
      VideosListItem: [],
      // GamesListItem: [],
      components: [
        "StreamsListItem",
        // "ChannelsListItem",
        "VideosListItem",
        // "GamesListItem"
      ]
    }
  },
  gatherData(limit, offset, callback) {
    limit = typeof limit === "number" ? limit : this.state.limit || 25;
    offset = typeof offset === "number" ? offset : this.state.requestOffset;

    if(loadData) {
      const searchParam = "All";
      const capitalType = searchParam.replace(/^(.)/, (_, letter) => {
        return letter.toUpperCase();
      });

      let searchTypes = [];
      if(searchParam === "All") {
        searchTypes.push(
          "searchStreams",
          // "searchGames",
          // "searchChannels",
          "searchVideos"
        );
      } else {
        searchTypes.push(`search${capitalType}`);
      }

      this._mounted ? this.setState({
        requestOffset: this.state.requestOffset + 25
      }) : null;
      // console.log(this);
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        query: this.refs.searchInput.value,
        offset,
        limit
      })
      .then(methods => {
        searchTypes.map(searchType => {
          const func = methods[searchType];
          if(typeof func === "function") {
            func()
            .then(data => {
              const componentName = `${searchType.replace(/^search/i, "")}ListItem`;
              let dataArray = Array.from(this.state[componentName]).concat(data.channels || data.streams || data.games || data.vods);

              // filter for only truthy data
              // console.log(searchType, capitalType, componentName, dataArray);
              dataArray = dataArray.filter(d => !!d);console.log(searchType, dataArray);

              // if(this.state.components.indexOf(componentName) < 0) {
              //   this.state.components.push(componentName);
              // }

              this._mounted ? this.setState({
                // offset: this.state.requestOffset + 25,
                [componentName]: dataArray,
                // components: this.state.components
              }) : null;
            })
            .catch(e => console.error(e.stack));
          } else {
            console.error("Cannot get data for method", searchType);
          }
        });
      })
      .catch(e => console.error(e.stack));
    }
  },
  refreshLists(cb) {
    let obj = {
      StreamsListItem: [],
      ChannelsListItem: [],
      VideosListItem: [],
      GamesListItem: [],
      requestOffset: 0,
    };
    this._mounted ? this.setState(obj, cb) : null;
  },
  performSearch(e) {
    e.preventDefault();
    this.refreshLists();
    this.gatherData(null, 0);
  },
  componentDidMount() {
    this._mounted = true;
    // this.gatherData();
    [
      "stream1",
      "stream2",
      "stream3",
      "stream4",
      "stream5",
      "stream6",
    ].map(streamParam => {
      const streamName = this.props.params[streamParam];
      if(!streamName) return;
      setTimeout((streamName) => {
        this.props.methods
          .appendStream(streamName)
      }, 0, streamName);
    });
  },
  componentWillUnmount() {
    delete this._mounted;
  },
  render() {
    const {
      requestOffset,
      // dataArray,
      components
    } = this.state;
    const {
      auth,
      fireRef,
      userData,
      versionData,
      data,
      methods: {
        appendStream,
        loadData
      },
      params
    } = this.props;

    return (
      <div className="top-level-component multistream-page">
        <div className="multi-search">
          <div className="box">
            <h3 className="title">Search for new streams/videos to add</h3>
            <br />
            <div className="separator-2-dimmer"></div>
            <br />
            <form onSubmit={this.performSearch}>
              <input ref="searchInput" type="text"/>
              <br /><br />
              <button>Search</button>
            </form>
          </div>
        </div>
        <div className="general-page">
          {
            components.map(componentName => {
              const ListItem = searchComponents[componentName].comp;
              const name = searchComponents[componentName].name;
              const dataArray = this.state[componentName];
              // console.log(componentName, dataArray);
              if(dataArray.length === 0) return  (
                [
                  <div key={componentName} className={"search-results"}>
                    <div className="title">
                      <span>No {name} Results</span>
                    </div>
                  </div>,
                  <div key={`${componentName}-sep`} className="separator-4-black"></div>
                ]
              );
              return (
                [
                  <div key={componentName} className={"search-results"}>

                    <div className="title">
                      <span>{name} Results.</span>
                    </div>
                    <div className="wrapper">
                      <ul className="list">
                        {
                          dataArray.map((itemData, ind) => {
                            if(!itemData) return console.error("no data");
                            return <ListItem
                              auth={auth}
                              fireRef={fireRef}
                              userData={userData}
                              versionData={versionData}
                              key={ind}
                              data={itemData}
                              index={ind}

                              filter={"all"} // for channels

                              methods={{
                              appendStream
                            }} />
                          })
                        }
                      </ul>
                    </div>
                    {
                      <div className="tools">
                        <div className="parent">
                          <div className="scroll">
                            {/* <div className="option btn-default refresh" onClick={() => this.refreshList(true)}>
                              Refresh Listing
                            </div> */}
                            <div className="btn-default load-more" onClick={this.gatherData}>
                              Load More
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>,
                  <div key={`${componentName}-sep`} className="separator-4-black"></div>
                ]
              );
            })
          }
        </div>
      </div>
    );
  }
})
