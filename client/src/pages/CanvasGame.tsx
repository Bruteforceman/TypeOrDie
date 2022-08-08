import { useEffect } from "react";
import data from "../components/data";
import "./CanvasGame.css";

const height = 500; // Math.floor(window.innerHeight / 2);
const width  = 500; // Math.floor(window.innerWidth / 2);

class Player {
    posX : number;    
    height = 50;
    width = 50;
    posY  = 30;

    constructor(posX : number) {
        this.posX = posX;
    }
    move(dx : number) {
        this.posX += dx;
        if(this.posX < 0) {
            this.posX = 0;
        }
        if(this.posX + this.width > width) {
            this.posX = width - this.width;
        }
    }
    draw(context : CanvasRenderingContext2D) {
        context.fillStyle = 'rgb(200, 0, 0)';
        context.fillRect(this.posX, this.posY, this.width, this.height);
    }
}

class Enemy {
    word   : string;
    cur    : string;
    posX   : number;
    posY = height - 30;

    constructor(word : string, posX : number) {
        this.cur  = word;
        this.word = word;
        this.posX = posX;
    }
    shoot(letter : string) {
        if(this.cur[0].toLowerCase() === letter.toLowerCase()) {
            this.cur = this.cur.slice(1);
        }
    }
    move(dy : number) {
        this.posY += dy;
    }
    draw(context : CanvasRenderingContext2D) {
        context.fillStyle = 'rgb(0, 0, 0)';
        context.font = '20px serif';
        context.fillText(this.cur, this.posX, this.posY);
    }
    isDead(): boolean {
        return this.posY < 0 || this.cur.length === 0;
    }
}

function mutableFilter <T> (arr : T[], func: (el : T) => boolean): void {
    const remaining : T[] = arr.filter(func);
    const len = arr.length;
    arr.splice(0, len);
    for (const el of remaining) {
        arr.push(el);
    }
}

function addRandomEnemy(enemies: Enemy[]): void {
    const idx = Math.floor(Math.random() * data.length); 
    const posY = Math.floor(Math.random() * width);
    enemies.push(new Enemy(data[idx], posY));
}

function initGame(context: CanvasRenderingContext2D) : () => void {
    const player = new Player(0); // creates a player in the corner
    const enemies = [new Enemy('lmfao', 30)];
    const playerSpeed = 14;
    const enemySpeed = 1;

    const keyHandler = (e: KeyboardEvent) => {    
        if(e.key === 'ArrowRight') {
            player.move(playerSpeed);
        } else if (e.key === 'ArrowLeft') {
            player.move(-playerSpeed);
        } else {
            for(const enemy of enemies) {
                enemy.shoot(e.key);
            }
        }
    }

    const animate = () => {
        context.clearRect(0, 0, width, height);
        player.draw(context);
        mutableFilter(enemies, (enemy) => !enemy.isDead());
        for(const enemy of enemies) {
            enemy.move(-enemySpeed);
            enemy.draw(context);
        }
    }

    const animationTimer = setInterval(animate, 50);
    const enemyTimer = setInterval(() => addRandomEnemy(enemies), 1500);

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