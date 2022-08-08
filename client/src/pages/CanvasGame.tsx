import { useEffect } from "react";
import data from "../components/data";
import "./CanvasGame.css";

const height = window.innerHeight; // Math.floor(window.innerHeight / 2);
const width  = window.innerWidth; // Math.floor(window.innerWidth / 2);

class Player {
    posX : number;    
    height = 50;
    width = 50;
    posY  = height - 80;

    constructor(posX : number) {
        this.posX = posX;
    }
    move(dx : number) {
        this.posX += dx;
        if(this.posX < 0) 
            this.posX = 0;
        if(this.posX + this.width > width)
            this.posX = width - this.width;
    }
    draw(context : CanvasRenderingContext2D) {
        context.fillStyle = 'rgb(191, 97, 106)';
        context.fillRect(this.posX, this.posY, this.width, this.height);
    }
}

class Enemy {
    word   : string;
    typed  : string;
    cur    : string;
    posX   : number;
    posY = 30;

    constructor(word : string, posX : number) {
        this.cur  = word;
        this.word = word;
        this.typed = "";
        this.posX = posX;
    }
    // As the player types, cut off parts of the word
    // If player mistypes a letter, the word respawns
    shoot(letter : string) {
        if(this.cur[0].toLowerCase() === letter.toLowerCase()) {
            this.typed += this.cur[0]
            this.cur = this.cur.slice(1);
        }
        else{
            this.typed = ""
            this.cur = this.word
        }
    }
    move(dy : number) {
        this.posY -= dy;
    }

    // draw the typed part in rgb(163, 190, 140) and the untyped part in black
    texter(ctx: CanvasRenderingContext2D, left: string, 
           right: string, x: number, y: number, curColor: string){
        for(let i = 0; i <= left.length; ++i){
            const ch = left.charAt(i);
            ctx.fillStyle = 'rgb(163, 190, 140)';
            ctx.fillText(ch, x, y);
            x += ctx.measureText(ch).width;
        }
        for(let i = 0; i <= right.length; ++i){
            const ch = right.charAt(i);
            ctx.fillStyle = curColor;
            ctx.fillText(ch, x, y);
            x += ctx.measureText(ch).width;
        }
    }

    draw(context : CanvasRenderingContext2D, color: string = 'rgb(169,169,169)') {
        context.font = '35px monospace';
        this.texter(context, this.typed, this.cur, this.posX, this.posY, color);
    }

    // word has been correctly typed by the player, or the word has gone beyond the
    // boundary
    isDead(): boolean {
        return this.posY > height || this.cur.length === 0;
    }
}

// function mutableFilter <T> (arr : T[], func: (el : T) => boolean): void {
//     const remaining : T[] = arr.filter(func);
//     const len = arr.length;
//     arr.splice(0, len);
//     for (const el of remaining) {
//         arr.push(el);
//     }
// }

// Adds a random enemy that fits within the game box
function addRandomEnemy(enemies: Enemy[], context: CanvasRenderingContext2D): void {
    const idx = Math.floor(Math.random() * data.length); 
    const word = data[idx];
    const wordWidth = context.measureText(word).width;
    let posX = Math.floor(Math.random() * width);
    
    while (posX + wordWidth > width - 10 || posX < 10) 
        posX = Math.floor(Math.random() * width);

    enemies.push(new Enemy(data[idx], posX));
}

function initGame(context: CanvasRenderingContext2D) : () => void {
    let enemies = [new Enemy('lmfao', 30)];
    const player = new Player(0); // creates a player in the corner
    const playerSpeed = 14;
    const enemySpeed = 1;

    const keyHandler = (e: KeyboardEvent) => {    
        if(e.key === 'ArrowRight') {
            player.move(playerSpeed);
        } else if (e.key === 'ArrowLeft') {
            player.move(-playerSpeed);
        } else {
            // This removes the key from the front of all the enemies
            // for(const enemy of enemies) {
            //     enemy.shoot(e.key);
            // }
            
            // This only removes it from the first enemy
            enemies[0].shoot(e.key);
        }
    }

    const animate = () => {
        context.clearRect(0, 0, width, height);
        player.draw(context);
        enemies = enemies.filter((enemy) => !enemy.isDead());
        // mutableFilter(enemies, (enemy) => !enemy.isDead());

        // draw the current enemy in black
        const [head, ...tail] = enemies
        head.move(-enemySpeed)
        head.draw(context, 'black')
        // and the rest in gray
        for(const enemy of tail) {
            enemy.move(-enemySpeed);
            enemy.draw(context);
        }
    }

    // the numbers here should be determined by the difficulty level
    
    // lower animationTimer => more texts on the screen, more crowdy
    const animationTimer = setInterval(animate, 30);

    // lower enemyTimer => quicker enemy spawn
    const enemyTimer = setInterval(() => addRandomEnemy(enemies, context), 1000);

    window.addEventListener('keydown', keyHandler);

    // must return a function that clears out the timer and the event listener
    return () => {
        window.removeEventListener('keydown', keyHandler);
        clearInterval(animationTimer);
        clearInterval(enemyTimer);
    };
}



function CanvasGame() : JSX.Element {
    useEffect(() => {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        if(canvas !== null) {
            const context = canvas.getContext('2d');
            if(context !== null) {                
                return initGame(context);
            }
        }
        return () => {};
    }, []);
    return (
        <div className="canvas-container">
            <canvas id={"game"} height={height} width={width}>
                Sorry, canvas is not supported in your browser.
            </canvas>
        </div>
    );
}

export default CanvasGame;
