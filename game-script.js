// Sound initialization
const snakeChangingDirectionSound = new Audio("snake-changing-direction.wav");
const snakeAteFoodSound = new Audio("snake-ate-food-sound.mp3");
const gameEndSound = new Audio("game-end-sound.mp3");

// HTML elements initialization
const gridContainer = document.querySelector("#grid-container");
const scoreCard = document.querySelector("#score-card");

// Grid cell size calculation
const gridSize = 20;
const cellSize =
  Math.min(gridContainer.offsetHeight, gridContainer.offsetWidth) / gridSize;
const numColumns = Math.floor(gridContainer.offsetWidth / cellSize);
const numRows = Math.floor(gridContainer.offsetHeight / cellSize);
gridContainer.style.gridTemplateRows = `repeat(${numRows}, ${cellSize}px)`;
gridContainer.style.gridTemplateColumns = `repeat(${numColumns}, ${cellSize}px)`;

// Other constants
let coordinatesOfSnake = [{ x: 1, y: 1 }];
let directionOfMovement = { x: 0, y: 1 }; // initially, the direction of movement will be to the right
const topButton = document.querySelector("#top");
const leftButton = document.querySelector("#left");
const rightButton = document.querySelector("#right");
const downButton = document.querySelector("#down");
let score = 0;
let setToStoreCurrentCoordinatesOfSnake = new Set();
setToStoreCurrentCoordinatesOfSnake.add(1);
let coordinatesOfFoodPlaced = { x: -1, y: -1 };
let foodElement = document.createElement("div");
let lastScreenRepaintTime = 0;
let speedOfSnake = localStorage.getItem("speedOfSnake");
let eventHandlerOngoing = false;
let gameEnd = false;

// Event handlers
// 1. Keyboard event handlers
document.addEventListener("keydown", function (event) {
  if (!gameEnd) {
    const charKeyPressed = event.key.toLowerCase();
    if (directionOfMovement.y == 0) {
      if (event.key === "ArrowLeft" || charKeyPressed === "a") {
        eventHandlerOngoing = true;
        directionOfMovement = { x: 0, y: -1 };
        snakeChangingDirectionSound.play();
        checkWhetherSnakeAteFood();
        updateCoordinatesOfSnakeAndSet();
        eventHandlerOngoing = false;
      } else if (event.key === "ArrowRight" || charKeyPressed === "d") {
        eventHandlerOngoing = true;
        directionOfMovement = { x: 0, y: 1 };
        snakeChangingDirectionSound.play();
        checkWhetherSnakeAteFood();
        updateCoordinatesOfSnakeAndSet();
        eventHandlerOngoing = false;
      }
    }
    if (directionOfMovement.x == 0) {
      if (event.key === "ArrowUp" || charKeyPressed === "w") {
        eventHandlerOngoing = true;
        directionOfMovement = { x: -1, y: 0 };
        snakeChangingDirectionSound.play();
        checkWhetherSnakeAteFood();
        updateCoordinatesOfSnakeAndSet();
        eventHandlerOngoing = false;
      } else if (event.key === "ArrowDown" || charKeyPressed === "s") {
        eventHandlerOngoing = true;
        directionOfMovement = { x: 1, y: 0 };
        snakeChangingDirectionSound.play();
        checkWhetherSnakeAteFood();
        updateCoordinatesOfSnakeAndSet();
        eventHandlerOngoing = false;
      }
    }
  }
});

