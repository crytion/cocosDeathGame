


const {ccclass, property} = cc._decorator;

@ccclass
export class GameDefine
{
    static nMonsterMoveSpeed: number = 150; //每秒120像素
    static nManMoveSpeed: number = 100; //每秒100像素

    static nMyPoint: number = 0;  //本次游戏我投掷的点数,用来比较大小计算身份
    static objOtherPoint = [];    //别人发来的点数数组,用来比较大小计算身份
    static bIAmMonster: boolean = false;  //自己是不是猎人
    static nCatchedNum: number = 0;        //自己是猎人抓住多少
    static nGameType: number = 1;//0,单人   1,多人
    static bGameJoyStick: boolean = true; //现在游戏可以使用摇杆控制
    static bAgoraVoiceEnable: boolean = false; //语音交流的开关
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
    msgPlayerMove:0,             //玩家移动的网络消息
    msgPlayerPoint:1,               //玩家投掷点数网络消息
    msgPlayerCatched:2,             //玩家被抓网络消息
    msgPlayerFixMachine:3,          //玩家修复电机网络消息
};

window["GameDefine"] = GameDefine;
window["CrtEventType"] = CrtEventType;
window["MsgType"] = MsgType;
