import {GameDefine} from "./GameUtils/GameDefine";

let GameData = require('./1/ExamplesData');
let engine = require('./1/MatchvsEngine');


// 445 2020 0426 15:26


cc.Class({
    extends: cc.Component,

    properties: {
        mainCamera: {
            type: cc.Camera,
            default: null
        },
        nodeBackUI: {
            type: cc.Node,
            default: null
        },
        nodeGameParent: {
            type: cc.Node,
            default: null
        },
        nodeMask: {
            type: cc.Node,
            default: null
        },
        nodeStartUI: {
            type: cc.Node,
            default: null
        },
        nodeBtn: {
            type: cc.Node,
            default: null
        },
        btnStartGame2: {
            type: cc.Button,
            default: null
        },
        btnStartGame3: {
            type: cc.Button,
            default: null
        },
        btnStartGame4: {
            type: cc.Button,
            default: null
        },
        btnStartGame5: {
            type: cc.Button,
            default: null
        },
        btnStartGameSingle: {
            type: cc.Button,
            default: null
        },
        btnReLogin: {
            type: cc.Button,
            default: null
        },
        nodeWaitUI: {
            type: cc.Node,
            default: null
        },
        nodeControl: {
            type: cc.Node,
            default: null
        },
        btnLoginOut: {
            type: cc.Button,
            default: null
        },
        labelGame: {
            type: cc.Label,
            default: null
        },
        labelTooClose: {
            type: cc.Label,
            default: null
        },
        labelCountDown: {
            type: cc.Label,
            default: null
        },
        nodeJoystick: {
            type: cc.Node,
            default: null
        },
        nodeJoystickBg: {
            type: cc.Node,
            default: null
        },
        nodeJoystickBall: {
            type: cc.Node,
            default: null
        },

        prefabPlayer: null,
        prefabWall: null,
        prefabWaitPlayer: null,
        prefabMachine: null,
        prefabArrow: null,
        nodeMainPlayer: null, //自己的玩家Node节点,
        arrWallNode: [],    //所有墙体节点
        bCanMove: false,    //是不是点击了移动键
        fPerFrameSpeed: 0,  //玩家移速,人和怪不同
        arrPlayerMoveStatus: [],//当前的移动状态,因为会多点触控,所以全部存到数组中,相应最后一次输入就行
        resourceUtils: null,
        fSin45: 0.707, //sin45度
        roomUserList: [],    //房间内的别人ID信息
        bGameStarted: false,    //身份分配好后开始游戏
        nUpdateCounts: 0,          //update次数
        arrPlayerInfo: [],          //房间的所有人的信息,包括玩家的Node节点信息
        nodeWaitPlayerArr: [],      //等待玩家加入界面玩家节点数组
        nodeMachineNodeArr: [],     //电机节点数组
        nodeArrowNodeArr: [],       //电机位置预览数组
        nStayInMachineTime: 0,      //靠近电机一共多长时间了
        nMachineNum: 0,             //本局游戏应该有多少电机
        nMonsterUserID: 0,          //猎人玩家ID
        postionManArr: [],//X个人类位, 其中一个会变猎人
        postionMachineArr: [], //电机位置

        nCountDownTime: 285, //整个游戏的倒计时,计时结束就算猎物逃不了,4分44秒

        nodeMyVoice: null,
        nodeOtherVoice: null,

        labelMyVoice: null,
        labelOtherVoice: null,

        posCurrentJoyStick: cc.v2(0, 0),  //缓存下摇杆珠的位置,用来计算玩家的移动方向
    },


    //将游戏重置为登录状态
    ResetGameUI()
    {
        this.nCountDownTime = 285;
        this.nMonsterUserID = 0;
        this.nMachineNum = 0;
        this.fPerFrameSpeed = 0;
        this.nUpdateCounts = 0;
        this.nStayInMachineTime = 0;
        this.bGameStarted = false;
        this.bCanMove = false;
        this.nodeBtn.active = false;
        this.nodeStartUI.active = true;
        this.btnReLogin.node.active = false;
        this.nodeWaitUI.active = false;
        this.nodeControl.active = false;
        this.nodeMask.active = false;
        this.labelCountDown.node.active = false;
        this.nodeJoystick.active = false;
        this.arrPlayerMoveStatus = [];
        this.arrPlayerInfo = [];
        this.nodeWaitPlayerArr = [];
        GameDefine.bIAmMonster = false;
        GameDefine.nMyPoint = 0;
        GameDefine.nCatchedNum = 0;
        GameDefine.objOtherPoint = [];
        GameDefine.nGameType = 0;
        this.labelGame.string = "";
        this.labelTooClose.node.active = false;
        this.mainCamera.node.setPosition(cc.v2(0,0));
        this.nodeMask.setPosition(cc.v2(0,0));
        //X个人类位, 其中一个会变猎人
        this.postionManArr = [
            cc.v2(67*5, 148*5), cc.v2(383*5, 96*5),
            cc.v2(-131*5, 185*5), cc.v2(192*5, 211*5),
            cc.v2(-219*5, -157*5), cc.v2(-382*5, -117*5),
            cc.v2(405*5, -74*5), cc.v2(-337*5, 162*5),];
        this.postionMachineArr = [
            cc.v2(0, -213*5),
            cc.v2(0, 169*5),
            cc.v2(-320*5, 0),
            cc.v2(329*5, 0),
            cc.v2(0, 0),
        ];

        this.ShowHelpNode();

        //重置语音聊天的数据
        this.labelMyVoice.string = "关闭麦克风";
        this.labelOtherVoice.string = "静音别人";
        AgoraDefine.bMyVoiceOpened = true;
        AgoraDefine.bOtherVoiceOpened = true;

        this.posCurrentJoyStick = cc.v2(0, 0);
    },

    onLoad()
    {
        //开启碰撞
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        // manager.debugDrawFlags = 1;
        manager.gravity = cc.v2(0, 0);

        this.resourceUtils = this.node.getComponent("ResourceUtils");

        //响应按钮回调
        //分别可以匹配2,3,4,5人房间
        //同时改变GameData.maxNumber属性和本局游戏应该有几个电机
        this.btnStartGame2.node.on("click", this.OnClickStartGame.bind(this, 2), this);
        this.btnStartGame3.node.on("click", this.OnClickStartGame.bind(this, 3), this);
        this.btnStartGame4.node.on("click", this.OnClickStartGame.bind(this, 4), this);
        this.btnStartGame5.node.on("click", this.OnClickStartGame.bind(this, 5), this);

        this.btnStartGameSingle.node.on("click", this.OnClickStartGameSingle, this);
        this.btnReLogin.node.on("click", this.OnClickRelogin, this);
        this.btnLoginOut.node.on("click", this.OnClickLoginOut, this);


        this.nodeMyVoice = this.nodeControl.getChildByName("btnMyVoice");
        this.nodeOtherVoice = this.nodeControl.getChildByName("btnOtherVoice");
        this.labelMyVoice = this.nodeMyVoice.getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        this.labelOtherVoice = this.nodeOtherVoice.getChildByName("Background").getChildByName("Label").getComponent(cc.Label);

        this.nodeMyVoice.on("click", this.OnClickMyVoice, this);
        this.nodeOtherVoice.on("click", this.OnClickOtherVoice, this);
        if (!GameDefine.bAgoraVoiceEnable)
        {
            this.nodeMyVoice.active = false;
            this.nodeOtherVoice.active = false;
        }

        //添加网络事件的监听和虚拟按键的监听
        this.AddEventListener();
        //重置游戏为初始状态
        this.ResetGameUI();

        this.ResizeMaskSize();

        AgoraManager.AddAgoraListener();
        AgoraManager.InitAgora();

        //加载游戏内的prefab, 资源太小了,几乎一瞬间加载完,
        this.GetResourceUtils().LoadPrefab("nodePlayer", (res) =>
        {
            this.prefabPlayer = res;
        });
        this.GetResourceUtils().LoadPrefab("nodeWall", (res) =>
        {
            this.prefabWall = res;
        });
        this.GetResourceUtils().LoadPrefab("nodeWaitPlayer", (res) =>
        {
            this.prefabWaitPlayer = res;
        });
        this.GetResourceUtils().LoadPrefab("nodeMachine", (res) =>
        {
            this.prefabMachine = res;
        });
        this.GetResourceUtils().LoadPrefab("nodeArrow", (res) =>
        {
            this.prefabArrow = res;
        });

        this.GetResourceUtils().LoadPrefab("nodeHelp", (res) =>
        {
            this.nodeHelp = cc.instantiate(res);
            this.nodeGameParent.addChild(this.nodeHelp);
        });
    },

    ResizeMaskSize()
    {
        let fFrameWidth_Height = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        let fScaleViewOffRateX = 1;
        let fScaleViewOffRateY = 1;

        //当手机分辨率大于 2比1, 会导致横轴有黑边
        //横轴有黑边,先拉伸横轴,让屏幕铺满
        if(fFrameWidth_Height > 2)
        {
            fScaleViewOffRateX = fFrameWidth_Height/2;
            fScaleViewOffRateY = 1;
        }
        //纵轴有黑边的话
        //纵轴有黑边,先拉伸纵轴,让屏幕铺满
        else
        {
            fScaleViewOffRateX = 1;
            fScaleViewOffRateY = (1/fFrameWidth_Height) / 0.5;
        }

        this.nodeMask.setScale(fScaleViewOffRateX, fScaleViewOffRateY);
    },


    AddEventListener()
    {
        cc.systemEvent.on(CrtEventType.MainPlayerLoginSucc, this.OnLoginSuccess, this);
        cc.systemEvent.on(CrtEventType.MainPlayerLoginFail, this.OnLoginFail, this);
        cc.systemEvent.on(CrtEventType.MainPlayerSearchRoomResponse, this.OnSearchRoomResponse, this);
        cc.systemEvent.on(CrtEventType.MainPlayerJoinRoomResponse, this.OnJoinRoomResponse, this);
        cc.systemEvent.on(CrtEventType.GamePlayerAllotOver, this.OnGamePlayerAllotOver, this);
        cc.systemEvent.on(CrtEventType.GamePlayerUpdatePosition, this.OnOtherPlayerMove, this);
        cc.systemEvent.on(CrtEventType.PlayerCatchedNotify, this.OnOtherPlayerCatched, this);
        cc.systemEvent.on(CrtEventType.PlayerFixedNotify, this.OnOtherMachineFixed, this);

        cc.systemEvent.on(CrtEventType.PlayerLeaveRoomNotify, this.HandleOnePlayerLeave, this);

        let nodeUp = this.nodeControl.getChildByName("nodeUp");
        let nodeDown = this.nodeControl.getChildByName("nodeDown");
        let nodeLeft = this.nodeControl.getChildByName("nodeLeft");
        let nodeRight = this.nodeControl.getChildByName("nodeRight");

        this.SetNodeControl(nodeUp, MoveStatus.Status_UP);
        this.SetNodeControl(nodeDown, MoveStatus.Status_DOWN);
        this.SetNodeControl(nodeLeft, MoveStatus.Status_LEFT);
        this.SetNodeControl(nodeRight, MoveStatus.Status_RIGHT);

        this.nodeJoystickBg.on(cc.Node.EventType.TOUCH_START, this.JoyStickTouchStart, this);
        this.nodeJoystickBg.on(cc.Node.EventType.TOUCH_MOVE, this.JoyStickTouchMove, this);
        this.nodeJoystickBg.on(cc.Node.EventType.TOUCH_END, this.JoyStickTouchEnd, this);
        this.nodeJoystickBg.on(cc.Node.EventType.TOUCH_CANCEL, this.JoyStickTouchEnd, this);
    },

    RemoveAllEvent()
    {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.OnKeyUp, this);
        cc.systemEvent.off(CrtEventType.MainPlayerLoginSucc, this.OnLoginSuccess, this);
        cc.systemEvent.off(CrtEventType.MainPlayerLoginFail, this.OnLoginFail, this);
        cc.systemEvent.off(CrtEventType.MainPlayerSearchRoomResponse, this.OnSearchRoomResponse, this);
        cc.systemEvent.off(CrtEventType.MainPlayerJoinRoomResponse, this.OnJoinRoomResponse, this);
        cc.systemEvent.off(CrtEventType.GamePlayerAllotOver, this.OnGamePlayerAllotOver, this);
        cc.systemEvent.off(CrtEventType.GamePlayerUpdatePosition, this.OnOtherPlayerMove, this);
        cc.systemEvent.off(CrtEventType.PlayerLeaveRoomNotify, this.HandleOnePlayerLeave, this);
        cc.systemEvent.off(CrtEventType.PlayerCatchedNotify, this.OnOtherPlayerCatched, this);
        cc.systemEvent.off(CrtEventType.PlayerFixedNotify, this.OnOtherMachineFixed, this);

    },

    JoyStickTouchStart(event)
    {
        let posLocal = event.getLocation();
        posLocal = this.nodeJoystickBg.convertToNodeSpaceAR(posLocal);
        this.posCurrentJoyStick = posLocal;

        this.nodeJoystickBall.setPosition(this.posCurrentJoyStick);

        this.bCanMove = true;

    },

    JoyStickTouchMove(event)
    {
        let posLocal = event.getLocation();
        posLocal = this.nodeJoystickBg.convertToNodeSpaceAR(posLocal);
        this.posCurrentJoyStick = posLocal;

        //移动到范围外, 最多移动到半径位置
        let fPosLength = posLocal.mag();
        if(fPosLength > 75)
        {
            let fSin = posLocal.y/fPosLength;
            let fCos = posLocal.x/fPosLength;
            let fMaxX = 75*fCos;
            let fMaxY = 75*fSin;

            this.nodeJoystickBall.setPosition(fMaxX, fMaxY);
        }
        else
        {
            this.nodeJoystickBall.setPosition(this.posCurrentJoyStick);
        }

    },

    JoyStickTouchEnd(event)
    {
        let posLocal = event.getLocation();
        this.posCurrentJoyStick = cc.v2(0, 0);

        this.nodeJoystickBall.setPosition(this.posCurrentJoyStick);
        this.bCanMove = false;
    },

    HideHelpNode()
    {
        if (this.nodeHelp)
        {
            this.nodeHelp.active = false;
        }
    },

    ShowHelpNode()
    {
        if (this.nodeHelp)
        {
            this.nodeHelp.active = true;
        }
    },

    SetNodeControl(node, moveStatus)
    {
        node.on(cc.Node.EventType.TOUCH_START, this.OnClickControlNode.bind(this, moveStatus), this);
        node.on(cc.Node.EventType.TOUCH_END, this.OnCancelClickControlNode.bind(this, moveStatus), this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.OnCancelClickControlNode.bind(this, moveStatus), this);
    },

    //游戏的公告label
    ShowLabelGame(strTips, callFunc)
    {
        this.labelGame.node.opacity = 255;
        this.labelGame.string = strTips;
        cc.tween(this.labelGame.node).stop();
        cc.tween(this.labelGame.node)
            .to(4, {opacity: 0})
            .call(() =>
            {
                this.labelGame.string = "";
                if(callFunc)
                {
                    callFunc();
                }
            })
            .start();
    },

    OnClickMyVoice()
    {
        if (AgoraDefine.bMyVoiceOpened)
        {
            AgoraManager.CloseMyVoice();
            this.labelMyVoice.string = "开启麦克风";
        }
        else
        {
            AgoraManager.OpenMyVoice();
            this.labelMyVoice.string = "关闭麦克风";
        }
        AgoraDefine.bMyVoiceOpened = !AgoraDefine.bMyVoiceOpened;
    },

    OnClickOtherVoice()
    {
        if (AgoraDefine.bOtherVoiceOpened)
        {
            AgoraManager.CloseAgoraVoice();
            this.labelOtherVoice.string = "听别人";

        }
        else
        {
            AgoraManager.OpenAgoraVoice();
            this.labelOtherVoice.string = "静音别人";
        }

        AgoraDefine.bOtherVoiceOpened = !AgoraDefine.bOtherVoiceOpened;
    },

    OnClickControlNode(moveStatus)
    {
        this.SetMainPlayerMoveStatus(moveStatus);
    },

    OnCancelClickControlNode(moveStatus)
    {
        this.CancelOneStatus(moveStatus);
    },

    //登录成功,显示开始游戏按钮
    OnLoginSuccess()
    {
        this.nodeBtn.active = true;
        this.btnReLogin.node.active = false;
    },

    //登录失败,显示重新登录按钮
    OnLoginFail()
    {
        this.nodeBtn.active = false;
        this.btnReLogin.node.active = true;
    },

    //自己进入房间的回应
    OnSearchRoomResponse(roomInfo)
    {
        //给等待其他玩家界面添加自己的信息
        let nodeWait1 = cc.instantiate(this.prefabWaitPlayer);
        this.nodeWaitUI.addChild(nodeWait1);
        nodeWait1.setPosition(-300, 0);
        let labelID = nodeWait1.getChildByName("labelID").getComponent(cc.Label);
        let labelName = nodeWait1.getChildByName("labelName").getComponent(cc.Label);
        labelID.string = GameData.userID;
        labelName.string = GameData.userName;
        this.nodeWaitPlayerArr.push(nodeWait1);

        let onePlayer = new OnePlayerInfo(GameData.userID, GameData.userName);
        this.SavePushPlayerInfo(onePlayer);

        this.roomUserList = roomInfo.userInfoList;        //除了自己的其他人
        this.SetWaitingNodeShow();


        let nMainRoomID = roomInfo.nMainRoomID;
        AgoraManager.AddOneAgoraChannel(nMainRoomID+"");
    },

    //别人进房间
    OnJoinRoomResponse(roomUser)
    {
        let oneUser = roomUser.roomUserInfo;
        this.roomUserList.push(oneUser);

        this.SetWaitingNodeShow();
    },

    //等待其他人全部加入
    SetWaitingNodeShow()
    {
        //遍历房间内其他玩家的信息,显示到等待界面上
        for(let i = 0; i < this.roomUserList.length; i++)
        {
            let strName = this.roomUserList[i].userProfile;
            let strID = this.roomUserList[i].userID;
            let onePlayer = new OnePlayerInfo(strID, strName);
            this.SavePushPlayerInfo(onePlayer);

            let nodeWait2 = cc.instantiate(this.prefabWaitPlayer);
            this.nodeWaitUI.addChild(nodeWait2);
            this.nodeWaitPlayerArr.push(nodeWait2);
            nodeWait2.setPosition(-150 + i*150, 0);
            let labelID = nodeWait2.getChildByName("labelID").getComponent(cc.Label);
            let labelName = nodeWait2.getChildByName("labelName").getComponent(cc.Label);
            labelID.string = strID;
            labelName.string = strName;
        }

        //所有人都已加入,移除等待界面的子节点,
        if (this.roomUserList && this.roomUserList.length === GameData.maxNumber - 1)
        {
            this.RemoveWaitUI();
            //根据ID大小,给房间玩家排序
            this.ResortArrPlayerInfo();
            //开始投掷点数计算身份
            this.StartLoad();
        }
    },

    RemoveWaitUI()
    {
        for(let i in this.nodeWaitPlayerArr)
        {
            this.nodeWaitPlayerArr[i].removeFromParent();
            this.nodeWaitPlayerArr[i].destroy();
        }
        this.nodeWaitPlayerArr = [];
    },

    ResortArrPlayerInfo()
    {
        if (Array.isArray(this.arrPlayerInfo))
        {
            for (let i = this.arrPlayerInfo.length - 1; i > 0; i--)
            {
                for (let j = 0; j < i; j++)
                {
                    if (this.arrPlayerInfo[j].nPlayerUserID > this.arrPlayerInfo[j + 1].nPlayerUserID)
                    {
                        [this.arrPlayerInfo[j], this.arrPlayerInfo[j + 1]] = [this.arrPlayerInfo[j + 1], this.arrPlayerInfo[j]];
                    }
                }
            }
            return this.arrPlayerInfo;
        }
    },

    OnClickStartGame(nPlayerNum)
    {
        this.HideHelpNode();

        GameData.maxNumber = nPlayerNum;
        this.nMachineNum = GameData.maxNumber;
        //最多4个电机
        this.nMachineNum = this.nMachineNum > 5 ? 5 : this.nMachineNum;

        GameDefine.nGameType = 1;
        this.nodeStartUI.active = false;
        this.nodeWaitUI.active = true;

        cc.systemEvent.emit(CrtEventType.MainPlayerSearchRoom)
    },

    OnClickStartGameSingle()
    {
        this.HideHelpNode();

        this.nMachineNum = 5;
        GameDefine.nGameType = 0;
        GameDefine.bIAmMonster = true;
        this.nodeStartUI.active = false;
        this.nodeWaitUI.active = false;
        this.arrPlayerInfo = [];
        for (let i = 0; i < 6; i++)
        {
            let onePlayer = new OnePlayerInfo(GameDefine.GetRandNum(1, 99999), GameDefine.GetRandNum(1, 99999));
            this.SavePushPlayerInfo(onePlayer);
        }
        let onePlayer = new OnePlayerInfo(GameData.userID, GameData.userName);
        this.SavePushPlayerInfo(onePlayer);

        this.StartGame();
        this.OnGamePlayerAllotOver(GameData.userID);
    },

    OnClickRelogin()
    {
        cc.systemEvent.emit(CrtEventType.MainPlayerReLogin)
    },

    HandleOnePlayerLeave(strUserID)
    {
        for (let i = 0; i < this.roomUserList.length; i++)
        {
            let strID = this.roomUserList[i].userID;
            if (strUserID == strID)
            {
                this.roomUserList.splice(i, 1);
            }
        }

        for (let i = 0; i < this.arrPlayerInfo.length; i++)
        {
            let strID = this.arrPlayerInfo[i].nPlayerUserID;
            if (strUserID == strID)
            {
                if(this.arrPlayerInfo[i].playerNode)
                {
                    this.arrPlayerInfo[i].playerNode.removeFromParent();
                    this.arrPlayerInfo[i].playerNode.destroy();
                }
                this.arrPlayerInfo.splice(i, 1);
            }
        }

        //所有人都离开了
        if (this.roomUserList.length <= 0)
        {
            this.OnClickLoginOut();
        }
    },

    OnClickLoginOut()
    {
        if(GameDefine.nGameType == 1)
        {
            engine.prototype.leaveRoom();
            try
            {
                AgoraManager.LeaveAgoraRoom();
            } catch (e) {}
        }
        else
        {

        }
        this.RemoveRoomUI();
    },

    RemoveRoomUI()
    {
        for(let i in this.arrPlayerInfo)
        {
            let oneInfo = this.arrPlayerInfo[i];
            if(oneInfo.playerNode)
            {
                oneInfo.playerNode.removeFromParent();
                oneInfo.playerNode.destroy();
            }
        }

        this.nodeMainPlayer = null;
        this.ResetGameUI();
        for(let i in this.arrWallNode)
        {
            this.arrWallNode[i].active = false;
        }
        for(let i in this.nodeArrowNodeArr)
        {
            this.nodeArrowNodeArr[i].active = false;
        }
        for(let i in this.nodeMachineNodeArr)
        {
            this.nodeMachineNodeArr[i].active = false;
        }
        this.nodeBtn.active = true;
        this.nodeStartUI.active = true;
    },

    OnOtherMachineFixed(arr)
    {
        let nOtherMaID = arr[0];
        let nCurrentProgress = arr[1];

        let oneMachine = this.GetMachineNodeByID(nOtherMaID);
        if(oneMachine)
        {
            oneMachine.getComponent(MachineControl).SetProgress(nCurrentProgress);
        }

    },

    OnOtherPlayerCatched(arr)
    {
        let nUserID = arr[0];
        let nCatchNum = arr[1];


        if (nCatchNum == (GameData.maxNumber - 1))
        {
            this.ShowLabelGame("游戏结束!!!!!!", this.OnClickLoginOut.bind(this));
            this.bGameStarted = false;
        }
        else
        {
            //自己被抓
            if (nUserID == GameData.userID)
            {
                this.nodeMainPlayer.active = false;
                this.ShowLabelGame("你被抓了,请观战一会");
            }
            //别人
            else
            {
                let catchPlayer = this.GetPlayerNodeByUserID(nUserID);
                if (catchPlayer)
                {
                    catchPlayer.playerNode.active = false;

                    this.ShowLabelGame("玩家" + nUserID + "被抓!");
                }
            }
        }
    },

    OnOtherPlayerMove(strPosition)
    {
        let objPosition = JSON.parse(strPosition);

        let nUserID = objPosition.nMyUserID;

        let oneInfo = this.GetPlayerNodeByUserID(nUserID);
        if(oneInfo)
        {
            oneInfo.playerNode.x = objPosition.posx;
            oneInfo.playerNode.y = objPosition.posy;
        }
    },

    //开始进入房间
    StartLoad()
    {
        //时间戳加随机数,基本保证不会有人点数重合
        GameDefine.nMyPoint = new Date().getTime();
        GameDefine.nMyPoint = parseInt(GameDefine.nMyPoint) + GameDefine.GetRandNum(900000, 999999);
        cc.error("我的点数是nMyPoint= " + GameDefine.nMyPoint);

        let objPoint = {
            "msgType": MsgType.msgPlayerPoint,
            "nMyUserID":GameData.userID,
            "nMyPoint": GameDefine.nMyPoint};
        engine.prototype.sendEvent(JSON.stringify(objPoint));

        this.nodeWaitUI.active = false;
        this.nodeStartUI.active = false;
        this.StartGame();
    },

    StartGame()
    {
        //创建地形
        this.CreateRandomWall();
        //创建电机,人数不同电机数量也不同
        this.CreateMachineArr();
        //创建所有玩家的节点,并且初始化nodeMainPlayer属性
        this.CreatePlayerNode();
    },

    //角色分配成功
    OnGamePlayerAllotOver(nMaxPointUserID)
    {
        this.nMonsterUserID = nMaxPointUserID;
        if(GameDefine.bIAmMonster)
        {
            //初始化玩家的移动速度,猎人略快些
            this.fPerFrameSpeed = GameDefine.nMonsterMoveSpeed / cc.game.getFrameRate();

            for(let i in this.arrPlayerInfo)
            {
                let oneInfo = this.arrPlayerInfo[i];
                let nRandomIndex = GameDefine.GetRandNum(0, this.postionManArr.length-1);
                let posOne = this.postionManArr[nRandomIndex];
                oneInfo.playerNode.setPosition(posOne);
                oneInfo.playerNode.getChildByName("labelName").getComponent(cc.Label).string = "猎物";
                this.postionManArr.splice(nRandomIndex, 1);
            }

            this.nodeMainPlayer.getChildByName("labelName").getComponent(cc.Label).string = "猎人";
            this.nodeMask.active = true;
            this.ShowLabelGame("请寻找躲起来的猎物!");
        }
        else
        {
            this.fPerFrameSpeed = GameDefine.nManMoveSpeed / cc.game.getFrameRate();

            for(let i in this.arrPlayerInfo)
            {
                let oneInfo = this.arrPlayerInfo[i];
                let nRandomIndex = GameDefine.GetRandNum(0, this.postionManArr.length-1);
                let posOne = this.postionManArr[nRandomIndex];
                oneInfo.playerNode.setPosition(posOne);
                oneInfo.playerNode.getChildByName("labelName").getComponent(cc.Label).string = "猎物";
                this.postionManArr.splice(nRandomIndex, 1);
            }

            let monsterInfo = this.GetPlayerNodeByUserID(nMaxPointUserID);
            monsterInfo.playerNode.getChildByName("labelName").getComponent(cc.Label).string = "猎人";

            this.ShowLabelGame("猎人来了,破坏"+ (this.nMachineNum-1) +"个电机逃脱!");
        }

        //让玩家可以控制角色
        this.AddControlFunc();

        //游戏开始, update运行
        this.bGameStarted = true;
        this.labelCountDown.node.active = true;
    },

    CreatePlayerNode()
    {
        for(let i in this.arrPlayerInfo)
        {
            let oneInfo = this.arrPlayerInfo[i];

            let nodePlayer = cc.instantiate(this.prefabPlayer);
            this.nodeGameParent.addChild(nodePlayer);
            oneInfo.SetPlayerNode(nodePlayer);

            if(oneInfo.nPlayerUserID == GameData.userID)
            {
                this.nodeMainPlayer = nodePlayer;

            }
        }
    },

    //创建电机数组, nMachineNum是多少就显示多少
    CreateMachineArr()
    {
        if(this.nodeMachineNodeArr.length > 0)
        {
            for (let i = 0; i < this.nMachineNum; i++)
            {
                this.nodeMachineNodeArr[i].active = true;
                this.nodeMachineNodeArr[i].getComponent(MachineControl).SetProgress(0);
                this.nodeArrowNodeArr[i].active = true;
            }
            return;
        }

        for (let i = 0; i < 5; i++)
        {
            let oneMachineNode = cc.instantiate(this.prefabMachine);
            this.nodeMachineNodeArr.push(oneMachineNode);
            this.nodeGameParent.addChild(oneMachineNode);
            oneMachineNode.active = false;
            let oneArrow = cc.instantiate(this.prefabArrow);
            this.nodeArrowNodeArr.push(oneArrow);
            oneArrow.active = false;
            this.nodeGameParent.addChild(oneArrow, 99);
            oneMachineNode.setPosition(this.postionMachineArr[i]);
            //设置机器ID
            oneMachineNode.getComponent(MachineControl).SetMachineID(i);
            //重置维修进度
            oneMachineNode.getComponent(MachineControl).SetProgress(0);
        }

        if(this.nodeMachineNodeArr.length > 0)
        {
            for (let i = 0; i < this.nMachineNum; i++)
            {
                this.nodeMachineNodeArr[i].active = true;
                this.nodeMachineNodeArr[i].getComponent(MachineControl).SetProgress(0);
                this.nodeArrowNodeArr[i].active = true;
            }
        }
    },

    //创建地形,现在用的是mapWallData中的信息
    CreateRandomWall()
    {
        //墙体数组关闭游戏不销毁,下局游戏直接改变active就行
        if(this.arrWallNode.length > 0)
        {
            for(let i in this.arrWallNode)
            {
                this.arrWallNode[i].active = true;
            }
            return;
        }
        let arr = [];
        // for (let i = 0; i < 200; i++)
        for (let i = 0; i < mapWallData.length; i++)
        {
            let oneWall = cc.instantiate(this.prefabWall);

            // 这个段可以随机生成墙体,存到arr数组中,遇到喜欢的地形就可以直接把arr的信息复制到mapWallData数据中
            // let nRandomX = GameDefine.GetRandNum(-2500, 2500);
            // let nRandomY = GameDefine.GetRandNum(-1200, 1200);
            // let bLegel = (nRandomX<-100 || nRandomX>100) && (nRandomY<-100 || nRandomY>100);
            // while (!bLegel)
            // {
            //     nRandomX = GameDefine.GetRandNum(-2500, 2500);
            //     nRandomY = GameDefine.GetRandNum(-1200, 1200);
            //     bLegel = (nRandomX<-100 || nRandomX>100) && (nRandomY<-100 || nRandomY>100);
            // }
            // oneWall.setPosition(nRandomX, nRandomY);
            // let fRandScaleX = Math.random() * 2.5 + 0.5;
            // let fRandScaleY = Math.random() * 2.5 + 0.5;
            // oneWall.setScale(fRandScaleX, fRandScaleY);
            // let oneNodeShuxin = {positionx: nRandomX, positiony: nRandomY, scalex:fRandScaleX, scaley:fRandScaleY};
            // arr.push(oneNodeShuxin);

            let oneWallShuxin = mapWallData[i];
            let nX = oneWallShuxin.positionx;
            let nY = oneWallShuxin.positiony;
            let fScX = oneWallShuxin.scalex;
            let fScY = oneWallShuxin.scaley;
            oneWall.setPosition(nX, nY);
            oneWall.setScale(fScX, fScY);

            this.arrWallNode.push(oneWall);
            this.nodeGameParent.addChild(oneWall);

        }
        // cc.log("ppppppppp===>" + arr.length);
        // cc.log("ppppppppp===>" + JSON.stringify(arr));
    },

    //pc端按键控制WASD
    AddControlFunc()
    {
        if(GameDefine.bGameJoyStick)
        {
            this.nodeControl.active = false;
            this.nodeJoystick.active = true;
        }
        else
        {
            this.nodeControl.active = true;
            this.nodeJoystick.active = false;
        }



        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.OnKeyUp, this);
    },

    OnKeyDown(event)
    {
        switch (event.keyCode)
        {
            case cc.macro.KEY.w:
                this.SetMainPlayerMoveStatus(MoveStatus.Status_UP);
                break;
            case cc.macro.KEY.a:
                this.SetMainPlayerMoveStatus(MoveStatus.Status_LEFT);
                break;
            case cc.macro.KEY.s:
                this.SetMainPlayerMoveStatus(MoveStatus.Status_DOWN);
                break;
            case cc.macro.KEY.d:
                this.SetMainPlayerMoveStatus(MoveStatus.Status_RIGHT);
                break;
        }
    },

    OnKeyUp(event)
    {
        switch (event.keyCode)
        {
            case cc.macro.KEY.w:
                this.CancelOneStatus(MoveStatus.Status_UP);
                break;
            case cc.macro.KEY.a:
                this.CancelOneStatus(MoveStatus.Status_LEFT);
                break;
            case cc.macro.KEY.s:
                this.CancelOneStatus(MoveStatus.Status_DOWN);
                break;
            case cc.macro.KEY.d:
                this.CancelOneStatus(MoveStatus.Status_RIGHT);
                break;
        }
    },

    //设置移动状态,并存下上次的移动状态
    SetMainPlayerMoveStatus(status)
    {
        if (this.arrPlayerMoveStatus.indexOf(status) != -1)
        {
            //状态不重复添加
            return;
        }
        this.bCanMove = true;
        this.arrPlayerMoveStatus.push(status);

        //斜面移动,4种
        //同时点击三个按键就不管了
        if(this.arrPlayerMoveStatus.length === 2)
        {
            let nLastStatus1 = this.arrPlayerMoveStatus[this.arrPlayerMoveStatus.length - 1];
            let nLastStatus2 = this.arrPlayerMoveStatus[this.arrPlayerMoveStatus.length - 2];

            if(nLastStatus1 === MoveStatus.Status_UP || nLastStatus2===MoveStatus.Status_UP)
            {
                if(nLastStatus1 === MoveStatus.Status_LEFT || nLastStatus2 === MoveStatus.Status_LEFT)
                {
                    this.arrPlayerMoveStatus.push(MoveStatus.Status_UP_LEFT);
                }
                else if(nLastStatus1 === MoveStatus.Status_RIGHT || nLastStatus2 === MoveStatus.Status_RIGHT)
                {
                    this.arrPlayerMoveStatus.push(MoveStatus.Status_UP_RIGHT);
                }
            }
            else if(nLastStatus1 === MoveStatus.Status_DOWN || nLastStatus2===MoveStatus.Status_DOWN)
            {
                if(nLastStatus1 === MoveStatus.Status_LEFT || nLastStatus2 === MoveStatus.Status_LEFT)
                {
                    this.arrPlayerMoveStatus.push(MoveStatus.Status_DOWN_LEFT);
                }
                else if(nLastStatus1 === MoveStatus.Status_RIGHT || nLastStatus2 === MoveStatus.Status_RIGHT)
                {
                    this.arrPlayerMoveStatus.push(MoveStatus.Status_DOWN_RIGHT);
                }
            }

        }
    },

    //按键弹起,取消弹起的移动状态
    CancelOneStatus(status)
    {
        if (this.arrPlayerMoveStatus.indexOf(status) !== -1)
        {
            let nIndex = this.arrPlayerMoveStatus.indexOf(status);
            this.arrPlayerMoveStatus.splice(nIndex, 1);
        }
        let nLastIndex = this.arrPlayerMoveStatus.length - 1;
        if(this.arrPlayerMoveStatus[nLastIndex] >= MoveStatus.Status_UP_LEFT)
        {
            this.arrPlayerMoveStatus.splice(nLastIndex, 1);
        }

        if (this.arrPlayerMoveStatus.length <= 0)
        {
            this.bCanMove = false;
            this.arrPlayerMoveStatus = [];
        }
    },

    update(fDt)
    {
        this.nUpdateCounts++;


        if (this.bGameStarted && this.bCanMove && this.arrPlayerMoveStatus.length > 0)
        {
            switch (this.arrPlayerMoveStatus[this.arrPlayerMoveStatus.length - 1])
            {
                case MoveStatus.Status_UP:
                    this.nodeMainPlayer.y += this.fPerFrameSpeed;
                    break;
                case MoveStatus.Status_DOWN:
                    this.nodeMainPlayer.y -= this.fPerFrameSpeed;
                    break;
                case MoveStatus.Status_LEFT:
                    this.nodeMainPlayer.x -= this.fPerFrameSpeed;
                    break;
                case MoveStatus.Status_RIGHT:
                    this.nodeMainPlayer.x += this.fPerFrameSpeed;
                    break;
                case MoveStatus.Status_UP_LEFT:
                    this.nodeMainPlayer.y += this.fPerFrameSpeed * this.fSin45;
                    this.nodeMainPlayer.x -= this.fPerFrameSpeed * this.fSin45;
                    break;
                case MoveStatus.Status_UP_RIGHT:
                    this.nodeMainPlayer.y += this.fPerFrameSpeed * this.fSin45;
                    this.nodeMainPlayer.x += this.fPerFrameSpeed * this.fSin45;
                    break;
                case MoveStatus.Status_DOWN_LEFT:
                    this.nodeMainPlayer.y -= this.fPerFrameSpeed * this.fSin45;
                    this.nodeMainPlayer.x -= this.fPerFrameSpeed * this.fSin45;
                    break;
                case MoveStatus.Status_DOWN_RIGHT:
                    this.nodeMainPlayer.y -= this.fPerFrameSpeed * this.fSin45;
                    this.nodeMainPlayer.x += this.fPerFrameSpeed * this.fSin45;
                    break;

            }
        }
        else if (this.bGameStarted && this.bCanMove && this.posCurrentJoyStick.mag() > 10)
        {
            //算出joystick的正弦余弦, 乘上移动速度,就是x和y方向上的移动速度了.
            let fSin = this.posCurrentJoyStick.y / this.posCurrentJoyStick.mag();
            let fCos = this.posCurrentJoyStick.x / this.posCurrentJoyStick.mag();
            let fPerMoveX = this.fPerFrameSpeed * fCos;
            let fPerMoveY = this.fPerFrameSpeed * fSin;
            this.nodeMainPlayer.y += fPerMoveY;
            this.nodeMainPlayer.x += fPerMoveX;
        }


        this.UpdateCameraPosition();

        if (this.bGameStarted)
        {
            //60%2, 每秒30次校验位置
            if (this.nUpdateCounts % 2 === 0)
            {
                let strData = {
                    "msgType": MsgType.msgPlayerMove,
                    "nMyUserID": GameData.userID,
                    "posx": this.nodeMainPlayer.getPosition().x,
                    "posy": this.nodeMainPlayer.getPosition().y
                };
                engine.prototype.sendEvent(JSON.stringify(strData));
            }

            //抓到人了没?
            this.CheckIsCatched();
            //是不是在修理电机
            this.CheckIsFixMachine();

            this.UpdateCountDownTime(fDt);
        }
    },

    //开始倒计时,计时结束,猎物全部死亡
    UpdateCountDownTime(fDt)
    {
        this.nCountDownTime -= fDt;
        let nMin = parseInt(this.nCountDownTime/60);
        let nSce = parseInt(this.nCountDownTime%60);

        this.labelCountDown.string = nMin+":"+nSce+"后\n猎物全部中毒死亡!";
        if(this.nCountDownTime <= 0)
        {
            this.GameOver();
        }
    },

    //摄像机跟踪主玩家位置
    UpdateCameraPosition()
    {
        if(this.nodeBackUI.scaleX !== 1)
        {
            //正在全局预览地图,摄像机可以歇歇了
            return;
        }
        if(this.nodeMainPlayer)
        {
            this.mainCamera.node.setPosition(this.nodeMainPlayer.getPosition());
            this.nodeMask.setPosition(this.nodeMainPlayer.getPosition());
        }
    },


    //游戏开始后检测自己有没有抓到人,只需要g判定就行
    CheckIsCatched()
    {
        //猎人抓人
        if(GameDefine.bIAmMonster)
        {
            let myPos = this.nodeMainPlayer.getPosition();

            for(let i in this.arrPlayerInfo)
            {
                //只能显示的节点才有资格校验
                if (this.arrPlayerInfo[i].playerNode.active)
                {
                    let otherPos = this.arrPlayerInfo[i].playerNode.getPosition();
                    if ((otherPos.x == myPos.x) && (otherPos.y == myPos.y))
                    {
                        continue;
                    }

                    let nDistance = myPos.sub(otherPos).mag();
                    if (nDistance <= 80)
                    {
                        let nUserID = this.arrPlayerInfo[i].nPlayerUserID;
                        this.arrPlayerInfo[i].playerNode.active = false;
                        GameDefine.nCatchedNum++;
                        let playerCacth = {
                            msgType: MsgType.msgPlayerCatched,
                            catched: true,
                            catchedID: nUserID,
                            nCatchedNum: GameDefine.nCatchedNum
                        };
                        engine.prototype.sendEvent(JSON.stringify(playerCacth));

                        // cc.error("抓到一个人==== " + GameDefine.nCatchedNum);
                        if (GameDefine.nCatchedNum == (GameData.maxNumber - 1))
                        {
                            this.ShowLabelGame("游戏结束!!!!!!", this.OnClickLoginOut.bind(this));
                            this.bGameStarted = false;
                        }
                    }
                }
            }
        }
        //猎人靠近需要警告猎物
        else
        {
            let myPos = this.nodeMainPlayer.getPosition();
            let monsterInfo = this.GetPlayerNodeByUserID(this.nMonsterUserID);
            let monsterPos = monsterInfo.playerNode.getPosition();
            let nDistance = myPos.sub(monsterPos).mag();
            if(nDistance <= 600)
            {
                this.labelTooClose.node.active = true;
            }
            else
            {
                this.labelTooClose.node.active = false;
            }
        }
    },

    //修理电机
    CheckIsFixMachine()
    {
        let myPos = this.nodeMainPlayer.getPosition();

        //猎物才能开机
        if(!GameDefine.bIAmMonster)
        {
            for(let i in this.nodeMachineNodeArr)
            {
                let oneMachine = this.nodeMachineNodeArr[i];
                let nCurrentProgress = oneMachine.getComponent(MachineControl).GetProgress();
                if(nCurrentProgress < 100 && oneMachine.active)
                {
                    let posMachine = oneMachine.getPosition();
                    let nDistance = myPos.sub(posMachine).mag();
                    if(nDistance <= 140)
                    {
                        let nMachineID = oneMachine.getComponent(MachineControl).GetMachineID();
                        this.nStayInMachineTime++;
                        if (this.nStayInMachineTime % 20 === 0)
                        {
                            nCurrentProgress++;
                            oneMachine.getComponent(MachineControl).SetProgress(nCurrentProgress);

                            let playerFix = {
                                msgType: MsgType.msgPlayerFixMachine,
                                nMachineID: nMachineID,
                                nCurrentProgress: nCurrentProgress
                            };
                            engine.prototype.sendEvent(JSON.stringify(playerFix));
                        }
                    }
                }
            }
        }

        let nTotalFixedCount = 0;
        for(let i =0;i< this.nodeMachineNodeArr.length;i++)
        {
            let oneMachine = this.nodeMachineNodeArr[i];
            if(!oneMachine.active)
            {
                continue;
            }
            let posMachine = oneMachine.getPosition();
            let nDistance = myPos.sub(posMachine).mag();

            //距离远的机子就显示方向
            if (nDistance > 300)
            {
                this.nodeArrowNodeArr[i].active = true;
                //向量减法
                let vec = posMachine.sub(myPos);
                vec.x = vec.x/15 + myPos.x;
                vec.y = vec.y/15 + myPos.y;

                this.nodeArrowNodeArr[i].setPosition(vec);
                // cc.error("kaskaskaskaskaskaskaskaskaskaskasds" + JSON.stringify(vec));
            }
            else
            {
                this.nodeArrowNodeArr[i].active = false;
            }


            let nCurrentProgress = oneMachine.getComponent(MachineControl).GetProgress();
            if (nCurrentProgress >= 100)
            {
                nTotalFixedCount++;
            }
        }

        if(nTotalFixedCount == (this.nMachineNum-1))
        {
            this.GameOver();
        }
    },

    GameOver()
    {
        if(!GameDefine.bIAmMonster)
        {
            this.ShowLabelGame("猎物逃脱!你赢了", this.OnClickLoginOut.bind(this));
        }
        else
        {
            this.ShowLabelGame("猎物逃脱!你输了", this.OnClickLoginOut.bind(this));
        }
        this.bGameStarted = false;
    },


    GetResourceUtils()
    {
        return this.resourceUtils;
    },

    SavePushPlayerInfo(onePlayer)
    {
        if(this.arrPlayerInfo.length > 0)
        {
            for(let i in this.arrPlayerInfo)
            {
                if(onePlayer.nPlayerUserID == this.arrPlayerInfo[i].nPlayerUserID)
                {
                    cc.error("这个玩家已经进入房间");
                    return;
                }
            }
        }

        this.arrPlayerInfo.push(onePlayer);
    },

    //根据ID返回房间玩家的属性
    GetPlayerNodeByUserID(nUserID)
    {
        for(let i in this.arrPlayerInfo)
        {
            let oneInfo = this.arrPlayerInfo[i];
            if(nUserID == oneInfo.nPlayerUserID)
            {
                return oneInfo;
            }
        }

        cc.error("GetPlayerNodeByUserID Err== nUserID=" + nUserID, "  this.arrPlayerInfo.length="+this.arrPlayerInfo.length);
        return null;
    },

    GetMachineNodeByID(nID)
    {
        for(let i in this.nodeMachineNodeArr)
        {
            let oneMachine = this.nodeMachineNodeArr[i];
            let nMachineID = oneMachine.getComponent(MachineControl).GetMachineID();
            if(nMachineID == nID)
            {
                return oneMachine;
            }
        }

        cc.error("GetMachineNodeByID Err== nID=" + nID, "  this.nodeMachineNodeArr.length="+this.nodeMachineNodeArr.length);

        return null;
    },

    onDestroy()
    {
        this.RemoveAllEvent();
        this.GetResourceUtils().ReleasePrefab("nodePlayer");
        this.GetResourceUtils().ReleasePrefab("nodeWall");
    },

});

//8方向
let MoveStatus =
    {
        Status_UP: 1,
        Status_DOWN: 2,
        Status_LEFT: 3,
        Status_RIGHT: 4,
        Status_UP_LEFT: 5,
        Status_UP_RIGHT: 6,
        Status_DOWN_LEFT: 7,
        Status_DOWN_RIGHT: 8,
    };


class OnePlayerInfo
{

    playerNode = null;
    nPlayerUserID = -1;
    strPlayerName = "";
    constructor(nID, strName)
    {
        this.nPlayerUserID = nID;
        this.strPlayerName = strName;
    }

    SetPlayerNode(node)
    {
        this.playerNode = node;
    }
}