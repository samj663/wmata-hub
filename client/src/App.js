import React, {useState} from 'react';
import './App.css';
import LineInfo from './LineInfo';
import handleLineInput from './handleLineInput';

/**
 * Component that handels if to display the home screen or metro system information.
 * @returns HomeScreen component or LineInfo component
 */
export default function App(){
  const[showNextScreen, setScreen] = useState(false);
  const[input, setInput] = useState("");
  const[line, setLine] = useState("");
  const[station, setStation] = useState("");
  const[invalidInput, setInvalidInput] = useState("input-text-box");

  const handleInput = (e) => {setInput(e.target.value);  setInvalidInput("input-text-box");};

  //Handles form submissions
  async function submitHandler(e){
    e.preventDefault();
    if(input.length > 0){
      setInvalidInput("input-text-box");
      setLine(input);
      await getStationInfo(input);
    }
    else{
      setInvalidInput("input-text-box-invalid");
    }
  }

  /**
   * Checks if input is a valid station. If not, the input is sent to
   * handleLineInfo to see if the input is a line instead.
   * If input is valid, setScreen is set to true and will load
   * LineInfo component instead of HomeScreen component.
   * @param {*} input user's input
   */
  async function getStationInfo(input){
    await fetch(`/stationInfo?station=${input}`)
    .then(res => res.json())
    .then(v => { 
      setLine(v.LineCode1);
      setStation(v.Name);
      setScreen(true);
    }).catch(error=>{ 
      if(handleLineInput(input)!= null){
        setLine(input);
        setStation("");
        setScreen(true);
      } 
      setInvalidInput("input-text-box-invalid");
      console.error(error);
    });
  }

  // HTML code that displays HomeScreen and search bar.
  function displayText(){
    return(
    <div>
      {<HomeScreen />}
      <div id="home-screen-search-bar">
        <form id="input-selection" onSubmit={e=>submitHandler(e)}>
          <input id={invalidInput} type="text" value={input} onChange={handleInput}></input>
          <button id="input-text-button" type="submit" >Enter</button>
        </form>
      </div>
    </div>
  )};
  
  return(
      <div id="main">{showNextScreen ? <LineInfo input={input} line={line} station={station} screen={setScreen}/> : displayText()}</div>
  )
}

/**
 * Displays home screen elements
 * @returns Home screen elements
 */
function HomeScreen(){
    return(
    <div id="home-screen-top-section">
      <h1> WMATA Information Hub</h1>
      <p>This website provides all the information needed for you to navigate the DC Metro System.</p>
      <p>To get started, enter a line or station in the search bar below </p>
      <div id="home-screen-bottom-section">
        <div className="home-screen-link-container">
          <a href="https://www.wmata.com/schedules/maps/upload/2022-System-Map.pdf"> 
            <img  className="home-screen-img" src={process.env.PUBLIC_URL + '2022-System-Map2-1-1463x1600.png'} alt="Map Icon depicting link to view map"></img> 
            <div className="link-title">View Map</div>
          </a>
        </div>
        <div className="home-screen-link-container">
          <a href="https://www.wmata.com/service/status/"> 
            <img  className="home-screen-img" src={process.env.PUBLIC_URL + 's24-alert-outline-red.png'} alt="Alert icon depicting link to view metro alerts"></img> 
            <div className="link-title">View Metro Alerts</div>
          </a>
        </div>
      </div>
    </div>
  )
}