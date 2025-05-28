import { Container, Text } from 'pixi.js';


export default class DiceRollLog {
    constructor() {
        this.container = new Container();
        this.container.x = 100;
        this.container.y = 0;
        this.lineHeight = 10;
        this.maxLines = 100;
        this.texts = [];

        // Initialize with empty text objects
        for (let i = 0; i < this.maxLines; i++) {
            const text = new Text("", {
                fontFamily: "Arial",
                fontSize: 16,
                fill: 0xffffff,
            });
            text.y = i * this.lineHeight;
            this.container.addChild(text);
            this.texts.push(text);
        }
    }

    // Add a new line of text
    addLine(newText) {
        // Shift all text contents up
        for (let i = 0; i < this.maxLines - 1; i++) {
            this.texts[i].text = this.texts[i + 1].text;
        }
        // Set new text at the bottom
        this.texts[this.maxLines - 1].text = newText;
    }

    updateX(x){
        this.container.x = x;
    }

    get displayObject() {
        return this.container;
    }
}