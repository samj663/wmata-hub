import React, {useState, useEffect} from 'react';
import './App.css';
/**
 * Displays station information of the station passes through props.
 * @param {*} props stationName is the name of the station. updateList is a function that changes the list of stations.
 *            when a line icon is clicked
 * @returns Station information.
 */
export default function StationInfo(props){
    const [isDone, setDone] = useState(false);
    const [station, setStation] = useState(Object);
    const [station2, setStation2] = useState(Object);
    const [stationEntrances, setEntrances] = useState([]);
  
    // This will run whenever the component updates
    // Which should be when a station name is sent through props
    useEffect(() => {
      if(station == null) getStationInfo(props.stationName);
      else if(props.stationName !== station.Name && props.stationName !== undefined && props.stationName !== null) getStationInfo(props.stationName);
    });
  
    const linesServed = (value, index)=>
    <div className={"transfer-station-circle-"+value} key={index+value} id={index+value} onClick={()=>props.updateList(value, station.Name)}>{value} </div>;
  
    const entrances = ({Name,Description}, index) => <p key={index}>{Name + ": " + Description}</p>;
  
    //Get and displays line icons which represents the lines the station serves.
    function getLines(){
      var l = [];
      if(station.LineCode1 != null) l.push(station.LineCode1);
      if(station.LineCode2 != null) l.push(station.LineCode2);
      if(station.LineCode3 != null) l.push(station.LineCode3);
      if(station.LineCode4 != null) l.push(station.LineCode4);
      if(station2 != null){
        if(station2.LineCode1 != null) l.push(station2.LineCode1);
        if(station2.LineCode2 != null) l.push(station2.LineCode2);
        if(station2.LineCode3 != null) l.push(station2.LineCode3);
        if(station2.LineCode4 != null) l.push(station2.LineCode4);
      }
      return(
        <div id="lines-served">
          {l.map(linesServed)}
        </div>
      )
    }
  
    //Fetches information of a train station
    function getStationInfo(station){
      fetch(`/stationInfo?station=${station}`)
      .then(res => res.json())
      .then(v => { 
        console.log(v);
        setStation(v);
        setStation2(null);
        if(v.StationTogether1 !== "") getStation2(v.StationTogether1);
        setDone(true);
        getEntrances(station);
      }).catch(error=>{
        console.error(error);
      });
    }
  
    //Gets all the entrances to the station
    function getEntrances(station){
      fetch(`/stationEntrance?station=${station}`)
      .then(res => res.json())
      .then(v => { 
        setEntrances(v);
      }).catch(error=>{
        console.error(error);
      });
    }
    
    //Fetches station information from the second level of a transfer station
    function getStation2(s){
      fetch(`/stationInfo?station=${s}`)
      .then(res => res.json())
      .then(v => { 
        console.log(v);
        setStation2(v);
        setDone(true);
      }).catch(error=>{// If input is invalid or not found, fetch will return 400 status code 
        console.error(error);
      });
    }
  
    function displayText(stationInfo){
      return(
        <div className="station-info-content">
          <div className="section-title">{station.Name} Station Information</div>
          <div className="section-container">
            <div className="station-info-subsection">Lines Served</div>
                {getLines()}
            <div className="station-info-subsection">Address</div>
              <p className="station-info-subsection-address">{`${stationInfo.Address.Street}, ${stationInfo.Address.City}, ${stationInfo.Address.State},${stationInfo.Address.Zip}`}</p>
            <div className="station-info-subsection">Entrances</div>
              <div className="station-info-subsection-entrances">{stationEntrances.map(entrances)}</div>
          </div>
        </div>
      )
    }
  
    return(
      <div className="station-info">
        {isDone ? displayText(station) : null}
      </div>
    );
  }