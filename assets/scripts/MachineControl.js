// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

window.MachineControl = cc.Class({
    extends: cc.Component,

    properties: {

        labelProgress:{type:cc.Label, default:null},


        nMachineID: 0,
        nFixedProgress: 0

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start ()
    {

    },

    SetMachineID(nID)
    {
        this.nMachineID = nID;
    },

    GetMachineID()
    {
        return this.nMachineID;
    },

    SetProgress(nProgress)
    {
        this.nFixedProgress = nProgress;
        this.labelProgress.string = "电机\n进度" + this.nFixedProgress+"%";

    },

    GetProgress()
    {
        return this.nFixedProgress;
    }

    // update (dt) {},
});
