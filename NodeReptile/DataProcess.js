/*
    这是一个数据处理文件
    我把数据库中的数据整理成了189个数据点
    最后存储为json文件，供前端调用
*/

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const variables = require('./GlobalVariable');

//对于一个输入的工作对象
//返回其最高薪水和最低薪水
function processSalary(job){
    var str = job.salary;
    var salary = null;
    if(str.indexOf('-') < 0){
        salary = {
            lowerSalary: parseInt(str),
            higherSalary: parseInt(str)
        };
    }
    else{
        let arr = str.split('-');
        salary = {
            lowerSalary: parseFloat(arr[0]),
            higherSalary: parseFloat(arr[1])
        };
    }
    return salary;
}

//给定工作岗位和工作地点
//返回对应的薪水平均值
function fetchAvg(jobName, jobLocation) {
    return new Promise((resolve, reject) => {
        MongoClient.connect('mongodb://localhost:27017', (e, db) => {
            if (e)
                reject(e);
            var jobs = db.db('jobs');
            var collection = jobs.collection('jobs');
            collection.find({ type: jobName, location: jobLocation }).toArray((e, arr) => {
                if (e)
                    console.error(e);
                let res = [];
                let lowerSalary = 0;
                let higherSalary = 0;
                //用于测试空白数据
                // if(arr.length === 0){
                //     console.log(jobName, jobLocation);
                // }
                arr.forEach((job) => {
                    let salary = processSalary(job);
                    res.push(salary);
                });
                db.close();
                res.forEach(obj => {
                    lowerSalary += obj.lowerSalary;
                    higherSalary += obj.higherSalary;
                });
                resolve({
                    lowerSalary: (lowerSalary * 1.0 / res.length).toFixed(2),
                    higherSalary: (higherSalary * 1.0 / res.length).toFixed(2),
                    name: jobName,
                    city: jobLocation,
                    count:res.length
                });
            });
        });
    });
}

function main() {
    var resArr = [];
    for (job in variables.jobs) {
        for (city in variables.cities) {
            (function (jobName, jobLocation, resArr) {
                fetchAvg(jobName, jobLocation).then(obj => {
                    resArr.push(obj);
                    if(resArr.length === 189){
                        console.log(resArr);
                        fs.writeFileSync('./files/data.json', JSON.stringify(resArr));
                    }
                }, e => {
                    console.error(e);
                });
            })(job, variables.cities[city], resArr)
        }
    }
}

main();