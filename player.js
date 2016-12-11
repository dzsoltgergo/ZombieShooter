var plyImg = fw.image('Player.png');

class player extends fw.Entity {
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
        return 120
    }

    $draw(ctx) {
        //ctx.drawImage(hosImg, this.x, this.y)

        var kepY = 0
        var kepX = Math.floor(this.anim)
        if (kepX >= 7) {
            kepX -= 7
            kepY = 1
        }

        ctx.drawImage(plyImg, kepX * 96, kepY * 130, 96, 110, this.x, this.y, 96, 110);

    }

    $frame() {
        this.cooldown--;
        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
        this.anim += 0.2;
        if (this.anim >= 12)
            this.anim = 0;

        if (fw.isDown(37) && this.isFree(-2, 0))
            this.x -= 2;
        if (fw.isDown(39) && this.isFree(2, 0))
            this.x += 2;

        if (fw.isDown(38) && this.isFree(0, -2))
            this.y -= 2;
        if (fw.isDown(40) && this.isFree(0, 2))
            this.y += 2;
    }
}
fw.register(player);