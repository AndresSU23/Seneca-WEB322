const fs = require("fs")
let videos = []

var readVideoList = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.log(`Error Encountered`);
        reject(err)
      } 
      else {
        videos = JSON.parse(data)
        console.log(videos[0])
        resolve(videos)
      }
    })
  })
}
                  
readVideoList('./videos.json').then((firstVideo) => {
    console.log("First Video:", firstVideo);
}).catch((error) => {
    console.error("Error occurred:", error);
});




