import gameBoard from "./gameBoard.js";
import stateController from "./stateController.js";

const gameController = ({ player1, player2 }) => {
  const tileObjects = gameBoard.tileObjects;
  const output = document.querySelector("#turn");
  document
    .querySelector(".restart")
    .addEventListener("click", () => location.reload());

  // number of moves played
  let moves = 0;

  function playGame() {
    // render the gameboard
    gameBoard.render();

    // output the player 1 name as the starter
    output.textContent = player1.getName();

    // listen for a single click on tile
    tileObjects.forEach((tileObject) =>
      tileObject.tile.addEventListener("click", playTurn.bind(tileObject), {
        once: true,
      })
    );
  }

  async function playTurn() {
    // ensure we do not overwrite a pre-existing choice
    if (this.getIcon() !== "") return;

    if (player2.getType() === "user") {
      // determine which player plays
      const nextPlayer = (moves + 1) % 2 === 0 ? player1 : player2;
      const currentPlayer = moves++ % 2 === 0 ? player1 : player2;

      // update the turn output to the next player
      output.textContent = nextPlayer.getName();

      // update tile that the player clicked on
      this.clicked(currentPlayer.getIcon());
    } else if (
      player2.getType() === "ai-easy" ||
      player2.getType() === "ai-hard"
    ) {
      // update tile that the player clicked on
      this.clicked(player1.getIcon());

      // update output
      output.textContent = player2.getName();

      // get list of available tiles
      const emptyTiles = tileObjects.filter((tile) => tile.getIcon() === "");

      // return if there are no more empty tiles
      if (
        emptyTiles.length !== 0 &&
        !gameFinished(tileObjects, player1, player2).isFinished
      ) {
        // get computers choice
        const computerTile = getComputerChoice(
          player1,
          player2,
          tileObjects,
          emptyTiles
        );

        // wait 0.5 seconds and then click on that tile
        document.querySelector(".block-input").classList.toggle("hidden");
        await pausePlay(500);
        computerTile.clicked(player2.getIcon());
        document.querySelector(".block-input").classList.toggle("hidden");

        // update output to the user's name again
        output.textContent = player1.getName();
      }
    }

    // check if game is over
    const roundResult = gameFinished(tileObjects, player1, player2);
    if (roundResult.isFinished) {
      document.querySelector(".block-input").classList.toggle("hidden");
      await pausePlay(500);
      document.querySelector(".block-input").classList.toggle("hidden");
      stateController.endingMenu(roundResult.result, roundResult.winner);
    }
  }

  function getComputerChoice(player, computer, tiles, emptyTiles) {
    if (computer.getType() == "ai-easy") {
      return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    } else if (computer.getType() == "ai-hard") {
      let bestScore = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].getIcon() === "") {
          tiles[i].setIcon(computer.getIcon());
          let score = minimax(tiles, player, computer, false);
          tiles[i].setIcon("");
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return tiles[bestMove];
    }
  }

  function minimax(tiles, player, computer, isMaximising) {
    // result is either "win", "tie" or "none"
    const output = gameFinished(tiles, player, computer);

    // if the game is finished
    if (output.result !== "none") {
      if (output.winner == null) return 0;
      if (output.winner.getIcon() == computer.getIcon()) return 1;
      if (output.winner.getIcon() == player.getIcon()) return -1;
    }

    // maximise computers score
    if (isMaximising) {
      let bestScore = -Infinity;
      for (let i = 0; i < tiles.length; i++) {
        // try each empty tile and find the maximum score
        if (tiles[i].getIcon() === "") {
          tiles[i].setIcon(computer.getIcon());
          let score = minimax(tiles, player, computer, false);
          tiles[i].setIcon("");
          if (score > bestScore) {
            bestScore = score;
          }
        }
      }
      return bestScore;
      // minimise player score
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < tiles.length; i++) {
        // try each empty tile and find the minimum score
        if (tiles[i].getIcon() === "") {
          tiles[i].setIcon(player.getIcon());
          let score = minimax(tiles, player, computer, true);
          tiles[i].setIcon("");
          if (score < bestScore) {
            bestScore = score;
          }
        }
      }
      return bestScore;
    }
  }

  function pausePlay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // check each row/column/diagonal for a winner
  function gameFinished(tiles, player1, player2) {
    const icons = tiles.map((tile) => tile.getIcon());
    const p1Icon = player1.getIcon();

    for (let i = 0; i < 3; i++) {
      // rows
      if (
        [icons[0 + 3 * i], icons[1 + 3 * i], icons[2 + 3 * i]].every(
          (icon) => icon === icons[3 * i] && icon !== ""
        )
      ) {
        return {
          isFinished: true,
          result: "win",
          winner: icons[0 + 3 * i] === p1Icon ? player1 : player2,
        };
      }
      // columns
      if (
        [icons[0 + i], icons[3 + i], icons[6 + i]].every(
          (icon) => icon === icons[0 + i] && icon !== ""
        )
      ) {
        return {
          isFinished: true,
          result: "win",
          winner: icons[0 + i] === p1Icon ? player1 : player2,
        };
      }
    }

    if (
      // major diagonal
      (icons[0] == icons[4] && icons[4] == icons[8] && icons[0] != "") ||
      // minor diagonal
      (icons[2] == icons[4] && icons[4] == icons[6] && icons[2] != "")
    ) {
      return {
        isFinished: true,
        result: "win",
        winner: icons[4] === p1Icon ? player1 : player2,
      };
    }

    // if every tile is filled, it's a tie
    if (icons.every((icon) => icon === "x" || icon === "o")) {
      return {
        isFinished: true,
        result: "tie",
        winner: null,
      };
    }

    return { isFinished: false, result: "none", winner: null };
  }

  return { playGame };
};

export default gameController;
