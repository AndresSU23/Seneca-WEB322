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
const dotenv = require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// Define Theme model
const Theme = sequelize.define('Theme', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING
});

// Define Set model
const Set = sequelize.define('Set', {
  set_num: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING,
  year: DataTypes.INTEGER,
  num_parts: DataTypes.INTEGER,
  theme_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Theme, // References Theme model
      key: 'id' // References the id column in Theme
    }
  },
  img_url: DataTypes.STRING
});

// Set up associations
Theme.hasMany(Set, { foreignKey: 'theme_id' });
Set.belongsTo(Theme, { foreignKey: 'theme_id' });


function initialize() {
    return sequelize.sync()
      .then(() => {
        console.log('Database synchronized');
      })
      .catch(error => {
        console.error('Error synchronizing database:', error);
        throw error;
      });
  }

  function getAllSets() {
    return Set.findAll({ include: [Theme] })
      .then(sets => {
        return sets;
      })
      .catch(error => {
        console.error('Error fetching all sets:', error);
        throw error;
      });
  }

function getSetByNum(setNum) {
  return Set.findAll({
    where: { set_num: setNum },
    include: [Theme]
  })
    .then(sets => {
      if (sets.length > 0) {
        return sets[0]; // Return the first element of the array
      } else {
        throw new Error('Unable to find requested set');
      }
    })
    .catch(error => {
      console.error('Error fetching set by set_num:', error);
      throw error;
    });
}

function getSetsByTheme(theme) {
    return Set.findAll({ 
      include: [Theme], 
      where: { 
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`
        } 
      } 
    })
      .then(sets => {
        if (sets.length > 0) {
          return sets;
        } else {
          throw new Error('Unable to find requested sets');
        }
      })
      .catch(error => {
        console.error('Error fetching sets by theme:', error);
        throw error;
      });
  }

// Function to add a new set
function addSet(setData) {
  return Set.create(setData)
    .then(() => {
      console.log(setData);
      // Return a promise that resolves once the set has been created
    })
    .catch(error => {
      // If there was an error, reject the promise with a human-readable error message
      const errorMessage = error.errors[0].message;
      throw new Error(errorMessage);
    });
}
  
  // Function to get all themes
function getAllThemes() {
  return Theme.findAll()
    .then(themes => {
      console.log(themes);
      // Return a promise that resolves with all the themes in the database
      return themes;
    })
    .catch(error => {
      console.error('Error fetching all themes:', error);
      throw error;
    });
}

function editSet(set_num, setData) {
  return Set.update(setData, {
    where: { set_num: set_num }
  })
    .then(() => {
      console.log(setData, set_num);
      // Return a promise that resolves once the set has been updated
    })
    .catch(error => {
      // If there was an error, reject the promise with a human-readable error message
      const errorMessage = error.errors[0].message;
      throw new Error(errorMessage);
    });
}

function deleteSet(set_num) {
  return Set.destroy({
    where: { set_num: set_num }
  })
    .then(() => {
      console.log(set_num);
      // Return a promise that resolves once the set has been deleted
    })
    .catch(error => {
      // If there was an error, reject the promise with a human-readable error message
      const errorMessage = error.errors[0].message;
      throw new Error(errorMessage);
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet }
