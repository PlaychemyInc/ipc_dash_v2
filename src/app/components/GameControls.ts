import Camera from "./Camera";
import UIManager from "../managers/UIManager";

export default class GameControls {
    private scene: any;

    constructor(scene: any) {
        this.scene = scene;

        this.setupControls();
    }

    private setupControls(): void {
        

        
    }

    public destroy(): void {
        // if you had any specific listeners in controls, remove them here
    }
}
