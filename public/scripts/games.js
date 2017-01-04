//Guess value
function GuessNumberGame(input){
  var gameValue = rand(100);

  if(gameValue!=input){
    return "You lose, the value was " + gameValue;
  }
  else{
    return "You win, good job"
  }
}

function rand (n){
     return ( Math.floor(Math.random() * n + 1 ));
}

function displayMessageGuessGame(form){
  var input = document.forms["GameGuess"]["MyInput"].value;
  var output = GuessNumberGame(input);
  document.forms["GameGuess"]["Answer"].value = output;
}

//dice roll
var die = 6;
var dice = 3;
function dice_roll(die, dice) {
var roll = 0;
for (loop=0; loop < dice; loop++) {
roll = roll + Math.round(Math.random()*(die - 1))+1;
}
document.forms["DiceForm"]["text"].value = roll;
}
