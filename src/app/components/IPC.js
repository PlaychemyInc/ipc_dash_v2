import { Spritesheet, Assets, Texture, AnimatedSprite, Ticker } from 'pixi.js';

export default class IPC {
    #ipcID;
    #attribute;
    constructor(spritesheet, ipc_id, x, y, callback) {

        this.spritesheet = spritesheet;

        this.#ipcID = ipc_id;
        this.#attribute = {};
        this.callback = callback;
        this.x = x;
        this.y = y;

        this.getIPCdata();

        return this;
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

    }

    async loadSprite() {

        const scaling = 0.5;

        // Create a  AnimatedSprite
        const animatedSprite = new AnimatedSprite(this.spritesheet.animations.ipc);

        animatedSprite.anchor.set(0.5);
        animatedSprite.scale.set(scaling);

        animatedSprite.x = this.x;
        animatedSprite.y = this.y;

        animatedSprite.play();
        this.sprite = animatedSprite;
        this.callback(animatedSprite);

    }

    setIPCprops(traits) {
        traits.forEach(trait => {
            this.#attribute[trait.trait_type] = trait.value;
        });
    }


    startRace() {
        const ipc = this;

        const jumpHeight = this.sprite.height/2;
        const velocityY = 2;
        const groundY = this.sprite.y;
        const maxY = this.sprite.y - jumpHeight;

        var up = true;
        console.log(this.x);
        console.log(groundY);
        console.log(maxY);
        function ipcCelebrate() {
            if (ipc.sprite.y >= maxY && up) {
                ipc.sprite.y -= velocityY;
                if(ipc.sprite.y <= maxY){
                    up = false;
                    ipc.sprite.gotoAndStop(0);
                }
            }

            if (ipc.sprite.y <= groundY && !up) {
                ipc.sprite.y += velocityY;
                if(ipc.sprite.y >= groundY){
                    up = true;
                    ipc.sprite.gotoAndStop(7);
                }
            }
        }

        const finalX = 3914;
        const speed = this.getSpeed() / 5;
        const moveIPC = (delta) => {
            // Move sprite only if it hasn't reached or passed the target
            if (ipc.sprite.x < finalX) {
                ipc.sprite.x += speed;
                ipc.x += speed;

                // Clamp if it overshoots
                if (ipc.sprite.x > finalX) {
                    ipc.sprite.x = finalX;
                    ipc.x = finalX;
                }
            } else {
                // Stop the ticker function once the sprite reaches the target
                ipc.sprite.stop();
                Ticker.shared.remove(moveIPC);

                Ticker.shared.add(ipcCelebrate);
            }
        };

        // Start the movement
        Ticker.shared.add(moveIPC);
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
}

// animation_url: null
// description: `2018 Nordic Human\n\nMale, 6'3", Pale Skin, Platinum Hair, Green Eyes, Right-Handed\n\n16 Strength, 14 Dexterity, 7 Intelligence, 8 Constitution, 10 Luck`
// external_link: null
// image: "https://i.seadn.io/gae/KayxuBDT-2eXC_eMT0qYzuMdFVHV20O08qwZyRVtq8wuToUUYtXWDeud9jP91F29mPyg2fOkKxBNqx017Ji0EhPj2t7vdUkNKw7xAe4?w=500&auto=format"
// name: "#1 - Eve"
// traits: Array(27) [ {…}, {…}, {…}, … ]
// 0: Object { trait_type: "Accessories", value: "None", display_type: null, … }
// 1: Object { trait_type: "Birth Year", value: "2018", display_type: null, … }
// 2: Object { trait_type: "Constitution", value: "8", display_type: null, … }
// 3: Object { trait_type: "Dexterity", value: "14", display_type: null, … }
// 4: Object { trait_type: "Eye Color", value: "Green", display_type: null, … }
// 5: Object { trait_type: "Force", value: "6", display_type: null, … }
// 6: Object { trait_type: "Fortitude", value: "3", display_type: null, … }
// 7: Object { trait_type: "Gender", value: "Male", display_type: null, … }
// 8: Object { trait_type: "Hair Color", value: "Platinum", display_type: null, … }
// 9: Object { trait_type: "Handedness", value: "Right", display_type: null, … }
// 10: Object { trait_type: "Healing", value: "4", display_type: null, … }
// 11: Object { trait_type: "Height", value: `6'3"`, display_type: null, … }
// 12: Object { trait_type: "Intelligence", value: "7", display_type: null, … }
// 13: Object { trait_type: "Luck", value: "10", display_type: null, … }
// 14: Object { trait_type: "Memory", value: "2", display_type: null, … }
// 15: Object { trait_type: "Precision", value: "6", display_type: null, … }
// 16: Object { trait_type: "Processing", value: "2", display_type: null, … }
// 17: Object { trait_type: "Race", value: "Human", display_type: null, … }
// 18: Object { trait_type: "Reaction", value: "2", display_type: null, … }
// 19: Object { trait_type: "Reasoning", value: "3", display_type: null, … }
// 20: Object { trait_type: "Skin Color", value: "Pale", display_type: null, … }
// 21: Object { trait_type: "Speed", value: "6", display_type: null, … }
// 22: Object { trait_type: "Strength", value: "16", display_type: null, … }
// 23: Object { trait_type: "Subrace", value: "Nordic Human", display_type: null, … }
// 24: Object { trait_type: "Sustain", value: "5", display_type: null, … }
// 25: Object { trait_type: "Tolerance", value: "5", display_type: null, … }
// 26: Object { trait_type: "Vitality", value: "1", display_type: null, … }


