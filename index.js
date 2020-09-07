const HtmlTableToJson = require('html-table-to-json');
const request = require('request');
const grtable = require("./grtable.js")

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
            let content = subArray.object.text
            let messageArrey = content.split(" ");
            let cmd = messageArrey[0];
            let args = messageArrey.slice(1);


            if (cmd == `/расписание`) {
                //      /расписание П-11-20 Среда       ||  /расписание П-11 Среда      ||      /расписание П-11
                let parsgroup = grtable.initGroup(args[0])
                if (Array.isArray(parsgroup)) {
                    let data
                    if (args[1] == undefined) {
                        data = Date.prototype.getDay()
                    }
                    if (args[1] == "Понедельник" || args[1] == "понедельник" || data == 1) {
                        //gettingTables("sr")

                    } else if (args[1] == "Вторник" || args[1] == "вторник" || data == 2) {
                        //gettingTables("sr")

                    } else if (args[1] == "Среда" || args[1] == "среда" || data == 3) {
                        grtable.findGroup(parsgroup, timeTablesUrl.timeTablesURLs[2]).then((results) => {
                            // Должно вернуть массив [Есть ли такая группа, номер html в таблице, номер строки 0 или 1, Номер корпуса 0 или 1]

                            if (results[0]) {
                                results[1]++
                                console.log(results)
                                api.messagesSend({
                                    user_id: subArray.object.from_id,
                                    message: "ЛОл НАШЕЛ ТВОЮ ГРУППУ",
                                    random_id: Math.random()
                                })

                                //      Получаем [ [расписание 1 корпуса, расписание 2 корпуса], [Есть ли такая группа, номер html в таблице, номер строки 0 или 1, Номер корпуса 0 или 1] ]
                                //      Вернет [Удачно ли, [ [Урок], [Препод], [Кабинет] ] ]
                                grtable.findTimeTable([timeTablesUrl.timeTablesURLs[2] ,results]).then((resultsTwo) =>{
                                    console.log("ZHOPA")
                                })
                            } else {
                                //Функция группа не найдена
                            }
                        })
                    } else if (args[1] == "Четверг" || args[1] == "четверг" || data == 4) {
                        //gettingTables("sr")

                    } else if (args[1] == "Пятница" || args[1] == "пятница" || data == 5) {
                        //gettingTables("sr")

                    } else if (args[1] == "Суббота" || args[1] == "суббота" || data == 6) {
                        //gettingTables("sr")

                    } else {

                    }
                }
            }
        }
    })
})