var hosImg = fw.image('hos.png')

class Hos extends fw.Entity {
    constructor(x, y) {
        super(x, y)
        this.anim = 0
        this.cooldown = 0;
    }

    getLeft() {
        return this.x + 20
    }

    getWidth() {
        return 56
    }

    getHeight() {
        return 130
    }

    $draw(ctx) {
        //ctx.drawImage(hosImg, this.x, this.y)

        var kepY = 0
        var kepX = Math.floor(this.anim)
        if (kepX >= 7) {
            kepX -= 7
            kepY = 1
        }

        ctx.drawImage(hosImg, kepX * 96, kepY * 130, 96, 130, this.x, this.y, 96, 130);

    }

    $frame() {
        this.cooldown--;
        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
        this.anim += 0.2
        if (this.anim >= 12)
            this.anim = 0

        if (fw.isDown(37) && this.isFree(-2, 0))
            this.x -= 2;
        if (fw.isDown(39) && this.isFree(2, 0))
            this.x += 2;

        if (fw.isDown(38) && this.isFree(0, -2))
            this.y -= 2;
        if (fw.isDown(40) && this.isFree(0, 2))
            this.y += 2;
    }

    isFree(x, y) {

        var utkozesek = scene.index.query(this.getLeft() + x, this.getTop() + y, this.getWidth(), this.getHeight())
        for (var i = 0; i < utkozesek.length; i++) {
            var entity = utkozesek[i];
            if (entity instanceof Fal) {
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

    $keyDown_83() { //S
        if (this.cooldown === 0) {
            var x = Math.random()*canvas.width;
            var y = 0;
            var zombi = new Zombi(x, y);
            zombi.speedY = 5;
            this.cooldown = 10;
            scene.add(zombi);
        }
    }

    $keyDown_87() { //W
        if (this.cooldown === 0) {
            var x = Math.random()*canvas.width;
            var y = canvas.height;
            var zombi = new Zombi(x, y);
            zombi.speedY = -5;
            this.cooldown = 10;
            scene.add(zombi);
        }
    }

    $keyDown_65() { //A
        if (this.cooldown === 0) {
            var x = canvas.width;
            var y = Math.random()*canvas.height;
            var zombi = new Zombi(x, y);
            zombi.speedX = -5;
            this.cooldown = 10;
            scene.add(zombi);
        }
    }
    $keyDown_68() { //D
        if (this.cooldown === 0) {
            var x = 0;
            var y = Math.random()*canvas.height;
            var zombi = new Zombi(x, y);
            zombi.speedX = 5;
            this.cooldown = 10;
            scene.add(zombi);
        }
    }
}

fw.register(Hos);