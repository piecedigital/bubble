# Things to add before v 1
- Notifications - 0.8.0 **done**
- Questions Listed - 0.9.0 **done**
- Polls - 0.10.0 **done**
  - Featured section titles - 0.10.3 **ok**
  - Bookmark button for featured stream - 0.10.3 **ok**
  - Fixed overlay modal - 0.10.4 **ok**
  - Fixed bookmarking - 0.10.5 **ok**
- Game invite queuing - 0.11.0 **done**
  - Hot fix HTTPS fixed - 0.11.1 **ok**
  - Improved Firebase authorization - 0.11.2 **ok**
  - Sneak update: added SSL - 0.11.2 **ok**
  - Fixed undefined name on `follow-streams` titles - 0.11.2 **ok**
  - UI improvements - 0.11.3 **ok**
  - Images use special "primer" component. Text tweaks. Game queue "Subscribers Only" option now only available to partnered streamers - 0.11.4 **ok**
  - Hot Fix. - 0.11.5 **ok**
  - Navigation fix for overlays. Added timestamped link to stream players menu. Using embed API. Fixed `CImg` component not updating image. Updated `answerQuestion` to accept video links as answers. Adjusted `UserInfo` to handle buttons better. Fixed `returnTo` navigation when going from a question view - 0.11.6 **ok**
  - Fixed mixed content for Twitch embed SDK. Fixed channel streams not appending - 0.11.7 **ok**
  - Fixed menu longness - 0.11.8 **ok**
  - fixed undefined error - 0.11.9 **ok**
- Add polish: - 0.12.0
  - Add pages: About, Terms of Service **ok**
  - UI fixed for user info **ok**
- Bug fixes: - 0.12.1
  - Receiver username missing from question URL in question tools **ok**
  - Add application name **ok**
  - Add feedback overlay **ok**
- Bug fixes: 0.12.2
  - Fixed VOD appending **ok**
- Bug fixes: 0.12.3
  - Fixed VOD linking **ok**
- Bug fixes: 0.12.4
  - Fixed potential issue with multistreamfeature **ok**
- Bug fixes and improvements: 0.12.5 **ok**
  - Improved stream/VOD appending logic **ok**
  - Fixed cookie regex **ok**
- Bug fixes: 0.12.6
  - Fixed profiles not being visible to non-authed users **ok**
  - Follow list can now be viewed oon profile without being authed **ok**
  - Notifications only for people you follow **ok**
- Improvements: 0.12.7
  - Add logo **ok**
- Improvements: 0.12.8
  - Refactored code for modularity and reusability **ok**
  - Share stream button **ok**
  - Link in stream panels should open up in their own damn tab now **ok**
- Bug Fixes: 0.12.9
  - Fixed bug preventing live streams from listing **ok**
- Improvement: 0.12.10
  - Added Twitter link **ok**
- Bug fixed: 0.12.11
  - Fixed links in panels not opening in new window due to some not having an HTML description **ok**
- Bug fixed: 0.12.12
  - Share link "via" now accurate **ok**
- Bug fixed, Improvement: 0.13.0
  - Fixed bookmarks **ok**
  - New host suggestion when a channel goes offline **ok**
- Patch: 0.13.1
  - Checking for host should happen constantly after the stream goes offline **ok**
- Patch: 0.13.2
  - Fixed CSS for host suggestion **ok**
- Improvements: 0.13.3
  - Improved UI for host suggestion **ok**
- Improvements: 0.13.4
  - In-view stream now have a hint of green in the menu **ok**
- Improvements: 0.13.5
  - Host suggestion goes away when returning to hoster **ok**
- Improvements: 0.13.6
  - Changed multistream parsing. Should be complient with normal URL parsers **ok**
- Improvements: 0.13.7
  - Improved host suggestion feature **ok**
- Bug fix: 0.13.8
  - Fixed bug with host suggestion not working when a stream goes offline **ok**
- Bug fix: 0.13.9
  - Migrating streams should should now be in focus if they were before **ok**
- Improvement and fix: 0.14.0
  - Added stream re-ordering **ok**
  - Fixed host suggestion UI **ok**
- Improvements: 0.14.1
  - UI adjustment to host suggestion **ok**
  - UI adjustment to stream reorder view **ok**
- Improvements and bug fixes: 0.14.2
  - Making sure queuing up users are put in the correct order **ok**
  - Fixed "queue up" input not going away after queuing up **ok**
- Improvements and bug fixes: 0.14.3
  - Fixed overlap of player stream tools menu **ok**
  - Added notes for players in game queue **ok**
  - Fixed typo in "about" page **ok**
  - Queue creator will know if their queue is now available **ok**
  - Queue creator can close the game queue so no one can sign up **ok**
- Improvements: 0.14.4
  - Improved stream reordering **ok**
  - Fixed host checking. It no longer checks for hosts for unmounted components **observing**
- Bug Fix: 0.14.5
  - Fixed a bug where a single stream was not visible **ok**
- Improvements: 0.14.6
  - Fixed stream reordering **ok**
- Addon: newrelic
- Improvements and bug fixes: 0.14.7 **ok**
  - Fixed duplication error with channels lists on user profiles **ok**
  - Added live VOD time stamp (still monitoring integrity) **ok**
  - Improved default image performance **ok**
