const gameBoard = (function () {
  // create 9 tiles using the tile factory
  const tileObjects = Array.from({ length: 9 }, createTile);

  // show gameBoard by rendering the tiles
  function render() {
    tileObjects.forEach((tileObject) => {
      tileObject.update();
      document.querySelector(".gameboard").appendChild(tileObject.tile);
    });
  }

  return { tileObjects, render };
})();

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
    if (player2.getType() === "user") {
      // determine which player plays
      const nextPlayer = (moves + 1) % 2 === 0 ? player1 : player2;
      const currentPlayer = moves++ % 2 === 0 ? player1 : player2;

      // update the turn output to the next player
      output.textContent = nextPlayer.getName();

      // update tile that the player clicked on
      this.clicked(currentPlayer.getIcon());
    } else if (player2.getType() === "ai-easy") {
      // update tile that the player clicked on
      this.clicked(player1.getIcon());

      // update output
      output.textContent = player2.getName();

      // get list of available tiles
      const emptyTiles = tileObjects.filter((tile) => tile.getIcon() === "");

      // return if there are no more empty tiles
      if (
        emptyTiles.length !== 0 &&
        !gameFinished(player1, player2).isFinished
      ) {
        // choose random tile from that list
        const randomTile =
          emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

        // wait 3 seconds and then click on that tile
        document.querySelector(".block-input").classList.toggle("hidden");
        await sleep(500);
        randomTile.clicked(player2.getIcon());
        document.querySelector(".block-input").classList.toggle("hidden");

        // update output to the user's name again
        output.textContent = player1.getName();
      }
    } else if (player2.getType() === "ai-hard") {
      console.log("hard");
    }

    // check if game is over
    const roundResult = gameFinished(player1, player2);
    if (roundResult.isFinished) {
      document.querySelector(".block-input").classList.toggle("hidden");
      await sleep(500);
      document.querySelector(".block-input").classList.toggle("hidden");
      stateController.endingMenu(roundResult.result, roundResult.winner);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // check each row/column/diagonal for a winner
  function gameFinished() {
    const icons = tileObjects.map((tile) => tile.getIcon());
    const p1Icon = player1.getIcon();

    // 0 1 2
    // 3 4 5
    // 6 7 8

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

    return { isFinished: false, result: "", winner: null };
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

    // if singleplayer is clicked, hide the player 2 name input
    // and unhide computer input.
    singleplayer.addEventListener("click", () => {
      if (!p2Input.classList.contains("hidden")) {
        p2label.textContent = "Computer Difficulty:";
        p2Input.classList.toggle("hidden");
        computer.classList.toggle("hidden");
      }
    });

    // if multiplayer is clicked, hide the computer input
    // and unhide player 2 name input.
    document.querySelector("#multiplayer").addEventListener("click", () => {
      if (p2Input.classList.contains("hidden")) {
        p2label.textContent = "Player 2 Name:";
        p2Input.classList.toggle("hidden");
        computer.classList.toggle("hidden");
      }
    });

    // when form is submitted determine how many non-computer players there are
    // and then start the game with those players
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
    // provide output depending on the result of the game
    let output = "";
    if (result == "win") output = `The winner is ${player.getName()}!`;
    else if (result == "tie") output = "It was a tie..";
    document.querySelector("#result").textContent = output;

    // switch to the ending menu
    document.querySelector(".game").classList.toggle("hidden");
    document.querySelector(".end").classList.toggle("hidden");

    // reload game if the user wishes to re-start
    document
      .querySelector("#restart-end")
      .addEventListener("click", () => location.reload());
  };

  startMenu();

  return { endingMenu };
})();
