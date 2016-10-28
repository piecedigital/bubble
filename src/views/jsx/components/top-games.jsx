import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../../modules/load-data";

// list item for featured streams
const ListItem = React.createClass({
  displayName: "game-ListItem",
  render() {
    const {
      data: {
        channels,
        viewers,
        game: {
          name,
          _id: id,
          box,
        }
      }
    } = this.props;
    let viewersString = viewers.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
    let channelsString = channels.toLocaleString("en"); // https://www.livecoding.tv/earth_basic/
    return (
      <li className={`game-list-item`}>
        <Link to={`/search/streams?q=${name}`}>
          <div className="image">
            <img src={box.medium} />
          </div>
          <div className="info">
            <div className="game-name">
              {name}
            </div>
            <div className={`separator-1-7`}></div>
            <div className="channel-count">
              {`${channelsString} total streams`}
            </div>
            <div className="viewer-count">
              {`${viewersString} total viewers`}
            </div>
          </div>
        </Link>
      </li>
    )
  }
})

// primary section for the top games component
export default React.createClass({
  displayName: "TopGames",
  getInitialState() {
    return {
      requestOffset: 0,
      dataArray: []
    }
  },
  componentDidMount() {
    const {
      methods: {
        loadData
      }
    } = this.props;
    if(loadData) {
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        limit: 10
      })
      .then(methods => {
        methods
        .topGames()
        .then(data => {
          // console.log(data);
          this.setState({
            offset: this.state.requestOffset + 10,
            dataArray: Array.from(this.state.dataArray).concat(data.top)
          });
        })
        .catch(e => console.error(e.stack));
      })
      .catch(e => console.error(e.stack));
    }
  },
  render() {
    const {
      requestOffset,
      dataArray
    } = this.state;
    const {
      methods: {
        appendStream,
        loadData
      }
    } = this.props
    return (
      <div className="top-games">
        <div className={`title`}>Top 10 Games</div>
        <div className="wrapper">
          <ul className="list">
            {
              dataArray.map((itemData, ind) => {
                return (
                  <ListItem key={ind} index={ind} data={itemData} />
                );

              })
            }
          </ul>
        </div>
      </div>
    );
  }
})
