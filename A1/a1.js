/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: David Andres Sanchez Umbarila Student ID: 140273228 Date: 19/01/2024
*
********************************************************************************/ 

function longestWord (arr) {
    var Longest = '.';
    arr.forEach(word => {
        if (word.length > Longest.length) Longest = word;
    });
    return Longest;
}

function mostFrequentWord (arr) {
    if(!arr.length) return null;
    var words = {};
    var mostRepeatedWord = arr[0], maxRepetitions = 1;
    arr.forEach(word => {
        if(!words[word]) words[word] = 1;
        else words[word]++;

        if (words[word] > maxRepetitions) {
            mostFrequentWord = word;
            maxRepetitions = words[word];
        }
    });
    return [mostFrequentWord, maxRepetitions];
}
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

var fs = require('fs');

rl.question('Do you wish to process a File (f) or directory (d): ', (option) => {
    switch (option) {
        case 'f':
            rl.question(`File: `, (file) => {
                fs.readFile(file, (err, fileData) => {
                    if (err) console.log(err);
                    else {
                        fileData = fileData.toString().replace(/\s+/g, ' ');  
                        console.log(`Number of Characters (including spaces): ${fileData.split('').length}`);
                        fileData = fileData.replace(/[^\w\s\']/g, "").split(' ');  
                        console.log(`Number of Words: ${fileData.length}`);
                        console.log(`Longest Word: ${longestWord(fileData)}`);
                        console.log(`Most Repeated Word: ${mostFrequentWord(fileData).join(' - ')}`);
                        rl.close();
                    }
                  });
            })
            break;
        case 'd':
            rl.question(`Directory: `, (directory) => {
                fs.readdir(directory, (err, filesArray) => {
                if (err) console.log(err);
                else {
                    filesArray.sort().reverse();
                    console.log(`Files (reverse alphabetical order): ${filesArray.join(', ')}`);
                    
                    console.log(`File Sizes: `);
                    filesArray.forEach(file => {
                        console.log(`${file}: ${fs.statSync(directory+'/'+file).size} bytes`);
                    });
                    rl.close();
                }
                })
            })
            break;
        default:
            console.log(`Invalid Selection`);
            break;
    }
})
