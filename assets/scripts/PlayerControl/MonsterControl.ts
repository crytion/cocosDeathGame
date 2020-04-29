

//猎人/怪兽控制


import {PlayerControl} from "./PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export class MonsterControl extends PlayerControl
{

    onLoad()
    {
    }

    start()
    {

    }

    // update (dt) {}
}

window["MonsterControl"] = MonsterControl;

