# WMATA Information Hub

This web application provides information about the stations in the DC Metro. The user can enter a line or station and get a list of stations the line serves, station information (which inclues the address, lines served, and entrance locations), and next train information.

**Note:** It takes 15-30 seconds for the website to initially load after being idle for a while.

**Render URL:** https://wmatainfo.onrender.com/

**React Component "App":** View Manager
  * *Functionality:* Manages whether the home screen or metro system information view is visible
  * *Interactivity:* The user can enter a station or line in a search bar and will show the metro system information view.

**React Component 2 "HomeScreen":** Landing page
  * *Functionality:* Displays title and website of the website.
  * *Interactivity:* The user can click on a button to view a system map or system alerts.

**React Component 3 "LineInfo":** Metro Line and Station Information
  * *Functionality:* Displays a list of stations from the selected line
  * *Interactivity:* The user can scroll and click on each station name and the station nformation and next train component will update.

**React Component "StationInfo":** Retrieve station information
  * *Functionality:* Displays station information which includes the lines it serves, the address, and all the entrances to the station
  * *Interactivity:* The user can click on the line icons and the station list on the left will update to display all the stations that line will show.

**React Component "NextTrain":** Retrieve next train information
  * *Functionality:* Displays a list of all the trains that will arrive to the station soon.
  * *Interactivity:* When user clicks on a station in the list or enters a station in the search bar, it will show the next trains to that station.
