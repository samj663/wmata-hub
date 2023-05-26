import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import StationInfo from './StationInfo'
import NextTrains from './NextTrains'
import handleLineInput from './handleLineInput';

/**
 * Displays metro system information like station list, next train info, and 
 * station information
 * @param {*} props 
 * @returns 
 */
export default function LineInfo(props){
    const [stationList, setStations] = useState([]);
    const [input, setInput] = useState("");
    const [showStationInfo, setStationInfo] = useState(false);
    const [showTable, setTable] = useState("hide-section");
    const [stationName, setStationName] = useState("");
    const [lineCode, setLineCode] = useState("");
    const [invalidInput, setInvalidInput] = useState("input-text-box");
  
    const updateList = (line, station) => getStationList(line, station);
  
    const handleInput = (e) =>{ setInput(e.target.value); setInvalidInput("input-text-box");};
  
    const submitHandler = (e) =>{ e.preventDefault(); getStationInfo(input);}
  
    //HTML code that represents a station list element
    const trainList = (station, index) =>
      <div className="station-container" key={index} id={index + station} onClick={()=>setStationName(station)}>
        <div className={"line-box-" + lineCode}>
            <div className="station-circle">
                <div className="inner-station-circle"></div>
            </div>
        </div>
        <p className="center-station-name">
            {station}
        </p>
     </div>;
  
    /**
     * Gets a list of stations that are served by a line. A station can be passes
     * to automatically display that station in StationInfo instead of the default which
     * is the first element in the list.
     */
    const getStationList = useCallback(async function getStationL(line, station){
      line = handleLineInput(line);
      await fetch(`/stationServed?line=${line}`)
      .then(res => res.json())
      .then(value => { 
        console.log(value);
        setStations(value);
        setLineCode(line);
        setTable(""); //Makes line information visible
        if(station == null) setStationName(value[0]); //automatically displays the station info of the first station entry
        else setStationName(station);
        setStationInfo(true);
        setInvalidInput("input-text-box");
        }).catch(error=>{// If input is invalid or not found, fetch will return 400 status code 
        console.error(error);
        setInvalidInput("input-text-box-invalid");
      })
    },[]);
  
    /**
     * Gets station information if submitted through search bar and sets the
     * station list to show a line the station is served by.
     * @param {*} station the station the user inputs.
     */
    async function getStationInfo(station){
      await fetch(`/stationInfo?station=${station}`)
      .then(res => res.json())
      .then(v => { 
        console.log(v)
        setStationName(v.Name);
        getStationList(v.LineCode1, station);
        setInvalidInput("input-text-box");
      }).catch(error=>{
        getStationList(station, null);
        setInvalidInput("input-text-box-invalid");
        console.error(error);
      });
    }
  
    useEffect(() => {
      if(props.line !== "" && props.station === ""){
        getStationList(props.line, null);
        setInput(props.input);
      }
      else if(props.station !== ""){
        getStationList(props.line, props.station)
        setInput(props.input);
      }
      return()=>{
        setStations([]);
      }
    },[getStationList, props.input, props.line, props.station]);
  
    return (
      <div id="line-info">
        <div id="top-side">
          <button className="back-button"  onClick={()=>props.screen(false)}>{"< Go Home"}</button>
          <form id="input-selection" onSubmit={e=>submitHandler(e)}>
            <input id={invalidInput} type="text" value={input} onChange={handleInput}></input>
            <button id="input-text-button" className="button-highlight" type="submit">Enter</button>
          </form>
          <p id="spacer-for-search"></p>
        </div>
        <div id="system-information">
          <section id="left-side" className={showTable}>
            {stationList ? stationList.map(trainList) : null}
          </section>
          <section id="middle-side" className={showTable}>
            { showStationInfo ? <StationInfo stationName={stationName} updateList={updateList}/> : null }
          </section>
          <section id="right-side" className={showTable}>
            { showStationInfo ? <NextTrains stationName={stationName} /> : null }
          </section>
        </div>
      </div>
    );
  }