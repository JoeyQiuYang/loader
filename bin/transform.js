#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { Transform } = require('stream');


const config = require(path.join(process.cwd(), process.argv[2]))

const sourcePath = path.join(process.cwd(), process.argv[3])

function fileDisplay(filePath,cb){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            // 读取文件内容
                            var content = fs.readFileSync(filedir, 'utf-8');
                            cb(filedir,content);
                        }
                        if(isDir){
                            fileDisplay(filedir,cb);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

fileDisplay(sourcePath,(pathStr,res)=>{
    const readStream = fs.createReadStream(pathStr);
    let data = '';
    //
    readStream.on('data',(res)=>{
        data += res;
    });
    readStream.on('end',function(){
        const writeStream = fs.createWriteStream(pathStr);
        for (let i = 0;i < config.transformArr.length;i++){
            const re = new RegExp(config.transformArr[i].oldStr, 'g');
            data = data.replace(re, config.transformArr[i].newStr);
        }
        writeStream.write(data);
    });
})
