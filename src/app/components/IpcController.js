import { Container, Sprite, Text, AnimatedSprite, Ticker, Assets, Spritesheet, Texture } from 'pixi.js';
import { GAME, IPC_CONFIG } from '../config'


export default class IpcController {

    constructor(view, model) { 
        this.view = view;
        this.model = model;

         this.pauseMove = false;
        this.successRolls = 0;
        this.totalRolls = 1;
    }

    startRace() {

        const ipc = this.view;

        const jumpHeight = this.view.sprite.height / 2;
        const velocityY = 2;
        const groundY = this.view.sprite.y;
        const maxY = this.view.sprite.y - jumpHeight;

        var up = true;
        var scaleModifier = (this.view.shadowScale/jumpHeight)*0.8;
        const ipcCelebrate = () => {
            if (this.view.sprite.y >= maxY && up) {
                this.view.sprite.y -= velocityY;
                this.view.shadowScale -= scaleModifier;
                if (this.view.sprite.y <= maxY) {
                    up = false;
                    this.view.sprite.gotoAndStop(0);
                }
            }

            if (this.view.sprite.y <= groundY && !up) {
                this.view.sprite.y += velocityY;
                this.view.shadowScale += scaleModifier;
                if (this.view.sprite.y >= groundY) {
                    up = true;
                    this.view.sprite.gotoAndStop(7);
                }
            }
            this.view.shadow.scale.set(this.view.shadowScale);
        }

        const finalX = 4020;
        const moveIPC = (delta) => {
            // Move sprite only if it hasn't reached or passed the target
            if (this.view.container.x < finalX) {
                if (!ipc.pauseMove) {
                    this.totalRolls+=1;
                    //roll rnd 100
                    var roll = Math.random() * 100;
                    var speed = this.model.getSpeed();
                    var str = "IPC " + ipc.model.getID() + " rolled " + (roll + speed);
                    this.diceRollLog?.addLine(str);
                    // ipc.diceOutput.updateText(roll + speed);
                    if ((roll + speed > 50)) {
                        this.view.container.x += IPC_CONFIG.base_speed;
                        ipc.x += IPC_CONFIG.base_speed;
                        this.successRolls += 1;
                    }
                    else if(roll/2 <= this.model.getLuck()){
                        roll = Math.random() * 100;
                        if ((roll + speed > 50)) {
                            this.view.container.x += IPC_CONFIG.base_speed;
                            ipc.x += IPC_CONFIG.base_speed;
                            this.successRolls += 1;
                        }
                    }
                }

                // Clamp if it overshoots
                if (this.view.container.x > finalX) {
                    this.view.container.x = finalX;
                    ipc.x = finalX;
                }

                this.view.graph.setProgress(this.successRolls/this.totalRolls);
            }
            else {
                // Stop the ticker function once the sprite reaches the target
                this.view.sprite.stop();
                Ticker.shared.remove(moveIPC);
                
                // this.container.removeChild(this.graph);
                this.view.graph.container.visible = false;
                GAME.ipcManager.notifyFinished(this);
                this.model.raceCompleted = true;
                Ticker.shared.add(ipcCelebrate);
            }
        };

        // Start the movement
        Ticker.shared.add(moveIPC);
    }


    hitRock(rock) {
        const ipc = this.view;
        this.pauseMove = true;
        this.view.sprite.stop();
        function destroyRock() {
            if (rock.health > 0) {
                var damage = ipc.model.calculateHitDamage();
                rock.takeDamage(damage / 100);
            }
            else {
                ipc.pauseMove = false;
                ipc.sprite.play();
                Ticker.shared.remove(destroyRock);
            }
        }
        Ticker.shared.add(destroyRock);
    }

    getSuccessRate(){
        return  this.successRolls /this.totalRolls;
    }
}