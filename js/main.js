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
      boardContainer.appendChild(tileObject.tile);
    });
  }

  return { initialise, render };
})();

const gameController = (function () {
  const tileObjects = gameBoard.initialise();

  // listen for a single click on tile
  tileObjects.forEach((tileObject) =>
    tileObject.tile.addEventListener("click", makeTurn.bind(tileObject), {
      once: true,
    })
  );

  function makeTurn() {
    // work out which player's turn it is
    // set that tile to the players icon
    const playerIcon = "x";
    this.clicked(playerIcon);
    // check if game is over
  }
})();

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
