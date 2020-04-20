window.AgoraDefine = {
    strAgoraAppID : "1535be382fe646bfb9dee86823e96ff4",

    bMyVoiceOpened:true,
    bOtherVoiceOpened:true,
};


window.AgoraManager = {

    AddAgoraListener: function ()
    {
        agora.on("init-success", this.onInitAgoraSuccess, this);
        agora.on('join-channel-success', this.onJoinChannelSuccess, this);
        agora.on('leave-channel', this.onLeaveChannel, this);
    },


    OpenMyVoice:function()
    {
        agora.muteLocalAudioStream(false);
    },


    CloseMyVoice:function()
    {
        agora.muteLocalAudioStream(true);
    },

    //开启别人的声音
    OpenAgoraVoice: function()
    {
        agora.muteAllRemoteAudioStreams(false);
    },

    //关闭所有人的声音
    CloseAgoraVoice: function()
    {
        agora.muteAllRemoteAudioStreams(true);
    },

    InitAgora: function ()
    {
        console.log("开始初始化Agora组件!!!!!!!!!!!!!!!!!");
        agora.init(AgoraDefine.strAgoraAppID);
    },


    AddOneAgoraChannel: function (strChannelID)
    {
        agora.joinChannel("", strChannelID);
    },

    LeaveAgoraRoom: function ()
    {
        agora.leaveChannel()
    },


    onInitAgoraSuccess: function ()
    {
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
        console.log("加入房间成功agora====" + channel, uid, elapsed);
    },

    onLeaveChannel: function (stat)
    {

    },

};