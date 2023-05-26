const {default : fetch} = require('node-fetch');
const express = require('express')
const app = express()
const path = require('path');
require('dotenv').config();
app.use(express.static(path.join(__dirname, 'client/build')));

var name_to_code; //Map of station names to codes
var code_to_name; //Map of station codes to names
var stations= [];
var entrances = [];
var trains;

var key = process.env.WMATA_KEY

var stationlist = new Map(); //Map of station names to codes
var trainlist = new Map();
var trainlist_temp = new Map();
var lines = new Map();
var entranceMap = new Map();

/**
 * These sets all the stations for each line in order. There's no option in WMATA'S API that
 * returns the stations in order.
 * Note: C11 is the new Potomac Yard station, but it's station information isn't in the system.
 */
lines.set("RD", ["A15", "A14", "A13", "A12", "A11", "A10", "A09", "A08", "A07", "A06", "A05", "A04", "A03", "A02", "A01", "B01", "B02", "B03", "B35", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11"])
lines.set("BL",["J03","J02", "C13", "C12", "C11", "C10", "C09", "C08", "C07","C06", "C05","C04","C03", "C02","C01", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "G01", "G02", "G03", "G04", "G05"])
lines.set("OR",["K08","K07","K06", "K05", "K04", "K03", "K02", "K01", "C05","C04","C03", "C02","C01", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12", "D13"])
lines.set("YL",["C15", "C14", "C13", "C12", "C11", "C10", "C09", "C08", "C07", "F03", "F02", "F01", "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10"])
lines.set("GR",["F11", "F10", "F09", "F08", "F07", "F06", "F05", "F04", "F03", "F02", "F01", "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10"])
lines.set("SV",["N12", "N11", "N10", "N09", "N08", "N07", "N06", "N04", "N03", "N02", "N01","K05", "K04", "K03", "K02", "K01", "C05","C04","C03", "C02","C01", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "G01", "G02", "G03", "G04", "G05"])


/** 
 * Pulls station infomration from the API
 */
async function get_station_data() {
	let jsonFile, entranceJson;
	try {
		var stationResponse = await fetch(`https://api.wmata.com/Rail.svc/json/jStations?api_key=${key}`);
		var entranceResponse = await fetch(`https://api.wmata.com/Rail.svc/json/jStationEntrances?api_key=${key}`);
		let date = stationResponse.headers.get('date'); //Date that's in the header of the file we're fetching
		jsonFile = await stationResponse.json();
		entranceJson = await entranceResponse.json();
		stations = jsonFile.Stations;
		entrances = entranceJson.Entrances;
		console.log(`Recieved Station Data \n    Timestamp: ${date}`);
	} catch (e) {
		console.error(e);
	}
}

/**
 * Creates station objects and maps their names to their internal code names and
 * pushes the key, value pairs to each line that serves that station.
 */
function mapStationToCode(){
  name_to_code = new Map;
  code_to_name = new Map;
	for (let i = 0; i < stations.length; i++){
		let lines = [];
		if(stations[i].LineCode1 != null){
			lines.push(stations[i].LineCode1);
		}
		if(stations[i].LineCode2 != null){
			lines.push(stations[i].LineCode2);
		}
		if(stations[i].LineCode3 != null){
			lines.push(stations[i].LineCode3);
		}
		if(stations[i].LineCode4 != null){
			lines.push(stations[i].LineCode4);
		}
		code_to_name.set(stations[i].Code, stations[i].Name);
		name_to_code.set(stations[i].Name, stations[i].Code);
		stationlist.set(stations[i].Code, stations[i]);
		
		trainlist.set(stations[i].Code,new Array());//new stuff for hw4
		trainlist_temp.set(stations[i].Code,new Array());
	}
	console.log("Finished Mapping Stations to Codes");
}

/**
 * Maps all station entrances to their internal code and
 * puts them in the "entrances" global variable
 */
function mapEntrances(){
	var output;
	for(var i = 0; i < entrances.length; i++){
		if(entranceMap.get(entrances[i].StationCode1) == null){
			entranceMap.set(entrances[i].StationCode1, []);
		}
		let temp = entranceMap.get(entrances[i].StationCode1);
		temp.push(entrances[i]);
	}
}
/**
 * Pulls next train information from the API.
 */
async function get_train_data() {
	let jsonFile;
	try {
		var trainResponse = await fetch(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All?api_key=${key}`);
		let date = trainResponse.headers.get('date'); //Date that's in the header of the file we're fetching
		jsonFile = await trainResponse.json();
		trains = jsonFile.Trains;
		console.log(`Recieved new train data \n    Timestamp: ${date}`);
	} catch (e) {
		console.error(e);
	}
	getTrains().then(x => console.log("Next Train Information Updated"));
	setTimeout(get_train_data,10000);
}

/**
 * Puts all new train times in their station's updatedTrains array.
 * When that's done, the nextTrains array will be set to updatedTrains Array.
 */
async function getTrains(){
  let t = Array.from(code_to_name.keys());
  var temp = new Map;
  for(let i = 0; i< t.length; i++){
    temp.set(t[i],[]);
  }
  for(let i = 0; i< trains.length; i++){
	
		let s = temp.get(trains[i].LocationCode);
		if(s == undefined){
			continue;
		}
		
		s.push(trains[i]);
		temp.set(trains[i].LocationCode,s);
	}
	trainlist = new Map(temp);
}

/**
 * Initializes geetting the station and train data
 */
get_station_data().then(mapStationToCode).then(mapEntrances).then(get_train_data);

//----------------------------------------------------------
//    Below is all the GET and POST endpoint functions
//----------------------------------------------------------

/**
 * Landing page for microservice.
 */
app.get('/', function(req, res){
	res.send("Welcome to Samuel Johnson's HW4 Assignment!");
});

/**
 * Returns next train information from requested station.
 * Transfer stations like Metro Center are treated as two stations in
 * the API so to keep things simple, the method returns all available next train
 * information from the station. THIS IS DIFFERENT FROM HW2 in that you can't ask for trains
 * to a specific deatination.
 */
app.get('/nextTrain', async function(req, res){
	if(req.query.station == null){
		res.status(400).send("Provide a station name");//Bad request status code: 400
	}
	else{
		let statName = req.query.station.toString().replace("_"," ");
		let code = name_to_code.get(statName);
		if (code_to_name.get(statName) != null){
			code = statName;
		}
		if(code == null){
			res.status(400).send("Provided station is invalid. Input a valid station name");
			return;
		}
		var output = trainlist.get(code);
		if(stationlist.get(code).StationTogether1 != ""){
			output = output.concat(trainlist.get(stationlist.get(code).StationTogether1));
		}
		res.json(output);
	}
});

/**
 * Return an object that contains the station information. Object contains the station name,
 * address, lines that served the station, and transfers if available.
 */
app.get('/stationInfo', async function(req, res){
	if(req.query.station == null){
		res.status(400).send("Input a valid station name");//Bad request status code: 400
	}
	else{
		let station = req.query.station.toString().replace("_"," ");
		let code = name_to_code.get(station)
		if (code_to_name.get(station) != null){
			code = station;
		}
		if(code == null){
			res.status(400).send("Provided station is invalid. Input a valid station name");
			return;
		}
		else{
			var output = stationlist.get(code);
			res.json(output);
			return;
		}
	}
});

/**
 * Returns an array of objects that stores all the station entrances and information
 * on how to access them.
 */
app.get('/stationEntrance', async function(req, res){
	if(req.query.station == null){
		res.status(400).send("Input a valid station name");//Bad request status code: 400
	}
	else{
		let station = req.query.station.toString().replace("_"," ");
		let code = name_to_code.get(station)
		if (code_to_name.get(station) != null){
			code = station;
		}
		if(code == null){
			res.status(400).send("Provided station is invalid. Input a valid station name");
			return;
		}
		else{
			var output = entranceMap.get(code);
			if(output == undefined){
				output = entranceMap.get(stationlist.get(code).StationTogether1);
			}
			if(output != null){
				if(output[0].StationCode2 != null){
					output = output.concat( entranceMap.get(output[0].StationCode2))
				}
			}
			output = output.filter(elements => {
				return (elements != null && elements !== undefined && elements !== "");
			   });
			res.json(output);
			return;
		}
	}
});

/**
 * Returns a map of the stations served by the line. The key is the internal station code 
 * and the value is the station's name
 * ex. ("E05":"Georgia Ave-Petworth")
 */
app.get('/stationServed', async function(req, res){
	if(req.query.line == null){
		res.status(400).send("Input a valid line. Valid options are 'RD,BL,OR,YL,GR,SV'");//Bad request status code: 400
	}
	else{
		let inputOptions = ['RD','BL','OR','YL','GR','SV'];
		if(inputOptions.find(e => e == req.query.line) == null){
			res.status(400).send("Input a valid line. Valid options are 'RD,BL,OR,YL,GR,SV'");
			return;
		}
		else{
			let temp = lines.get(req.query.line);
			let output = [];
			for(let i = 0; i <temp.length; i++){
				output[i] = code_to_name.get(temp[i]);
			}
			if(output){
				res.json(output);
			}
			return;
		}
	}
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app;