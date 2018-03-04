window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){
  window.setTimeout(callback,1000/30);
}
// 元素
var container = document.getElementById("game");
var levelText = document.querySelector(".game-level");
var nextLevelText = document.querySelector(".game-next-level");
var scoreText = document.querySelector(".game-info .score");
var totalScoreText = document.querySelector(".game-failed .score");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;
//键盘事件
var keyBoard = function(){
  document.onkeydown = this.keydown.bind(this);
  document.onkeyup = this.keyup.bind(this);
}
keyBoard.prototype={
  pressedLeft: false,
  pressedRight: false,
  pressedUp: false,
  heldLeft: false,
  heldRight: false,
  pressedSpace: false,
  keydown: function(b) {
    var a = b.keyCode;
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
  },
  keyup: function(b) {
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


/**
* 游戏相关配置
* @type {Object}
*/
var CONFIG = {
  status: 'start', // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 6, // 总共6关
  numPerLine: 6, // 游戏默认每行多少个怪兽
  canvasPadding: 30, // 默认画布的间隔
  bulletSize: 10, // 默认子弹长度
  bulletSpeed: 10, // 默认子弹的移动速度
  enemySpeed: 10, // 默认敌人移动距离
  enemySize: 50, // 默认敌人的尺寸
  enemyGap: 10,  // 默认敌人之间的间距
  enemyIcon: './img/enemy.png', // 怪兽的图像
  enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
  enemyDirection: 'right', // 默认敌人一开始往右移动
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {
    width: 60,
    height: 100
  }, // 默认飞机的尺寸,
  planeIcon: './img/plane.png',
};

function getBoundry(b){
  var a, c;
  b.forEach(function(d) {
    if (!a && !c) {
      a = d.x;
      c = d.x
    } else {
      if (d.x < a) {
        a = d.x
      }
      if (d.x > c) {
        c = d.x
      }
    }
  });
  return {
    minX: a,
    maxX: c
  }
}

function inherit(sonType,fatherType){
  var pro = Object.create(fatherType.prototype);
  pro.constructor = sonType;
  sonType.prototype = pro;
}

function Element(opts){
  var opts = opts||{};
  this.x = opts.x;
  this.y = opts.y;
  this.size = opts.size;
  this.speed = opts.speed;
}
Element.prototype = {
  move:function(x,y){
    this.x+=x;
    this.y+=y;
  },
  draw:function(){}
}

//子弹对象
function Bullet(opts){
  Element.call(this,opts);
}
inherit(Bullet,Element);
Bullet.prototype.fly =function(){
  var s = this.speed;
  this.move(0,-s);
}
Bullet.prototype.draw = function(){
  context.beginPath();
  context.moveTo(this.x,this.y);
  context.lineTo(this.x,this.y-this.size);
  context.strokeStyle = "#fff";
  context.closePath();
  context.stroke();
  return this;
}
//飞机对象
function Plane(opts){
  Element.call(this,opts);
  this.minX = CONFIG.canvasPadding;
  this.maxX = canvasWidth - CONFIG.canvasPadding-CONFIG.planeSize.width;
  this.bulletSpeed = opts.bulletSpeed || CONFIG.bulletSpeed;
  this.bulletSize = opts.bulletSize || CONFIG.bulletSize;
  this.bullets = [];
  this.load();
}
inherit(Plane,Element);
Plane.prototype.load = function(){
  var img = new Image();
  img.src = CONFIG.planeIcon;
  img.onload = (function(){
    Plane.icon = img;
  })()
}
Plane.prototype.shoot = function(){
  var w = this.x + this.size.width/2;
  this.bullets.push(new Bullet({
    x:w,
    y:this.y,
    speed:this.bulletSpeed,
    size:this.bulletSize
  }))
}
Plane.prototype.drawBullets = function(){
  var bullets = this.bullets;
  
  var len = bullets.length;
    for(var i=len;i>0;){
    i--;
    var cur = bullets[i];
    cur.fly();
    if(cur.y<0){
      bullets.splice(cur,1);
    }
    cur.draw();
   }
}
Plane.prototype.hasHit = function(f){
  var b = this.bullets;
  for (var c = b.length - 1; c >= 0; c--) {
    var a = b[c];
    var e = f.x < a.x && a.x < (f.x + f.size);
    var d = f.y < a.y && a.y < (f.y + f.size);
    if (e && d) {
      this.bullets.splice(c, 1);
      return true
    }
  }
  return false;
};
Plane.prototype.translate = function(d){
  var s = this.speed;
  var w;
  if(d == 'left'){
    w = this.x < this.minX ? 0 : -s; 
  }else{
    w= this.x >this.maxX ? 0 : s;
  }
  this.move(w,0);
}
Plane.prototype.draw = function(){
  this.drawBullets();
  if(!Plane.icon){
    context.fillRect(this.x,this.y,this.size.width,this.size.height);
  }else{
    context.drawImage(Plane.icon,this.x,this.y,this.size.width,this.size.height);
  }

}

//怪兽
function Enemy(opts){
  Element.call(this,opts);
  this.minX = CONFIG.canvasPadding;
  this.maxX = canvasWidth - CONFIG.canvasPadding-CONFIG.enemySize;
  this.status = 'normal';
  this.boomCount = 0;
  this.load();
}
inherit(Enemy,Element);
Enemy.prototype.load = function(){
  var img1 = new Image();
  var img2 = new Image();
  img1.src = CONFIG.enemyIcon;
  img2.src = CONFIG.enemyBoomIcon;
  img1.onload = (function(){
      Enemy.icon = img1;
  })()
  img2.onload =(function(){
    Enemy.boomIcon = img2;
  })()
}
Enemy.prototype.down = function(){
  this.move(0,this.size);
}
Enemy.prototype.translate = function(d){
   var b = this.speed;
  // console.log(b);
  if(d == 'left'){
    this.move(-b,0);
  }else{
    this.move(b,0)
  }
  return this;
}
Enemy.prototype.booming = function(){
  this.status = 'booming'
  this.boomCount +=1;
  if(this.boomCount > 4){
    this.status = 'boomed';
  }
}

Enemy.prototype.draw =function(){
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

var game = {
  init:function(){
    var self = this;
    
    this.padding = CONFIG.canvasPadding;
    this.enemyLimitY = canvasHeight - CONFIG.canvasPadding - CONFIG.planeSize.height;
    this.enemyMinX = CONFIG.canvasPadding;
    this.enemyMaxX = canvasWidth - CONFIG.canvasPadding - CONFIG.enemySize;
    this.planePosY = this.enemyLimitY;
    this.planePosX = canvasWidth/2 - CONFIG.planeSize.width;
    this.score = 0;
    this.level =CONFIG.level;
    this.keyBoard = new keyBoard();
    
    this.bindEvent();
    this.renderLevel();
  },
  setStatus:function(status){
    this.status = status;
    container.setAttribute('data-status', status);
  },
  bindEvent:function(){
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var rePlay = document.querySelectorAll('.js-replay');
    var nextPlay = document.querySelector(".js-next");
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
     rePlay.forEach(function(ele){
      ele.onclick = function(){
        self.level =1;
        self.play();
        self.score = 0;
        totalScoreText.innerText = self.score;
      }
    });
    nextPlay.onclick = function(){
      self.level +=1;
      self.play();
    }
  },
  play:function(){
    var _this = this;
    this.setStatus('playing');
    var num = CONFIG.numPerLine;
    var padding = CONFIG.canvasPadding;
    var enemySize = CONFIG.enemySize;
    var enemyGap = CONFIG.enemyGap;  
    var enemySpeed = CONFIG.enemySpeed;
    this.plane = new Plane({
      x:this.planePosX,
      y:this.planePosY,
      size:CONFIG.planeSize,
      speed:CONFIG.planeSpeed
    });
    this.enemys =[];
    for(var i=0;i<this.level;i++){
      for(var k=0;k<num;k++){
        this.enemys.push(new Enemy({
          x:padding+k*(enemySize+enemyGap),
          y:i*(enemySize+enemyGap)+padding,
          size:enemySize,
          speed:enemySpeed
        }))
      }
    }
    this.update();
    this.renderLevel();
  },
  update:function(){
    var self = this;
    var enemys = this.enemys;
    context.clearRect(0,0,canvasWidth,canvasHeight);
    this.updatePlane();
    this.updateEnemies();
    this.draw();
    if(enemys.length == 0){
      if(self.level == CONFIG.totalLevel){
        this.end('all-success');
      }else{
        this.end('success');
      }
      return
    }
    var h = self.enemys[self.enemys.length -1].y;
    if(self.enemys.length>0 &&(h > self.enemyLimitY)){
      this.end('failed');
      return;
    }
    requestAnimationFrame(function(){
      self.update();
    })
  },
  updatePlane:function(){
    var p = this.plane;
    var e = this.keyBoard;
    if(e.pressedLeft || e.heldLeft){
      p.translate('left');
    }else if(e.pressedRight || e.heldRight){
      p.translate('right');
    }else if(e.pressedUp||e.pressedSpace){
      e.pressedSpace = false;
      e.pressedUp = false;
      p.shoot();
    } 
  },
  updateEnemies:function(){
    var _this = this;
      var enemys = this.enemys;
      var len = enemys.length;
      var minX = CONFIG.canvasPadding;
      var maxX = canvasWidth-CONFIG.canvasPadding-CONFIG.enemySize;
      var down =false;
      var a = getBoundry(enemys);
      if (a.minX < this.enemyMinX || a.maxX > this.enemyMaxX) {
        CONFIG.enemyDirection = CONFIG.enemyDirection == "right" ? "left" : "right";
        down = true
      }
      console.log(a.minX,a.maxX)
      while(len--){
        var cur = enemys[len];
        if(down == true){
          cur.down();
        }
        cur.translate(CONFIG.enemyDirection);
        // console.log(_this.plane);
        switch (cur.status){
            case 'normal':
              if(_this.plane.hasHit(cur)){
                cur.booming();
              }
              break;
            case 'booming':
              cur.booming();
              
              break;
            case 'boomed':
              _this.enemys.splice(len,1);
              _this.score +=1;
              context.fillStyle = '#fff';
              context.font ="18px Arial";
              context.fillText('分数:'+_this.score,20,20);
        }
      }
  },
  end:function(a){
    context.clearRect(0,0,canvasWidth,canvasHeight);
    this.setStatus(a);
  },
  draw:function(){
    this.renderScore();
    this.plane.draw();
    this.enemys.forEach(function(a){
      a.draw();
    });
    context.fillStyle = '#fff';
    context.font ="18px Arial";
    context.fillText('分数:'+this.score,20,20); 
  },
  renderScore:function(){
    totalScoreText.innerHTML = this.score;
  },
  renderLevel:function(){
    levelText.innerText = "当前Level：" + this.level;
    nextLevelText.innerText = "下一个Level： " + (this.level + 1);
  }
}

game.init();