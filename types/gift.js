/*
 * @Date: 2021-01-30 18:41:45
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-01-31 16:45:52
 */


const { nanoid } = require("nanoid")
const idlength = 8

module.exports = function(timestamp, roomId, price, type, senderUid, senderNickName,num) {
    return {
        id: nanoid(idlength),
        timestamp: timestamp,
        price: price,
        senderNickName: senderNickName,
        senderUid: senderUid,
        type: type,
        roomId: roomId,
        num
    }
}