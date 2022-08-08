import { useEffect } from "react";
import "./CanvasGame.css";

const height = 500; // Math.floor(window.innerHeight / 2);
const width  = 500; // Math.floor(window.innerWidth / 2);

class Player {
    posX : number;    
    height = 50;
    width = 50;

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
        context.fillRect(this.posX, 30, this.width, this.height);
    }
}

let player : Player;

function initGame(context: CanvasRenderingContext2D) {
    player = new Player(0); // creates a player in the corner
    player.draw(context);
}
function keyHandler(e: KeyboardEvent, context : CanvasRenderingContext2D) {
    const playerSpeed = 14;
    if(e.key === 'ArrowRight') {
        player.move(playerSpeed);
    } else if (e.key === 'ArrowLeft') {
        player.move(-playerSpeed);
    }
    context.clearRect(0, 0, width, height);
    player.draw(context);
}

function CanvasGame() : JSX.Element {
    useEffect(() => {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        let eventAdded = false;

        let handleKeyEvent : (e : KeyboardEvent) => void;
        if(canvas !== null) {
            const context = canvas.getContext('2d');
            if(context !== null) {
                initGame(context);
                handleKeyEvent = (e : KeyboardEvent) => keyHandler(e, context);
                window.addEventListener('keydown', handleKeyEvent);
                eventAdded = true;
            }
        }
        return () => { 
            if(eventAdded) {
                window.removeEventListener('keydown', handleKeyEvent);
            } 
        };
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