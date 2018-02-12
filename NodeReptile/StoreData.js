/*
该程序用于将数据存储到LeanCloud平台
*/
var APP_ID = 'Me872SwKDBgiMyDLnneSS9T3-gzGzoHsz';
var APP_KEY = '8hyFXTocldzAvkPSr0i5ba0C';
var LC = require('leancloud-storage');
var fs = require('fs');

LC.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var Data = LC.Object.extend('Data');

var str = fs.readFileSync(`${__dirname}\\files\\data.json`);

var obj = JSON.parse(str);

var i = 0;
for(let key in obj){
    i++;
    (function(interval){
        setTimeout(() => {
            let data = new Data();
            data.set('lowerSalary', obj[key].lowerSalary);
            data.set('higherSalary', obj[key].higherSalary);
            data.set('name', obj[key].name);
            data.set('city', obj[key].city);
            data.set('count', obj[key].count);
            data.save().then(() => {
                console.log('Success...'+interval);
            },
            (e) => {
                console.error(e);
            });
        }, interval * 1000);
    })(i);
}