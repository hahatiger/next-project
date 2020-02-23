import Element from './Elment'

//子弹对象
export default class Bullet extends Element {
  constructor(props) {
    super(props);
  }
  fly() {
    this.move(0, -this.speed);
  }
  draw() {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y - this.size);
    context.strokeStyle = "#fff";
    context.closePath();
    context.stroke();
    return this;
  }
}
