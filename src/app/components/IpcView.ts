import { Container, Sprite, Text, AnimatedSprite, Assets, Spritesheet, Texture } from 'pixi.js';
import SuccessRateGraph from './SuccessRateGraph';
import { IPC_CONFIG } from '../config';
import IpcModel from './IpcModel';
import IpcController from './IpcController';

export default class IpcView {
    public container: Container;
    public sprite!: AnimatedSprite;
    public shadow!: Sprite;
    public idText!: Text;
    public graph!: SuccessRateGraph;
    public controller!: IpcController;

    private model: IpcModel;
    private spritesheetData: any;
    private scene: any;
    private imageURL!: string;
    private spritesheet!: Spritesheet;

    constructor(x: number, y: number, model: IpcModel, spritesheetData: any, scene: any) {
        this.model = model;
        this.spritesheetData = spritesheetData;
        this.scene = scene;

        this.container = new Container();
        this.container.x = x;
        this.container.y = y;
        this.container.sortableChildren = true;
    }

    public async loadAssets(): Promise<void> {
        await this.loadShadow();
        await this.loadSprite();
    }

    private async loadSprite(): Promise<void> {
        this.imageURL = `https://raw.githubusercontent.com/AnnEsther/ipc_dash_page/main/assets/IPCSpriteSheets/${this.model.getID()}.png`;
        this.spritesheetData.meta.image = this.imageURL;

        await Assets.load(this.imageURL);
        this.spritesheet = new Spritesheet(Texture.from(this.imageURL), this.spritesheetData);
        await this.spritesheet.parse();

        this.sprite = new AnimatedSprite(this.spritesheet.animations.ipc);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(IPC_CONFIG.sprite_scale);
        this.sprite.play();
        this.sprite.animationSpeed = 0.5;

        this.container.addChild(this.sprite);
    }

    private async loadShadow(): Promise<void> {
        const texture = await Assets.load('assets/shadow.png');
        this.shadow = Sprite.from(texture);
        this.container.addChild(this.shadow);
    }

    public onDataLoaded(): void {
        this.loadIdText();
        this.loadGraph();
        this.setShadowTransform();
        this.setIdTextTransform();
    }

    private loadIdText(): void {
        this.idText = new Text(`#${this.model.getID()}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff
        });
        this.container.addChild(this.idText);
    }

    private loadGraph(): void {
        this.graph = new SuccessRateGraph({
            x: this.sprite.x - ((this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) / 2),
            y: this.sprite.y,
            width: (this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale * 2)) * 0.25,
            height: (this.sprite.height - (IPC_CONFIG.padding.top * 2)) * 0.8,
            bgColor: 0x333333,
            fillColor: 0x00ff00
        });
        this.container.addChild(this.graph.displayObject);
    }

    private setShadowTransform(): void {
        var shadowScale = (this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) / (this.shadow.width);
        this.shadow.scale.set(shadowScale);
        this.shadow.anchor.set(0.5, 0);
        this.shadow.y += this.sprite.height / 2 - (IPC_CONFIG.padding.bottom * IPC_CONFIG.sprite_scale);
    }

    private setIdTextTransform(): void {
        this.idText.style.fontSize = this.sprite.height / 9;
        this.idText.x = this.sprite.x - ((this.sprite.width - (IPC_CONFIG.padding.left * IPC_CONFIG.sprite_scale)) / 2),
            this.idText.y -= (this.sprite.height / 2);
    }

    public updateGraph(progress: number): void {
        this.graph.setProgress(progress);
    }

    public get displayObject(): Container {
        return this.container;
    }

    public destroy(): void {
        this.sprite?.destroy();
        this.shadow?.destroy();
        this.idText?.destroy();
        this.graph?.destroy();
        this.container.destroy({ children: true });
    }
}
