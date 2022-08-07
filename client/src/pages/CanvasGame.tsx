import { useEffect } from "react";

function initGame(context: CanvasRenderingContext2D) {
    context.fillStyle = 'rgb(200, 0, 0)';
    context.fillRect(10, 10, 50, 50);

    context.fillStyle = 'rgba(0, 0, 200, 0.5)';
    context.fillRect(60, 60, 50, 50);
}

function CanvasGame() : JSX.Element {
    useEffect(() => {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        console.log(canvas);
        if(canvas !== null) {
            const context = canvas.getContext('2d');
            if(context !== null) {
                initGame(context);
            }
        }
    }, []);
    return (
        <div>
            <canvas id={"game"} height={150} width={150}>
                Sorry, canvas is not supported in your browser.
            </canvas>
        </div>
    );
}

export default CanvasGame;