import { Assets } from 'pixi.js';

export default class AssetLoader {
    static async init() {
        await Assets.init({ manifest: '/manifest.json' });
    }

    static async loadBundle(bundleKey) {
        return await Assets.loadBundle(bundleKey);
    }

    static async load(assetUrlOrArray) {
        return await Assets.load(assetUrlOrArray);
    }

    static get assets() {
        return Assets;
    }
}