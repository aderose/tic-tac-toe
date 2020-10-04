import createTile from "./createTile.js";

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

export default gameBoard;
