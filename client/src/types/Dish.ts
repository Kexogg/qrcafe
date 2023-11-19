export class Dish {
    id: number;
    name: string;
    price: number;
    description: string;
    weight: string;
    extras: DishExtra[];
    image: string;
    constructor(id: number, name: string, price: number, description: string, weight: string, extras: DishExtra[], image: string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.weight = weight;
        this.extras = extras;
        this.image = image;
    }
    toggleExtra(id: number) {
        const extra = this.extras.find(extra => extra.id === id);
        if (extra) {
            extra.applied = !extra.applied;
        }
    }
    get total() {
        return this.price + this.extras.filter(extra => extra.applied).reduce((acc, extra) => acc + extra.price, 0);
    }
}

interface DishExtra {
    id: number;
    name: string;
    price: number;
    applied: boolean;
}