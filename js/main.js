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
    // work out which player's turn it is

    // set that tile to the players icon
    this.clicked(++moves % 2 === 0 ? player1 : player2);
    // check if game is over
  }

  function gameFinished() {}

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
