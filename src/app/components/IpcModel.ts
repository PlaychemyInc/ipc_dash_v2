export default class IpcModel {
    #ipcID: number;
    #attribute: Record<string, any> = {};
    public description: string = '';
    public name: string = '';
    public points: number = 0;
    public raceCompleted: boolean = false;
    public hitDamage: number = 0;

    constructor(id: number) {
        this.#ipcID = id;
    }

    public async loadData(): Promise<void> {
        const contractAddress = '0x011C77fa577c500dEeDaD364b8af9e8540b808C0';
        const url = `https://api.opensea.io/api/v2/metadata/ethereum/${contractAddress}/${this.#ipcID}`;

        const response = await fetch(url);
        const data = await response.json();

        this.description = data.description;
        this.name = data.name;

        this.setIPCprops(data.traits);
        this.hitDamage = this.calculateHitDamage();
    }

    private setIPCprops(traits: any[]): void {
        if (traits) {
            traits.forEach(trait => {
                this.#attribute[trait.trait_type] = trait.value;
            });
        }
    }

    public calculateHitDamage(): number {
        const base = this.getStrength() * 0.6 + this.getForce() * 0.4;
        const precisionFactor = 0.8 + (this.getPrecision() / 100) * 0.4;
        const luckBoost = Math.random() < this.getLuck() / 200 ? 1.5 : 1.0;
        return Math.round(base * precisionFactor * luckBoost);
    }

    public getID(): number { return this.#ipcID; }
    public getStrength(): number { return this.#attribute.Strength ?? 0; }
    public getForce(): number { return this.#attribute.Force ?? 0; }
    public getPrecision(): number { return this.#attribute.Precision ?? 0; }
    public getLuck(): number { return this.#attribute.Luck ?? 0; }

    public destroy(): void {
        this.#attribute = {};
    }
}
