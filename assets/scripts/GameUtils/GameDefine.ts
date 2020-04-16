


const {ccclass, property} = cc._decorator;

@ccclass
export class GameDefine
{
    static nMonsterMoveSpeed: number = 150; //每秒120像素
    static nManMoveSpeed: number = 100; //每秒100像素

    static nMyPoint: number = 0;
    static objOtherPoint = [];
    static bIAmMonster: boolean = false;
    static nCatchedNum: number = 0;
    static nGameType: number = 1;//0,单人   1,多人

    /////////////////////////////////////////////////////
    //随机数
    ////////////////////////////////////////////////////
    //获得[nMin,nMax]之间的随机数
    static GetRandNum(nMin, nMax)
    {
        if (nMin >= nMax)
        {
            return nMin;
        }
        return nMin + Math.floor(Math.random() * (nMax - nMin + 1));
    }
}

export let CrtEventType =
{
    MainPlayerCollisionWall: "MainPlayerCollisionWall",
    MainPlayerLoginSucc: "MainPlayerLoginSucc",
    MainPlayerLoginFail: "MainPlayerLoginFail",
    MainPlayerReLogin: "MainPlayerReLogin",
    MainPlayerSearchRoom: "MainPlayerSearchRoom", //点击开始匹配
    MainPlayerSearchRoomResponse: "MainPlayerSearchRoomResponse",//匹配的回应
    MainPlayerJoinRoomResponse: "MainPlayerJoinRoomResponse",//别人进房间的回应
    GamePlayerAllotOver: "GamePlayerAllotOver",//玩家身份分配完成
    GamePlayerUpdatePosition: "GamePlayerUpdatePosition",//更新别的玩家位置
    PlayerLeaveRoomNotify: "PlayerLeaveRoomNotify",//一个玩家离开
    PlayerCatchedNotify: "PlayerCatchedNotify",//一个玩家被捉住
    PlayerFixedNotify: "PlayerFixedNotify",//一个玩家正在修复

};

export let MsgType =
{
    msgPlayerMove:0,
    msgPlayerPoint:1,
    msgPlayerCatched:2,
    msgPlayerFixMachine:3,
};

window["GameDefine"] = GameDefine;
window["CrtEventType"] = CrtEventType;
window["MsgType"] = MsgType;
