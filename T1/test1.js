/*
class BankAccount {
    #balance;

    constructor(balance){this.balance =  balance;}

    deposit(amount) {
        this.balance += amount;
    }

    checkMinimumBalance() {
        return (this.balance >= 100);
    } 
}

let newAccount = new BankAccount(99);
console.log(newAccount.checkMinimumBalance());
newAccount.deposit(100);
console.log(newAccount.checkMinimumBalance());
*/
function readVideoList(fileName){
    const fs = require('fs');
    fs.readFile(fileName, function (err, fileData) {
      if (err) console.log(err);
      else {
        namesArray = fileData.toString().replace(/\r/g,'').replace(/\n/g,'').split(',');
        console.log(namesArray);
      }
    });
}
 
 
readVideoList(`./videos.csv`);