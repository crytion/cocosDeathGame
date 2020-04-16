
const {ccclass, property} = cc._decorator;

@ccclass
export class ResourceUtils extends cc.Component
{
    mapPrefabResource:Map<string, cc.Prefab> = new Map();

    LoadPrefab(strPrefabName: string, callFunc: Function)
    {
        if(this.mapPrefabResource.has(strPrefabName))
        {
            cc.log("LKX", "LoadPrefab直接加载===" + strPrefabName);
            let resPrefab = this.mapPrefabResource.get(strPrefabName);
            callFunc(resPrefab);
            return;
        }
        let strPrefabUrl = "prefab/" + strPrefabName;

        cc.loader.loadRes(strPrefabUrl, cc.Prefab, (err, res)=>
        {
            if(err)
            {
                cc.error("LKX, " + "LoadPrefabErrrorrrrr==== " + err);
                return;
            }
            this.mapPrefabResource.set(strPrefabName, res);
            callFunc(res);
        });
    }

    ReleasePrefab(strPrefabName: string)
    {
        let strPrefabUrl = "prefab/" + strPrefabName;
        cc.loader.releaseRes(strPrefabUrl);
        this.mapPrefabResource.delete(strPrefabName);
    }
}
window["ResourceUtils"] = ResourceUtils;
