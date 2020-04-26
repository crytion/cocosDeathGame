window.AgoraDefine = {
    strAgoraAppID : "1535be382fe646bfb9dee86823e96ff4",

    bMyVoiceOpened:true,
    bOtherVoiceOpened:true,
};


window.AgoraManager = {

    AddAgoraListener: function ()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;

        agora.on("init-success", this.onInitAgoraSuccess, this);
        agora.on('join-channel-success', this.onJoinChannelSuccess, this);
        agora.on('leave-channel', this.onLeaveChannel, this);
    },


    OpenMyVoice:function()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        agora.muteLocalAudioStream(false);
    },


    CloseMyVoice:function()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        agora.muteLocalAudioStream(true);
    },

    //开启别人的声音
    OpenAgoraVoice: function()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        agora.muteAllRemoteAudioStreams(false);
    },

    //关闭所有人的声音
    CloseAgoraVoice: function()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        agora.muteAllRemoteAudioStreams(true);
    },

    InitAgora: function ()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        console.log("开始初始化Agora组件!!!!!!!!!!!!!!!!!");
        agora.init(AgoraDefine.strAgoraAppID);
    },


    AddOneAgoraChannel: function (strChannelID)
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        agora.joinChannel("", strChannelID);
    },

    LeaveAgoraRoom: function ()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        agora.leaveChannel()
    },


    onInitAgoraSuccess: function ()
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        console.log("agora init onInitAgoraSuccess======");

        //断线网回来就离开房间
        try
        {
            this.LeaveAgoraRoom();
        }catch (e)
        {

        }
    },

    onJoinChannelSuccess: function (channel, uid, elapsed)
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;
        console.log("加入房间成功agora====" + channel, uid, elapsed);
    },

    onLeaveChannel: function (stat)
    {
        if(!GameDefine.bAgoraVoiceEnable)
            return;

    },

};