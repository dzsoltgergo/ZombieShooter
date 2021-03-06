var zombiImg = fw.image('zombi.png')

class Zombi extends fw.Entity {
 constructor(x, y) {
  super(x, y);
  this.speedX = 0;
  this.speedY = 0;
  this.health = 100;
 }

 $frame() {
     this.x += this.speedX;
     this.y += this.speedY;

  /*   if (scene.index.hasCollision(this, Fal)) {
         this.speedX = -this.speedX;
         this.speedY = -this.speedY;
     }*/
 }

 $draw(ctx){
  ctx.drawImage(zombiImg, this.x, this.y)
 }

 getWidth(){
  return zombiImg.width
 }

 getHeight(){
  return zombiImg.height
 }
}

fw.register(Zombi);