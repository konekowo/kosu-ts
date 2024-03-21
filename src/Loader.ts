import * as PIXI from "pixi.js";
import {PxfObject} from "node:tls";

export class Loader {
    private static loadList: LoaderObject[] = [];
    private static loadedList: LoadedObject[] = [];
    public static readonly defaultBackgroundsNum = 8;

    private static addToLoadList() {
        // intro and interaction screen
        this.loadList.push({id: "introTrianglesTrack", url: "assets/osu-assets/osu.Game.Resources/Tracks/triangles.osz"});
        this.loadList.push({id: "sample_dialog_ok", url: "assets/osu-assets/osu.Game.Resources/Samples/UI/dialog-ok-select.wav"});
        this.loadList.push({id: "TorusRegular", url: "assets/fonts/TorusRegular.otf", pixiBundleName: "fonts"});
        this.loadList.push({id: "TorusLight", url: "assets/fonts/TorusLight.otf", pixiBundleName: "fonts"});
        this.loadList.push({id: "TorusThin", url: "assets/fonts/TorusThin.otf", pixiBundleName: "fonts"});
        this.loadList.push({id: "icon_ruleset_std", url: "assets/icons/ruleset-standard.png", pixiBundleName: "textures"});
        this.loadList.push({id: "icon_ruleset_mania", url: "assets/icons/ruleset-mania.png", pixiBundleName: "textures"});
        this.loadList.push({id: "icon_ruleset_taiko", url: "assets/icons/ruleset-taiko.png", pixiBundleName: "textures"});
        this.loadList.push({id: "icon_ruleset_ctb", url: "assets/icons/ruleset-ctb.png", pixiBundleName: "textures"});
        this.loadList.push({id: "intro_triangles_osuLogo_gray", url: "assets/intro/logo-gray.png", pixiBundleName: "textures"});
    }

    public static Get(id: string): Blob {
        let result;
        this.loadedList.forEach((loadedObj) => {
            if (loadedObj.id == id){
                result = loadedObj.data;
            }
        });
        if (!result){
            throw new Error("Asset not found!");
        }
        return result;
    }

    private static addBackgrounds() {
        for (let i = 1; i < this.defaultBackgroundsNum + 1; i++) {
            this.loadList.push({id: "default_bg"+i, url: "assets/osu-assets/osu.Game.Resources/Textures/Menu/menu-background-"+i+".jpg", pixiBundleName: "textures"});
        }
    }

    public static Load() {
        this.addToLoadList();
        this.addBackgrounds();
        return new Promise<void>((resolve) => {
            let nonPixi: LoaderObject[] = [];
            let pixi: LoaderObject[] = [];
            let pixiwithBundles: LoaderObject[][] = [];

            let loadedAssets: number = 0;
            let erroredAssets: number = 0;

            this.loadList.forEach((loadObj) => {
               if (loadObj.pixiBundleName){
                   pixi.push(loadObj);
               }
               else {
                   nonPixi.push(loadObj);
               }
            });

            pixi.forEach((loadObj) => {
                let added = false;
                pixiwithBundles.forEach((loadObjs) => {
                    if (loadObjs.length > 0){
                        if (loadObjs[0].pixiBundleName == loadObj.pixiBundleName){
                            loadObjs.push(loadObj);
                            added = true;
                        }
                    }
                });
                if (!added){
                    pixiwithBundles.push([loadObj]);
                }
            });

            const incrementLoadAssetNumber = (errored?: boolean) => {
                if (errored){
                    erroredAssets++;
                }
                else {
                    loadedAssets++;
                }

                if (erroredAssets + loadedAssets >= this.loadList.length){
                    resolve();
                }
            }

            nonPixi.forEach((loadObj) => {
                fetch(loadObj.url)
                    .then(response => response.blob())
                    .then((response) => {
                        incrementLoadAssetNumber();
                       this.loadedList.push({id: loadObj.id, data: response});
                    })
                    .catch((error) => {
                        incrementLoadAssetNumber(true);
                        console.warn("Asset '"+loadObj.id+"' failed to load: "+error);
                    });
            });

            pixiwithBundles.forEach((bundle) => {
                if (bundle.length > 0){
                    if (!bundle[0].pixiBundleName){
                        throw new Error("wtf????");
                    }
                    let assets: PIXI.UnresolvedAsset[] = [];
                    bundle.forEach((loadObj) => {
                        assets.push({alias: loadObj.id, src: loadObj.url});
                    });
                    PIXI.Assets.addBundle(bundle[0].pixiBundleName, assets);
                    PIXI.Assets.loadBundle(bundle[0].pixiBundleName).then(() => {
                        bundle.forEach(() => {
                           incrementLoadAssetNumber();
                        });
                    });
                }

            })

        });
    }
}

interface LoaderObject {
    id: string;
    url: string;
    pixiBundleName?: string;
}

interface LoadedObject {
    id: string;
    data: Blob;
}
