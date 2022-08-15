import { useEffect } from "react";
import "./Background.css";

const height = window.innerHeight - 0;
const width = window.innerWidth - 0;
const bgColor = 'rgb(0, 0, 0)';

class Star {
    posX : number;
    posY : number;
    radius = 2; // we'll representing stars with circles for now

    constructor(posX : number, posY : number) {
        this.posX = posX;
        this.posY = posY;
    }
    draw(ctx : CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(this.posX, this.posY, this.radius, this.radius);
    }
    clear(ctx : CanvasRenderingContext2D) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(this.posX, this.posY, this.radius, this.radius);
    }
}

function initBackground(ctx : CanvasRenderingContext2D) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    const stars : Star[] = [];
    const numberOfStars = Math.floor(width * height * 0.0001); // 0.01% of the total area

    for(let i = 0; i < numberOfStars; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        stars.push(new Star(x, y));
    }
    const animate = () => {
        for(const star of stars) {
            star.clear(ctx);
        }
        for(const star of stars) {
            star.posY += 1;
            star.posX += 1;
            if(star.posX >= width) star.posX = 0;
            if(star.posY >= height) star.posY = 0;
            star.draw(ctx);
        }
    }
    const animationTimer = setInterval(animate, 100);

    return () => { 
        clearInterval(animationTimer);
    }
}

export default function Background() {
    useEffect(() => {
        const canvas = document.getElementById("background") as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        return initBackground(context);
    }, []);
    return (
        <canvas id={"background"} height={height} width={width}>
        </canvas>
    )
}