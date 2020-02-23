export default class Element {
  constructor(opts = {}) {
    this.x = opts.x;
    this.y = opts.y;
    this.size = opts.size;
    this.speed = opts.speed;
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
  draw() {

  }
}