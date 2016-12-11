var hosImg = fw.image('hos.png')

class Hos extends fw.Entity {
    constructor(x, y) {
        super(x, y)
        this.anim = 0
        this.cooldown = 0;
    }

    getLeft() {
        return this.x+20;
    }

    getWidth() {
        return 100
    }

    getHeight() {
        return 100
    }

    draw(ctx){
        //ctx.drawImage(hosImg, this.x, this.y)
        var kepY=Math.floor(this.anim)
        var kepX=0;
        if(kepY>=4){
            kepX += 1
            kepY =1
        }
        ctx.drawImage(hosImg, kepX*100, kepY*100, 100, 100, this.x, this.y, 100, 100);

    }

    frame(){
        this.anim+=0.2
        if(this.anim>=12)
            this.anim=0

        if(fw.isDown(37) && this.isFree(-2,0))
            this.x-=2;
        if(fw.isDown(39) && this.isFree(2,0))
            this.x+=2;

        if(fw.isDown(38) && this.isFree(0,-2))
            this.y-=2;
        if(fw.isDown(40) && this.isFree(0,2))
            this.y+=2;
    }

    isFree(x, y) {

        var utkozesek = scene.index.query(this.getLeft() + x, this.getTop() + y, this.getWidth(), this.getHeight())
        for (var i = 0; i < utkozesek.length; i++) {
            var entity = utkozesek[i];
            if (entity instanceof Zombi) {
                return false
            }
        }
        return true
    }
}

fw.register(Hos);
