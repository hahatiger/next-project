//键盘事件
export default class keyBoard {
  constructor() {
    document.onkeydown = this.keydown.bind(this);
    document.onkeyup = this.keyup.bind(this);
    Object.assign(this, {
      pressedLeft: false,
      pressedRight: false,
      pressedUp: false,
      heldLeft: false,
      heldRight: false,
      pressedSpace: false
    })
  }

  keydown(b) {
    var a = b.keyCode;
    console.log(a)
    switch (a) {
      case 32:
        this.pressedSpace = true;
        break;
      case 37:
        this.pressedLeft = true;
        this.heldLeft = true;
        this.pressedRight = false;
        this.heldRight = false;
        break;
      case 38:
        this.pressedUp = true;
        break;
      case 39:
        this.pressedLeft = false;
        this.heldLeft = false;
        this.pressedRight = true;
        this.heldRight = true;
        break
    }
  }
  keyup(b) {
    var a = b.keyCode;
    switch (a) {
      case 32:
        this.pressedSpace = false;
        break;
      case 37:
        this.heldLeft = false;
        this.pressedLeft = false;
      case 38:
        this.pressedUp = false;
        break;
      case 39:
        this.heldRight = false;
        this.pressedRight = false;
        break
    }
  }
}
