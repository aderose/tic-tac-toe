const gameBoard = (function (boardContainer) {
  // create 9 tiles using the tile factory
  const tileObjects = Array.from({ length: 9 }, createTile);

  // show gameBoard by rendering the tiles
  function render() {
    tileObjects.forEach((tileObject) => {
      tileObject.update();
      boardContainer.appendChild(tileObject.tile);
    });
  }

  return { tileObjects, render };
})(document.querySelector(".gameboard"));

const gameController = ({ player1, player2, restart }) => {
  const tileObjects = gameBoard.tileObjects;
  restart.addEventListener("click", () => location.reload());

  // number of moves played
  let moves = 0;

  function playGame() {
    // render the gameboard
    gameBoard.render();

    // listen for a single click on tile
    tileObjects.forEach((tileObject) =>
      tileObject.tile.addEventListener("click", playTurn.bind(tileObject), {
        once: true,
      })
    );
  }

  function playTurn() {
    // determine which player plays
    const currentPlayer = moves++ % 2 === 0 ? player1 : player2;

    // update tile that the player clicked on
    this.clicked(currentPlayer.getIcon());
    // check if game is over
    const roundResult = gameFinished();
    if (roundResult.isFinished) {
      stateController.endingMenu(roundResult.result, currentPlayer);
    }
  }

  // check each row/column/diagonal for a winner
  function gameFinished() {
    const tiles = tileObjects.map((tile) => tile.getIcon());
    let isFinished = false;
    let result = "";

    for (let i = 0; i < 3; i++) {
      if (
        // rows
        [tiles[0 + 3 * i], tiles[1 + 3 * i], tiles[2 + 3 * i]].every(
          (icon, index, icons) => icon === icons[0] && icon !== ""
        ) ||
        // columns
        [tiles[0 + i], tiles[3 + i], tiles[6 + i]].every(
          (icon, index, icons) => icon === icons[0] && icon !== ""
        )
      ) {
        isFinished = true;
        result = "win";
      }
    }

    if (
      // major diagonal
      (tiles[0] == tiles[4] && tiles[4] == tiles[8] && tiles[0] != "") ||
      // minor diagonal
      (tiles[2] == tiles[4] && tiles[4] == tiles[6] && tiles[2] != "")
    ) {
      isFinished = true;
      result = "win";
    }

    // if every tile is filled, it's a tie
    if (tiles.every((icon) => icon === "x" || icon === "o")) {
      isFinished = true;
      result = "tie";
    }

    return { isFinished, result };
  }

  return { playGame };
};

// create a tile object for the given tile value
function createTile() {
  let value = "";
  const tile = document.createElement("div");
  tile.classList.add("tile", "round-border", "clickable");
  const icon = document.createElement("i");
  tile.appendChild(icon);

  const getIcon = () => value;
  const setIcon = (tileValue) => (value = tileValue);

  // set icon, remove pointer formatting then update icon
  const clicked = (tileValue) => {
    setIcon(tileValue);
    tile.classList.remove("clickable");
    update();
  };

  // update tile image to show icon depending on tile value
  const update = () => {
    if (value === "x") icon.classList.add("fas", "fa-times");
    if (value === "o") icon.classList.add("far", "fa-circle");
  };

  return { tile, setIcon, getIcon, clicked, update };
}

// create a player object for the given name and icon
function createPlayer(newName, newIcon) {
  let name = newName || "";
  let icon = newIcon || "";

  const getName = () => name;
  const getIcon = () => icon;
  const setName = (name) => (this.name = name);
  const setIcon = (icon) => (this.icon = icon);

  return { getName, getIcon, setName, setIcon };
}

// control which state of the game we're in
const stateController = (() => {
  // initialise the start menu state (default on load)
  const startMenu = () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const p1Name = document.querySelector("#player1").value || "Player 1";
      const p2Name = document.querySelector("#player2").value || "Player 2";
      document.querySelector(".menu").classList.toggle("hidden");
      document.querySelector(".game").classList.toggle("hidden");
      startGame(createPlayer(p1Name, "x"), createPlayer(p2Name, "o"));
    });
  };

  // initialise the game state (loads on form submit)
  const startGame = (player1, player2) => {
    // initialise the game
    const game = gameController({
      player1,
      player2,
      restart: document.querySelector(".restart"),
    });
    game.playGame();
  };

  // initialise ending menu (after the game is finished)
  const endingMenu = (result, player) => {
    console.log("Game OVER");
    if (result == "win") console.log(`Winner is ${player.getName()}`);
    else if (result == "tie") console.log("It was a tie.");
  };

  startMenu();

  return { endingMenu };
})();
