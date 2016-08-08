import React from "react";
import { Link, browserHistory as History } from 'react-router';

// list item for featured streams
const ListItem = React.createClass({
  displayName: "feat-ListItem",
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
    return (
      <li>
        <Link to={`/search/game?q=${name}`}>
          <div className="image">
            <img src={box.medium} />
          </div>
          <div className="info">
            <div className="game-name">
              {name}
            </div>
            <div className="channel-count">
              {`${channels} total streams`}
            </div>
            <div className="viewer-count">
              {`${viewers} total viewers`}
            </div>
          </div>
        </Link>
      </li>
    )
  }
})

// primary section for the featured component
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
      })
      .then(methods => {
        methods
        .topGames()
        .then(data => {
          // console.log(data);
          this.setState({
            offset: this.state.requestOffset + 20,
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
        <div className="wrapper">
          <ul className="list">
            {
              dataArray.map((itemData, ind) => {
                return <ListItem key={ind} index={ind} data={itemData} />
              })
            }
          </ul>
        </div>
      </div>
    );
  }
})