- Improvements: 0.14.8
  - Changed text for VOD link button to be more relevant **ok**
- Bug fixes and Improvement: 0.14.9
  - "Change in-view stream" is not behaving well with stream re-ordering. This'll fix that. **ok**
  - Stream reordering is not getting new streams after first use. Fix **ok**
  - Affiliate recognition on profiles (affiliate, partner) **ok**
- Bug Fix: 0.14.10
  - Fixed a bug preventing stream chat elements from closing **ok**
- Bug Fixes and Improvements: 0.14.11
  - Added new icons to the player **ok**
  - Fixed channel not being removed when unfollowed (from follow-streams.jsx) **ok**
  - Migrating a stream no longer focuses it if the host stream wasn't already in focus **ok**
  - Improved name scrolling in player stream menu **ok**
- Bug Fixes and Improvements: 0.14.12
  - Fixed a minor UI overlap issue in the player nav **ok**
  - Fixed the follow button having a non-breakable space **ok**
  - When the nav is collapsed into mobile mode it stays open when an input is in focus **ok**
- Improvements: 0.14.13
  - Display time length on listed videos **ok**
  - Can now get time-stamped live video without pausing **ok**
  - Follow/Unfollow button is orange when it's function is to unfollow, and green for follow **ok**
- Bug fixes: 0.14.14
  - Fixed follow button in stream menus **ok**
  - Fixed stream menus not closing when the timestamped link is not available **ok**
- Improvements: 0.15.0
  - Improved authentication process **ok**
- Improvements: 0.15.1
  - Initial search page now contains other search results (videos, games, channels) **ok**
  - Search inputs take off white space on ends
- Bug Fixes: 0.15.2
  - Fixed some data gathering and filtering issues **ok**
- Improvements: 0.15.3
  - Search inputs take off white space on ends **ok**
- Improvements: 0.15.4
  - Beginning some simple server side adjustments for SEO **ok**
- Improvements: 0.15.5
  - SEO upgrades: key profile information renders server side **ok**
- Bug fix and Improvement: 0.15.6
  - Fix redirect loop for alternate profile path ("/p/<username>")
  - Improved how followings/followers are loaded
- Bug fix: 0.15.7
  - Fixed bug preventing the loading of profile due to server rendering differences **ok**
- Bug fix: 0.15.8
  - Fixed bug preventing the loading of search results **ok**
- Bug fix: 0.15.9
  - Fixed bug preventing the loading of profile pages for missing/incorrect usernames **ok**
- New Feature: 0.16.0
  - NEW dedicated multi-stream page **ok**
    - "/multistream". Also "/ms" and "/multi" are accepted
- Improvement: 0.16.1
  - Multi-stream link generator in player now uses dedicated page path **ok**
- Bug fix and Improvement: 0.16.2
  - Fixed search child pages not working **ok**
  - Multistream page has unique description **ok**
- Bug fix: 0.16.3
  - Fixed a silly bug preventing streams and games pages from loading **ok**
- Bug fix: 0.16.4
  - Fixed issue where selecting "see more" from the search page would not change page **ok**
  - Fixed name scrolling in player **ok**
- Bug fix and Improvements: 0.16.5
  - NEW FEATURE: synchronize your viewing experience with someone else. **ok**
  - Fixed scrolling issue with overlay **ok**
- Improvements: 0.16.6
  - Added broadcast type **ok**

# Things to add eventually
- Allow users to vote on polls without logging in
- Meta data update and full server-side rendering - TBD
- PVP card game - TBD
- AMAs - TBD


Latin words:
- Flumine - "Stream" - river
- Torrens - "Stream" - wealth, quantity
- Multis - "Many"
- Quastio - "question"
- Penitus - "interact"
- Amicis - "friends"
- Amicus - "friend"

# Name concepts:
<!-- - FlumPenAm - Flumine + Penitus + Amicis -->
<!-- - FluPenAm - Flumine + Penitus + Amicis -->
<!-- - PentiFlum - Penitus + Flumine -->
<!-- - PentiFlu - Penitus + Flumine -->
<!-- - PenAmic - Penitus + Amicis -->
<!-- - TorrAmic - Torrens + Amicis -->
<!-- - AmiTor - Amicis + Torrens -->
<!-- - AmicisTor - Amicis + Torrens -->
<!-- - ATorius - Amicis + Torrens + Penitus -->
- Amorrius - Amicis + Torrens + Penitus
<!-- - PenTor - Penitus + Torrens -->
<!-- - AmPeniTor - Penitus + Torrens -->
<!-- - PenTorrens - Penitus + Torrens
- PenTorren - Penitus + Torrens -->
<!-- - FluTorrus - Flumine + Torrens + Penitus -->
<!-- - FluTorius - Flumine + Torrens + Penitus -->

Officially this application is called Amorrius. https://amorrius.net


returns a list of channel that are hosting :target
http://tmi.twitch.tv/hosts?include_logins=1&target=29020039

returns only who is hosted by :host
http://tmi.twitch.tv/hosts?include_logins=1&host=83101325

returns a list of followers that are hosting somebody
https://api.twitch.tv/api/users/piecedigital/followed/hosting?client_id=cye2hnlwj24qq7fezcbq9predovf6yy
