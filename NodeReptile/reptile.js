const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const variables = require('./GlobalVariable');

function getData(pageNo, job, jobLocation, jobsCount){
    var url = encodeURI(`http://sou.zhaopin.com/jobs/searchresult.ashx?bj=160000&sj=${variables.jobs[job]}&in=160400&jl=${jobLocation}&p=${pageNo}&isadv=0`);    
    var jobs = [];
    console.log(`${job}-${jobLocation}...`);
    return new Promise((resolve, reject)=>{
        try{
            http.get(url, (res)=>{
                res.setEncoding('utf-8');
                var str = '';
                res.on('data', (data)=>{
                    str += data;
                });
                res.on('end',()=>{
                    var $ = cheerio.load(str);
                    $('table.newlist').each((k, v)=>{
                        var job = {};
                        job.company = $('td.gsmc', v).text();
                        job.salary = $('td.zwyx', v).text();
                        job.name = String($('td.zwmc>div', v).text()).replace(/\s/g, '');
                        job.location = jobLocation;
                        if(job.company !== '' && job.salary !== '面议'){
                            jobs.push(job);
                        }
                    });
                    var realJobs = null;
                    if(jobsCount < 60){
                        realJobs = jobs.slice(0, jobsCount);
                    }
                    else {
                        realJobs = jobs;
                    }
                    resolve(realJobs);
                });
            });
        }
        catch(e){
            reject(e);
        }
    });
}

function fetchCount(url){
    return new Promise(function(resolve, reject){
        try{
            http.get(url, (res)=>{
                res.setEncoding('utf-8');
                var str = '';
                res.on('data', (data)=>{
                    str += data;
                });
                res.on('end', function(){
                    var $ = cheerio.load(str);
                    var txt = $('span.search_yx_tj>em').text();
                    var jobsCount = parseInt(txt);
                    var pagesCount = 0;
                    if(jobsCount%60 === 0){
                        pagesCount = jobsCount/60;
                    } 
                    else{ 
                        pagesCount = jobsCount/60 + 1;
                    }
                    resolve(pagesCount, jobsCount);
                });
            });
        }
        catch(e){
            reject(e);
        }
    });
}

function callGetData(pagesCount, job, jobLocation, jobsCount){
    try {
        for (let i = 1; i <= pagesCount; i++) {
            //返回Promise对象
            getData(i, job, jobLocation, jobsCount).then((realJobs) => {
                // console.log(realJobs);
                // writeFile(job, jobLocation, realJobs);
                writeDB(job, realJobs);
            }, (e) => {
                console.log(e);
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}

//写入.txt文件
//用于测试
//生产环境写入数据库
// function writeFile(jobCode, jobLocation, arr){
//     fs.writeFile(`${__dirname}\\files\\${jobCode}_${jobLocation}.txt`, JSON.stringify(arr), (e)=>{
//         assert.ifError(e);
//     });
// }

//将数据写入数据库
function writeDB(type, realJobs){
    MongoClient.connect('mongodb://localhost:27017', (e, db)=>{
        assert.ifError(e);
        var jobs = db.db('jobs');
        var collection = jobs.collection('jobs');
        realJobs.forEach((job)=>{
            collection.insert(Object.assign({}, job, { type }));
        });
        db.close();
    });
}

//主函数
function main(job){
    if(City !== undefined){
        let url = encodeURI(`http://sou.zhaopin.com/jobs/searchresult.ashx?bj=160000&sj=${variables.jobs[job]}&in=160400&jl=${City}&p=1&isadv=0`);
        fetchCount(url).then((pagesCount, jobsCount)=>{
            callGetData(pagesCount, job, City, jobsCount);
        },(e)=>{
            console.log(e);
        });
    }
    else {
        for(city in variables.cities){
            (function(city){
                let url = encodeURI(`http://sou.zhaopin.com/jobs/searchresult.ashx?bj=160000&sj=${variables.jobs[job]}&in=160400&jl=${variables.cities[city]}&p=1&isadv=0`);
                fetchCount(url).then((pagesCount, jobsCount)=>{
                    callGetData(pagesCount, job, variables.cities[city], jobsCount);
                },(e)=>{
                    console.log(e);
                });
            })(city)
        }
    }
}

const Job = process.argv[2];
const City = process.argv[3];
if(variables.cities.indexOf(City) < 0 && City !== undefined){
    console.error('无法查询该岗位数据... ...');
}
if(variables.jobs.hasOwnProperty(Job)){
    main(process.argv[2]);
}
else {
    console.error('无法查询该岗位数据... ...');
}