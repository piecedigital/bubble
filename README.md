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


# Things to add eventually
- Stream reordering - TBD
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
