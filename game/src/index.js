import './style.css'

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 30);
}

// 导入游戏元素对象
import keyBoard from './common/keyboard'
// 游戏总体配置
import CONFIG from './common/gameconfig'
import { getBoundry } from './common/util';
// 飞机对象
import Plane from './contoller/Plane';
// 怪物
import Enemy from './contoller/Enemy';

// 全局挂载元素 方便后面各个模块使用
window.container = document.getElementById("game");
window.levelText = document.querySelector(".game-level");
window.nextLevelText = document.querySelector(".game-next-level");
window.scoreText = document.querySelector(".game-info .score");
window.totalScoreText = document.querySelector(".game-failed .score");
window.canvas = document.getElementById("canvas");
window.context = canvas.getContext("2d");
window.canvasWidth = canvas.clientWidth;
window.canvasHeight = canvas.clientHeight;



// 游戏控制器
class Game {

  init() {
    var self = this;

    this.padding = CONFIG.canvasPadding;
    this.enemyLimitY = canvasHeight - CONFIG.canvasPadding - CONFIG.planeSize.height;
    this.enemyMinX = CONFIG.canvasPadding;
    this.enemyMaxX = canvasWidth - CONFIG.canvasPadding - CONFIG.enemySize;
    this.planePosY = this.enemyLimitY;
    this.planePosX = canvasWidth / 2 - CONFIG.planeSize.width;
    this.score = 0;
    this.level = CONFIG.level;
    this.keyBoard = new keyBoard();

    this.bindEvent();
    this.renderLevel();
  }
  // 游戏状态设置
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus(status) {
    this.status = status;
    container.setAttribute('data-status', status);
  }
  bindEvent() {
    let self = this;
    let playBtn = document.querySelector('.js-play');
    let rePlay = document.querySelectorAll('.js-replay');
    let nextPlay = document.querySelector(".js-next");
    // 开始游戏按钮绑定
    playBtn.onclick = function () {
      self.play();
    };
    rePlay.forEach(function (ele) {
      ele.onclick = function () {
        self.level = 1;
        self.play();
        self.score = 0;
        totalScoreText.innerText = self.score;
      }
    });
    nextPlay.onclick = function () {
      self.level += 1;
      self.play();
    }
  }
  // 开始游戏
  play() {
    let _this = this;
    this.setStatus('playing');
    let num = CONFIG.numPerLine;
    let padding = CONFIG.canvasPadding;
    let enemySize = CONFIG.enemySize;
    let enemyGap = CONFIG.enemyGap;
    let enemySpeed = CONFIG.enemySpeed;
    this.plane = new Plane({
      x: this.planePosX,
      y: this.planePosY,
      size: CONFIG.planeSize,
      speed: CONFIG.planeSpeed
    });
    this.enemys = [];
    for (var i = 0; i < this.level; i++) {
      for (var k = 0; k < num; k++) {
        this.enemys.push(new Enemy({
          x: padding + k * (enemySize + enemyGap),
          y: i * (enemySize + enemyGap) + padding,
          size: enemySize,
          speed: enemySpeed
        }))
      }
    }
    this.update();
    this.renderLevel();
  }
  // 动画刷新
  update() {
    let self = this;
    let enemys = this.enemys;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.updatePlane();
    this.updateEnemies();
    this.draw();
    if (enemys.length == 0) {
      if (self.level == CONFIG.totalLevel) {
        this.end('all-success');
      } else {
        this.end('success');
      }
      return
    }
    var h = self.enemys[self.enemys.length - 1].y;
    if (self.enemys.length > 0 && (h > self.enemyLimitY)) {
      this.end('failed');
      return;
    }
    requestAnimationFrame(function () {
      self.update();
    })
  }
  updatePlane() {
    let p = this.plane;
    let e = this.keyBoard;
    if (e.pressedLeft || e.heldLeft) {
      p.translate('left');
    } else if (e.pressedRight || e.heldRight) {
      p.translate('right');
    } else if (e.pressedUp || e.pressedSpace) {
      e.pressedSpace = false;
      e.pressedUp = false;
      p.shoot();
    }
  }
  updateEnemies() {
    let _this = this;
    let enemys = this.enemys;
    let len = enemys.length;
    let minX = CONFIG.canvasPadding;
    let maxX = canvasWidth - CONFIG.canvasPadding - CONFIG.enemySize;
    let down = false;
    let a = getBoundry(enemys);
    if (a.minX < this.enemyMinX || a.maxX > this.enemyMaxX) {
      CONFIG.enemyDirection = CONFIG.enemyDirection == "right" ? "left" : "right";
      down = true
    }
    // console.log(a.minX, a.maxX)
    while (len--) {
      var cur = enemys[len];
      if (down == true) {
        cur.down();
      }
      cur.translate(CONFIG.enemyDirection);
      // console.log(_this.plane);
      switch (cur.status) {
        case 'normal':
          if (_this.plane.hasHit(cur)) {
            cur.booming();
          }
          break;
        case 'booming':
          cur.booming();

          break;
        case 'boomed':
          _this.enemys.splice(len, 1);
          _this.score += 1;
          context.fillStyle = '#fff';
          context.font = "18px Arial";
          context.fillText('分数:' + _this.score, 20, 20);
      }
    }
  }
  end(status) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.setStatus(status);
  }
  draw() {
    this.renderScore();
    this.plane.draw();
    this.enemys.forEach(function (a) {
      a.draw();
    });
    context.fillStyle = '#fff';
    context.font = "18px Arial";
    context.fillText('分数:' + this.score, 20, 20);
  }
  renderScore() {
    totalScoreText.innerHTML = this.score;
  }
  renderLevel() {
    levelText.innerText = "当前Level：" + this.level;
    nextLevelText.innerText = "下一个Level： " + (this.level + 1);
  }
}

new Game().init();

