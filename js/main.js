const gameBoard = (function (boardContainer) {
  const tileObjects = Array.from({ length: 9 }, () => createTile());

  // render the gameBoard
  function render() {
    tileObjects.forEach((tileObject) => {
      tileObject.update();
      boardContainer.appendChild(tileObject.tile);
    });
  }

  return { tileObjects, render };
})(document.querySelector(".gameboard"));

const gameController = (function ({ player1, player2 }) {
  gameBoard.render();
  const tileObjects = gameBoard.tileObjects;

  // listen for a single click on tile
  tileObjects.forEach((tileObject) =>
    tileObject.tile.addEventListener("click", makeTurn.bind(tileObject), {
      once: true,
    })
  );

  function makeTurn() {
    // work out which player's turn it is
    // set that tile to the players icon
    this.clicked(player1);
    // check if game is over
  }
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
