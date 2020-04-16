/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, userName: string, maxNumber: number, userID: string, token: string, host: string}}
 */

var GameData = {
    gameID: 218859,
    channel: 'Matchvs',
    platform: 'alpha',
    gameVersion: 1,
    appKey: 'da64ff2033f54c26bfa695b1245fd9f4#C',
    userName: '',
    maxNumber: 2,
    userID: "",
    token: "",
    host: "",
    isPAAS: false,
    reset: function () {
        GameData.gameID = "";
        GameData.appKey = "";
        GameData.userID = "";
        GameData.token = "";
    },
};


module.exports = GameData;