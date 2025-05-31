import { Container, Sprite, Text, AnimatedSprite, Ticker, Assets, Spritesheet, Texture } from 'pixi.js';
import { IPC_CONFIG } from '../config'
import SuccessRateGraph from './SuccessRateGraph';



export default class IpcView {
    container;
    constructor(x, y, model, spritesheetData, onSpriteLoaded, scene){

        this.model = model;
        this.spritesheetData = spritesheetData;
        this.onSpriteLoaded = onSpriteLoaded;
        this.scene = scene;

        this.createContainer(x,y);

    }

    createContainer(x,y){
        this.container = new Container();
        this.container.x = x;
        this.container.y = y;
        this.container.sortableChildren = true;
    }

    async onDataLoaded(){
        await this.loadShadow();
        await this.loadSprite();
        this.loadIdText();
        this.loadGraph();

        this.setShadowTransform();
        this.setIdTextTransform();
        
        this.onSpriteLoaded();
    }

    async loadSprite() {

        this.imageURL = 'https://raw.githubusercontent.com/AnnEsther/ipc_dash_page/main/assets/IPCSpriteSheets/' + this.model.getID() + '.png';

        //Load your alternate image (according to gameData)
        this.spritesheetData.meta.image = this.imageURL;
        // Step 3: Create your own spritesheet
        // Step 4: Parse it (builds textures)
        await Assets.load(this.imageURL);
        this.spritesheet = new Spritesheet(Texture.from(this.imageURL), this.spritesheetData);
        await this.spritesheet.parse();

        // Create a  AnimatedSprite
        this.sprite = new AnimatedSprite(this.spritesheet.animations.ipc);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(IPC_CONFIG.sprite_scale);
        this.sprite.play();
        this.sprite.animationSpeed = this.model.getSpeed() / 10;

        this.container.addChild(this.sprite);

    }

    async loadShadow(){
        var texture = await Assets.load('assets/shadow.png');
        this.shadow = Sprite.from(texture);
        this.container.addChild(this.shadow);
    }

    loadIdText(){
        this.idText = new Text({ text: '#' + this.model.getID(), fontFamily: "Arial", fontSize: 16, fill: 0xffffff, });
        this.container.addChild(this.idText);
    }

    loadGraph(){
        var graphConfig = {
            x: this.sprite.x - ((this.sprite.width- (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) /2),
            y: this.sprite.y,
            width : (this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale * 2)) * 0.25,
            height : (this.sprite.height - (IPC_CONFIG.padding.top * 2)) * 0.8
        };
        this.graph = new SuccessRateGraph(graphConfig);
        this.container.addChild(this.graph.displayObject);
        this.graph.setProgress(this.controller.getSuccessRate());
    }

    setShadowTransform(){
        this.shadowScale = (this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) / (this.shadow.width);
        this.shadow.scale.set(this.shadowScale);
        this.shadow.anchor.set(0.5, 0);
        this.shadow.y += this.sprite.height / 2 - (IPC_CONFIG.padding.bottom * IPC_CONFIG.sprite_scale);
    }

    setIdTextTransform(){
        this.idText.style.fontSize = this.sprite.height / 9;
        this.idText.x = this.sprite.x - ((this.sprite.width- (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) /2),
        this.idText.y -= (this.sprite.height / 2);
    }


    get displayObject() {
        return this.container;
    }
}