// 2. Click event handlers
topButton.addEventListener("click", () => {
  if (!gameEnd) {
    if (directionOfMovement.x == 0) {
      eventHandlerOngoing = true;
      directionOfMovement = { x: -1, y: 0 };
      snakeChangingDirectionSound.play();
      checkWhetherSnakeAteFood();
      updateCoordinatesOfSnakeAndSet();
      eventHandlerOngoing = false;
    }
  }
});
leftButton.addEventListener("click", () => {
  if (!gameEnd) {
    if (directionOfMovement.y == 0) {
      eventHandlerOngoing = true;
      directionOfMovement = { x: 0, y: -1 };
      snakeChangingDirectionSound.play();
      checkWhetherSnakeAteFood();
      updateCoordinatesOfSnakeAndSet();
      eventHandlerOngoing = false;
    }
  }
});
rightButton.addEventListener("click", () => {
  if (!gameEnd) {
    if (directionOfMovement.y == 0) {
      eventHandlerOngoing = true;
      directionOfMovement = { x: 0, y: 1 };
      snakeChangingDirectionSound.play();
      checkWhetherSnakeAteFood();
      updateCoordinatesOfSnakeAndSet();
      eventHandlerOngoing = false;
    }
  }
});
downButton.addEventListener("click", () => {
  if (!gameEnd) {
    if (directionOfMovement.x == 0) {
      eventHandlerOngoing = true;
      directionOfMovement = { x: 1, y: 0 };
      snakeChangingDirectionSound.play();
      checkWhetherSnakeAteFood();
      updateCoordinatesOfSnakeAndSet();
      eventHandlerOngoing = false;
    }
  }
});

// Display snake in the grid
function displaySnakeInTheGrid() {
  const snakeHead = document.createElement("div");
  snakeHead.style.gridRowStart = coordinatesOfSnake[0].x;
  snakeHead.style.gridColumnStart = coordinatesOfSnake[0].y;
  snakeHead.classList.add("snake-head");
  gridContainer.appendChild(snakeHead);

  for (let i = 1; i < coordinatesOfSnake.length; i++) {
    const snakeBodyElement = document.createElement("div");
    snakeBodyElement.style.gridRowStart = coordinatesOfSnake[i].x;
    snakeBodyElement.style.gridColumnStart = coordinatesOfSnake[i].y;
    snakeBodyElement.classList.add("snake-body");
    gridContainer.appendChild(snakeBodyElement);
  }
}

// Place food in the grid
function generateNewFoodElement() {
  while (true) {
    let randomNum = Math.floor(Math.random() * numRows * numColumns) + 1;
    if (setToStoreCurrentCoordinatesOfSnake.has(randomNum)) {
      continue;
    }
    if (randomNum % numColumns === 0) {
      coordinatesOfFoodPlaced.x = randomNum / numColumns;
      coordinatesOfFoodPlaced.y = numColumns;
    } else {
      coordinatesOfFoodPlaced.x = Math.floor(randomNum / numColumns) + 1;
      coordinatesOfFoodPlaced.y = randomNum % numColumns;
    }
    break;
  }
}

function displayFoodInTheGrid() {
  foodElement.style.gridRowStart = coordinatesOfFoodPlaced.x;
  foodElement.style.gridColumnStart = coordinatesOfFoodPlaced.y;
  foodElement.classList.add("food");
  gridContainer.appendChild(foodElement);
}

// Check whether snake ate food
function checkWhetherSnakeAteFood() {
  if (
    coordinatesOfSnake[0].x === coordinatesOfFoodPlaced.x &&
    coordinatesOfSnake[0].y === coordinatesOfFoodPlaced.y
  ) {
    snakeAteFoodSound.play();
    gridContainer.removeChild(foodElement);
    score++;
    scoreCard.innerHTML = score;
    let new_x_coordinateOfSnakeHead =
      coordinatesOfSnake[0].x + directionOfMovement.x;
    let new_y_coordinateOfSnakeHead =
      coordinatesOfSnake[0].y + directionOfMovement.y;
    if (
      new_x_coordinateOfSnakeHead === 0 ||
      new_x_coordinateOfSnakeHead === numRows + 1 ||
      new_y_coordinateOfSnakeHead === 0 ||
      new_y_coordinateOfSnakeHead === numColumns + 1 ||
      setToStoreCurrentCoordinatesOfSnake.has(
        (new_x_coordinateOfSnakeHead - 1) * numColumns +
          new_y_coordinateOfSnakeHead
      )
    ) {
      gameEnd = true;
      localStorage.setItem("totalScore", score);
      gameEndSound.play();
      const snakeHeadElement = document.querySelector(".snake-head");
      snakeHeadElement.classList.add("animation-effect");
      setTimeout(() => window.location.replace("lastPage.html"), 2000);
      throw new Error("Game END!!");
    }
    const newCoordinate = {
      x: new_x_coordinateOfSnakeHead,
      y: new_y_coordinateOfSnakeHead,
    };
    coordinatesOfSnake.splice(0, 0, newCoordinate);
    setToStoreCurrentCoordinatesOfSnake.add(
      (coordinatesOfSnake[0].x - 1) * numColumns + coordinatesOfSnake[0].y
    );
    generateNewFoodElement();
  }
}

