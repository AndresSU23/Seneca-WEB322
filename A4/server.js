/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: David Andres Sanchez Umbarila Student ID: 140273228 Date: 12/02/2024
*  Published URL: https://odd-lime-cape-buffalo-wrap.cyclic.app/
*
********************************************************************************/


const { log } = require("console");
const clientSessions = require("client-sessions");
const legoData = require("./modules/legoSets");
const authData = require("./modules/auth-service")
const availableThemes = ["Supplemental", "Classic Town", "Playhouse"];

legoData.initialize()
.then(authData.initialize)
.then(function(){
    app.listen(HTTP_PORT, function(){
        console.log(`app listening on:  ${HTTP_PORT}`);
    });
}).catch(function(err){
    console.log(`unable to start server: ${err}`);
});



const express = require('express'); // "require" the Express module
const path = require('path');
const { NONAME } = require("dns");
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));
app.use(
  clientSessions({
    cookieName: 'session', // this is the object name that will be added to 'req'
    secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login?error=You must be logged in to access this page');
  } else {
    next();
  }
}
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
app.get('/lego/addSet', ensureLogin, (req, res) => {
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
app.post('/lego/addSet', ensureLogin, express.urlencoded({ extended: true }), (req, res) => {
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
app.get('/lego/editSet/:num', ensureLogin, (req, res) => {
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
app.post('/lego/editSet', ensureLogin, express.urlencoded({ extended: true }), (req, res) => {
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
app.get('/lego/deleteSet/:num', ensureLogin, (req, res) => {
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

app.get('/login', (req, res) => {
  const errorMessage = req.query.error || null;
  res.render('login', { errorMessage });
});

app.get('/register', (req, res) => {
  const successMessage = req.query.success || null;
  const errorMessage = req.query.error || null;
  res.render('register', { successMessage, errorMessage });
});


app.post('/register', express.urlencoded({ extended: true }), (req, res) => {
  const userData = req.body;
  authData.registerUser(userData)
    .then(() => res.render('register', { successMessage: "User created" }))
    .catch(err => res.render('register', { successMessage: null, errorMessage: err, userName: req.body.userName }));
});

app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect('/lego/sets');
    })
    .catch(err => res.render('login', { errorMessage: err, userName: req.body.userName }));
});

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
  res.render('userHistory', { user: req.session.user });
});


app.all('*', (req, res) => {
  res.status(404).render('404', {message: "No view matched for a specific route"});
});

