const gameBoard = (function () {
  const boardContainer = document.querySelector(".gameboard");
  const tileValues = ["x", "x", "o", "o", "x", "o", "o", "x", "o"];
  const tiles = [];

  // render the gameBoard
  function render() {
    tileValues.forEach((tileValue, index) => {
      addToBoard(tileValue, index);
    });
  }

  // add an individual tile to the board
  function addToBoard(tileValue, tileIndex) {
    tiles[tileIndex] = createTile(tileValue);
    boardContainer.appendChild(tiles[tileIndex]);
  }

  // create a tile object for the given tilevalue
  function createTile(tileValue) {
    const tile = document.createElement("div");
    tile.classList.add("tile", "round-border");
    const icon = document.createElement("i");
    if (tileValue === "x") icon.classList.add("fas", "fa-times");
    if (tileValue === "o") icon.classList.add("far", "fa-circle");
    tile.appendChild(icon);
    return tile;
  }

  return { tileValues, tiles, render };
})();

const gameController = (function () {
  gameBoard.render();

  const tiles = gameBoard.tiles;
  const tileValues = gameBoard.tileValues;

  // listen for click on tile
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => {
      console.log("Clicked: " + tileValues[index]);
    });
  });
})();
