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

  function playTurn() {
    // determine which player plays
    const nextPlayer = (moves + 1) % 2 === 0 ? player1 : player2;
    const currentPlayer = moves++ % 2 === 0 ? player1 : player2;

    // update the turn output to the next player
    output.textContent = nextPlayer.getName();

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
        return { isFinished: true, result: "win" };
      }
    }

    if (
      // major diagonal
      (tiles[0] == tiles[4] && tiles[4] == tiles[8] && tiles[0] != "") ||
      // minor diagonal
      (tiles[2] == tiles[4] && tiles[4] == tiles[6] && tiles[2] != "")
    ) {
      return { isFinished: true, result: "win" };
    }

    // if every tile is filled, it's a tie
    if (tiles.every((icon) => icon === "x" || icon === "o")) {
      return { isFinished: true, result: "tie" };
    }

    return { isFinished: false, result: "" };
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
function createPlayer(newName, newIcon, playerType) {
  let name = newName || "";
  let icon = newIcon || "";
  let type = playerType || "user";

  const getName = () => name;
  const getIcon = () => icon;
  const getType = () => type;
  const setName = (name) => (this.name = name);
  const setIcon = (icon) => (this.icon = icon);
  const setType = (type) => (this.type = type);

  return { getName, getIcon, getType, setName, setIcon, setType };
}

// control which state of the game we're in
const stateController = (() => {
  // initialise the start menu state (default on load)
  const startMenu = () => {
    const p1Input = document.querySelector("#player1");
    const p2Input = document.querySelector("#player2");
    const p2label = document.querySelector("#p2label");
    const singleplayer = document.querySelector("#singleplayer");
    const computer = document.querySelector("#computer-input");
    const aiEasy = document.querySelector("#easy");
    const aiHard = document.querySelector("#hard");
    let difficulty = "easy";

    aiEasy.addEventListener("click", () => (difficulty = "easy"));
    aiHard.addEventListener("click", () => (difficulty = "hard"));

    singleplayer.addEventListener("click", () => {
      if (!p2Input.classList.contains("hidden")) {
        p2label.textContent = "Computer Difficulty:";
        p2Input.classList.toggle("hidden");
        computer.classList.toggle("hidden");
      }
    });

    document.querySelector("#multiplayer").addEventListener("click", () => {
      if (p2Input.classList.contains("hidden")) {
        p2label.textContent = "Player 2 Name:";
        p2Input.classList.toggle("hidden");
        computer.classList.toggle("hidden");
      }
    });

    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      let player1, player2;
      if (singleplayer.checked) {
        player1 = createPlayer(p1Input.value || "Player 1", "x");
        player2 = createPlayer("Computer", "o", `ai-${difficulty}`);
      } else {
        player1 = createPlayer(p1Input.value || "Player 1", "x");
        player2 = createPlayer(p2Input.value || "Player 2", "o");
      }
      startGame(player1, player2);
      document.querySelector(".start").classList.toggle("hidden");
      document.querySelector(".game").classList.toggle("hidden");
    });
  };

  // initialise the game state (loads on form submit)
  const startGame = (player1, player2) => {
    // initialise the game
    const game = gameController({
      player1,
      player2,
    });
    game.playGame();
  };

  // initialise ending menu (after the game is finished)
  const endingMenu = (result, player) => {
    let output = "";
    if (result == "win") output = `The winner is ${player.getName()}!`;
    else if (result == "tie") output = "It was a tie..";
    document.querySelector("#result").textContent = output;
    document.querySelector(".game").classList.toggle("hidden");
    document.querySelector(".end").classList.toggle("hidden");
    document
      .querySelector("#restart-end")
      .addEventListener("click", () => location.reload());
  };

  startMenu();

  return { endingMenu };
})();
