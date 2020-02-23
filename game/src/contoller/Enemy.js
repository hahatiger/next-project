import Element from './Elment';
import CONFIG from '../common/gameconfig';
//怪兽
export default class Enemy extends Element {
  constructor(opts) {
    super(opts);
    this.minX = CONFIG.canvasPadding;
    this.maxX = canvasWidth - CONFIG.canvasPadding - CONFIG.enemySize;
    this.status = 'normal';
    this.boomCount = 0;
    this.load();
  }
  // 加载图片
  load() {
    let img1 = new Image();
    let img2 = new Image();
    img1.src = CONFIG.enemyIcon;
    img2.src = CONFIG.enemyBoomIcon;
    img1.onload = (function () {
      Enemy.icon = img1;
    })()
    img2.onload = (function () {
      Enemy.boomIcon = img2;
    })()
  }
  // 往下移动
  down() {
    this.move(0, this.size);
  }
  // 左右变化
  translate(d) {
    var b = this.speed;
    // console.log(b);
    if (d == 'left') {
      this.move(-b, 0);
    } else {
      this.move(b, 0)
    }
    return this;
  }

  // 爆炸效果
  booming() {
    this.status = 'booming'
    this.boomCount += 1;
    if (this.boomCount > 4) {
      this.status = 'boomed';
    }
  }

  draw() {
    if (Enemy.icon && Enemy.boomIcon) {
      switch (this.status) {
        case "normal":
          context.drawImage(Enemy.icon, this.x, this.y, this.size, this.size);
          break;
        case "booming":
          context.drawImage(Enemy.boomIcon, this.x, this.y, this.size, this.size);
          break
      }
    } else {
      context.fillRect(this.x, this.y, this.size, this.size)
    }
    return this
  }
}

