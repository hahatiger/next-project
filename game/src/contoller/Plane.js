import Element from './Elment';
import Bullet from './Bullet';
import CONFIG from '../common/gameconfig';

//飞机对象
export default class Plane extends Element {
  constructor(opts) {
    super(opts);
    this.minX = CONFIG.canvasPadding;
    this.maxX = canvasWidth - CONFIG.canvasPadding - CONFIG.planeSize.width;
    this.bulletSpeed = opts.bulletSpeed || CONFIG.bulletSpeed;
    this.bulletSize = opts.bulletSize || CONFIG.bulletSize;
    this.bullets = [];
    this.load();
  }
  // 加载 飞机图片
  load() {
    let img = new Image();
    img.src = CONFIG.planeIcon;
    img.onload = (function () {
      Plane.icon = img;
    })()
  }
  // 飞机发射子弹
  shoot() {
    let w = this.x + this.size.width / 2;
    this.bullets.push(new Bullet({
      x: w,
      y: this.y,
      speed: this.bulletSpeed,
      size: this.bulletSize
    }))
  }
  // 绘画子弹
  drawBullets() {
    let bullets = this.bullets,
      len = bullets.length;
    for (var i = len; i > 0;) {
      i--;
      var cur = bullets[i];
      cur.fly();
      if (cur.y < 0) {
        bullets.splice(cur, 1);
      }
      cur.draw();
    }
  }
  // 是否击中怪物
  hasHit(f) {
    // 飞机子弹量
    let b = this.bullets;
    for (let c = b.length - 1; c >= 0; c--) {
      let a = b[c];
      let e = f.x < a.x && a.x < (f.x + f.size);
      let d = f.y < a.y && a.y < (f.y + f.size);
      if (e && d) {
        this.bullets.splice(c, 1);
        return true
      }
    }
    return false;
  }
  // 飞机移动
  translate(d) {
    var s = this.speed;
    var w;
    if (d == 'left') {
      w = this.x < this.minX ? 0 : -s;
    } else {
      w = this.x > this.maxX ? 0 : s;
    }
    this.move(w, 0);
  }
  draw() {
    this.drawBullets();
    if (!Plane.icon) {
      context.fillRect(this.x, this.y, this.size.width, this.size.height);
    } else {
      context.drawImage(Plane.icon, this.x, this.y, this.size.width, this.size.height);
    }
  }
}

