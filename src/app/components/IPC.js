import { Container, Sprite, Text, AnimatedSprite, Ticker, Assets } from 'pixi.js';
import { IPC_CONFIG } from '../config'

import SuccessRateGraph from './SuccessRateGraph';

export default class IPC {
    #ipcID;
    #attribute;
    constructor(config) {


        this.spritesheet = config.spritesheet;

        this.#ipcID = config.id;
        this.#attribute = {};
        this.callback = config.callback;
        this.x = config.x;
        this.y = config.y;
        this.diceRollLog = config.diceRollLog;

        this.container = new Container();
        this.container.x = this.x;
        this.container.y = this.y;
        this.container.sortableChildren = true;

        this.getIPCdata();

        this.pauseMove = false;
        this.hitDamage = 0;
        this.successRolls = 0;
        this.totalRolls = 1;

        return this;
    }

    async loadUI() {
        var texture = await Assets.load('assets/shadow.png');
        this.shadow = Sprite.from(texture);

        this.shadow.scale.set((this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) / (this.shadow.width));
        this.shadow.anchor.set(0.5, 0);
        this.shadow.y += this.sprite.height / 2 - (IPC_CONFIG.padding.bottom * IPC_CONFIG.sprite_scale);
        this.container.addChild(this.shadow);

        this.idText = new Text({ text: '#' + this.getID(), fontFamily: "Arial", fontSize: 16, fill: 0xffffff, });
        this.container.addChild(this.idText);

        var graphConfig = {
            x: this.sprite.x - ((this.sprite.width- (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) /2),
            y: this.sprite.y,
            width : (this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale * 2)) * 0.25,
            height : (this.sprite.height - (IPC_CONFIG.padding.top * 2)) * 0.8
        };
        this.graph = new SuccessRateGraph(graphConfig);
        this.container.addChild(this.graph.displayObject);
        this.graph.setProgress(this.successRolls/this.totalRolls);

    }

    async getIPCdata() {
        const contractAddress = '0x011C77fa577c500dEeDaD364b8af9e8540b808C0';
        const url = `https://api.opensea.io/api/v2/metadata/ethereum/${contractAddress}/${this.#ipcID}`;

        const response = await fetch(url);
        const data = await response.json();

        this.description = data.description;

        this.loadSprite();

        this.setIPCprops(data.traits);

        this.sprite.animationSpeed = this.getSpeed() / 10;

        this.hitDamage = this.calculateHitDamage();

    }

    async loadSprite() {

        // Create a  AnimatedSprite
        this.sprite = new AnimatedSprite(this.spritesheet.animations.ipc);

        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(IPC_CONFIG.sprite_scale);

        this.sprite.play();

        this.container.addChild(this.sprite);

        await this.loadUI();

        this.sprite.zIndex = 10;
        this.shadow.zIndex = 5;

        this.idText.style.fontSize = this.sprite.height / 9;

        this.idText.x = this.sprite.x - ((this.sprite.width- (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) /2),
        this.idText.y -= (this.sprite.height / 2);


        this.callback(this);

    }

    setIPCprops(traits) {
        traits.forEach(trait => {
            this.#attribute[trait.trait_type] = trait.value;
        });
    }


    startRace() {
        const ipc = this;

        const jumpHeight = this.container.height / 2;
        const velocityY = 2;
        const groundY = this.container.y;
        const maxY = this.container.y - jumpHeight;

        var up = true;

        function ipcCelebrate() {
            if (ipc.container.y >= maxY && up) {
                ipc.container.y -= velocityY;
                if (ipc.container.y <= maxY) {
                    up = false;
                    ipc.sprite.gotoAndStop(0);
                }
            }

            if (ipc.container.y <= groundY && !up) {
                ipc.container.y += velocityY;
                if (ipc.container.y >= groundY) {
                    up = true;
                    ipc.sprite.gotoAndStop(7);
                }
            }
        }

        const finalX = 3914;
        const moveIPC = (delta) => {
            // Move sprite only if it hasn't reached or passed the target
            if (this.container.x < finalX) {
                if (!ipc.pauseMove) {
                    this.totalRolls+=1;
                    //roll rnd 100
                    var roll = Math.random() * 100;
                    var speed = this.getSpeed();
                    var str = "IPC " + ipc.getID() + " rolled " + (roll + speed);
                    this.diceRollLog?.addLine(str);
                    // ipc.diceOutput.updateText(roll + speed);
                    if (roll + speed > 50) {
                        this.container.x += IPC_CONFIG.base_speed;
                        ipc.x += IPC_CONFIG.base_speed;
                        this.successRolls += IPC_CONFIG.base_speed;
                    }
                }

                // Clamp if it overshoots
                if (this.container.x > finalX) {
                    this.container.x = finalX;
                    ipc.x = finalX;
                }

                this.graph.setProgress(this.successRolls/this.totalRolls);
            }
            else {
                // Stop the ticker function once the sprite reaches the target
                ipc.sprite.stop();
                Ticker.shared.remove(moveIPC);

                Ticker.shared.add(ipcCelebrate);
            }
        };

        // Start the movement
        Ticker.shared.add(moveIPC);
    }

    calculateHitDamage() {
        // Base damage from strength and force
        const base = this.getStrength() * 0.6 + this.getForce() * 0.4;

        // Precision modifier (0.8 to 1.2 based on how precise)
        const precisionFactor = 0.8 + (this.getPrecision() / 100) * 0.4;

        // Luck modifier (random boost from luck)
        const luckBoost = Math.random() < this.getLuck() / 200 ? 1.5 : 1.0;

        // Final damage
        const damage = base * precisionFactor * luckBoost;

        return Math.round(damage);
    }


    hitRock(rock) {
        const ipc = this;
        this.pauseMove = true;
        this.sprite.stop();
        function destroyRock() {
            if (rock.health > 0) {
                var damage = ipc.calculateHitDamage();
                console.log(damage);
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

    getID() { return this.#ipcID };
    getStrength() { return this.#attribute.Strength; };
    getForce() { return this.#attribute.Force; };
    getSustain() { return this.#attribute.Sustain; };
    getTolerance() { return this.#attribute.Tolerance; };
    getDexterity() { return this.#attribute.Dexterity; };
    getSpeed() { return this.#attribute.Speed; };
    getPrecision() { return this.#attribute.Precision; };
    getReaction() { return this.#attribute.Reaction; };
    getIntelligence() { return this.#attribute.Intelligence; };
    getMemory() { return this.#attribute.Memory; };
    getProcessing() { return this.#attribute.Processing; };
    getReasoning() { return this.#attribute.Reasoning; };
    getConstittuion() { return this.#attribute.Constittuion; };
    getHealing() { return this.#attribute.Healing; };
    getFortitude() { return this.#attribute.Fortitude; };
    getVitality() { return this.#attribute.Vitality; };
    getLuck() { return this.#attribute.Luck; };
    getRace() { return this.#attribute.Race; };
    getSubrace() { return this.#attribute.Subrace; };
    getGender() { return this.#attribute.Gender; };
    getSkinColor() { return this.#attribute.SkinColor; };
    getHairColor() { return this.#attribute.HairColor; };
    getEyeColor() { return this.#attribute.EyeColor; };
    getHandedness() { return this.#attribute.Handedness; };

    get displayObject() {
        return this.container;
    }
}

