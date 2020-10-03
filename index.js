const HtmlTableToJson = require('html-table-to-json');
const request = require('request');

const tokenvk = "56f368c618c5b7350fb3bed2cc45f1d73584fe6a09f25673be886859cb5cfb90bff9e0122bc2cdc89086f"
const groupidvk = 192617269
const timeTablesUrl = require("./urls.json")

const { VKApi, BotsLongPollUpdatesProvider } = require('node-vk-sdk')

let api = new VKApi({
    token: tokenvk
})

let updatesProvider = new BotsLongPollUpdatesProvider(api, groupidvk)

var grmod = {}

grmod.arraysEqual = function (a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

updatesProvider.getUpdates(updates => {

    updates.forEach((subArray) => {
        if (subArray.type == "message_new") {
            const grtable = require("./grtable.js")
            let content = subArray.object.text
            let messageArrey = content.split(" ");
            let cmd = messageArrey[0];
            let args = messageArrey.slice(1);


            if (cmd == `/расписание`) {
                console.log(args[1])
                //      /расписание П-11-20 Среда       ||  /расписание П-11 Среда      ||      /расписание П-11
                let parsgroup = grtable.initGroup(args[0])
                if (Array.isArray(parsgroup)) {
                    let d = new Date
                    let date
                    date = d.getDay()
                    if (args[1] == "Понедельник" || args[1] == "понедельник" || (date == 1 && args[1] == undefined)) {
                        let popololo 
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 0
                        }
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            if (results[0]) {
                                results[1]++
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo] ,results]).then((resultsTwo) =>{
                                    grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                        api.messagesSend({
                                            peer_id: subArray.object.peer_id,
                                            reply_to: subArray.object.id,
                                            message: timetable[1],
                                            random_id: Math.random(),
                                        })
                                    })
                                })
                            } else {
                                //Функция группа не найденa
                            }
                        })

                    } else if (args[1] == "Вторник" || args[1] == "вторник" || (date == 2 && args[1] == undefined)) {
                        
                        let popololo 
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 1
                        }
 
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            if (results[0]) {
                                results[1]++
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo] ,results]).then((resultsTwo) =>{
                                    grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                        api.messagesSend({
                                            peer_id: subArray.object.peer_id,
                                            reply_to: subArray.object.id,
                                            message: timetable[1],
                                            random_id: Math.random(),
                                        })
                                    })
                                })
                            } else {
                                //Функция группа не найденa
                            }
                        })

                    } else if (args[1] == "Среда" || args[1] == "среда" || (date == 3 && args[1] == undefined)) {
                        
                        let popololo 
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 2
                        }
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            // Должно вернуть массив [Есть ли такая группа, номер html в таблице, номер строки 0 или 1, Номер корпуса 0 или 1]

                            if (results[0]) {
                                results[1]++
                                console.log(results)
                                //      Получаем [ [расписание 1 корпуса, расписание 2 корпуса], [Есть ли такая группа, номер html в таблице, номер строки 0 или 1, Номер корпуса 0 или 1] ]
                                //      Вернет [Удачно ли, [ [Урок], [Препод], [Кабинет] ] ]
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[date - 1] ,results]).then((resultsTwo) =>{
                                    console.log("ZHOPA")
                                    console.log(resultsTwo)
                                    grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                        //      Получаем [Удачно ли, "расписание, готовое для отправки"]
                                        api.messagesSend({
                                            peer_id: subArray.object.peer_id,
                                            reply_to: subArray.object.id,
                                            message: timetable[1],
                                            random_id: Math.random(),
                                        })
                                        console.log("______TIMETABLEBUILD____________")
                                        console.log(timetable)
                                    })
                                })
                            } else {
                                //Функция группа не найдена
                            }
                        })
                    } else if (args[1] == "Четверг" || args[1] == "четверг" || (date == 4 && args[1] == undefined)) {
                        
                        let popololo 
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 3
                        }
 
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            if (results[0]) {
                                results[1]++
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo] ,results]).then((resultsTwo) =>{
                                    grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                        api.messagesSend({
                                            peer_id: subArray.object.peer_id,
                                            reply_to: subArray.object.id,
                                            message: timetable[1],
                                            random_id: Math.random(),
                                        })
                                    })
                                })
                            } else {
                                //Функция группа не найденa
                            }
                        })
                    } else if (args[1] == "Пятница" || args[1] == "пятница" || (date == 5 && args[1] == undefined)) {
                        console.log("LOOOOOOOOOOOOOOSDFJSDLKGJSL:KDJG:LSJDG:LJS:LDKG")
                        
                        let popololo 
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 4
                        }
 
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            if (results[0]) {
                                results[1]++
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo] ,results]).then((resultsTwo) =>{
                                    grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                        api.messagesSend({
                                            peer_id: subArray.object.peer_id,
                                            reply_to: subArray.object.id,
                                            message: timetable[1],
                                            random_id: Math.random(),
                                        })
                                    })
                                })
                            } else {
                                //Функция группа не найденa
                            }
                        })
                    } else if (args[1] == "Суббота" || args[1] == "суббота" || (date == 6 && args[1] == undefined)) {
                        
                        let popololo 
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 5
                        }
 
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            if (results[0]) {
                                results[1]++
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo] ,results]).then((resultsTwo) =>{
                                    grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                        api.messagesSend({
                                            peer_id: subArray.object.peer_id,
                                            reply_to: subArray.object.id,
                                            message: timetable[1],
                                            random_id: Math.random(),
                                        })
                                    })
                                })
                            } else {
                                //Функция группа не найденa
                            }
                        })
                    } else if (args[1] == "Воскресенье" || args[1] == "воскресенье" || (date == 0 && args[1] == undefined)) {
                        api.messagesSend({
                            message: "Расписание на воскресенье? лол",
                            user_id: subArray.object.from_id,
                            random_id: Math.random()
                        })
                    } else {

                    }
                }
            }
        }
    })
})