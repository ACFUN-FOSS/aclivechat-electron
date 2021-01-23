const mk = require("./utils/mkdir")
const path = require('path');
const publicDir = path.join(process.cwd(), "upload")
const uploadFontsDir = path.join(process.cwd(), "upload", "fonts")
const uploadStickersDir = path.join(process.cwd(), "upload", "stickers")
const uploadConfigDir = path.join(process.cwd(), "upload", "config")
//创建用户文件夹

exports.startup = function() {
    mk.mkdir(publicDir)
    mk.mkdir(uploadFontsDir)
    mk.mkdir(uploadStickersDir)
    mk.mkdir(uploadConfigDir)
}
