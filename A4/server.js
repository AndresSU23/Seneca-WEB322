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

// GET route for /lego/addSet
app.get('/lego/addSet', (req, res) => {
  legoData.getAllThemes()
      .then(themes => {
          res.render('addSet', { themes: themes });
      })
      .catch(error => {
          console.error(error);
          res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
      });
});

// POST route for /lego/addSet
app.post('/lego/addSet', express.urlencoded({ extended: true }), (req, res) => {
  const setData = req.body;
  legoData.addSet(setData)
      .then(() => {
          res.redirect('/lego/sets');
      })
      .catch(error => {
          console.error(error);
          res.status(500).render('505', { message: `I'm sorry, but we have encountered the following error: ${error}` });
      });
});

// GET route for /lego/editSet/:num
app.get('/lego/editSet/:num', (req, res) => {
  const setNum = req.params.num;

  Promise.all([
      legoData.getSetByNum(setNum),
      legoData.getAllThemes()
  ])
  .then(([setData, themeData]) => {
      res.render('editSet', { themes: themeData, set: setData });
  })
  .catch(error => {
      console.error(error);
      res.status(404).render('404', { message: error });
  });
});

// POST route for /lego/editSet
app.post('/lego/editSet', express.urlencoded({ extended: true }), (req, res) => {
  const setNum = req.body.set_num;
  const setData = req.body;

  legoData.editSet(setNum, setData)
  .then(() => {
      res.redirect('/lego/sets');
  })
  .catch(error => {
      console.error(error);
      res.status(500).render('500', { message: `${error}` });
  });
});

// GET route for /lego/deleteSet/:num
app.get('/lego/deleteSet/:num', (req, res) => {
  const setNum = req.params.num;

  legoData.deleteSet(setNum)
  .then(() => {
      res.redirect('/lego/sets');
  })
  .catch(error => {
      console.error(error);
      res.status(500).render('505', { message: `${error}` });
  });
});


app.all('*', (req, res) => {
  res.status(404).render('404', {message: "No view matched for a specific route"});
});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

