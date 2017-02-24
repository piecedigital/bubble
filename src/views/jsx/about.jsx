import React from "react";
import { browserHistory as History } from 'react-router';

export default React.createClass({
  displayName: "About",
  render() {
    return (
      <div className="top-level-component about">
        <div className="general-page about">
          <div className="wrapper-about">
            <section>
              <p>
                <span className="headline">What Is "Amorrius"?</span>
              </p>
              <p>
                <span className="limit">
                  Amorrius is a platform for <a href="http://twitch.tv" target="_blank" rel="nofollow">Twitch</a> users to enjoy the Twitch experience in a better or different way. Twitch streamers and viewers get a better to interact, and the viewing experience is pretty dope as well.
                  <br/><br/>
                  Have a question for you favorite streamer? Ask them and receive and answer.
                  <br/><br/>
                  Don't know what game to play on stream today? Make a poll for your viewers to vote on.
                  <br/><br/>
                  Like to play with viewers? Game Queue makes it easy to track who to play with next and who's already played.
                  <br/><br/>
                  Want to check out a streamer later, but you don't want to spend a follow on it just yet? Bookmark them!
                  <br/><br/>
                  And other smaller features, like being able to refresh the chat or video independently, and getting a timestamped video link if you're watching a VOD.
                  <br/><br/>
                  Amorrius is a SPA (Single-Page Application) so you don't need to worry about page refreshes. This means you won't miss a beat while watching your favorite streams while navigating the app.
                </span>
              </p>
            </section>
            <section>
              <p>
                <span className="headline">What Does "Amorrius" Mean?</span>
              </p>
              <span className="limit">
                <p>
                  I picked several Latin words (courtesy of Google Translate) to mean close to what's relevant to the app.
                  Amicus - "friend"
                  <br/><br/>
                  Torrens - "Stream" (of wealth, quantity)
                  <br/><br/>
                  Penitus - "interact"
                </p>
              </span>
            </section>
            <section>
              <p>
                <span className="headline">Why Should I Use Amorrius?</span>
                <span className="limit">
                  You should use Amorrius if you're not satisfied with the native Twitch expeirence.
                  <br/><br/>
                  You should use it if you like to watch multiple streams.
                  <br/><br/>
                  You should use it if you want a more complete Twitch experience.
                  <br/><br/>
                  You should use it if you like to interact with your viewers.
                  <br/><br/>
                  You should use it if you like the existing features, and hopeful/planned future features.
                  <br/><br/>
                  You should use it if you like <a href="http://piecedigital.net" target="_blank" rel="nofollow">me</a> (the developer). I'm hella dope... I think.
                </span>
              </p>
            </section>
            <section>
              <p>
                <span className="headline">What Features Does Amorrius Have?</span>
              </p>
              <span className="limit">
                <ul className="list">
                  <li>Multi-stream viewing (only up to 6, currently. That seemed like an optimal count for a viewing experience). Individual streams have their own set of options:</li>
                  <ul className="list">
                    <li>Refresh video or chat independently</li>
                    <li>Open stream panels</li>
                    <li>Bookmark the stream</li>
                    <li>Follow/Unfollow the channel</li>
                    <li>Open the question submission view for a channel</li>
                  </ul>
                  <li>Questions and answers</li>
                  <li>Polls</li>
                  <li>Comments for questions and polls</li>
                  <li>User queuing</li>
                  <li>Bookmarks</li>
                </ul>
              </span>
            </section>
          </div>
        </div>
      </div>
    );
  }
});
