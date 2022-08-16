import Enemy from "./Enemy";
import {boardWidth} from "./Game";

class Alien extends Enemy {
    moveBuffer = 0;
    moveFor = 120
    justMoved = false;

    override move(dy: number) {
        if (!this.justMoved && this.moveBuffer === 0 && !this.startDeath()) {
            this.justMoved = true;
            let posX = Math.floor(Math.random() * boardWidth);
            while (posX + this.getWidth() > boardWidth - 10 || posX < 10) {
                posX = Math.floor(Math.random() * boardWidth);
            }
            this.posX = posX;
        }
        this.posY -= dy
    }

    override draw(color: string = 'aliceblue') {
        super.draw(color);

        if (this.justMoved && this.moveBuffer < this.moveFor)
            this.moveBuffer += 1;
        else if (this.moveBuffer >= this.moveFor) {
            this.moveBuffer = 0;
            this.justMoved = false;
        }
    }

    override score() {
        return super.score() + 15 
    }
}

export default Alien;
