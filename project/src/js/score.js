// 数据类

// 依赖 global
var global = require('./global.js');
var ctx1 = global.ctx1;
var canWid = global.canWid;
var canHei = global.canHei;

var Score = function(){
  this.fruitNum = 0;       //大鱼吃到的果实数量
  this.doubleNum = 1;       //计算分数的倍数
  this.score = 0;
  this.strength = 10;
  this.alpha = 0;
  this.gameOver = false;
}
Score.prototype.init = function(){
  this.fruitNum = 0;       //大鱼吃到的果实数量
  this.doubleNum = 1;       //计算分数的倍数
  this.score = 0;
}
Score.prototype.drawScore = function(){
  var scoreOb = global.scoreOb;
  ctx1.fillText("num: " + this.fruitNum, canWid * 0.5, canHei-30);
  ctx1.fillText("double: " + this.doubleNum, canWid * 0.5, canHei-70);

  ctx1.save();
  ctx1.font = '30px verdana';
  ctx1.fillText("SCORE: " + this.score, canWid * 0.5, 50);
  ctx1.font = '20px verdana';
  ctx1.fillText("strength: ", 650, 45);
  if(scoreOb.strength <= 3){
    ctx1.fillStyle = "red";
  }
  ctx1.fillText(scoreOb.strength, 710, 45);

  if(scoreOb.gameOver){
    this.alpha += global.diffframetime * 0.0005;
    if(this.alpha > 1){
      this.alpha = 1;
    }
    ctx1.font = '40px verdana';
    ctx1.shadowBlur = 10;
    ctx1.shadowColor = "white";
    ctx1.fillStyle = "rgba(255, 255, 255, "+ this.alpha +")";
    ctx1.fillText("GAME OVER", canWid * 0.5, canHei * 0.5 - 25);
    ctx1.save();
    ctx1.font = '25px verdana';
    ctx1.fillText("CLICK TO RESTART", canWid * 0.5, canHei * 0.5 + 25);
    ctx1.restore();
  }
  ctx1.restore();
}
Score.prototype.computeScore = function(){
  var scoreOb = global.scoreOb;
  scoreOb.score += scoreOb.fruitNum * scoreOb.doubleNum;
  this.fruitNum = 0;
  this.doubleNum = 1;
}

module.exports = Score;