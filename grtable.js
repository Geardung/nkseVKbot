const { patch } = require('request');

const tabletojson = require('tabletojson').Tabletojson;

// 2 && 24  -- Names of groups
module.exports.getMaxlengthofArrays = function getMaxlengthofArrays(array) {
    let counter = 0
    let result = [false, []]
    return new Promise((resolve) => {
        if (Array.isArray(array)) {
            result[0] = true
            array.forEach((element) => {
                if (Array.isArray(element)) {
                    array.forEach()
                }
            })
        } else {
            resolve(result)
        }
    })
}
module.exports.convertTableHTML = function convertTableHTML(url) {
    return new Promise((resolve) => {

        tabletojson.convertUrl(
            url,
            function (tablesAsJson) {
                resolve(tablesAsJson)
            }
        );
    })
}

module.exports.arraysEqual = function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

module.exports.initGroup = function initGroup(groupString) {
    let selectedgroup = false

    if (groupString.includes("-")) {
        selectedgroup = groupString.split("-")
    }

    return (selectedgroup)
}

module.exports.findGroup = function findGroup(findGroup, htmlURLsArray) {
    // Должно вернуть массив [Есть ли такая группа, номер html в таблице, номер строки 0 или 1, Номер корпуса 0 или 1]
    let selectedgroup = false
    if (!Array.isArray(findGroup)) {
        if (typeof (findGroup) == "string") {
            selectedgroup = initGroup(findGroup)
        } else {
            reject("findGroup is not a String or Array")
        }
    } else {
        selectedgroup = findGroup
    }

    return new Promise((resolve, reject) => {
        console.log("_________________________")
        let finalresult = [false]
        htmlURLsArray.forEach((htmlURLstring, numberofkorpus) => {
            if (selectedgroup) {
                this.convertTableHTML(htmlURLstring).then((tablesAsJson) => {
                    let frst = Object.entries(tablesAsJson[0][2])
                    let counter = 1
                    new Promise((resolve) => {

                        for (let index = 0; counter < frst.length && finalresult[0] != true; counter++) {
                            let groups = frst[counter]
                            let parsgroup = this.initGroup(groups[1])
                            let equal = this.arraysEqual(parsgroup, selectedgroup)
                            console.log(parsgroup + "     |   " + selectedgroup + "   |   " + equal === true)
                            if (equal === true) {
                                // Нашло совпадение
                                finalresult = [true, parseInt(groups[0], 10), 0, numberofkorpus]
                                resolve(finalresult)
                            }
                            if (frst.length >= counter && finalresult[0] != true) {
                                // За всю работу не нашло совпадения в первом секторе
                                finalresult = [false]
                                resolve(finalresult)
                            }
                        }
                    }).then(() => {
                        console.log("First check =>  " + finalresult)
                        setTimeout(() => {
                            if (finalresult[0]) {
                                resolve(finalresult)
                            } else if (finalresult.length > 1) {
                                resolve(finalresult)

                            } else {
                                new Promise((resolve) => {
                                    counter = 0
                                    let two = Object.entries(tablesAsJson[0][24])
                                    for (let index = 0; counter < two.length && finalresult[0] != true; counter++) {
                                        let groups = two[counter]
                                        let parsgroup = this.initGroup(groups[1])
                                        let equal = this.arraysEqual(parsgroup, selectedgroup)
                                        console.log(parsgroup + "     |   " + selectedgroup + "     |       " + equal)
                                        if (equal === true) {
                                            // Нашло совпадение
                                            finalresult = [true, parseInt(groups[0], 10), 1, numberofkorpus]
                                            resolve(finalresult)
                                        }
                                        if (two.length >= counter && finalresult[0] != true) {
                                            // За всю работу не нашло совпадения в первом секторе
                                            finalresult = [false]
                                            resolve(finalresult)
                                        }
                                    }
                                }).then(() => {
                                    resolve(finalresult)
                                })
                            }
                        }, 1000);
                    })
                })
            }
        })
    })
}

module.exports.findTimeTable = function findTimeTable(dataArray) {
    //      Получаем [ [расписание 1 корпуса, расписание 2 корпуса], [Есть ли такая группа, номер html в таблице, номер строки 0 или 1, Номер корпуса 0 или 1] ]
    //      Вернет [Удачно ли, [ [Урок], [Препод], [Кабинет] ] ]
    let result = [false, [[], [], []]]
    if (dataArray.length === 2) {
        return new Promise((resolve) => {
            console.log("______________FindTimeTableModule________________")
            this.convertTableHTML(dataArray[0][dataArray[1][3]]).then((tablesAsJson) => {
                let pureTable = tablesAsJson[0]
                let counter = 0
                pureTable.forEach((element, index) => {
                    // 16 - Предметы    |   >16 - Преподаватели и кабинеты
                    console.log(index)
                    let parsobj = Object.entries(element)
                    if (index != 2 && index != 24 && index != 0 && index != 1 && index != 23 && index != 45) {
                        // ВАЩЕ, есть идея, сделать формулу типа Максимальная длина из всех строчек в секторе \ 2 = Число x . Если число длина строчки <= x , то это раздел с уроками
                        if (dataArray[1][2] == 0 && index <= 22) { // Если ищем первый сектор, значит все строки должны быть до 22
                            console.log("Попал в 1 сектор")
                            //console.log(parsobj.length)
                            if (parsobj.length <= 16) {
                                console.log(parsobj[dataArray[1][1]-1][1])
                                console.log(" Это отдел с уроками")
                                result[1][0].push()
                            }
                        } else if (dataArray[1][2] == 1 && index <= 44) { // Если ищем второй сектор, значит все строки должны быть до 44
                            console.log("Попал в 2 сектор")
                            if (parsobj.length <= 16) { // 
                                console.log(" Это отдел с уроками")
                                
                            }
                        } else {
                            resolve(result)
                        }
                    } else {
                        console.log("Не берется в расчет")
                    }
                    console.log("_____________________________")
                    counter++
                    if (counter < 45) {
                        
                    }
                })
            })
        })
    } else {
        return result
    }
}