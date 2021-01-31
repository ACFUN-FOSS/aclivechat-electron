const acClient = require("ac-danmu")
const fs = require("fs")
const path = require("path")
const COMMAND_HEARTBEAT = 0
const COMMAND_JOIN_ROOM = 1
const COMMAND_ADD_TEXT = 2
const COMMAND_ADD_GIFT = 3
const COMMAND_ADD_MEMBER = 4
const COMMAND_ADD_SUPER_CHAT = 5
const COMMAND_DEL_SUPER_CHAT = 6
const COMMAND_UPDATE_TRANSLATION = 7
const COMMAND_ADD_LOVE = 8
const COMMAND_QUIT_ROOM = 9
const COMMAND_ADD_FOLLOW = 10
const COMMAND_ADD_JOIN_GROUP = 11

const CONFIG_PATH = path.join(process.cwd(), "upload", "config", "users.json")

async function MessageHandler(message) {
    const msg = JSON.parse(message)
    this.sendJson = (obj) => {
        this.send(JSON.stringify(obj))
    }
    this.on("close", () => {
        if (this.acClient) {
            this.acClient.removeAllListeners()
            this.acClient = null;
        }
    })
    switch (msg.cmd) {
        case 0:
            this.sendJson({ cmd: COMMAND_HEARTBEAT, data: {} })
            break;
        case 1:
            let userlogin = false;
            let users = ""
            try {
                const json = JSON.parse(fs.readFileSync(CONFIG_PATH).toString("utf-8"))
                if (json.accounts) {
                    users = json.accounts
                    userlogin = true
                } else {
                    userlogin = false
                }
            } catch (error) {
                users = null
            }
            if (!this.acClient) {
                this.roomId = msg.data.roomId;
                this.acClient = await acClient(msg.data.roomId, { login: userlogin, userinfo: users });
                if (!this.acClient) {
                    this.close();
                }
                try {
                    this.acClient.wsStart();
                } catch (error) {
                    console.log("直播间可能没有开播,或者账户密码配置错误")
                    return
                }

            }

            this.acClient.on("decode-error", () => {
                this.close();
            })


            this.acClient.on("enter", () => {
                this.send(`{"cmd":2,"data":{"id":0,"avatarUrl":"https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg","timestamp":1601641021,"authorName":"二号","authorType":0,"privilegeType":0,"translation":"","content":"使用${userlogin ? "登录模式" : "游客模式"}进入${msg.data.roomId}","userMark":"","medalInfo":{"UperID":0,"ClubName":"","Level":0}}}`)
                console.log("已进入直播间")
            })

            this.acClient.on("danmaku", (danmaku) => {
                const retMsg = {
                    cmd: COMMAND_ADD_TEXT,
                    data: {
                        content: danmaku.content,
                        ...processUserinfo(danmaku.userInfo)
                    }
                }
                this.sendJson(retMsg)
            });
            this.acClient.on("gift", (gift) => {
                const retMsg = {
                    cmd: COMMAND_ADD_GIFT,
                    data: {
                        roomId:this.roomId,
                        totalValue: gift.value,
                        giftName: gift.giftName,
                        num: gift.count,
                        webpPicUrl: gift.webpPicURL,
                        pngPicUrl: gift.pngPicURL,
                        ...processUserinfo(gift.user)
                    }

                }
                this.sendJson(retMsg)
            })

            this.acClient.on("user-enter", (info) => {
                const retMsg = {
                    cmd: COMMAND_JOIN_ROOM,
                    data: processUserinfo(info.userInfo)
                }
                this.sendJson(retMsg)
            })

            this.acClient.on("like", (like) => {
                const retMsg = {
                    cmd: COMMAND_ADD_LOVE,
                    data: processUserinfo(like.userInfo)
                }
                this.sendJson(retMsg)
            })

            this.acClient.on("follow", (follow) => {
                const retMsg = {
                    cmd: COMMAND_ADD_FOLLOW,
                    data: processUserinfo(follow.userInfo)
                }
                this.sendJson(retMsg)
            })
            this.acClient.on("join-club", (join) => {
                const retMsg = {
                    cmd: COMMAND_ADD_JOIN_GROUP,
                    data: processUserinfo(join.fansInfo)
                }
                this.sendJson(retMsg)
            })
        default:
            return;
    }

}

function processUserinfo(userinfo) {

    if (!userinfo) { return {} }

    if (userinfo.badge) {
        let medal = JSON.parse(userinfo.badge).medalInfo
        let medalInfo = {
            ClubName: medal.clubName,
            Level: medal.level,
            UperID: medal.uperId,
            UserID: medal.userId
        }
        return {
            id: userinfo.userId.toNumber(),
            avatarUrl:  userinfo.avatar?userinfo.avatar[0].url:"",
            authorName: userinfo.nickname,
            authorType: 0,
            arivilegeType: 0,
            userMark: "",
            medalInfo: medalInfo
        }
    } else {
        return {
            id: userinfo.userId.toNumber(),
            avatarUrl: userinfo.avatar[0].url,
            authorName: userinfo.nickname,
            authorType: 0,
            arivilegeType: 0,
            userMark: "",
        }
    }

}

module.exports = MessageHandler