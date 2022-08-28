import data from "../components/Data";
import { put } from "../utilities";
import Bullet from "../components/Bullet";
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import Alien from "./Alien";
import { User } from "../types";

const height = Math.max(window.innerHeight, 500);
const width = Math.max(window.innerWidth, 500);
let score = 0;

class Game {
    alienRate = 20
    
    addRandomEnemy(
        enemies: Enemy[],
        context: CanvasRenderingContext2D,
        enemySprite: HTMLElement[],
        alienSprite: HTMLElement[],
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

        let newEnemy = null
        const perc = Math.floor(Math.random() * 100)
        if (perc < this.alienRate) 
            newEnemy = new Alien(data[idx], posX, alienSprite, explosionSprite, context);
        else 
            newEnemy = new Enemy(data[idx], posX, enemySprite, explosionSprite, context);

        const buffer = 20;
        const lx = newEnemy.posX - buffer;
        const rx = newEnemy.posX + newEnemy.getWidth() + buffer;
        const ly = newEnemy.posY - buffer;
        const ry = newEnemy.posY + newEnemy.getHeight() + buffer;

        const closeEnemies = enemies.filter(enemy => {
            const elx = enemy.posX;
            const erx = enemy.posX + enemy.getWidth();
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

    targetEnemy(
        player: Player,
        enemies: Enemy[]
    ): Enemy | null {
        const inRange = enemies.filter(
            (enemy) => {
                const enemyLeftX = enemy.posX;
                const enemyRightX = enemy.posX + enemy.getWidth();
                const playerLeftX = player.posX;
                const playerRightX = player.posX + player.width;

                return !(enemy.startDeath() ||
                    enemyRightX <= playerLeftX ||
                    playerRightX <= enemyLeftX)
            }
        );
        // inRange[0] gives us closest enemy inside the range
        return inRange.length > 0 ? inRange[0] : null;
    }

    drawHealth(context : CanvasRenderingContext2D, health : number, heartImage : HTMLElement) {
        
        const len = 120;
        const rem = Math.floor(len * health / 180);
        const offset = 40;
        const y = 35;

        context.strokeStyle = 'red';
        roundRect(context, width - len - offset, y, len, 20, 5);

        context.fillStyle = 'rgb(255, 68, 51)';
        roundRect(context, width - len - offset, y, rem, 20, {tl : 5, bl : 5, tr : 0, br : 0}, true, false);

        context.drawImage(heartImage as CanvasImageSource, width - len - offset - 30, y - 5, 30, 30);
    }

    initGame(context: CanvasRenderingContext2D, user : User | null): () => void {
        const playerSprite = [] as HTMLElement[];
        const enemySprite = [] as HTMLElement[];
        const alienSprite = [] as HTMLElement[];
        const explosionSprite = [] as HTMLElement[];
        const heartImage = new Image();
        heartImage.src = process.env.PUBLIC_URL + 'heart.png';

        // load sprites
        const addSprites =
            (n: number, sprites: HTMLElement[], name1: string, name2: string) => {
                for (let i = 0; i < n; i++) {
                    const url = process.env.PUBLIC_URL + name1 + i.toString() + name2
                    const img = new Image();
                    img.src = url;
                    sprites.push(img);
                }
            }
        addSprites(4, playerSprite, "player_sprite/frame_", "_delay-0.1s.png")
        addSprites(4, enemySprite, "enemy_sprite/asteroid_", ".png")
        addSprites(4, alienSprite, "enemy_sprite/frame_", "_delay-0.1s.png")
        addSprites(5, explosionSprite, "explosion_sprite/frame_", "_delay-0.1s.png")
        // end loading

        let enemies = [] as Enemy[];
        // let bullets = [] as Bullet[];
        const player = new Player(0, playerSprite, context);
        // creates a player in the corner
        const playerSpeed = 14;
        const enemySpeed = 1;

        const keyHandler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                player.move(playerSpeed);
            } else if (e.key === 'ArrowLeft') {
                player.move(-playerSpeed);
            } else if (e.key >= 'a' && e.key <= 'z') {
                const targetedEnemy = this.targetEnemy(player, enemies);
                if (targetedEnemy !== null) {
                    targetedEnemy.shot(new Bullet(player, targetedEnemy, e.key));
                }
            }
        }

        const filterEnemy = (enemy: Enemy) => {
            if (enemy.startDeath() && !enemy.scoreAdded) {
                score += enemy.score()
                enemy.scoreAdded = true
                if (player.collide(enemy))
                    player.takeLife()
                if(enemy.cur.length === 0) { // successfully typed the word
                    player.health += enemy instanceof Alien ? 10 : 1;
                }
            }
            player.health = Math.min(180, player.health);
            player.health = Math.max(0, player.health);
            return !enemy.isDead()
        }

        const animate = () => {
            if (document.hidden) {
                return; // makes sure we don't render the game if the tab is closed
            }
            if(player.health <= 0) {
                context.font = '70px CCOverbyteOn';
                context.fillStyle = 'white';
                const textWidth = context.measureText('Game Over').width;
                context.fillText('Game Over', Math.floor((width - textWidth) / 2), Math.floor(height / 2));

                if(user !== null)
                    put("/api/topscore", {
                        "username": user.username,
                        "top_score": score
                    })


                return ;
            }
            context.clearRect(0, 0, width, height);
            player.draw();

            enemies = enemies.filter(filterEnemy);
            // bullets = bullets.filter((bullet) => !bullet.isShot());
            // mutableFilter(enemies, (enemy) => !enemy.isDead());

            // draw the current enemy in black
            const head = this.targetEnemy(player, enemies);
            const tail = enemies.filter((enemy) => enemy !== head);

            if (head !== null) {
                head.move(-enemySpeed)
                head.draw('crimson') // pass in the color of targeted enemy
            }
            // and the rest in gray
            for (const enemy of tail) {
                enemy.move(-enemySpeed);
                enemy.draw();
            }
            
            const username = user === null ? "guest" : user.username;

            context.font = '20px CCOverbyteOn';
            context.fillStyle = 'lightgreen'; // correctly typed part color
            context.fillText("Score: " + score + " (" + username + ")", 50, 50);
            // context.fillText("Health: " + player.health, boardWidth - 150, 50);
            
            this.drawHealth(context, player.health, heartImage);
        }

        // the numbers here should be determined by the difficulty level

        // lower animationTimer => more texts on the screen, more crowdy
        const animationTimer = setInterval(animate, 30);

        // lower enemyTimer => quicker enemy spawn
        const enemyTimer = setInterval(
            () =>
                this.addRandomEnemy(
                    enemies,
                    context,
                    enemySprite,
                    alienSprite,
                    explosionSprite
                ),
            2000
        );
        
        const healthTimer = setInterval(() => {
            player.health -= 10;
        }, 1000);

        window.addEventListener('keydown', keyHandler);

        // must return a function that clears out the timer and the event listener
        return () => {
            window.removeEventListener('keydown', keyHandler);
            clearInterval(animationTimer);
            clearInterval(enemyTimer);
            clearInterval(healthTimer);
        };
    }
}


function roundRect(
    ctx : CanvasRenderingContext2D,
    x : number,
    y : number,
    width : number,
    height : number,
    radius : {tl : number, tr: number, bl: number, br: number} | number,
    fill = false,
    stroke = true
  ) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
}


export const boardHeight = height;
export const boardWidth = width;
export var gameScore = score;
export default Game;
