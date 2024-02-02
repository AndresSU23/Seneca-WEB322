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


const legoData = require("./modules/legoSets");

legoData.initialize();

const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.get('/', (req, res) => {
    res.send('Assignment 2:  David Andres Sanchez Umbarila - 140273228');
  });

app.get('/lego/sets', (req, res) => {
    legoData.getAllSets()
    .then(sets => {
        res.send(sets);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
  });

app.get('/lego/sets/num-demo', (req, res) => {
    legoData.getSetByNum('052-1')
    .then(set => {
      res.send(set);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
  });

app.get('/lego/sets/theme-demo', (req, res) => {
    legoData.getSetsByTheme('tech')
    .then(themeSets => {
      res.send(themeSets);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
  });

  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

