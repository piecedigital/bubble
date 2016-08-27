import React from "react";

// components
let components = {};

// list item for streams matching the search
components.StreamsListItem = React.createClass({
  displayName: "stream-ListItem",
  render() {
    console.log(this.props);
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
            {`Streaming to ${viewers} viewer${viewers > 1 ? "s" : ""}`}
          </div>
        </div>
      </li>
    )
  }
})

// primary section for the search component
export default React.createClass({
  displayName: "SearchPage",
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
      },
      params,
      location
    } = this.props;
    if(loadData) {
      let capitalType = params.searchtype.replace(/^(.)/, (_, letter) => {
        return letter.toUpperCase();
      });
      let searchType = `search${capitalType}`;
      this.setState({
        requestOffset: this.state.requestOffset + 25
      });
      loadData.call(this, e => {
        console.error(e.stack);
      }, {
        query: location.query.q
      })
      .then(methods => {
        methods
        [searchType]()
        .then(data => {
          this.setState({
            // offset: this.state.requestOffset + 25,
            dataArray: Array.from(this.state.dataArray).concat(data.channels || data.streams || data.games),
            component: `${capitalType}ListItem`
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
      dataArray,
      component
    } = this.state;
    const {
      data,
      methods: {
        appendStream,
        loadData
      },
      location
    } = this.props;
    if(component) {
      const ListItem = components[component];
      return (
        <div className="top-level-component search-page">
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
