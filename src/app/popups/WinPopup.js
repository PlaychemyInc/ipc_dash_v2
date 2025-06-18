import { Container, Graphics, Text, Assets, Sprite, AnimatedSprite, Ticker } from 'pixi.js';
import BasicButton from '../components/BasicButton';
import InputLabel from '../components/InputLabel';
import { GAME, IPC_CONFIG } from '../config'
import SceneManager from '../managers/SceneManager';



export default class WinPopup {
  constructor(scene, x, y, winner, finishedIPCs) {

    this.scene = scene;

    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    this.container.sortableChildren = true;

    this.sprite = new Sprite(Assets.get('HallOfFame'));
    this.sprite.anchor.set(0.5);
    this.container.addChild(this.sprite);

    // Add close button
    // this.createCloseButton();

    this.cards = [];
    this.createWinnerGrid(finishedIPCs);

  }

  // createCloseButton() {
  //   this.closeBtn = new BasicButton('X', 40, 40, () => {
  //     Ticker.shared.destroy();
  //     this.scene.setScene('game');
  //   });

  //   // Red color background
  //   this.closeBtn.drawBackground(0xff0000);
  //   this.closeBtn.x = this.sprite.x + 10 + this.sprite.width / 3;
  //   this.closeBtn.y = this.sprite.y - this.sprite.height / 3;

  //   this.container.addChild(this.closeBtn);
  // }

  createWinnerGrid(finishedIPCs) {
    const cardWidth = this.sprite.width * 0.55 / 3;
    const cardHeight = this.sprite.height * 0.4;
    const spacing = 20;
    const startX = -(finishedIPCs.length * (cardWidth + spacing) - spacing) / 2;
    const startY = - cardHeight * 0.38;
    finishedIPCs.forEach((ipc, index) => {


      const card = new Container();
      card.x = startX + index * (cardWidth + spacing);
      card.y = startY;
      this.container.addChild(card);

      // Card background
      const bg = new Graphics();
      bg.beginFill(0xffffff);
      bg.lineStyle(2, 0x000000);
      bg.drawRoundedRect(0, 0, cardWidth, cardHeight, 15);
      bg.endFill();
      card.addChild(bg);

      // Character sprite
      const copySprite = new AnimatedSprite(ipc.view.spritesheet.animations.ipc);
      copySprite.anchor.set(0.5, 0.5);
      copySprite.x = cardWidth / 2;
      copySprite.y = cardHeight / 2;
      copySprite.scale.set(0.5); // Adjust scale as needed
      card.addChild(copySprite);

      // Rank icon
      const rankText = new Text(this.getRankEmoji(index), {
        fontSize: 42,
        fill: 0xffd700,
      });
      rankText.anchor.set(0.5);
      rankText.x = cardWidth / 2;
      rankText.y = 30;
      card.addChild(rankText);

      // Name label
      const nameLabel = new Text(ipc.model.name, {
        fontSize: 22,
        fill: 0x333333,
      });
      nameLabel.anchor.set(0.5);
      nameLabel.x = cardWidth / 2;
      nameLabel.y = cardHeight - 50;
      card.addChild(nameLabel);

      // Success rate
      var successRate = Math.round(ipc.getSuccessRate() * 100);
      const successText = new Text(`${successRate}% Success`, {
        fontSize: 18,
        fill: 0x00aa00,
      });
      successText.anchor.set(0.5);
      successText.x = cardWidth / 2;
      successText.y = cardHeight - 25;
      card.addChild(successText);

      this.cards.push(card);
    });
  }

  getRankEmoji(rank) {
    switch (rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${rank}`;
    }
  }

  updateData() {
    var winners = GAME.ipcManager.finishedIPCs;


  }

  setVisibility(flag) {
    this.container.visible = flag;
  }

  get displayObject() {
    return this.container;
  }

}
