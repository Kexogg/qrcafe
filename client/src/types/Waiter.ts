export class Waiter {
  name: string;
  id: string;
  image?: string;
  constructor(name: string, id: string, img?: string) {
    this.name = name;
    this.id = id;
    this.image = img;
  }
}