// Update coordinates of snake and set
function updateCoordinatesOfSnakeAndSet() {
  let new_x_coordinateOfSnakeHead =
    coordinatesOfSnake[0].x + directionOfMovement.x;
  let new_y_coordinateOfSnakeHead =
    coordinatesOfSnake[0].y + directionOfMovement.y;
  if (
    new_x_coordinateOfSnakeHead === 0 ||
    new_x_coordinateOfSnakeHead === numRows + 1 ||
    new_y_coordinateOfSnakeHead === 0 ||
    new_y_coordinateOfSnakeHead === numColumns + 1 ||
    setToStoreCurrentCoordinatesOfSnake.has(
      (new_x_coordinateOfSnakeHead - 1) * numColumns +
        new_y_coordinateOfSnakeHead
    )
  ) {
    gameEnd = true;
    localStorage.setItem("totalScore", score);
    gameEndSound.play();
    const snakeHeadElement = document.querySelector(".snake-head");
    snakeHeadElement.classList.add("animation-effect");
    setTimeout(() => window.location.replace("lastPage.html"), 2000);
    throw new Error("Game END!!");
  }
  setToStoreCurrentCoordinatesOfSnake.clear();

  for (let i = coordinatesOfSnake.length - 2; i >= 0; i--) {
    coordinatesOfSnake[i + 1] = { ...coordinatesOfSnake[i] };
    setToStoreCurrentCoordinatesOfSnake.add(
      (coordinatesOfSnake[i + 1].x - 1) * numColumns +
        coordinatesOfSnake[i + 1].y
    );
  }

  coordinatesOfSnake[0] = {
    x: coordinatesOfSnake[0].x + directionOfMovement.x,
    y: coordinatesOfSnake[0].y + directionOfMovement.y,
  };
  setToStoreCurrentCoordinatesOfSnake.add(
    (coordinatesOfSnake[0].x - 1) * numColumns + coordinatesOfSnake[0].y
  );
}

// Algorithm
// 1. Display snake in the grid - displaySnakeInTheGrid()
// 2. Check for game end - checkGameEnd()
// 3. Generate new food element in the grid, IF REQUIRED - generateNewFoodElement()
// 4. Display food in the grid - displayFoodInTheGrid()
// 5. Check whether snake ate food - checkWhetherSnakeAteFood()
// 6. Update the coordinates of the snake and the set having the snake coordinates - updateCoordinatesOfSnakeAndSet()

function gameLogic() {
  gridContainer.innerHTML = "";
  displaySnakeInTheGrid();
  displayFoodInTheGrid();
  if (!eventHandlerOngoing && !gameEnd) {
    checkWhetherSnakeAteFood();
    updateCoordinatesOfSnakeAndSet();
  }
}

function main(currentTime) {
  window.requestAnimationFrame(main);
  if (currentTime - lastScreenRepaintTime < 1000 / speedOfSnake) {
    return;
  }
  lastScreenRepaintTime = currentTime;
  gameLogic();
}
generateNewFoodElement();
window.requestAnimationFrame(main);