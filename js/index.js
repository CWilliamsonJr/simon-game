'use strict'

$(document).ready(function() {

  let colorChoice = [0]; // hold the moves of the board
  let roundCounter = 0; // tracks the rounds
  let playerClickCount = 0; // tracks how may moves the player has made
  let blinkPace = 430; // how fast the pc clicks a color,
  let blinkTimeout;
  let errorMade = false;
  const MAX_ROUNDS = 20; // sets the max rounds for the game.

  $("#reset").click((event) => { // resets everything when the button is hit.
    colorChoice = [0];
    roundCounter = 0;
    playerClickCount = 0;
    $(".counter-text").text("00");
    $("#start").trigger("click");
  })
  $(".switch").click(event =>{ // changes the strict mode button
    if(event.target.id === "off"){
      $("#on").removeClass("btn-primary").addClass("btn-default");
      $("#off").removeClass("btn-default").addClass("btn-danger");
    }else{
      $("#on").removeClass("btn-default").addClass("btn-primary");
      $("#off").removeClass("btn-danger").addClass("btn-default");
    }
    })

  $("#start").click((event) => {
    if (playerClickCount >= roundCounter) playerClickCount = 0; // sets the player counter to 0 after every round
    ++roundCounter;
    if (roundCounter < 10) {   // used to display 01 thru 09
      $(".counter-text").text("0" + roundCounter);
    } else {
      $(".counter-text").text(roundCounter);
    }
    colorChoice = ChooseColor(colorChoice);
    PcColorPress(colorChoice, roundCounter, blinkPace);
  });

  $(".colors").click((event) => {
    if(errorMade === true){
      playerClickCount = 1;
    }else{
      ++playerClickCount;
    }
    errorMade = GameBoardClick(event, colorChoice, blinkPace, playerClickCount, roundCounter,MAX_ROUNDS);
  });

})

function ChooseColor(colorChoice) {
  let colorArray = ["red", "green", "blue", "yellow"];
  let colorNum;
  const MIN = 0;
  const MAX = 4
  colorNum = Math.floor(Math.random() * (MAX - MIN));
  colorChoice.push(colorArray[colorNum]);
  return colorChoice;
}

function PcColorPress(colorChoice, roundCounter, blinkPace) {
  let setOpacity;
  let i = 1;
  let printPace = blinkPace * 2;
  blinkPace = 430;
  $("#gameboard").addClass("disabled");
  let colorPrint = setInterval(function() {

    $("#" + colorChoice[i]).toggleClass('blink-text');
     $("#mp3_"+colorChoice[i])[0].play();
    Blink(colorChoice[i], setOpacity, blinkPace);
    ++i;
    if (i > roundCounter) {
      clearTimeout(colorPrint);
      $("#gameboard").removeClass("disabled");
    };
  }, printPace)
}

function Blink(colorChoice, setOpacity, blinkPace) {
  setOpacity = 1;
  setTimeout(function() {
    $("#" + colorChoice).toggleClass('blink-text');
  }, blinkPace);
}

function GameBoardClick(event, colorChoice, blinkPace, playerClick, roundCounter,max_rounds) {
  let blinkTimeout;
  let errorMade = false;
  blinkPace = 300;
  //console.log(event.target.id);
  switch (event.target.id) {
    case "red":
    case "green":
    case "blue":
    case "yellow":
      //console.log(`current player click: ${playerClick} and current round is: ${roundCounter}`);
       $("#mp3_"+event.target.id)[0].play();
      //console.log(`current player clicks is: ${playerClick} current round is ${roundCounter}`);
      if (event.target.id !== colorChoice[playerClick]) {
        errorMade = true;

        $("#gameboard").addClass("disabled");
        blinkTimeout = setInterval(function() {
           $("#wrong").toggleClass("visible");
          $("body").toggleClass("wrong");
          $(".counter-text").toggleClass("blink-text");
          $("#error_txt").toggleClass("error-vis");
        }, blinkPace);
        setTimeout(function() {
          clearInterval(blinkTimeout);
        if($("#on").hasClass("btn-primary")){

          $("#reset").trigger("click");
          $("#gameboard").removeClass("disabled");


        } else{
            PcColorPress(colorChoice, roundCounter, blinkPace);
        }
        }, 2000)
      } else{
          if(playerClick < max_rounds){
            if (playerClick === roundCounter) $("#start").trigger("click");
          }else{

            alert("You Won!!!");
          }
      }

      break;
  }
return errorMade;
}
