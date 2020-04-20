var engine = require('./1/MatchvsEngine');
var response = require("./1/MatchvsResponse");
var msg = require("./1/MatvhsvsMessage");
var GameData = require('./1/ExamplesData');

cc.Class({
    extends: cc.Component,

    properties: {
        labelID:{
            type:cc.Label,
            default:null
        },
        labelGameLog:{
            type:cc.Label,
            default:null
        },
        labelGameTips:{
            type:cc.Label,
            default:null
        }
    },

    bLoginSuccess: false,
    bRoomInitedOver: false,

    onLoad()
    {
        this.bLoginSuccess = false;
        this.bRoomInitedOver = false;

    },


    start ()
    {
        this.initMatchvsEvent(this);
        this.ShowLabelLog("初始化游戏");
        this.init();
    },

    ShowLabelLog(str)
    {
        this.labelGameLog.string = str+"";
    },

    ShowLabelTips(str)
    {

    },


    HandleReLogin()
    {
        this.login();
    },

    //开始匹配
    HandleSearchRoom()
    {
        this.joinRandomRoom();
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     * @param self this
     */
    initMatchvsEvent(self)
    {
        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(self);

        this.node.on(msg.MATCHVS_INIT, this.initResponse, this);
        this.node.on(msg.MATCHVS_REGISTER_USER, this.registerUserResponse, this);
        this.node.on(msg.MATCHVS_LOGIN, this.loginResponse, this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.joinRoomNotify, this);
        this.node.on(msg.MATCHVS_JOIN_OVER_RSP, this.joinOverResponse, this);
        this.node.on(msg.MATCHVS_JOIN_OVER_NOTIFY, this.joinOverNotify, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM, this.leaveRoomResponse, this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.leaveRoomNotify, this);
        this.node.on(msg.MATCHVS_LOGOUT, this.logoutResponse, this);
        this.node.on(msg.MATCHVS_ERROE_MSG, this.errorResponse, this);

        cc.systemEvent.on(CrtEventType.MainPlayerReLogin, this.HandleReLogin, this);
        cc.systemEvent.on(CrtEventType.MainPlayerSearchRoom, this.HandleSearchRoom, this);
    },

    /**
     * 移除监听
     */
    removeEvent()
    {
        this.node.off(msg.MATCHVS_INIT, this.initResponse, this);
        this.node.off(msg.MATCHVS_REGISTER_USER, this.registerUserResponse, this);
        this.node.off(msg.MATCHVS_LOGIN, this.loginResponse, this);
        this.node.off(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.off(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.joinRoomNotify, this);
        this.node.off(msg.MATCHVS_JOIN_OVER_RSP, this.joinOverResponse, this);
        this.node.off(msg.MATCHVS_JOIN_OVER_NOTIFY, this.joinOverNotify, this);
        this.node.off(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.off(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
        this.node.off(msg.MATCHVS_LEAVE_ROOM, this.leaveRoomResponse, this);
        this.node.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.leaveRoomNotify, this);
        this.node.off(msg.MATCHVS_LOGOUT, this.logoutResponse, this);
        this.node.off(msg.MATCHVS_ERROE_MSG, this.errorResponse, this);

        cc.systemEvent.off(CrtEventType.MainPlayerReLogin, this.HandleReLogin, this);
        cc.systemEvent.off(CrtEventType.MainPlayerSearchRoom, this.HandleSearchRoom, this);
    },

    /**
     * 初始化
     */
    init()
    {
        let result = engine.prototype.init(GameData.channel, GameData.platform, GameData.gameID, GameData.appKey);
        // cc.log('初始化使用的gameID是:' + GameData.gameID, '如需更换为自己SDK，请修改ExamplesData.js文件');
        this.engineCode(result, 'init');
    },

    /**
     * 注册
     */
    register()
    {
        let result = engine.prototype.registerUser();
        this.engineCode(result, 'registerUser');
    },

    /**
     * 登录
     */
    login()
    {
        let result = engine.prototype.login(GameData.userID, GameData.token);
        cc.log('登录的账号userID是:', GameData.userID);
        if (result == -6)
        {
            cc.log('已登录，请勿重新登录');
        }
        else if (result === -26)
        {
            console.log("GameData:", GameData);
            cc.log('[游戏账户与渠道不匹配，请使用cocos账号登录Matchvs官网创建游戏]：(https://www.matchvs.com/cocos)');
        }
        else
        {
            this.engineCode(result, 'login');
        }
    },

    /**
     * 进入房间
     */
    joinRandomRoom()
    {
        if (this.bLoginSuccess)
        {
            let result = engine.prototype.joinRandomRoom(GameData.maxNumber);
            this.engineCode(result, 'joinRandomRoom');
        }
        else
        {
            cc.error('等待登录回应!!!!!!!!!!!!!：');
            this.ShowLabelTips('等待登录回应!');
        }
    },

    /**
     * 关闭房间
     */
    joinOver()
    {
        let result = engine.prototype.joinOver();
        this.engineCode(result, 'joinOver');
    },

    /**
     * 发送信息
     */
    sendEvent()
    {
        if (this.bRoomInitedOver)
        {
            // let result = engine.prototype.sendEvent("");
            // this.engineCode(result, 'sendEvent');
        }
        else
        {
            cc.error('等待其他玩家进入!!!!!!!!!!!!!：');

            this.ShowLabelTips('等待其他玩家进入!');
        }
    },

    /**
     *  离开房间
     */
    leaveRoom()
    {
        let result = engine.prototype.leaveRoom();
        this.engineCode(result, 'leaveRoom');
    },

    /**
     * 注销
     */
    logout()
    {
        let result = engine.prototype.logout();
        this.engineCode(result, 'logout');
    },

    /**
     * 反初始化
     */
    unInit()
    {
        let result = engine.prototype.unInit();
        this.engineCode(result, 'unInit');
    },


    /**
     * 初始化回调
     * @param info
     */
    initResponse(status)
    {
        if (status == 200)
        {
            cc.log('initResponse：初始化成功，status：' + status);
            this.ShowLabelLog("初始化成功");
            this.register();
        } else
        {
            cc.log('initResponse：初始化失败，status：' + status)
        }
    },


    /**
     * 注册回调
     * @param userInfo
     */
    registerUserResponse(userInfo)
    {
        if (userInfo.status == 0)
        {
            cc.log('registerUserResponse_注册用户成功,id = ' + userInfo.id + 'token = ' + userInfo.token + 'name:' + userInfo.name +
                'avatar:' + userInfo.avatar);
            GameData.userID = userInfo.id;
            GameData.token = userInfo.token;
            GameData.userName = userInfo.name;
            this.ShowLabelLog("注册用户成功");

            this.labelID.node.active = true;
            this.labelID.string = "我的ID是:" + userInfo.id;
            this.login();
        } else
        {
            cc.error('registerUserResponse: 注册用户失败userInfo.status==' + userInfo.status);
        }
    },

    /**
     * 登陆回调
     * @param MsLoginRsp
     */
    loginResponse(MsLoginRsp)
    {
        if (MsLoginRsp.status == 200)
        {
            this.bLoginSuccess = true;
            this.ShowLabelLog("用户登录成功");
            cc.systemEvent.emit(CrtEventType.MainPlayerLoginSucc, "登录成功");
            // this.leaveRoom();
            return;
        } else if (MsLoginRsp.status == 402)
        {
            cc.error('loginResponse: 应用校验失败，确认是否在未上线时用了release环境，并检查gameID、appkey 和 secret');
        } else if (MsLoginRsp.status == 403)
        {
            cc.error('loginResponse：检测到该账号已在其他设备登录');
        } else if (MsLoginRsp.status == 404)
        {
            cc.error('loginResponse：无效用户 ');
        } else if (MsLoginRsp.status == 500)
        {
            cc.error('loginResponse：服务器内部错误');
        }
        cc.systemEvent.emit(CrtEventType.MainPlayerLoginFail, "登录失败,请重新登录" + MsLoginRsp.status);
    },

    /**
     * 进入房间回调
     * @param status
     * @param userInfoList
     * @param roomInfo
     */
    joinRoomResponse(status, userInfoList, roomInfo)
    {
        if (status == 200)
        {
            this.ShowLabelLog("进入房间,等待其他玩家");
            cc.log('joinRoomResponse: 进入房间成功：房间ID为：' + roomInfo.roomID + '房主ID：' + roomInfo.ownerId + '房间属性为：' + roomInfo.roomProperty);
            cc.log('joinRoomResponse: 进入房间成功：userInfoList' + JSON.stringify(userInfoList));

            cc.systemEvent.emit(CrtEventType.MainPlayerSearchRoomResponse, {nMainRoomID: roomInfo.roomID, userInfoList:userInfoList});
        }
        else
        {
            cc.error('joinRoomResponse：进入房间失败status' + status);
        }
    },

    /**
     * 其他玩家加入房间通知
     * @param roomUserInfo
     */
    joinRoomNotify(roomUserInfo)
    {
        cc.log('joinRoomNotify_加入房间的玩家ID是' + roomUserInfo.userID, "     roomUserInfo==" + JSON.stringify(roomUserInfo));

        cc.systemEvent.emit(CrtEventType.MainPlayerJoinRoomResponse, {roomUserInfo : roomUserInfo});
    },

    /**
     * 关闭房间成功
     * @param joinOverRsp
     */
    joinOverResponse(joinOverRsp)
    {
        if (joinOverRsp.status == 200)
        {
            cc.log('joinOverResponse: 关闭房间成功');
        } else if (joinOverRsp.status == 400)
        {
            cc.error('joinOverResponse: 客户端参数错误 ');
        } else if (joinOverRsp.status == 403)
        {
            cc.error('joinOverResponse: 该用户不在房间 ');
        } else if (joinOverRsp.status == 404)
        {
            cc.error('joinOverResponse: 用户或房间不存在');
        } else if (joinOverRsp.status == 500)
        {
            cc.error('joinOverResponse: 服务器内部错误');
        }
    },

    /**
     * 关闭房间通知
     * @param notifyInfo
     */
    joinOverNotify(notifyInfo)
    {
        cc.log('joinOverNotify：用户' + notifyInfo.srcUserID + '关闭了房间，房间ID为：' + notifyInfo.roomID);
    },

    /**
     * 发送消息回调
     * @param sendEventRsp
     */
    sendEventResponse(sendEventRsp)
    {
        if (sendEventRsp.status == 200)
        {
            // cc.log('sendEventResponse：发送消息成功');
        }
        else
        {
            cc.error('sendEventResponse：发送消息失败sendEventRsp.status==' + sendEventRsp.status);
        }
    },

    /**
     * 接收到其他用户消息通知
     * @param eventInfo
     */
    sendEventNotify(eventInfo)
    {
        // cc.log("信息更新===================" + eventInfo.cpProto);
        if (eventInfo.cpProto.indexOf("msgType") !== -1)
        {
            let msgData = JSON.parse(eventInfo.cpProto);
            let nMsgType = msgData.msgType;
            switch (nMsgType)
            {
                case MsgType.msgPlayerMove:
                    cc.systemEvent.emit(CrtEventType.GamePlayerUpdatePosition, eventInfo.cpProto);
                    break;
                case MsgType.msgPlayerPoint:
                {
                    let objPoint = JSON.parse(eventInfo.cpProto);
                    let nMyUserID = objPoint["nMyUserID"];
                    let nOtherPoint = objPoint["nMyPoint"];
                    GameDefine.objOtherPoint.push([nMyUserID, nOtherPoint]);
                    let nMaxPoint = 0;
                    let nMaxPointUserID = 0;

                    //人来齐了,开始计算谁当g
                    if (GameDefine.objOtherPoint.length === GameData.maxNumber - 1)
                    {
                        //默认都是自己猎人
                        GameDefine.bIAmMonster = true;
                        nMaxPointUserID = GameData.userID;

                        for (let i in GameDefine.objOtherPoint)
                        {
                            let oneInfo = GameDefine.objOtherPoint[i];
                            //但是只要有任何人的数字比自己大,那就是别人当g
                            if (oneInfo[1] > GameDefine.nMyPoint)
                            {
                                GameDefine.bIAmMonster = false;
                                break;
                            }
                        }
                        //自己不是,就找出谁是
                        if (!GameDefine.bIAmMonster)
                        {
                            for (let i in GameDefine.objOtherPoint)
                            {
                                let oneInfo = GameDefine.objOtherPoint[i];
                                if (oneInfo[1] > nMaxPoint)
                                {
                                    nMaxPoint = oneInfo[1];
                                    nMaxPointUserID = oneInfo[0];
                                }
                            }
                        }

                        if (GameDefine.bIAmMonster)
                        {
                            this.ShowLabelLog("捕猎开始!");
                            this.labelGameTips.string = "你是猎人,追踪猎物!";
                        }
                        else
                        {
                            this.ShowLabelLog("逃脱开始!");
                            this.labelGameTips.string = "你是猎物,快跑!";
                        }
                        cc.systemEvent.emit(CrtEventType.GamePlayerAllotOver, nMaxPointUserID);
                    }
                }
                    break;
                case MsgType.msgPlayerCatched:
                {
                    let objCatch = JSON.parse(eventInfo.cpProto);
                    let nCatchedID = objCatch.catchedID;
                    let nCatchNum = objCatch.nCatchedNum;
                    if (nCatchedID == GameData.userID)
                    {
                        this.labelGameTips.string = "你已被抓住";
                        this.ShowLabelLog("你的游戏结束");
                    }

                    cc.systemEvent.emit(CrtEventType.PlayerCatchedNotify, [nCatchedID, nCatchNum]);
                }
                    break;
                case MsgType.msgPlayerFixMachine:
                {
                    let objMachine = JSON.parse(eventInfo.cpProto);

                    let nOtherMaID = objMachine.nMachineID;
                    let nCurrentProgress = objMachine.nCurrentProgress;
                    cc.systemEvent.emit(CrtEventType.PlayerFixedNotify, [nOtherMaID, nCurrentProgress]);
                }
                    break;
                default:
                    break;
            }
        }
        else
        {
            cc.error("什么情况???????????" + eventInfo.cpProto);
        }
    },

    /**
     * 离开房间回调
     * @param leaveRoomRsp
     */
    leaveRoomResponse(leaveRoomRsp)
    {
        if (leaveRoomRsp.status == 200)
        {
            cc.log('leaveRoomResponse：离开房间成功，房间ID是' + leaveRoomRsp.roomID);
            this.ShowLabelLog("离开房间,等待匹配");
            this.labelGameTips.string = "";
        } else if (leaveRoomRsp.status == 400)
        {
            cc.error('leaveRoomResponse：客户端参数错误,请检查参数');
        } else if (leaveRoomRsp.status == 404)
        {
            cc.error('leaveRoomResponse：房间不存在')
        } else if (leaveRoomRsp.status == 500)
        {
            cc.error('leaveRoomResponse：服务器错误');
        }
    },

    /**
     * 其他离开房间通知
     * @param leaveRoomInfo
     */
    leaveRoomNotify(leaveRoomInfo)
    {
        cc.log('leaveRoomNotify：' + leaveRoomInfo.userID + '离开房间，房间ID是' + leaveRoomInfo.roomID);

        cc.systemEvent.emit(CrtEventType.PlayerLeaveRoomNotify, leaveRoomInfo.userID);
    },

    /**
     * 注销回调
     * @param status
     */
    logoutResponse(status)
    {
        this.ShowLabelLog("用户注销");

        if (status == 200)
        {
            cc.log('logoutResponse：注销成功');
        }
        else if (status == 500)
        {
            cc.error('logoutResponse：注销失败，服务器错误');
        }
        else
        {
            cc.error('logoutResponse：注销失败status= ' + status);
        }

    },
    /**
     * 错误信息回调
     * @param errorCode
     * @param errorMsg
     */
    errorResponse(errorCode, errorMsg)
    {
        cc.error('errorMsg:' + errorMsg + 'errorCode:' + errorCode);
    },


    engineCode: function (code, engineName)
    {
        switch (code)
        {
            case 0:
                cc.log(engineName + '调用成功');
                break;
            case -1:
                cc.error(engineName + '调用失败');
                break;
            case -2:
                cc.error('尚未初始化，请先初始化再进行' + engineName + '操作');
                break;
            case -3:
                cc.error('正在初始化，请稍后进行' + engineName + '操作');
                break;
            case -4:
                cc.error('尚未登录，请先登录再进行' + engineName + '操作');
                break;
            case -5:
                cc.error('已经登录，请勿重复登陆');
                break;
            case -6:
                cc.error('尚未加入房间，请稍后进行' + engineName + '操作');
                break;
            case -7:
                cc.error('正在创建或者进入房间,请稍后进行' + engineName + '操作');
                break;
            case -8:
                cc.error('已经在房间中');
                break;
            case -20:
                cc.error('maxPlayer超出范围 0 < maxPlayer ≤ 20');
                break;
            case -21:
                cc.error('userProfile 过长，不能超过512个字符');
                break;
            case -25:
                cc.error(engineName + 'channel 非法，请检查是否正确填写为 “Matchvs”');
                break;
            case -26:
                cc.error(engineName + '：platform 非法，请检查是否正确填写为 “alpha” 或 “release”');
                break;
        }
    },

    onDestroy()
    {
        this.removeEvent();
    }

});
