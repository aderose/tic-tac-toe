const gameBoard = (function () {
  const boardContainer = document.querySelector(".gameboard");
  const tileObjects = [];
  const BOARD_SIZE = 9;

  // initialise the game board with empty tiles
  function initialise() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      tileObjects[i] = createTile();
    }
    render();
    return tileObjects;
  }

  // render the gameBoard
  function render() {
    tileObjects.forEach((tileObject) => {
      tileObject.update();
      tileObject.render(boardContainer);
    });
  }

  return { initialise, render };
})();

const gameController = (function () {
  const tileObjects = gameBoard.initialise();

  // get input from player on what game type to play
  // singleplayer/multiplayer
  // make players

  // game running
  // listen for a single click on tile
  tileObjects.forEach((tileObject) =>
    tileObject.tile.addEventListener("click", makeTurn.bind(tileObject), {
      once: true,
    })
  );

  function makeTurn() {
    // work out which player's turn it is
    // set that tile to the players icon
    this.setIcon("x");
    // check if game is over
  }
})();

// create a tile object for the given tilevalue
function createTile() {
  let value = "";
  const tile = document.createElement("div");
  tile.classList.add("tile", "round-border", "clickable");
  const icon = document.createElement("i");

  // set icon and prevent the tile from being clicked & update icon
  const setIcon = (tileValue) => {
    value = tileValue;
    tile.classList.remove("clickable");
    update();
  };

  const getIcon = () => value;

  const update = () => {
    if (value === "x") icon.classList.add("fas", "fa-times");
    if (value === "o") icon.classList.add("far", "fa-circle");
  };

  const render = (board) => {
    board.appendChild(tile);
  };

  tile.appendChild(icon);
  return { tile, setIcon, getIcon, update, render };
}
