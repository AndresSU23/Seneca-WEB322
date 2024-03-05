/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: David Andres Sanchez Umbarila Student ID: 140273228 Date: 12/02/2024
*  Published URL: https://kind-moth-fatigues.cyclic.app/
*
********************************************************************************/


const { log } = require("console");
const legoData = require("./modules/legoSets");
const availableThemes = ["Supplemental", "Classic Town", "Playhouse"];

legoData.initialize();

const express = require('express'); // "require" the Express module
const path = require('path');
const { NONAME } = require("dns");
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/about', (req, res) => {
    res.render('about');
  });

app.get('/lego/sets', (req, res) => {
    console.log(req.query);
    if (req.query.theme){
      legoData.getSetsByTheme(req.query.theme)
      .then(themeSets => {
        res.render('sets', {legoSets: themeSets, currentTheme: req.query.theme, availableThemes: availableThemes});
      })
      .catch(error => {
          console.error(error);
          res.status(404).render('404', {message: "No Sets found for a matching theme"});
      });
    }
    else {
      legoData.getAllSets()
      .then(sets => {
          res.render('sets', {legoSets: sets, currentTheme: "", availableThemes: availableThemes});
      })
      .catch(error => {
          console.error(error);
          res.status(404).render('404', {message: "No Sets found"});
      });
    }
  });

app.get('/lego/sets/:set_num', (req, res) => {
    legoData.getSetByNum(req.params.set_num)
    .then(set => {
      res.render('set', {legoSet: set});
    })
    .catch(error => {
        console.error(error);
        res.status(404).render('404', {message: "No Sets found for a specific set num"});
    });
  });

  app.all('*', (req, res) => { 
    res.status(404).render('404', {message: "No view matched for a specific route"});
  }); 

  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

