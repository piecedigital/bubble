import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../../modules/load-data";

// components
let components = {
  // list item for streams matching the search
  StreamsListItem: React.createClass({
    displayName: "stream-ListItem",
    render() {
      // console.log(this.props);
      const {
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
            language
          }
        }
      } = this.props;
      let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
      return (
        <li onClick={() => {
          appendStream(name)
        }}>
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
        </li>
      )
    }
  })
};


// primary section for the search component
export default React.createClass({
  displayName: "FollowedStreams",
  getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    }
  },
  gatherData() {
    const limit = 25;
    const {
      methods: {
        // loadData
      },
      location
    } = this.props;
    if(loadData) {
      let offset = this.state.requestOffset;
      this.setState({
        requestOffset: this.state.requestOffset + limit
      });
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        offset,
        limit: limit
      })
      .then(methods => {
        methods
        .followedStreams()
        .then(data => {
          this.setState({
            // offset: this.state.requestOffset + 25,
            dataArray: Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games || data.top),
            component: `StreamsListItem`
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  componentDidMount() { this.gatherData(); },
  render() {
    const {
      requestOffset,
      dataArray,
      component
    } = this.state;
    const {
      data,
      methods: {
        appendStream,
        loadData
      }
    } = this.props;
    if(component) {
      const ListItem = components[component];
      return (
        <div className={`top-level-component general-page profile`}>
          <div className="wrapper">
            <ul className="list">
              {
                dataArray.map((itemData, ind) => {
                  return <ListItem key={ind} data={itemData} index={ind} methods={{
                    appendStream
                  }} />
                })
              }
            </ul>
          </div>
          <div className="tools">
            <div className="btn-default load-more" onClick={this.gatherData}>
              Load More
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`top-level-component general-page profile`}>
          {`Loading followed streams...`}
        </div>
      );
    }
  }
})
