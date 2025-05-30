import { Container, Sprite, Text, AnimatedSprite, Ticker, Assets, Spritesheet, Texture } from 'pixi.js';
import { IPC_CONFIG } from '../config'

import IpcModel from './IpcModel';
import IpcView from './IpcView';
import IpcController from './IpcController';

export default class IPC {
    #ipcID;
    #attribute;
    constructor(config) {
       
        this.#ipcID = config.id;
        this.#attribute = {};
        this.callback = config.callback;
        this.x = config.x;
        this.y = config.y;
        this.diceRollLog = config.diceRollLog;
        this.scene = config.scene;

        this.model = new IpcModel(config, this.onDataLoaded.bind(this));
        this.view = new IpcView(this.x, this.y, this.model, config.spritesheetData, this.onSpriteLoaded.bind(this), this.scene);
        this.controller = new IpcController(this.view, this.model);

    }

    onDataLoaded(){
        this.view.onDataLoaded();
    }

    onSpriteLoaded(){
        this.callback(this);
    }
    
    startRace() {
        this.controller.startRace();
    }


    hitRock(rock) {
        this.controller.hitRock(rock);
    }

    getX(){
        return this.view.container.x;
    }

    get displayObject() {
        return this.view.displayObject;
    }
}

