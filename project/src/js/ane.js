// 海葵类

// 依赖 global
var global = require('./global.js');
var ctx2 = global.ctx2;
var canHei = global.canHei;

var Ane = function(){
  this.num = 50;
  //start point, controll point , end point
  this.rootx = [];
  this.headx = [];
  this.heady = [];
  this.amp = [];   //振幅
  this.beta = 0;    //sin的角度
}
Ane.prototype.init = function(){
  for (var i = 0; i< this.num; i++){
    this.rootx[i] = i * 18 + Math.random() * 30;
    this.headx[i] = this.rootx[i];
    this.heady[i] = (canHei - 220) + Math.random() * 50;
    this.amp[i] = Math.random() * 50 + 60;
  }
}
Ane.prototype.drawAne = function(){
  this.beta += global.diffframetime * 0.0008;
  var l = Math.sin(this.beta);

  ctx2.save();
  ctx2.globalAlpha = 0.7;
  ctx2.lineWidth = 20;
  ctx2.lineCap = 'round';
  ctx2.strokeStyle = '#3b154e';
  for(var i = 0; i< this.num; i++){
    //beginPath, moveTo,lineTo,lineWidth, strokeStyle, lineCap, stroke;
    var endx = this.headx[i] + l * this.amp[i];
    ctx2.beginPath();
    ctx2.moveTo(this.rootx[i], canHei);     //起始点
    ctx2.quadraticCurveTo(this.rootx[i], canHei - 100, endx, this.heady[i]);  //控制点  和  结束点的x，y
    ctx2.stroke();
  }
  ctx2.restore();
}

module.exports = Ane;