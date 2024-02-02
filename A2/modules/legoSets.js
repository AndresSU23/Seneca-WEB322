/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: David Andres Sanchez Umbarila Student ID: 140273228 Date: 29/01/2024
*
********************************************************************************/


const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];

function initialize() {
    setData.forEach(data => {
        data['theme'] = themeData.find((theme) => theme.id === data.theme_id).name;
        sets.push(data);
    });
    return new Promise((resolve, reject) => {
        console.log('The "sets" array is filled with objects');
        resolve(); 
    });
}

function getAllSets() {
  console.log(`Loading ${sets.length} number of sets`);
  return new Promise((resolve, reject) => {
      resolve(sets);
    });
}

function getSetByNum(setNum) {
  console.log(`Searching in sets by setNum: ${setNum}`);
  let set = sets.find((set) => set.set_num === setNum);
  return new Promise((resolve, reject) => {
      set ? resolve(set) : reject('Unable to find requested set');
    });
}

function getSetsByTheme(theme) {
  console.log(`Filtering sets by theme: ${theme}`);
  let themeSets = sets.filter((set) => set.theme.toLowerCase().includes(theme.toLowerCase()))
  return new Promise((resolve, reject) => {
        themeSets.length ? resolve(themeSets) : reject('Unable to find requested sets by theme');
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }