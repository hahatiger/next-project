// 小鱼类

// 依赖 global, util
var global = require('./global.js');
var util = require('./util.js');
var imgUrl = global.imgUrl;
var ctx1 = global.ctx1;
var can1 = global.can1;
var canWid = global.canWid;
var canHei = global.canHei;
var lerpAngle = util.lerpAngle;
var lerpDistance = util.lerpDistance;

var Baby = function(){
  this.x = 0;
  this.y = 0;
  this.angle;     //大鱼的角度
  this.babyTailArr = [];    //尾巴图片数组
  this.babyTailTimer = 0;  //计数器
  this.babyTailIndex = 0;  //尾巴图片数组的下标

  this.babyEyeArr = [];
  this.babyEyeTimer = 0;
  this.babyEyeIndex = 0;
  this.babyEyeInterval = 1000;  //初始间隔时间为1秒

  this.babyBodyArr = [];
  this.babyBodyTimer = 0;
  this.babyBodyIndex = 0;
}
Baby.prototype.init = function(){
  this.x = canWid * 0.5 -50;
  this.y = canHei * 0.5 + 50;
  this.babyBodyIndex = 0;
  this.angle = 0;
  for(var i = 0;i < 8;i++){    //初始化小鱼的尾巴图片数组
    this.babyTailArr[i] = new Image();
    this.babyTailArr[i].src = imgUrl + 'babyTail'+ i +'.png';
  }
  for(var i = 0;i < 2;i++){   //初始化小鱼的眼睛图片数组
    this.babyEyeArr[i] = new Image();
    this.babyEyeArr[i].src = imgUrl + 'babyEye'+ i +'.png';
  }
  for(var i = 0;i < 20;i++){   //初始化小鱼的身体图片数组
    this.babyBodyArr[i] = new Image();
    this.babyBodyArr[i].src = imgUrl + 'babyFade'+ i +'.png';
  }
}
Baby.prototype.drawBaby = function(){
  //lerp x , y   让小鱼坐标倾向于大鱼坐标。
  var momOb = global.momOb;
  var scoreOb = global.scoreOb;

  this.x = lerpDistance(momOb.x, this.x, 0.98);
  this.y = lerpDistance(momOb.y, this.y, 0.99);

  //lerpangle， 让小鱼的角度倾向于大鱼的角度，   然后绘制小鱼
  var deltaX = momOb.x - this.x;
  var deltaY = momOb.y - this.y;
  var beta = Math.atan2(deltaY, deltaX) + Math.PI;
  this.angle = lerpAngle(beta, this.angle, 0.6);    //获得每一次倾向于大鱼旋转的角度

  this.babyTailTimer += global.diffframetime;
  if(this.babyTailTimer > 50){
    this.babyTailIndex = (this.babyTailIndex + 1) % 8;   //获得尾巴图片数组下标
    this.babyTailTimer %= 50;
  }

  this.babyEyeTimer += global.diffframetime;
  if(this.babyEyeTimer > this.babyEyeInterval){   //如果计数器大于时间间隔,数组下标加1
    this.babyEyeIndex = (this.babyEyeIndex + 1) % 2;
    this.babyEyeTimer %= this.babyEyeInterval;

    if(this.babyEyeIndex == 0){       //如果下一帧是闭眼睛状态，时间间隔为2－3秒
      this.babyEyeInterval = Math.random() * 1500 + 1500;
    }else{
      this.babyEyeInterval = 200;
    }
  }

  this.babyBodyTimer += global.diffframetime;
  if(this.babyBodyTimer > 550){
    this.babyBodyIndex += 1;
    this.babyBodyTimer %= 550;
    scoreOb.strength = ((20 - this.babyBodyIndex)/2).toFixed(0);

    if(this.babyBodyIndex > 19){   //如果身体变成白色，game over；
      this.babyBodyIndex = 19;
      scoreOb.gameOver = true;
      can1.style.cursor = "pointer";
    }
  }

  ctx1.save();     //保存之前的画布
  ctx1.translate(this.x, this.y);
  ctx1.rotate(this.angle);

  var babyTailImage = this.babyTailArr[this.babyTailIndex];
  ctx1.drawImage(babyTailImage, -babyTailImage.width * 0.5 + 24, -babyTailImage.height * 0.5);

  var babyBodyImage = this.babyBodyArr[this.babyBodyIndex];
  ctx1.drawImage(babyBodyImage, -babyBodyImage.width * 0.5, -babyBodyImage.height * 0.5);

  var babyEyeImage = this.babyEyeArr[this.babyEyeIndex];
  ctx1.drawImage(babyEyeImage, -babyEyeImage.width * 0.5, -babyEyeImage.height * 0.5);

  ctx1.restore();   //操作完后返回到之前的画布
}


module.exports = Baby;