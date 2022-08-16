import {useEffect} from "react";
import Background from "../components/Background";
import Game from "../components/Game";
import {boardWidth, boardHeight} from "../components/Game";

import "./CanvasGame.css";

function CanvasGame(): JSX.Element {
    useEffect(
        () => {
            const canvas = document.getElementById('game') as HTMLCanvasElement;
            const game = new Game();
            if (canvas !== null) {
                const context = canvas.getContext('2d');
                if (context !== null) {
                    context.font = '20px CCOverbyteOn';
                    return game.initGame(context);
                }
            }
            return () => {};
        },
        []
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
