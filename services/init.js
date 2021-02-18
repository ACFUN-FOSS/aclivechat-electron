/*
 * @Date: 2021-01-23 21:50:02
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-02-17 22:08:37
 */
const mk = require("./utils/mkdir")
const path = require('path');
const publicDir = path.join(process.cwd(), "upload")
const uploadFontsDir = path.join(process.cwd(), "upload", "fonts")
const uploadStickersDir = path.join(process.cwd(), "upload", "stickers")
const uploadConfigDir = path.join(process.cwd(), "upload", "config")
const dbDir = path.join(process.cwd(), "db")
//创建用户文件夹

exports.startup = function() {
    mk.mkdir(publicDir)
    mk.mkdir(uploadFontsDir)
    mk.mkdir(uploadStickersDir)
    mk.mkdir(uploadConfigDir)
    mk.mkdir(dbDir)
}
