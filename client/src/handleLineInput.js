/**
 * Checks if input is a line name. Used by App and LineInfo component.
 * @param {*} input input of user
 * @returns line abbreviation if input is a valid line. Null otherwise.
 */
export default function handleLineInput(input){
    if(input.toLowerCase() === "green" || input.toUpperCase() === "GR"){
      return "GR";}
    else if(input.toLowerCase() === "red" || input.toUpperCase() === "RD"){
      return "RD";}
    else if(input.toLowerCase() === "orange" || input.toUpperCase() === "OR"){
      return "OR";}
    else if(input.toLowerCase() === "blue" || input.toUpperCase() === "BL"){
      return "BL";}
    else if(input.toLowerCase() === "yellow" || input.toUpperCase() === "YL"){
      return "YL";}
    else if(input.toLowerCase() === "silver" || input.toUpperCase() === "SV"){
      return "SV";}
    return null;
  }