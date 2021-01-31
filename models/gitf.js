/*
 * @Date: 2021-01-30 18:33:55
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-01-31 17:32:38
 */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/gift.json')
const _ = require('lodash')
const db = low(adapter)
db.defaults({ gifts: [] })
    .write()


function insertOne(gift) {
    return db.get('gifts')
        .push(gift)
        .write()
        .id
}

function findAllByUid(uid, roomId) {
    return db.get('gifts')
        .filter({ senderUid: uid, roomId })
        .value()
}

function findAllbetweenTimestamp(start, end) {
    return db.get('gifts')
        .filter(function (o) {
            return o.timestamp < end && o.timestamp > start
        })
        .value()
}

function findAllbetweenTimestampByRoomId(start, end, roomId) {
    return db.get('gifts')
        .filter(function (o) {
            return o.timestamp < end && o.timestamp > start && o.roomId === roomId
        })
        .value()
}

function daliyGiftByType(start, end, roomId) {
    const typeOfgift = db.get('gifts')
        .filter(function (o) {
            return o.timestamp < end && o.timestamp > start && o.roomId === roomId
        })
        .groupBy("type")
        .value()

    let typeCollection = {}
    let allTotalRMB = 0
    _.forEach(typeOfgift, function (v, k) {
        let total = 0
        v.forEach(e => {
            total += e.num
            if (e.type != "香蕉")
            allTotalRMB += e.price
        })
        typeCollection[k] = total
    })

    return { typeCollection, allTotalRMB }
}

module.exports = {
    insertOne, findAllByUid, findAllbetweenTimestamp, findAllbetweenTimestampByRoomId, daliyGiftByType
}