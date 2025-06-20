import { Container, Graphics, Text } from 'pixi.js';
import BasicButton from '../components/BasicButton';
import InputLabel from '../components/InputLabel';
import SimpleSlider from '../components/SimpleSlider';


export default class AddIpcPopup extends Container {
  private input: InputLabel;
  private slider: SimpleSlider;
  private onGenerateRandom: (ids: number[]) => void;

  constructor(x: number, y: number, onGenerateRandom = (ids: number[]) => void {}) {
    super();

    var bg_width = 350;
    var bg_height = 300;

    this.onGenerateRandom = onGenerateRandom;

    //Background
    const box = new Graphics()
      .beginFill(0xffffff)
      .drawRoundedRect(0, 0, bg_width, bg_height, 20)
      .endFill();
    box.x = x - (bg_width / 2);
    box.y = y - (bg_height / 2);
    this.addChild(box);

    const text = new Text('Add New IPCs to the Race', {
      fill: 0x000000,
      fontSize: 16,
      // wordWrap: true,
      // wordWrapWidth: bg_width - 40,
    });
    text.x = box.x + bg_width / 2 - text.width / 2;
    text.y = box.y + 30;
    this.addChild(text);

    // Manual IPC input
    this.input = new InputLabel({
      label: '',
      placeholder: 'Enter IPC ID',
      x: box.x + bg_width / 2,
      y: text.y + 20,
    });
    this.input.x -= this.input.width / 2;
    this.addChild(this.input);

    // Slider label
    const sliderLabel = new Text("Number of Random IPCs:", {
      fontSize: 16,
      fill: 0x000000
    });
    sliderLabel.x = box.x + bg_width / 2 - sliderLabel.width / 2;
    sliderLabel.y = this.input.y + this.input.height + 40;
    this.addChild(sliderLabel);

    // Slider
    this.slider = new SimpleSlider(1, 23, Math.floor(Math.random() * 23), (val) => {
      // live update if needed
    });
    this.slider.x = box.x + bg_width / 2 - this.slider.width / 2;
    this.slider.y = sliderLabel.y + sliderLabel.height + 20;
    this.addChild(this.slider);

    // Add button
    const closeBtn = new BasicButton('Add IPC', {
      width: 100,
      height: 40,
      backgroundColor: 0x2288cc,
      hoverColor: 0x44aaff,
      fontSize: 20,
      onClick: () => {
        const addIPC = this.input.getValue();

        var count = this.slider.getValue();
        const uniqueValues = new Set([]);

        if (addIPC !== "") {
          uniqueValues.add(addIPC);
          count++;
        }

        while (uniqueValues.size < count) {
          const randomIPC = 1 + Math.floor(Math.random() * 11999);
          uniqueValues.add(randomIPC); // Set automatically handles uniqueness
        }

        this.onGenerateRandom(Array.from(uniqueValues));

      }
    });

    closeBtn.x = box.x + bg_width / 2 - closeBtn.width / 2;
    closeBtn.y = this.slider.y + this.slider.height + 20;
    this.addChild(closeBtn);

  }

  private handleAddClick(): void {
    const addIPC = this.input.getValue();
    let count = this.slider.getValue();
    const uniqueValues = new Set([]);

    if (addIPC !== "") {
      uniqueValues.add(Number(addIPC));
      count++;
    }

    while (uniqueValues.size < count) {
      const randomIPC = 1 + Math.floor(Math.random() * 11999);
      uniqueValues.add(randomIPC);
    }

    this.onGenerateRandom(Array.from(uniqueValues));
  }

}
