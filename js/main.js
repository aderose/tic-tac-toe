const gameBoard = (function () {
  const boardContainer = document.querySelector(".gameboard");
  const tiles = ["", "", "", "", "", "", "", "", ""];

  // render the gameBoard
  function render() {
    tiles.forEach(addToBoard);
  }

  // add an individual tile to the board
  function addToBoard(tileValue) {
    boardContainer.appendChild(createTile(tileValue));
  }

  function createTile(tileValue) {
    const tile = document.createElement("div");
    tile.classList.add("tile", "round-border");
    const icon = document.createElement("i");
    if (tileValue === "x") icon.classList.add("fas", "fa-times");
    if (tileValue === "o") icon.classList.add("far", "fa-circle");
    tile.appendChild(icon);
    return tile;
  }

  return { render };
})();

gameBoard.render();
