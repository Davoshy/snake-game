document.addEventListener("DOMContentLoaded", () => {
  const squares = document.querySelectorAll(".grid div");
  const scoreDisplay = document.querySelector(".score-display");
  const startBtn = document.querySelector(".start");
  const newHighscore = document.querySelector(".new-highscore");
  const highscoreDisplay = document.querySelector(".highscore-display");

  //choose difficulty
  function getSelectedDiff() {
    let diff = document.getElementById("difficulty");
    let choosenDiff = diff.options[diff.selectedIndex].value;
    return choosenDiff;
  }

  const width = 20;
  let currentIndex = 380; //so first div in our grid
  let appleIndex = 212; //so first div in our grid
  let currentSnake = [384, 383, 382, 381, 380]; //starting snake 3divs indexes, 382 = Head
  let direction = 1;
  let difficulty = 1;
  let score = 0;
  let intervalTime = 0;
  let interval = 0;
  let highscore = 0;

  //setup starting screen
  currentSnake.forEach(index => squares[index].classList.add("snake"));
  squares[appleIndex].classList.add("apple");

  //to start, and restart the game
  function startGame() {
    difficulty = getSelectedDiff();
    currentSnake.forEach(index => squares[index].classList.remove("snake"));
    squares[appleIndex].classList.remove("apple");
    newHighscore.classList.remove("show");
    clearInterval(interval);
    appleIndex = 212;
    squares[appleIndex].classList.add("apple");
    score = 0;
    direction = 1;
    scoreDisplay.innerText = score;
    intervalTime = 1000 * (1 - difficulty * 0.1);
    currentSnake = [384, 383, 382, 381, 380];
    currentIndex = 380;
    currentSnake.forEach(index => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcomes, intervalTime);
  }

  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {
    //deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= width * width && direction === width) || //if snake hits bottom
      (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) || //if snake hits the top
      squares[currentSnake[0] + direction].classList.contains("snake") //if snake goes into itself
    ) {
      let endresult = score * difficulty;
      if (endresult > highscore) {
        highscore = endresult;
        highscoreDisplay.innerText = highscore;
        newHighscore.classList.add("show");
      }

      alert(`Game Over! Your Score: ${endresult}`);
      return clearInterval(interval); //this will clear the interval if any of the above happen
    }

    const tail = currentSnake.pop(); //removes last ite of the array and shows it
    squares[tail].classList.remove("snake"); //removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + direction); //gives direction to the head of the array

    //deals with snake getting apple
    if (squares[currentSnake[0]].classList.contains("apple")) {
      squares[currentSnake[0]].classList.remove("apple");
      squares[tail].classList.add("snake");
      currentSnake.push(tail);
      randomApple();
      score++;
      scoreDisplay.textContent = score * difficulty;
      clearInterval(interval);
      interval = setInterval(moveOutcomes, intervalTime);
    }
    squares[currentSnake[0]].classList.add("snake");
  }

  //generate new apple once apple is eaten
  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake")); //making sure apples dont appear on the snake
    squares[appleIndex].classList.add("apple");
  }

  //assign functions to keycodes
  function control(e) {
    squares[currentIndex].classList.remove("snake"); //we are removing the class of snake from ALL the squares.

    if (e.keyCode === 39) {
      // right arrow key
      if (direction == -1) {
        //if snake is moving left, don't change direction to right
        direction = -1;
      } else {
        direction = 1; //move right by select next div in order
      }
    } else if (e.keyCode === 38) {
      //up arrow key
      if (direction == width) {
        //if snake is moving down, don't change direction to up
        direction = width;
      } else {
        direction = -width; //move up by select above div (-20)
      }
    } else if (e.keyCode === 37) {
      if (direction == 1) {
        direction = 1;
      } else {
        direction = -1; //left, -1 div
      }
    } else if (e.keyCode === 40) {
      if (direction == -width) {
        direction = -width;
      } else {
        direction = +width; //press down, +10div
      }
    }
  }

  document.addEventListener("keyup", control);
  startBtn.addEventListener("click", startGame);
});
