const timeTablesUrl = require("./urls.json")
const grtable = require("./grtable")
const { VKApi, BotsLongPollUpdatesProvider } = require('node-vk-sdk')
const tabletojson = require('tabletojson').Tabletojson;
const fs = require("fs-extra")

let api = new VKApi({
    token: "56f368c618c5b7350fb3bed2cc45f1d73584fe6a09f25673be886859cb5cfb90bff9e0122bc2cdc89086f"
})

function startBeta() {

    let d = new Date
    d = d.getDay()
    let d2 = d
    if (d == 6 || d == 0) {
        d = 0
    } else {
        d = d--
    }

    function check() {
        setTimeout(() => {

            let lcheck = fs.readJSONSync("./logs.json")

            if (d2 == lcheck) {

            } else {
                //console.log(timeTablesUrl.timeTablesURLs[d][0])
                tabletojson.convertUrl(
                    timeTablesUrl.timeTablesURLs[d][0],
                    function (tablesAsJson) {
                        let pars = Object.entries(tablesAsJson)
                        let lolk = pars[0][1][0][0]
                        let futureDate = new Date
                        if (d2 == 6) {
                            futureDate.setDate(futureDate.getDate() + 2)
                        } else {
                            futureDate.setDate(futureDate.getDate() + 1)
                        }

                        if (lolk.search(`${futureDate.getDate()}`) != -1) {
                            fs.writeJSON(__dirname + "/logs.json", d2)
                            fs.readdir("./besedi", (err, files) => {
                                new Promise(resolve => {
                                    let prikol = []
                                    files.forEach((confpath, ind) => {
                                        console.log(`${files.length} - 1 == ${ind}`)
                                        let peer_id = confpath.split(".")
                                        peer_id = peer_id[0]
                                        let config = require(__dirname + "/besedi/" + confpath)
                                        if (config.bTT) {
                                            grtable.findGroup(config.group, timeTablesUrl.timeTablesURLs[d]).then((results) => {
                                                if (results[0]) {
                                                    results[1]++
                                                    grtable.findTimeTable([timeTablesUrl.timeTablesURLs[d], results]).then((resultsTwo) => {
                                                        grtable.buildTimeTable(resultsTwo).then((timetable) => {
                                                            prikol.push([peer_id, config.prefix + "\n" + timetable[1]])

                                                        })
                                                    })
                                                } else {

                                                }
                                            })
                                        } else {

                                        }
                                    })
                                    setTimeout(() => {
                                        resolve(prikol)
                                    }, 7000);
                                }).then((aoaoao) => {
                                    //  aoaoao = [ [peer_id, message], ...]
                                    aoaoao.forEach((element, indx) => {
                                        setTimeout(() => {
                                            sendMessage(element[0], element[1])
                                        }, 1500 * indx);
                                    })
                                })
                            })
                        }
                    }
                );
            }
            check()
        }, 6000);
    }
    check()
}
startBeta()

let updatesProvider = new BotsLongPollUpdatesProvider(api, 192617269)

function sendMessage(peer_id, message, replyto) {
    if (replyto != undefined) {
        api.messagesSend({
            peer_id: peer_id,
            reply_to: subArray.object.id,
            message: message,
            random_id: Math.random(),
        })
    } else {
        api.messagesSend({
            peer_id: peer_id,
            message: message,
            random_id: Math.random(),
        })
    }
}

updatesProvider.getUpdates(updates => {

    updates.forEach((subArray) => {
        console.log(subArray)
        if (subArray.type == "message_new") {
            let content = subArray.object.text
            let messageArrey = content.split(" ");
            let cmd = messageArrey[0];
            let args = messageArrey.slice(1);

            if (cmd == `/расписание`) {
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
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo], results]).then((resultsTwo) => {
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
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo], results]).then((resultsTwo) => {
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
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[date - 1], results]).then((resultsTwo) => {
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
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo], results]).then((resultsTwo) => {
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

                        let popololo
                        if (args[1] == undefined) {
                            popololo = date - 1
                        } else {
                            popololo = 4
                        }
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[popololo]).then((results) => {
                            if (results[0]) {
                                results[1]++
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo], results]).then((resultsTwo) => {
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
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[popololo], results]).then((resultsTwo) => {
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

            if (cmd == `/вклуведомления`) {
                fs.exists(`${__dirname}/besedi/${subArray.object.peer_id}.json`, (ex) => {
                    if (!ex) {
                        if (args[0] == undefined) {

                        } else {
                            grtable.findGroup(args[0], timeTablesUrl.timeTablesURLs[0]).then(res => {
                                if (res[0]) {
                                    fs.writeJSON(`${__dirname}/besedi/${subArray.object.peer_id}.json`, {
                                        "bTT": true,
                                        "prefix": "@all Расписание на завтра!",
                                        "group": args[0]
                                    })
                                    sendMessage(subArray.object.peer_id, `Теперь в эту беседу будут приходить уведомления об изменении расписания для группы ${args[0]}!`)
                                } else {
                                    sendMessage(subArray.object.peer_id, `Группа \"${args[0]}\" не была найдена! Baka!`)
                                }
                            })
                        }
                    } else {
                        let d = require(`${__dirname}/besedi/${subArray.object.peer_id}.json`)
                        if (args[0] == d.group) {
                            d.bTT = true
                            fs.writeJson(`${__dirname}/besedi/${subArray.object.peer_id}.json`, d)
                        } else {
                            grtable.findGroup(args[0], timeTablesUrl.timeTablesURLs[0]).then(res => {
                                if (res[0]) {
                                    fs.writeJSON(`${__dirname}/besedi/${subArray.object.peer_id}.json`, {
                                        "bTT": true,
                                        "prefix": d.prefix,
                                        "group": args[0]
                                    })
                                    sendMessage(subArray.object.peer_id, `Теперь в эту беседу будут приходить уведомления об изменении расписания для группы ${args[0]}!`)
                                } else {
                                    sendMessage(subArray.object.peer_id, `Группа \"${args[0]}\" не была найдена! Baka!`)
                                }
                            })
                        }
                    }
                })
            }

            if (cmd == `/выклуведомления`) {
                fs.exists(`${__dirname}/besedi/${subArray.object.peer_id}.json`, (ex) => {
                    if (!ex) {
                        sendMessage(subArray.object.peer_id, "Вы еще ни разу не включали уведомления для этой беседы.\nДля того, чтобы их включить, напишите команду \"/вклуведомление <Группа>\"")
                    } else {
                        let d = require(`${__dirname}/besedi/${subArray.object.peer_id}.json`)
                        d.bTT = false
                        fs.writeJSON(`${__dirname}/besedi/${subArray.object.peer_id}.json`, d)
                        sendMessage(subArray.object.peer_id, `Уведомления для данной беседы были успешно отключены.`)
                    }
                })
            }

            if (cmd == `/префикс`) {

            }

            if (cmd == '/chngfile') {
                if (args[0] != undefined && args[1] != undefined) {
                    fs.writeFile(__dirname + `/${args[0]}`, args[1])
                }
            }

            if (cmd == '/readfile') {
                if (args[0] != undefined) {
                    fs.readFile(__dirname+`/${args[0]}`,(err, data) =>{
                        if (err) {
                            console.error(err)
                        }
                        sendMessage(subArray.object.peer_id, data)
                    })
                }
            }
        }
    })
})