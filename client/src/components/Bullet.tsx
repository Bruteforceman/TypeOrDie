import Player from "./Player";
import Enemy from "./Enemy";

class Bullet {
    posX: number;
    posY: number;
    width = 10;
    height = 10;
    from: Player;
    to: Enemy;
    letter: string;
    dist: number;


    constructor(from: Player, to: Enemy, letter: string) {
        this.posX = Math.floor(from.posX + from.width / 2);
        this.posY = from.posY;
        this.from = from;
        this.to = to;
        this.letter = letter;

        const distX = this.to.curLetterX - this.posX
        const distY = this.to.posY - this.posY
        this.dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
    }

    move() {
        const distX = this.to.curLetterX - this.posX
        const distY = this.to.posY - this.posY
        this.dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
        const dx = 30 * distX / this.dist
        const dy = 30 * distY / this.dist
        this.posX += dx; // some more checks but later
        if (this.posY + dy < this.to.posY) {
            this.dist = 0
        }
        else {
            this.posY += dy;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'rgb(191, 97, 106)'; // bullet color
        context.fillText(this.letter, this.posX, this.posY);
    }

    isShot(): boolean {
        return this.to.isDead() || this.dist < 15 || this.to.posY > this.posY;
    }
}

export default Bullet;
