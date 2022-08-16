import {boardHeight} from "./Game";
import Bullet from "./Bullet";

class Enemy {
    word: string;
    typed: string;
    cur: string;
    context: CanvasRenderingContext2D;

    posX: number;
    posY = 30;
    curLetterX: number;
    bullets = [] as Bullet[];
    protBuffer = 0;

    gameScore = 0

    startedTyping = false;
    typedFor = 0;
    endedTyping = false;
    mistyped = 0;
    scoreAdded = false;

    images: HTMLElement[];
    curImage = 0;
    imageHeight = 50;
    imageWidth = 50;

    deathBuffer = 30; // shows explosion for 30 iterations at death
    deathCounter = 0;
    explosionImages: HTMLElement[];

    constructor(
        word: string,
        posX: number,
        images: HTMLElement[],
        explosionImages: HTMLElement[],
        context: CanvasRenderingContext2D,
    ) {
        this.cur = word;
        this.word = word;
        this.typed = "";
        this.posX = posX;
        this.curLetterX = posX;
        this.images = images;
        this.explosionImages = explosionImages;
        this.context = context;
    }
    // As the player types, cut off parts of the word
    // If player mistypes a letter, the word respawns
    shoot(letter: string) {
        if (this.startDeath()) {
            return;
        }
        if (this.cur[0].toLowerCase() === letter.toLowerCase()) {
            if (this.typed === "")
                this.startedTyping = true
            this.typed += this.cur[0]
            this.cur = this.cur.slice(1);
            if (this.cur === "")
                this.endedTyping = true
        }
        else {
            this.typed = ""
            this.cur = this.word

            this.bullets = [] as Bullet[]
            this.protBuffer = 30;
            // this.protStart = Date.now();

            this.startedTyping = false;
            this.typedFor = 0;
            this.mistyped += 1;
        }
    }
    move(dy: number) {
        this.posY -= dy;
    }

    getShot() {
        for (const bullet of this.bullets) {
            if (bullet.isShot() && this.protBuffer === 0)
                this.shoot(bullet.letter)
        }
        this.bullets = this.bullets.filter((bullet) => !bullet.isShot())
    }

    getHeight() {
        // 20 px font, 10 px gap between, then height of the image
        return 20 + 10 + this.imageHeight;
    }

    getWidth() {
        return this.context.measureText(this.word).width;
    }

    shot(bullet: Bullet) {
        this.bullets.push(bullet)
    }

    // draw the typed part in rgb(163, 190, 140) and the untyped part in black
    texter(ctx: CanvasRenderingContext2D, left: string,
        right: string, x: number, y: number, curColor: string): number {
        for (let i = 0; i <= left.length; ++i) {
            const ch = left.charAt(i);
            ctx.fillStyle = 'rgb(163, 190, 140)'; // correctly typed part color
            ctx.fillText(ch, x, y);
            x += ctx.measureText(ch).width;
        }
        this.curLetterX = x;
        for (let i = 0; i <= right.length; ++i) {
            const ch = right.charAt(i);
            ctx.fillStyle = curColor; // color of the untyped part
            ctx.fillText(ch, x, y);
            x += ctx.measureText(ch).width;
        }
        return x;
    }

    draw(color: string = 'aliceblue') {
        if (this.startDeath()) {
            this.deathCounter += 1;
            const src = Math.min(this.explosionImages.length - 1,
                Math.floor(this.deathCounter / 6));
            const posX = this.posX +
                this.getWidth() / 2 - this.imageWidth / 2;

            this.context.drawImage(
                this.explosionImages[src] as CanvasImageSource,
                posX, this.posY, this.imageWidth, this.imageHeight
            );


            const scr = this.score();
            if (scr > 0) {
                this.context.fillStyle = 'rgb(163, 190, 140)';
                this.context.fillText("+" + scr.toString(), posX + 30, this.posY);
            }
            else{
                this.context.fillStyle = 'crimson';
                this.context.fillText(scr.toString(), posX + 30, this.posY);
            }
            return;
        }
        this.getShot();

        if (this.protBuffer > 0) {
            // const x = 
            const color =
                Math.floor(this.protBuffer / 10) % 2 === 0 ? 'blue' : 'crimson';
            this.texter(this.context, this.typed, this.cur, this.posX, this.posY, color);

            // context.fillStyle = "rgba(129, 161, 193, 0.4)"
            // context.fillRect(this.posX - 5, this.posY - 35, x - this.posX + 10, 30);
            this.protBuffer -= 1;
        }
        else {
            this.texter(this.context, this.typed, this.cur, this.posX, this.posY, color);
            for (const bullet of this.bullets) {
                bullet.move();
                bullet.draw(this.context);
            }
        }

        const src = Math.floor(this.curImage / 15);
        const imgX =
            Math.floor(this.posX + this.getWidth() / 2 - this.imageWidth / 2);
        const imgY =
            Math.floor(this.posY + 10);
        // 10 is the gap between text and spaceship
        this.context.drawImage(
            this.images[src] as CanvasImageSource,
            imgX, imgY, this.imageWidth, this.imageHeight
        );

        this.curImage += 1;
        if (Math.floor(this.curImage / 15) >= this.images.length)
            this.curImage = 0;

        if (this.startedTyping && !this.endedTyping)
            this.typedFor += 1;
    }
    // word has been correctly typed by the player, or the word has gone beyond the
    // boundary
    startDeath(): boolean {
        return this.cur.length === 0 || this.posY >= boardHeight - 100;
    }

    score(): number {
        if (!this.endedTyping && this.mistyped === 0)
            return 0
        else if (!this.endedTyping)
            return -10
        else
            return Math.floor(this.word.length * 100 / this.typedFor -
                20 * this.mistyped)
    }

    isDead(): boolean {
        return this.deathCounter >= this.deathBuffer;
    }
}

export default Enemy;
