var createEnemyImg = fw.image('createEnemy.png')

class CreateEnemy extends fw.Entity {
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

    $draw(ctx) {
        ctx.drawImage(createEnemyImg, this.x, this.y)
    }

    $frame() {
        this.cooldown--;
        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
        this.anim += 0.2
        if (this.anim >= 12)
            this.anim = 0

        if (fw.isDown(65) && this.isFree(-2, 0))
            this.x -= 2;
        if (fw.isDown(68) && this.isFree(2, 0))
            this.x += 2;

        if (fw.isDown(87) && this.isFree(0, -2))
            this.y -= 2;
        if (fw.isDown(83) && this.isFree(0, 2))
            this.y += 2;

        var dir = Math.random()*4;
        if (dir > 3){ if (this.cooldown === 0) {
            var x = Math.random()*canvas.width;
            var y = 0;
            var zombi = new Zombi(x, y);
            zombi.speedY = 5;
            this.cooldown = 100;
            scene.add(zombi);
        } }
        else if (dir > 2){
            if (this.cooldown === 0) {
                var x = Math.random()*canvas.width;
                var y = canvas.height;
                var zombi = new Zombi(x, y);
                zombi.speedY = -5;
                this.cooldown = 100;
                scene.add(zombi);
            }
        }
        else if (dir >1){
            if (this.cooldown === 0) {
                var x = canvas.width;
                var y = Math.random()*canvas.height;
                var zombi = new Zombi(x, y);
                zombi.speedX = -5;
                this.cooldown = 100;
                scene.add(zombi);
            }
        }
        else{
            if (this.cooldown === 0) {
                var x = 0;
                var y = Math.random()*canvas.height;
                var zombi = new Zombi(x, y);
                zombi.speedX = 5;
                this.cooldown = 100;
                scene.add(zombi);
            }
        }

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

    $keyDown_32() {
        if (this.cooldown === 0) {
            this.cooldown = 10;
        }
    }
}

fw.register(CreateEnemy);