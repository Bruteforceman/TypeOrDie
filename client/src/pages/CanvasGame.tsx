import {useEffect} from "react";
import Background from "../components/Background";
import Game from "../components/Game";
import {boardWidth, boardHeight} from "../components/Game";
import { UserProp } from "../types";

import "./CanvasGame.css";

function CanvasGame({ user } : UserProp): JSX.Element {
    useEffect(
        () => {
            const canvas = document.getElementById('game') as HTMLCanvasElement;
            const game = new Game();
            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
            context.font = '20px CCOverbyteOn';
            const clearFunc = game.initGame(context, user);
            
            return clearFunc;
        },
        [user]
    );
    return (
        <>
            <Background />
            <canvas id={"game"} height={boardHeight} width={boardWidth}>
                Sorry, canvas is not supported in your browser.
            </canvas>
        </>
    );
}

export default CanvasGame;
