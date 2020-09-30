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

const gameController = (function ({ player1, player2 }) {
  const tileObjects = gameBoard.tileObjects;

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
    const currentPlayer = ++moves % 2 === 0 ? player1 : player2;

    // update tile that the player clicked on
    this.clicked(currentPlayer);
    // check if game is over
    if (gameFinished()) console.log(`Winner is ${currentPlayer}`);
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
      )
        return true;
    }

    if (
      // major diagonal
      (tiles[0] == tiles[4] && tiles[4] == tiles[8] && tiles[0] != "") ||
      // minor diagonal
      (tiles[2] == tiles[4] && tiles[4] == tiles[6] && tiles[2] != "")
    )
      return true;

    return false;
  }

  return { playGame };
})({ player1: "x", player2: "o" });

// create a tile object for the given tilevalue
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

gameController.playGame();
