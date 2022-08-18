import Enemy from "./Enemy";
import {boardWidth, boardHeight} from "./Game";

class Player {
    posX: number;
    height = 100;
    width = 100;
    posY = boardHeight - 120;
    context: CanvasRenderingContext2D;

    directionBuffer = 0;
    // 0 stands for normal, negative directon for left move, positive direction for
    // right move

    health = 180
    lostLife = false;
    lifeBuffer = 0;

    images = [] as HTMLElement[]; // stores the image object

    constructor(posX: number, images: HTMLElement[],
        context: CanvasRenderingContext2D) {
        this.posX = posX;
        this.images = images;
        this.context = context;
    }

    move(dx: number) {
        if (dx < 0) {
            this.directionBuffer = -10;
        } else {
            this.directionBuffer = 10;
        }
        this.posX += dx;
        if (this.posX < 0)
            this.posX = 0;
        if (this.posX + this.width > boardWidth)
            this.posX = boardWidth - this.width;
    }

    draw() {
        let src = 0;
        if (this.directionBuffer < 0) {this.directionBuffer += 1; src = 1;}
        if (this.directionBuffer > 0) {this.directionBuffer -= 1; src = 3;}
        this.context.drawImage(
            this.images[src] as CanvasImageSource,
            this.posX, this.posY, this.width, this.height
        );
        if (this.lostLife && this.lifeBuffer < 30) {
            this.context.fillStyle = "crimson";
            this.context.fillText("-1", this.posX + this.width, this.posY)
            this.lifeBuffer += 1
        }
        else if (this.lifeBuffer >= 30) {
            this.lifeBuffer = 0;
            this.lostLife = false
        }
    }

    collide(enemy: Enemy) {
        return 1000 > // 1000 is arbitray, neets testing
            (Math.pow(this.posX - enemy.posX, 2) +
                Math.pow(this.posY - enemy.posY, 2))
    }

    takeLife() {
        this.health -= 10;
        this.lostLife = true;
    }
}

export default Player;
