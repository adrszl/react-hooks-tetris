import React, { useState } from 'react';
import { StyledTetrisWrapper, StyledTetris } from '../components/styles/StyledTetris'
import { createStage, checkCollision } from '../gameHelpers';

// COMPONENTS
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

// CUSTOM HOOKS
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage] = useStage(player, resetPlayer);

    const movePlayer = dir => {
        if(!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    }

    const startGame = () => {
        // reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
    }

    const drop = () => {
        if(!checkCollision(player, stage, {x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game Over
            if(player.pos.y < 1) {
                console.log('game over');
                setGameOver(true);
                setDropTime(null);
            }

            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver && keyCode === 40) {
            setDropTime(1000);
        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode }) => { // desctructure event.keyCode
        if(!gameOver) {
            if(keyCode === 37) { // left arrow
                movePlayer(-1);
            } else if(keyCode === 39) { // right arrow
                movePlayer(1);
            } else if(keyCode === 40) { // down arrow
                dropPlayer();
            } else if(keyCode === 38) { // up arrow
                playerRotate(stage, 1);
            }
        }
    }

    useInterval(() => {
        drop();
    }, dropTime)

    return(
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={event => move(event)} onKeyUp={keyUp}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text="Score" />
                            <Display text="Rows" />
                            <Display text="Level" />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}

export default Tetris;