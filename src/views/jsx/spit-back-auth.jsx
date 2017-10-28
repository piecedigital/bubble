import React from "react";
import { browserHistory as History } from 'react-router';

export default React.createClass({
  displayName: "About",
  render() {
    const {
      auth,
      userData,
    } = this.props;

    if(typeof window !== "undefined") {
      if(auth && userData) {

        window.opener.postMessage(JSON.stringify({
          res: "auth",authData:auth,userData
        }), "*");

      }
    };

    return (
      <div className="top-level-component about">
        <div className="general-page about">
          <div className="wrapper-about">
            <section>
              <p>
                <span className="headline">Authenticating...</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }
});
