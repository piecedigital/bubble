import React from "react";
import { Link, browserHistory as History } from 'react-router';
import loadData from "../../modules/client/load-data";
import { ListItemHoverOptions } from "./components/hover-options.jsx";
import { CImg } from "../../modules/client/helper-tools";
import * as components from './components/list-items.jsx';

export default React.createClass({
  displayName: "StreamsPage",
  getInitialState() {
    return {
      page: this.props.params ? this.props.params.page : null,
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
    if(!params.page) return;
    if(loadData) {
      let capitalType;
      switch (params.page.toLowerCase()) {
        case "streams": capitalType = "Stream"; break;
        case "games": capitalType = "Game"; break;
        default:

      }
      let searchType = `top${capitalType}s`;
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
          // console.log(components, components.GameListItem, components.StreamListItem);
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
  shouldComponentUpdate(nextProps) {
    return !!this.props.params.page || !!nextProps.params.page;
  },
  componentWillReceiveProps(nextProps) {
    // console.log("updated");
    this.setState({
      page: nextProps.params.page || this.state.page
    });
  },
  componentDidUpdate(_, oldState) {
    if(this.state.page !== oldState.page) {
      this.setState({
        dataArray: [],
        requestOffset: 0
      }, () => {
        this.gatherData();
      });
    }
  },
  render() {
    const {
      requestOffset,
      dataArray,
      component,
      page
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
        <div className={`top-level-component ${page || (params ? params.page : data.page)}`}>
          <div className="general-page">
            <div className="wrapper">
              <ul className="list">
                {
                  dataArray.map((itemData, ind) => {
                    return (
                      [
                        <ListItem
                          key={ind}
                          fireRef={fireRef}
                          auth={auth}
                          userData={userData}
                          data={itemData}
                          index={ind}
                          methods={{
                            appendStream
                          }} />,
                          <div key={`sep-${ind}`} className={`separator-4-dim`}></div>
                      ]
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
