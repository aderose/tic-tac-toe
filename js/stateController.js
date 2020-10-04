import gameController from "./gameController.js";
import createPlayer from "./createPlayer.js";

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

export default stateController;
