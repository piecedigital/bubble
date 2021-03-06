import React from "react";
import { Link } from 'react-router';
import loadData from "../../modules/client/load-data";
import { ListItemHoverOptions } from "./components/hover-options.jsx";
import { CImg } from "../../modules/client/helper-tools";
import { StreamListItem, ChannelListItem, VideoListItem, SearchGameListItem } from "./components/list-items.jsx";

// components
let searchComponents = {};

searchComponents.StreamsListItem = {
  name: "Stream",
  comp: StreamListItem,
};
searchComponents.ChannelsListItem = {
  name: "Channel",
  comp: ChannelListItem,
};
searchComponents.VideosListItem = {
  name: "Video",
  comp: VideoListItem,
};
searchComponents.GamesListItem = {
  name: "Game",
  comp: SearchGameListItem,
};

// primary section for the search component
export default React.createClass({
  displayName: "SearchPage",
  getInitialState() {
    return {
      requestOffset: 0,
      // dataArray: [],
      StreamsListItem: [],
      ChannelsListItem: [],
      VideosListItem: [],
      GamesListItem: [],
      components: []
    }
  },
  gatherData(limit, offset, callback) {
    const {
      params,
      location
    } = this.props;
    if(!params.searchtype) {
      limit = 12;
    } else {
      limit = typeof limit === "number" ? limit : this.state.limit || 25;
    }

    offset = typeof offset === "number" ? offset : this.state.requestOffset;
    if(loadData) {
      const searchParam = params.searchtype || "All";
      const capitalType = searchParam.replace(/^(.)/, (_, letter) => {
        return letter.toUpperCase();
      });

      let searchTypes = [];
      // console.log(params);
      if(searchParam === "All") {
        searchTypes.push("searchStreams", "searchGames", "searchChannels", "searchVideos");
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
        query: encodeURIComponent(location.query.q),
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
              let dataArray = Array.from(this.state[componentName]).concat(data.channels || data.streams || data.games || data.vods).filter(d => !!d);

              // filter for only truthy data
              // console.log(searchType, capitalType, componentName, dataArray);
              dataArray = dataArray.filter(d => !!d);

              if(this.state.components.indexOf(componentName) < 0) {
                this.state.components.push(componentName);
              }

              this._mounted ? this.setState({
                // offset: this.state.requestOffset + 25,
                [componentName]: dataArray,
                components: this.state.components
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
      components: []
    };
    this._mounted ? this.setState(obj, cb) : null;
  },
  componentDidMount() {
    this._mounted = true;
    this.gatherData();
  },
  componentWillReceiveProps(nextProps) {
    const {
      params: {
        searchtype,
      },
      location: {
        query: {
          q
        }
      }
    } = this.props;

    if(nextProps.params.searchtype !== searchtype || nextProps.location.query.q !== q) {
      console.log("refreshing");
      this.refreshLists(() => {
        this.gatherData();
      });
    }
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
      location,
      params
    } = this.props;

    if(components.length > 0) {
      return (
        <div className="top-level-component search-page">
          <div className="general-page">
            {
              components.map(componentName => {
                const ListItem = searchComponents[componentName].comp;
                const name = searchComponents[componentName].name;
                const dataArray = this.state[componentName];
                // console.log(componentName, dataArray);
                if(dataArray.length === 0) return (
                  [
                    <div key={componentName} className={"search-results"}>
                      <div className="title">
                        <span>{name} Results.</span>
                        None
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
                        {
                          (!params.searchtype) ? (
                            [
                              " ",
                              <Link key="link" className="load-more" to={`/search/${name.toLowerCase()}s?q=${encodeURIComponent(location.query.q)}`}>
                                See More...
                              </Link>
                            ]
                          ) : null
                        }
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
                        (params.searchtype) ? (
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

                        ) : null
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
    } else {
      return (
        <div className="search-page">
          {`Loading streams for ${location ? location.query.q || location.query.query : data.query.q || data.query.query}...`}
        </div>
      );
    }
  }
})
