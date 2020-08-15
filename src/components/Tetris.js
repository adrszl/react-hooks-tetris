import React, { useState } from 'react';
import { StyledTetrisWrapper, StyledTetris } from '../components/styles/StyledTetris'
import { createStage } from '../gameHelpers';

// COMPONENTS
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

// CUSTOM HOOKS
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';

const Tetris = () => {

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer] = usePlayer();
    const [stage, setStage] = useStage(player);

    const movePlayer = dir => {
        updatePlayerPos({ x: dir, y: 0 });
    }

    const startGame = () => {
        // reset everything
        setStage(createStage());
        resetPlayer();
    }

    const drop = () => {
        updatePlayerPos({ x: 0, y: 1, collided: false });
    }

    const dropPlayer = () => {
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
            }
        }
    }

    return(
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={event => move(event)}>
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