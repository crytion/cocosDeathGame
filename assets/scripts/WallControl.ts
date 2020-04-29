// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class WallControl extends cc.Component
{

    @property(cc.Label)
    labelInfo: cc.Label = null;

    start ()
    {
    }

    SetWallInfo(nIndex)
    {
        this.labelInfo.node.active = false;
        return;
        //this.labelInfo.string = nIndex;
    }

    // update (dt) {}
}
