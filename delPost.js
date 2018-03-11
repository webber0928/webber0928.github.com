const fs = require('fs');
const myArgs = process.argv.slice(2);
const startPath = myArgs[0];
const keepFile = 'index.js';

const deleteall = (path) => {  
  let files = [];  
  if(fs.existsSync(path)) {  
    files = fs.readdirSync(path);  
    files.forEach(function(file, index) {  
      if( file === keepFile) return true
      let curPath = `${path}/${file}`;  
      if(fs.statSync(curPath).isDirectory()) { // recurse  
        deleteall(curPath);  
      } else { // delete file
        fs.unlinkSync(curPath);  
      }
      console.log(`${curPath} 已刪除`);
    });
    if (startPath !== path) fs.rmdirSync(path);  
  }  
}; 

deleteall(startPath);