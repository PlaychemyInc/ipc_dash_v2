import { Ticker } from 'pixi.js';

export default class Camera { 

    constructor(gameScene, diceRollLog){
        this.camera = gameScene.scene;
        this.scene = gameScene;
        this.diceRollLog = diceRollLog;
    }

    startFollowIPC(fastestIPC, maxWidth, finalX, scaleFactor){

        var speed = 0;
        maxWidth /= scaleFactor;
        // const camera = this.camera;

        const followIPC = (delta) => {
            // 
            if (fastestIPC.x + (fastestIPC.sprite.width/(scaleFactor*2)) >=  maxWidth) {
                speed = fastestIPC.getSpeed()/5;
            }

            if (this.camera.pivot.x + maxWidth < finalX) {
                this.camera.pivot.x += speed;
                

                // Clamp if it overshoots
                if (this.camera.pivot.x + maxWidth > finalX) {
                    this.camera.pivot.x = finalX - maxWidth;
                }

                this.diceRollLog?.updateX(this.camera.pivot.x);
            } else {
                // Stop the ticker function once the sprite reaches the target
                Ticker.shared.remove(followIPC);
            }
        };

        // Start the movement
        Ticker.shared.add(followIPC);
    }

}