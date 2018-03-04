// 鱼妈妈类

// 依赖 global, util
var util = require('./util.js');
var global = require('./global.js');
var ctx1 = global.ctx1;
var imgUrl = global.imgUrl;
var canWid = global.canWid;
var canHei = global.canHei;
var lerpAngle = util.lerpAngle;
var lerpDistance = util.lerpDistance;

var Mom = function(){
  this.x = 0;
  this.y = 0;
  this.angle;     //大鱼的角度
  this.momTailArr = [];
  this.momTailTimer = 0;
  this.momTailIndex = 0;

  this.momEyeArr =[];
  this.momEyeTimer = 0;
  this.momEyeIndex = 0;
  this.momEyeInterval = 1000;

  this.momOrangeArr = [];   //大鱼的橙色身体数组
  this.momBlueArr = [];     //蓝色身体数组
  this.momBodyIndex = 0;
}
Mom.prototype.init = function(){
  this.x = canWid * 0.5;
  this.y = canHei * 0.5;
  this.angle = 0;

  for(var i = 0;i< 8; i++){   //大鱼尾巴
    this.momTailArr[i] = new Image();
    this.momTailArr[i].src = imgUrl + 'bigTail'+ i +'.png';
  }
  for(var i = 0;i< 2; i++){   //大鱼眼睛
    this.momEyeArr[i] = new Image();
    this.momEyeArr[i].src = imgUrl + 'bigEye'+ i +'.png';
  }
  for(var i = 0;i< 8; i++){
    this.momOrangeArr[i] = new Image();         //大鱼橙色身体
    this.momOrangeArr[i].src = imgUrl + 'bigSwim'+ i +'.png';
    this.momBlueArr[i] = new Image();           //大鱼蓝色身体
    this.momBlueArr[i].src = imgUrl + 'bigSwimBlue'+ i +'.png';
  }
}
Mom.prototype.drawMom = function(){
  var scoreOb = global.scoreOb;
  //lerp x,y   让大鱼的坐标值倾向于鼠标位置，然后绘制大鱼
  this.x = lerpDistance(global.mx, this.x, 0.96);
  this.y = lerpDistance(global.my, this.y, 0.98);

  //lerp angle    让大鱼的角度倾向于鼠标的角度
  var deltaX = global.mx - this.x;  //横坐标差
  var deltaY = global.my - this.y;  //纵坐标差
  var beta = Math.atan2(deltaY, deltaX) + Math.PI;    //目标角度
  this.angle = lerpAngle(beta, this.angle, 0.6);    //获得每一次旋转的角度

  this.momTailTimer += global.diffframetime;
  if(this.momTailTimer > 50){
    this.momTailIndex = (this.momTailIndex + 1) % 8;
    this.momTailTimer %= 50;
  }

  this.momEyeTimer += global.diffframetime;
  if(this.momEyeTimer > this.momEyeInterval){
    this.momEyeIndex = (this.momEyeIndex + 1) % 2;
    this.momEyeTimer %= this.momEyeInterval;

    if(this.momEyeIndex == 0){
      this.momEyeInterval = Math.random() * 1500 + 1500;
    }else{
      this.momEyeInterval = 200;
    }
  }

  ctx1.save();     //保存之前的画布
  ctx1.translate(this.x, this.y);      //把原点变成(this.x , this.y);
  ctx1.rotate(this.angle);

  var momTailImage = this.momTailArr[this.momTailIndex];
  ctx1.drawImage(momTailImage, -momTailImage.width * 0.5 + 30, -momTailImage.height * 0.5);

  var momBodyImage;
  if(scoreOb.doubleNum != 1){   //说明大鱼吃到了蓝色果实，身体变蓝色
    momBodyImage = this.momBlueArr[this.momBodyIndex];
  }else{
    momBodyImage = this.momOrangeArr[this.momBodyIndex];
  }
  ctx1.drawImage(momBodyImage, -momBodyImage.width * 0.5, -momBodyImage.height * 0.5);

  var momEyeImage = this.momEyeArr[this.momEyeIndex];
  ctx1.drawImage(momEyeImage, -momEyeImage.width * 0.5, -momEyeImage.height * 0.5);
  ctx1.restore();   //操作完后返回到之前的画布
}

module.exports = Mom;