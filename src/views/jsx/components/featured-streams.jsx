import React from "react";

// list item for featured streams
const ListItem = React.createClass({
  displayName: "feat-ListItem",
  render() {
    const {
      index,
      methods: {
        displayStream
      },
      data: {
        stream: {
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
      }
    } = this.props;
    return (
      <li onClick={() => {
        displayStream(index)
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
        </div>
      </li>
    )
  }
})

// the displayed stream of the feature streams
const FeaturedStream = React.createClass({
  displayName: "FeaturedStream",
  render() {
    console.log(this.props);
    const {
      data: {
        stream: {
          channel: {
            name
          }
        }
      }
    } = this.props;
    return (
      <div className="featured-stream">
        <div className="stream">
          <iframe src={`http://player.twitch.tv/?channel=${name}`} />
        </div>
      </div>
    );
  }
});

// primary section for the featured componentt
export default React.createClass({
  displayName: "FeaturedStreams",
  getInitialState() {
    return {
      featuredRequestOffset: 0,
      featuredArray: [],
      featuredStreamIndex: 0
    }
  },
  displayStream(index) {
    this.setState({
      featuredStreamIndex: index
    });
  },
  componentDidMount() {
    const {
      loadData
    } = this.props;
    if(loadData) {
      loadData(e => {
        console.error(e.stack);
      })
      .featured()
      .then(data => {
        // console.log(data);
        this.setState({
          featuredRequestOffset: this.state.featuredRequestOffset + 25,
          featuredArray: Array.from(this.state.featuredArray).concat(data.featured)
        });
      })
      .catch(e => console.error(e.stack));
    }
  },
  render() {
    const {
      featuredRequestOffset,
      featuredArray
    } = this.state;
    const {
      methods: {
        appendStream
      }
    } = this.props
    // console.log(featuredArray);
    return (
      <div className="featured-streams">
        {
          featuredArray.length > 0 ? (
            <FeaturedStream data={featuredArray[this.state.featuredStreamIndex]} />
          ) : null
        }
        <div className="wrapper">
          <ul className="list">
            {
              featuredArray.map((itemData, ind) => {
                return <ListItem key={ind} index={ind} data={itemData} methods={{
                  appendStream,
                  displayStream: this.displayStream
                }} />
              })
            }
          </ul>
        </div>
      </div>
    );
  }
})
