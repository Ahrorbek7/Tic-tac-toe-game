
// GAMEBOARD

const Gameboard = (() => {
  const gameboard = ['', '', '', '', '', '', '', '', '']
  // JS function that renders game conents array to webpage.
  const render = () => {
    let boardHTML = ''
    gameboard.forEach((square, index) => {
      boardHTML += `<div class="square" id="${index}">${square}</div>`
    })
    document.querySelector('#gameboard').innerHTML = boardHTML
    const squares = document.querySelectorAll('.square')
    squares.forEach((square) => {
      square.addEventListener('click', Game.handleClick)
    })
  }
  const update = (index, value) => {
    gameboard[index] = value
    render()
  }
  const getGameboard = () => gameboard

  return {
    render,
    update,
    getGameboard
  }
})()

// Display module that congrats the winning player!
const displayModule = (() => {
  const renderMessage = (message) => {
    document.querySelector('#message').innerHTML = message
  }
  return {
    renderMessage
  }
})()

// Player factory function
const Player = (name, mark) => {
  return { name, mark }
}

// Game module
const Game = (() => {
  let players = []
  let currentPlayerindex
  let gameOver

  // here is function to add each square to board

  const start = () => {
    players = [
      Player(document.querySelector('#player1').value, 'X'),
      Player(document.querySelector('#player2').value, 'O')
    ]

    currentPlayerindex = 0
    gameOver = false
    Gameboard.render()
    const startGame = document.querySelector('.show')
    startGame.classList.remove('show')
    const squares = document.querySelectorAll('.square')
    squares.forEach((square) => {
      square.addEventListener('click', handleClick)
    })
  }

  // buttons for starting and restarting

  const startButton = document.querySelector('#start-button')
  startButton.addEventListener('click', () => {
    Game.start()
  })

  const restartButton = document.querySelector('#restart')
  restartButton.addEventListener('click', () => {
    Game.restart()
  })

  const handleClick = (e) => {
    // logic that stops players from playing same squares twice
    if (gameOver) {
      return
    }
    const index = e.target.id
    if (Gameboard.getGameboard()[index] !== '') {
      return
    }

    Gameboard.update(index, players[currentPlayerindex].mark)
    const endGame = document.querySelector('#winningMessage')
    // check when game over! should check 3-in-a-row and tie
    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerindex].mark)
    ) {
      gameOver = true
      displayModule.renderMessage(
        `Congrats ${players[currentPlayerindex].name}, you Win!`
      )
      endGame.classList.add('show')
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true
      displayModule.renderMessage("It's a tie")
      endGame.classList.add('show')
    }
    currentPlayerindex = currentPlayerindex === 0 ? 1 : 0
  }

  const checkForWin = (board, mark) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // vertical
      [0, 4, 8],
      [2, 4, 6] // diagonal
    ]
    return winningCombinations.some((combination) =>
      combination.every((index) => board[index] === mark)
    )
  }

  const checkForTie = (board) => {
    return board.every((square) => square !== '')
  }

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, '')
      const endGame = document.querySelector('#winningMessage')
      endGame.classList.remove('show')
    }
    Gameboard.render()
    gameOver = false
    currentPlayerindex = 0
    document.querySelector('#message').innerHTML = ''
  }

  return {
    start,
    handleClick,
    restart,
    checkForWin,
    checkForTie
  }
})()
