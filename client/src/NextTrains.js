import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/**
 * Displays next train information from the station that was passed through
 * the parameter "props.stationName"
 * @param {*} props stationName: the station to retrieve next trains from
 * @returns Next train infromation section of the page
 */
export default function NextTrains(props){
    const [isDone, setDone] = useState(false);
    const [group1, setGroup1] = useState([]);
    const [group2, setGroup2] = useState([]);
    const [group3, setGroup3] = useState([]);
    const [group4, setGroup4] = useState([]);
    const [stationName, setStationName] = useState();
    const [timer, setTimer] = useState(0);
    
    /**
     * gets next train infromation from station provided in parameter "s".
     * To prevent an update loop when the component update, the
     * function is put in useCallback function.
     */
    const getNextTrain = useCallback((s) => {
      clearTimeout(timer);
      fetch(`/nextTrain?station=${s}`)
      .then(res => res.json())
      .then(value => { 
        console.log(value);
        if(value[0] === undefined){
          setStationName(s);
          setDone(true);
          return;
        }
        var code = value[0].LocationCode
        value = value.sort((a, b) => {return (a.Group + a.line) - (b.Group + b.line)});
        setGroup1(value.filter(item => item.Group === '1' && item.LocationCode === code ));
        setGroup2(value.filter(item => item.Group === '2' && item.LocationCode === code ));
        setGroup3(value.filter(item => item.Group === '1' && item.LocationCode !== code ));
        setGroup4(value.filter(item => item.Group === '2' && item.LocationCode !== code ));
        setStationName(s)
        setDone(true);
        setTimer(window.setTimeout(()=>{getNextTrain(s)}, 10000))
      }).catch(error=>{
        console.error(error);
        setDone(true);
      });
      
    },[timer]);
  
    //HTML code to dsiplay each next train object
    const trainList = ({DestinationCode,Line,Min,Group,Car, Destination}, index) => 
      <tr key={DestinationCode + Line + Min + Group + Car + index} id={DestinationCode + Line + Min + Group + Car + index}>
        <td>{Line}</td>
        <td>{Car}</td>
        <td>{Destination}</td>
        <td>{Min}</td>
      </tr>;
      
    /**
     * Update next train information when component is updated.
     * Also clears timer to make sure getNextTrain isn't using the previous station that
     * was displayed.
     */
    useEffect(() => {
      if(props.stationName !== stationName && props.stationName !== undefined && props.stationName !== null){
        setStationName(props.stationName);
        getNextTrain(props.stationName);
      }
      return()=>{
        clearTimeout(timer);
      }
    },[props.stationName, stationName, timer, getNextTrain]);
  
    //Converts array of next trains into tables.
    function displayTable(g){
      if(g.length === 0) return(<div></div>);
      return(
        <div>
        <table id="next-train-table">
            <tbody>
              <tr className="title_row">
                <td>Ln</td>
                <td>Cars</td>
                <td>Dest</td>
                <td>Min</td>
              </tr> 
              {g ? g.map(trainList) : null}
            </tbody>
          </table>
        </div>
      )
     }
  
    //displays next train table when data is finished being fetched.
    function displayText(){
      return(
          <div id="next-train-section"> 
            {group1 ? displayTable(group1) : null}
            {group2 ? displayTable(group2) : null}
            {group3 ? displayTable(group3) : null}
            {group4 ? displayTable(group4) : null}
          </div>
      );
    }
  
    return(
      <div id="next-train">
        <div className="section-title">Next Train Information</div>
        {isDone ? displayText() : null}
      </div>
    );
  }
  