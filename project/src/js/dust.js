// 灰尘类

// 依赖 global
var global = require('./global.js');
var ctx1 = global.ctx1;
var imgUrl = global.imgUrl;
var canWid = global.canWid;
var canHei = global.canHei;

var Dust = function(){
  this.num = 30;
  this.dustPic = [];
  this.x = [];
  this.y = [];
  this.amp = [];
  this.index = [];
  this.beta = 0;
}
Dust.prototype.init = function(){
  for(var i =0; i< 7; i++){
    this.dustPic[i] = new Image();
    this.dustPic[i].src = imgUrl + 'dust'+ i +'.png';
  }
  for(var i = 0;i< this.num; i++){
    this.x[i] = Math.random() * canWid;
    this.y[i] = Math.random() * canHei;
    this.amp = 20 + Math.random() + 15;
    this.index[i] = Math.floor(Math.random() * 7);

  }
}
Dust.prototype.drawDust = function(){
  // console.log(this.dustPic[0]);
  for(var i = 0;i< this.num; i++){
    var index = this.index[i];
    ctx1.drawImage(this.dustPic[index], this.x, this.y);
  }
}

module.exports = Dust;