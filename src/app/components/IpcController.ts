import { Ticker } from 'pixi.js';
import { IPC_CONFIG } from '../config';
import IPCManager from '../managers/IPCManager';
import IpcView from './IpcView';
import IpcModel from './IpcModel';

export default class IpcController {
    private view: IpcView;
    private model: IpcModel;
    private diceRollLog: any;
    private successRolls = 0;
    private totalRolls = 1;
    private pauseMove = false;
    private activeTickers: Array<(Ticker: any) => void> = [];

    constructor(view: IpcView, model: IpcModel, diceRollLog: any) {
        this.view = view;
        this.model = model;
        this.diceRollLog = diceRollLog;
    }

    public startRace(): void {
        const jumpHeight = this.view.sprite.height / 2;
        const velocityY = 2;
        const groundY = this.view.sprite.y;
        const maxY = groundY - jumpHeight;
        let up = true;
        let scaleModifier = (this.view.shadow.scale.x / jumpHeight) * 0.8;

        const ipcCelebrate = (ticker: any): void => {
            const delta = ticker as number;
            if (this.view.sprite.y >= maxY && up) {
                this.view.sprite.y -= velocityY;
                this.view.shadow.scale.x -= scaleModifier;
                this.view.shadow.scale.y -= scaleModifier;
                if (this.view.sprite.y <= maxY) {
                    up = false;
                    this.view.sprite.gotoAndStop(0);
                }
            } else if (this.view.sprite.y <= groundY && !up) {
                this.view.sprite.y += velocityY;
                this.view.shadow.scale.x += scaleModifier;
                this.view.shadow.scale.y += scaleModifier;
                if (this.view.sprite.y >= groundY) {
                    up = true;
                    this.view.sprite.gotoAndStop(7);
                }
            }
        };
        
        const moveIPC = (ticker: any): void => {
            if (this.view.container.x < 4020) {
                if (!this.pauseMove) {
                    this.totalRolls++;
                    const roll = Math.random() * 100;
                    const speed = this.model.getStrength();
                    this.diceRollLog?.addLine(`IPC ${this.model.getID()} rolled ${roll + speed}`);

                    if (roll > 50 || (this.model.points > 0 && --this.model.points >= 0)) {
                        this.view.container.x += IPC_CONFIG.base_speed;
                        this.successRolls++;
                    }

                    this.view.updateGraph(this.getSuccessRate());
                }

                if (this.view.container.x > 4020) {
                    this.view.container.x = 4020;
                }
            } else {
                this.endRace(moveIPC, ipcCelebrate);
            }
        };

        


        Ticker.shared.add(moveIPC);
        this.activeTickers.push(moveIPC);
    }

    private endRace(moveIPC: (ticker: any) => void, ipcCelebrate: (ticker: any) => void): void {
        Ticker.shared.remove(moveIPC);
        this.view.sprite.stop();
        this.view.graph.displayObject.visible = false;
        IPCManager.getInstance().notifyFinished(this);
        this.model.raceCompleted = true;

        Ticker.shared.add(ipcCelebrate);
        this.activeTickers.push(ipcCelebrate);
    }

    public hitRock(rock: any): void {
        this.pauseMove = true;
        this.view.sprite.stop();

        const destroyRock = (): void => {
            if (rock.health > 0) {
                rock.takeDamage(this.model.calculateHitDamage() / 100);
            } else {
                this.pauseMove = false;
                this.view.sprite.play();
                Ticker.shared.remove(destroyRock);
            }
        };

        Ticker.shared.add(destroyRock);
        this.activeTickers.push(destroyRock);
    }

    public getSuccessRate(): number {
        return this.successRolls / this.totalRolls;
    }

    public destroy(): void {
        this.activeTickers.forEach(fn => Ticker.shared.remove(fn));
        this.activeTickers = [];
    }
}
