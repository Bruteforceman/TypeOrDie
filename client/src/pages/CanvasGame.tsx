import {useEffect} from "react";
import Background from "../components/Background";
import data from "../components/Data";
import "./CanvasGame.css";

const height = Math.max(window.innerHeight - 0, 500);
const width = Math.max(window.innerWidth - 0, 500);
let score = 0;

class Bullet {
    posX: number;
    posY: number;
    width = 10;
    height = this.width;
    from: Player;
    to: Enemy;
    letter: string;
    dist: number;


    constructor(from: Player, to: Enemy, letter: string) {
        this.posX = from.posX + 50;
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

class Player {
    posX: number;
    height = 100;
    width = 100;
    posY = height - 120;
    directionBuffer = 0;
    // 0 stands for normal, negative directon for left move, positive direction for
    // right move

    images = [] as HTMLElement[]; // stores the image object

    constructor(posX: number, images: HTMLElement[]) {
        this.posX = posX;
        this.images = images;
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
        if (this.posX + this.width > width)
            this.posX = width - this.width;
    }
    draw(context: CanvasRenderingContext2D) {
        let src = 0;
        if (this.directionBuffer < 0) {this.directionBuffer += 1; src = 1;}
        if (this.directionBuffer > 0) {this.directionBuffer -= 1; src = 3;}
        context.drawImage(this.images[src] as CanvasImageSource, this.posX, this.posY, this.width, this.height);

    }
}

class Enemy {
    word: string;
    typed: string;
    cur: string;
    posX: number;
    posY = 30;
    curLetterX: number;
    bullets = [] as Bullet[];
    protBuffer = 0;
    protStart = Date.now();

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
        explosionImages: HTMLElement[]
    ) {
        this.cur = word;
        this.word = word;
        this.typed = "";
        this.posX = posX;
        this.curLetterX = posX;
        this.images = images;
        this.explosionImages = explosionImages;
    }
    // As the player types, cut off parts of the word
    // If player mistypes a letter, the word respawns
    shoot(letter: string) {
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
            this.protStart = Date.now();

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
            if (bullet.isShot() && !this.protBuffer)
                this.shoot(bullet.letter)
        }
        this.bullets = this.bullets.filter((bullet) => !bullet.isShot())
    }

    getHeight() {
        // 20 px font, 10 px gap between, then height of the image
        return 20 + 10 + this.imageHeight;
    }

