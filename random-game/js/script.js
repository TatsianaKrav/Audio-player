import { createSudoku, findEmptyCell } from "./sudokuCreator.js";
import { GRID_SIZE, createElement, createSound, getRowAndColumnIndex, addToScore, renderScoreTable } from "./utilities.js";


let sudoku = null;
let focusedCell = null;
let focusedCellIndex;
let isPrevGame = false;
let scores = [];

window.onload = () => {
    scores = JSON.parse(localStorage.getItem('results'));
    if (scores) {
        renderScoreTable(scores);
    }
}

init(false);

function init(val) {

    if (val) {
        sudoku = JSON.parse(localStorage.getItem('grid'));
    } else {
        sudoku = createSudoku();
    }

    localStorage.setItem('grid', JSON.stringify(sudoku));

    renderCells();
    setCellFocused();
    removeCell();
    cellsValueHandler();
    nextGame();
    showErrors();
    showSolution();
    restart();
}

function renderCells() {
    const grid = document.querySelector('.grid');

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = createElement('div', 'cell');
        grid.append(cell);

        const row = getRowAndColumnIndex(i).rowIndex;
        const column = getRowAndColumnIndex(i).columnIndex;

        if (sudoku.clearedGrid[row][column] !== null) {
            cell.innerText = sudoku.clearedGrid[row][column];
            cell.classList.add('numbered');
            cell.classList.add('default');
        } else continue;
    }
}

function cellsValueHandler() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
        number.addEventListener('click', (e) => {
            const value = e.target.innerText;

            if (focusedCell && !focusedCell.classList.contains('numbered')) {
                setCellValue(value);
                const container = document.querySelector('.container');

                const fillSound = document.createElement('audio');
                fillSound.setAttribute('src', '../assets/sounds/fill.mp3');
                container.appendChild(fillSound);
                fillSound.play();
            }
        })
    })

    window.addEventListener('keydown', (e) => {
        const value = e.key;

        if (focusedCell && !focusedCell.classList.contains('numbered') && Number.isInteger(+value)) {
            setCellValue(value);
        }
    })
}

function setCellValue(val) {
    focusedCell.innerText = val;
    focusedCell.classList.add('numbered');

    const row = getRowAndColumnIndex(focusedCellIndex).rowIndex;
    const column = getRowAndColumnIndex(focusedCellIndex).columnIndex;
    sudoku.clearedGrid[row][column] = +val;




    const fillSound = createSound('assets/sounds/fill.mp3');
    fillSound.play();

    if (!findEmptyCell(sudoku.clearedGrid)) {
        finishGame();
    }
}

function setCellFocused() {
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell, index) => {
        cell.onclick = (e) => {
            cells.forEach(cell => {
                cell.classList.remove('focused');
                cell.classList.remove('error');
            });

            focusedCell = e.target;
            focusedCellIndex = index;
            e.target.classList.add('focused');
        }
    })
}

function clearCell() {
    if (focusedCell && focusedCell.classList.contains('numbered') && !focusedCell.classList.contains('default')) {
        focusedCell.classList.remove('numbered');
        focusedCell.innerText = '';

        const row = getRowAndColumnIndex(focusedCellIndex).rowIndex;
        const column = getRowAndColumnIndex(focusedCellIndex).columnIndex;
        sudoku.clearedGrid[row][column] = null;

        const removeSound = createSound('assets/sounds/remove.mp3');
        removeSound.play();
    }
}

function removeCell() {
    const removeBtn = document.querySelector('.remove');

    window.addEventListener('keydown', (e) => {
        if (e.key === "Backspace") {
            clearCell();
        }
    })

    removeBtn.addEventListener('click', clearCell);
}

function finishGame() {
    let isCorrect = checkResult();

    const popup = document.querySelector('.popup');
    const popupMessage = document.querySelector('.popup-message');
    popup.classList.toggle('active');

    const winSound = createSound('assets/sounds/win2.mp3')
    const lostSound = createSound('assets/sounds/lost.mp3')

    const winner = document.querySelector('.winner');
    const iconWrapper = document.querySelector('.icon-wrapper');

    if (isCorrect) {
        popupMessage.innerText = 'Congratilations!';
        winSound.play();
        winner.classList.add('active');
        iconWrapper.classList.add('won');
        iconWrapper.classList.remove('lost');

        addToScore(scores, 'win');
        renderScoreTable(scores);

    } else {
        popupMessage.innerText = "You lost";
        lostSound.play();
        winner.classList.remove('active');
        iconWrapper.classList.add('lost');
        iconWrapper.classList.remove('won');

        addToScore(scores, 'losing');
        renderScoreTable(scores);
    }
}

function checkResult() {
    const initialGrid = sudoku.filledGrid.flat();
    const filledGrid = sudoku.clearedGrid.flat();

    return JSON.stringify(initialGrid) === JSON.stringify(filledGrid);
}

function nextGame() {
    const popupNextBtn = document.querySelector('.popup-next');
    const nextBtn = document.querySelector('.next');

    popupNextBtn.addEventListener('click', startNextGame);
    nextBtn.addEventListener('click', startNextGame);
}

function startNextGame() {
    const popup = document.querySelector('.popup');
    popup.classList.remove('active');

    const grid = document.querySelector('.grid');
    grid.innerHTML = '';

    init(false);
}

function showErrors() {
    const errorsBtn = document.querySelector('.errors');
    const cells = document.querySelectorAll('.cell');
    const initialGrid = sudoku.filledGrid.flat();

    errorsBtn.onclick = () => {
        for (let i = 0; i < initialGrid.length; i++) {
            if ((initialGrid[i] !== +cells[i].innerText) && cells[i].innerText !== '') {
                cells[i].classList.add('error');
            }
        }
    }
}

function showSolution() {
    const solutionBtn = document.querySelector('.solution');
    const cells = document.querySelectorAll('.cell');
    const initialGrid = sudoku.filledGrid.flat();

    solutionBtn.onclick = () => {
        for (let i = 0; i < initialGrid.length; i++) {
            if (initialGrid[i] !== +cells[i].innerText) {
                cells[i].innerText = initialGrid[i];
                cells[i].classList.add('numbered');
            }
        }
    }

}

function restart() {
    const restartBtns = document.querySelectorAll('.restart');
    isPrevGame = true;

    restartBtns.forEach(btn => {
        btn.onclick = () => {
            const popup = document.querySelector('.popup');
            if (popup.classList.contains('active')) {
                popup.classList.remove('active');
            }

            const grid = document.querySelector('.grid');
            grid.innerHTML = '';

            init(isPrevGame);
        }
    })
}


