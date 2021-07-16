/****************************************
| Data: 31/05/2021                      |
| Resumo: Controlador Logs              |
| Sistema: GAFio                        |
****************************************/

import { te } from "date-fns/locale";
import { Request, Response } from "express";
import fs from 'fs';
// var fs = require('fs');

export interface json{
    email: string,
    date: string
}

class LogsController {
    async showUserLogs(request: Request, response: Response){
        try{
            fs.readFile('./tmp/Logs/Login/successfulLogins.log', 'utf8', (err: any, data: any) =>  {
                if (err) throw err;
                data = data.replace(/"/g, "'");
                data = data.replace(/\r/g, "");
                var array = data.split("\n");
                var dataArray = [];
                for(let i = 0; i < array.length; i++){
                    if(array[i] == ''){ continue; }
                    let tempArray = [];
                    tempArray = array[i].split(",");
                    dataArray.push(tempArray);
                }
    
                var vector: any[] = []
                var json = {};
                var i = 1;
                dataArray.forEach( e1 => {
                    var tempjson = {};
                    e1.forEach( (e2: string) =>{
                        if(e2.includes("email")){
                            // @ts-ignore
                            tempjson.email = (e2.split("'email':'")[1]).replace("'", "");
                        }else if(e2.includes("date")){
                            // @ts-ignore
                            tempjson.date = (e2.split("'date':'")[1]).replace("'}", "");
                        }
                    })
                    // @ts-ignore
                    json[i] = tempjson;
                    i++;
                    vector.push(tempjson);
                })
                vector = vector.reverse();
                return response.status(200).json({showLogs: true, logs: vector, length: vector.length});
            });
        }catch(error){
            return response.status(400).json({showLogs: false, error})
        }
    }
    async showMicrobiologyLogs(request: Request, response: Response){
        try{
            const {logType} = request.body;
            if(!logType){
                throw 'Log type does not exists';
            }
            if(logType != 'successfulCreations' && logType != 'successfulExclusions' && logType != 'successfulUpdates' && logType != 'unsuccessfulCreations' && logType != 'unsuccessfulExclusions' && logType != 'unsuccessfulUpdates'){
                throw "Log type don't match";
            }
            fs.readFile(`./tmp/Logs/Microbiology/${logType}.log`, 'utf8', (err: any, data: any) =>  {
                if (err) throw err;
                data = data.replace(/"/g, "'");
                data = data.replace(/\r/g, "");
                var array = data.split("\n");
                var dataArray = [];
                for(let i = 0; i < array.length; i++){
                    if(array[i] == ''){ continue; }
                    let tempArray = [];
                    tempArray = array[i].split(",");
                    dataArray.push(tempArray);
                }
                
                var vector: any[] = []
                var json = {};
                var i = 1;
                dataArray.forEach( e1 => {
                    var tempjson = {};
                    e1.forEach( (e2: string) =>{
                        if(e2.includes("type")){
                            //do nothing
                        }
                        else if(e2.includes("user")){
                            // @ts-ignore
                            tempjson.email = (e2.split("'user':'")[1]).replace("'", "");
                        }else if(e2.includes("date")){
                            if(e2.includes("'}")){
                                // @ts-ignore
                                tempjson.date = (e2.split("'date':'")[1]).replace("'}", "");
                            }else{
                                // @ts-ignore
                                tempjson.date = (e2.split("'date':'")[1]).replace("'", "");
                            }
                        }else if(e2.includes("microbiology")){
                            // @ts-ignore
                            tempjson.microbiologyId = (e2.split("'microbiology':")[1]).replace("}", "");
                        }else if(e2.includes("erro")){
                            var temp = e2.split("'erro':'")[1];
                            if(temp){
                                // @ts-ignore
                                tempjson.error = temp.replace("'", "");
                            }
                        }
                    })
                    // @ts-ignore
                    json[i] = tempjson;
                    i++;
                    vector.push(tempjson);
                })
                vector = vector.reverse();
                return response.status(200).json({showLogs: true, logs: vector, length: vector.length});
            });
        }catch(error){
            return response.status(400).json({showLogs: false, error})
        }
    }
    async showPatientLogs(request: Request, response: Response){
        try{
            const {logType} = request.body;
            if(!logType){
                throw 'Log type does not exists';
            }
            if(logType != 'successfulCreations' && logType != 'successfulUpdates'){
                throw "Log type don't match";
            }
            fs.readFile(`./tmp/Logs/Patient/${logType}.log`, 'utf8', (err: any, data: any) =>  {
                if (err) throw err;
                data = data.replace(/"/g, "'");
                data = data.replace(/\r/g, "");
                var array = data.split("\n");
                var dataArray = [];
                for(let i = 0; i < array.length; i++){
                    if(array[i] == ''){ continue; }
                    let tempArray = [];
                    tempArray = array[i].split(",");
                    dataArray.push(tempArray);
                }
                
                var vector: any[] = []
                var json = {};
                var i = 1;
                dataArray.forEach( e1 => {
                    var tempjson = {};
                    e1.forEach( (e2: string) =>{
                        if(e2.includes("type")){
                            //do nothing
                        }
                        else if(e2.includes("user")){
                            // @ts-ignore
                            tempjson.email = (e2.split("'user':'")[1]).replace("'", "");
                        }else if(e2.includes("date")){
                            if(e2.includes("'}")){
                                // @ts-ignore
                                tempjson.date = (e2.split("'date':'")[1]).replace("'}", "");
                            }else{
                                // @ts-ignore
                                tempjson.date = (e2.split("'date':'")[1]).replace("'", "");
                            }
                        }else if(e2.includes("patient")){
                            // @ts-ignore
                            tempjson.patientId = (e2.split("'patient':")[1]).replace("}", "");
                        }
                    })
                    // @ts-ignore
                    json[i] = tempjson;
                    i++;
                    vector.push(tempjson);
                })
                vector = vector.reverse();
                return response.status(200).json({showLogs: true, logs: vector, length: vector.length});
            });
        }catch(error){
            return response.status(400).json({showLogs: false, error})
        }
    } 
    async showMedicalRecordsLogs(request: Request, response: Response){
        try{
            const {logType} = request.body;
            if(!logType){
                throw 'Log type does not exists';
            }
            if(logType != 'successfulCreations' && logType != 'successfulExclusions' && logType != 'successfulUpdates' && logType != 'unsuccessfulCreations'){
                throw "Log type don't match";
            }
            fs.readFile(`./tmp/Logs/MedicalRecord/${logType}.log`, 'utf8', (err: any, data: any) =>  {
                if (err) throw err;
                data = data.replace(/"/g, "'");
                data = data.replace(/\r/g, "");
                var array = data.split("\n");
                var dataArray = [];
                for(let i = 0; i < array.length; i++){
                    if(array[i] == ''){ continue; }
                    let tempArray = [];
                    if(array[i].includes("'erro':{'")){
                        let errorStartPosition = (array[i].indexOf("'erro':"));
                        let errorEndPosition = (array[i].indexOf("}"));
                        let error0 = array[i].slice(errorStartPosition, errorEndPosition);
                        let error1 = error0.slice(error0.indexOf("{")+1, errorEndPosition);
                        array[i] = array[i].replace(error1, "");
                        tempArray = array[i].split(",");
                        tempArray[2] = tempArray[2].substring(0, tempArray[2].indexOf("{")+1) + error1 + "}"
                    }else{
                        tempArray = array[i].split(",");
                    }
                    dataArray.push(tempArray);
                }
                
                var vector: any[] = []
                var json = {};
                var i = 1;
                dataArray.forEach( e1 => {
                    var tempjson = {};
                    e1.forEach( (e2: string) =>{
                        if(e2.includes("type")){
                            //do nothing
                        }
                        else if(e2.includes("user")){
                            // @ts-ignore
                            tempjson.email = (e2.split("'user':'")[1]).replace("'", "");
                        }else if(e2.includes("date")){
                            if(e2.includes("'}")){
                                // @ts-ignore
                                tempjson.date = (e2.split("'date':'")[1]).replace("'}", "");
                            }else{
                                // @ts-ignore
                                tempjson.date = (e2.split("'date':'")[1]).replace("'", "");
                            }
                        }else if(e2.includes("MedicalRecord")){
                            // @ts-ignore
                            tempjson.medicalRecordId = (e2.split("'MedicalRecord':")[1]).replace("}", "");
                        }else if(e2.includes("erro")){
                            var temp = e2.split("'erro':")[1];
                            if(temp[0] == "'"){
                                temp = temp.replace(/'/g, "");
                            }
                            // @ts-ignore
                            tempjson.error = temp;
                        }
                    })
                    // @ts-ignore
                    json[i] = tempjson;
                    i++;
                    vector.push(tempjson);
                })
                vector = vector.reverse();
                return response.status(200).json({showLogs: true, logs: vector, length: vector.length});
            });
        }catch(error){
            return response.status(400).json({showLogs: false, error})
        }
    }
}

export default LogsController;
