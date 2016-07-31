import React from "react";
import Home from "./home.jsx";
import { ajax } from "../../modules/ajax";
import { Link } from 'react-router';

export default React.createClass({
  displayName: "Layout",
  getInitialState() {
    return {
      prePlaceData: this.props.data
    }
  },
  componentDidMount() {
    new Promise((resolve, reject) => {
      if(!this.props.data) {
        ajax({
          url: "/get-test-data",
          success(data) {
            console.log(data);
            resolve(JSON.parse(data));
          },
          error(e) { console.error(e); }
        });
      } else {
        resolve(this.props.data);
      }
    })
    .then(data => {
      this.setState({
        prePlaceData: data
      });
    });
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !!nextState.prePlaceData;
  },
  render() {
    const {
      prePlaceData
    } = this.state;
    return (
      <div>
        <nav><Link to={"/"}>Home</Link><Link to={"/profile"}>Profile</Link></nav>
        {
          function () {
            if(prePlaceData) {
              return this.props.children ? React.cloneElement(this.props.children, {
                data: prePlaceData
              }) : <Home data={prePlaceData}/>
            }
          }.bind(this)()
        }
      </div>
    )
  }
});