    getWidth(context: CanvasRenderingContext2D) {
        return context.measureText(this.word).width;
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

    draw(context: CanvasRenderingContext2D, color: string = 'aliceblue') {
        if (this.startDeath() && !this.scoreAdded) {
            score += this.score();
            this.scoreAdded = true;
        }
        // check for death conditions
        if (this.startDeath()) {
            this.deathCounter += 1;
            const src = Math.floor(this.deathCounter / 6);
            const posX = this.posX +
                this.getWidth(context) / 2 - this.imageWidth / 2;

            context.drawImage(
                this.explosionImages[src] as CanvasImageSource,
                posX, this.posY, this.imageWidth, this.imageHeight
            );

            const scr = this.score();
            if (scr > 0) {
                context.fillStyle = 'rgb(163, 190, 140)';
                context.fillText("+" + scr.toString(), posX+30, this.posY);
            }
            else 
                context.fillText(scr.toString(), posX+30, this.posY);
            return;
        }
        context.font = '20px CCOverbyteOn';
        if (this.protBuffer > 0) {
            // const x = 
            const color =
                Math.floor(this.protBuffer / 10) % 2 === 0 ? 'blue' : 'crimson';
            this.texter(context, this.typed, this.cur, this.posX, this.posY, color);

            // context.fillStyle = "rgba(129, 161, 193, 0.4)"
            // context.fillRect(this.posX - 5, this.posY - 35, x - this.posX + 10, 30);
            this.protBuffer -= 1;
        }
        else {
            this.texter(context, this.typed, this.cur, this.posX, this.posY, color);
            for (const bullet of this.bullets) {
                bullet.move();
                bullet.draw(context);
            }
        }

        const src = Math.floor(this.curImage / 10);
        const imgX = Math.floor(this.posX + this.getWidth(context) / 2 -
            this.imageWidth / 2);
        const imgY = Math.floor(this.posY + 10);
        // 10 is the gap between text and spaceship
        context.drawImage(
            this.images[src] as CanvasImageSource,
            imgX, imgY, this.imageWidth, this.imageHeight);

        this.curImage += 1;
        if (Math.floor(this.curImage / 10) >= this.images.length) {
            this.curImage = 0;
        }

        if (this.startedTyping && !this.endedTyping)
            this.typedFor += 1;
    }
    // word has been correctly typed by the player, or the word has gone beyond the
    // boundary
    startDeath(): boolean {
        return this.cur.length === 0 || this.posY >= height - 200;
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

// Adds a random enemy that fits within the game box
function addRandomEnemy(
    enemies: Enemy[],
    context: CanvasRenderingContext2D,
    enemySprite: HTMLElement[],
    explosionSprite: HTMLElement[]
): void {
    if (document.hidden) {
        return; // makes sure we don't add words when the tab is inactive
    }
    const idx = Math.floor(Math.random() * data.length);
    const word = data[idx];
    const wordWidth = context.measureText(word).width;
    let posX = Math.floor(Math.random() * width);

    while (posX + wordWidth > width - 10 || posX < 10) {
        posX = Math.floor(Math.random() * width);
    }
    const newEnemy = new Enemy(data[idx], posX, enemySprite, explosionSprite);

    const buffer = 20;
    const lx = newEnemy.posX - buffer;
    const rx = newEnemy.posX + newEnemy.getWidth(context) + buffer;
    const ly = newEnemy.posY - buffer;
    const ry = newEnemy.posY + newEnemy.getHeight() + buffer;

    const closeEnemies = enemies.filter(enemy => {
        const elx = enemy.posX;
        const erx = enemy.posX + enemy.getWidth(context);
        const ely = enemy.posY;
        const ery = enemy.posY + enemy.getHeight();

        if (Math.max(lx, elx) < Math.min(rx, erx) &&
            Math.max(ly, ely) < Math.min(ry, ery)) {
            return true;
        }
        return false;
    });
    if (closeEnemies.length === 0) {
        enemies.push(newEnemy);
    }
}


function targetEnemy(
    player: Player,
    enemies: Enemy[],
    context: CanvasRenderingContext2D
): Enemy | null {
    const inRange = enemies.filter((enemy) => {
        const enemyLeftX = enemy.posX;
        const enemyRightX = enemy.posX + enemy.getWidth(context);
        const playerLeftX = player.posX;
        const playerRightX = player.posX + player.width;

        return !(enemyRightX <= playerLeftX || playerRightX <= enemyLeftX)
    });
    return inRange.length > 0 ? inRange[0] : null;
    // inRange[0] gives us closest enemy inside the range
}

function initGame(context: CanvasRenderingContext2D): () => void {
    const playerSprite = [] as HTMLElement[];
    const enemySprite = [] as HTMLElement[];
    const explosionSprite = [] as HTMLElement[];

    // Loads all the sprites
    for (let i = 0; i < 4; i++) {
        const url =
            process.env.PUBLIC_URL + `player_sprite/frame_${i}_delay-0.1s.png`;
        const img = new Image();
        img.src = url;
        playerSprite.push(img);
    }
    for (let i = 0; i < 4; i++) {
        const url =
            process.env.PUBLIC_URL + `enemy_sprite/frame_${i}_delay-0.1s.png`;
        const img = new Image();
        img.src = url;
        enemySprite.push(img);
    }
    for (let i = 0; i < 5; i++) {
        const url =
            process.env.PUBLIC_URL + `explosion_sprite/frame_${i}_delay-0.1s.png`;
        const img = new Image();
        img.src = url;
        explosionSprite.push(img);
    }
    // end loading

    let enemies = [] as Enemy[];
    // let bullets = [] as Bullet[];
    const player = new Player(0, playerSprite); // creates a player in the corner
    const playerSpeed = 14;
    const enemySpeed = 1;


    const keyHandler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            player.move(playerSpeed);
        } else if (e.key === 'ArrowLeft') {
            player.move(-playerSpeed);
        } else if (e.key >= 'a' && e.key <= 'z') {
            const targetedEnemy = targetEnemy(player, enemies, context);
            if (targetedEnemy !== null) {
                targetedEnemy.shot(new Bullet(player, targetedEnemy, e.key));
            }
        }
    }


    const animate = () => {
        if (document.hidden) {
            return; // makes sure we don't render the game if the tab is closed
        }
        context.clearRect(0, 0, width, height);
        player.draw(context);
        enemies = enemies.filter((enemy) => !enemy.isDead());
        // bullets = bullets.filter((bullet) => !bullet.isShot());
        // mutableFilter(enemies, (enemy) => !enemy.isDead());

        // draw the current enemy in black
        const head = targetEnemy(player, enemies, context);
        const tail = enemies.filter((enemy) => enemy !== head);

        if (head !== null) {
            head.move(-enemySpeed)
            head.draw(context, 'crimson') // pass in the color of targeted enemy
            head.getShot()
        }
        // and the rest in gray
        for (const enemy of tail) {
            enemy.move(-enemySpeed);
            enemy.draw(context);
        }

        context.font = '20px CCOverbyteOn';
        context.fillStyle = 'crimson'; // correctly typed part color
        context.fillText("Score: " + score.toString(), 50, 50);
    }

    // the numbers here should be determined by the difficulty level

    // lower animationTimer => more texts on the screen, more crowdy
    const animationTimer = setInterval(animate, 30);

    // lower enemyTimer => quicker enemy spawn
    const enemyTimer = setInterval(
        () => addRandomEnemy(enemies, context, enemySprite, explosionSprite), 2000
    );

    window.addEventListener('keydown', keyHandler);

    // must return a function that clears out the timer and the event listener
    return () => {
        window.removeEventListener('keydown', keyHandler);
        clearInterval(animationTimer);
        clearInterval(enemyTimer);
    };
}



function CanvasGame(): JSX.Element {
    useEffect(() => {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        if (canvas !== null) {
            const context = canvas.getContext('2d');
            if (context !== null) {
                return initGame(context);
            }
        }
        return () => {};
    }, []);
    return (
        <>
            <Background />
            <canvas id={"game"} height={height} width={width}>
                Sorry, canvas is not supported in your browser.
            </canvas>
        </>
    );
}

export default CanvasGame;
