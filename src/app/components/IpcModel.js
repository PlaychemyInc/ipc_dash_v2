
export default class IpcModel {
    #ipcID;
    #attribute;
    constructor(config, onDataLoaded) {
        this.#ipcID = config.id;
        this.#attribute = {};
        this.callback = onDataLoaded;

        this.raceCompleted = false;

        this.getIPCdata();
    }

    async getIPCdata() {
        const contractAddress = '0x011C77fa577c500dEeDaD364b8af9e8540b808C0';
        const url = `https://api.opensea.io/api/v2/metadata/ethereum/${contractAddress}/${this.#ipcID}`;

        const response = await fetch(url);
        const data = await response.json();

        this.onDataLoaded(data);

    }

    setIPCprops(traits) {
        traits.forEach(trait => {
            this.#attribute[trait.trait_type] = trait.value;
        });
    }

    onDataLoaded(data) {
        this.description = data.description;
        this.name = data.name;

        this.setIPCprops(data.traits);

        this.hitDamage = this.calculateHitDamage();

        this.callback();
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
}