// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        labelHelp: {
            type: cc.Label,
            default: null
        },
        btnReturnLobby: {
            type: cc.Button,
            default: null
        },
    },

    start ()
    {
        this.btnReturnLobby.node.active = false;
        this.btnReturnLobby.node.on("click", this.OnClickCloseHelpView, this);

    },

    OnClickCloseHelpView()
    {
        this.node.active = false;
    },


    // update (dt) {},
});
