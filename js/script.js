//card images array
var cardimages = new Array();
//avaliable cards array
var shuffled_cards = new Array();


for(i = 0; i < 52; i++)
{
	cardimages[i] = new Image();
	cardimages[i].src = 'img/card' + i + ".png";
	cardimages[i].style.height = '100px';
	shuffled_cards[i] = i;
}

//copied from github
function shuffle(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

//shuffle the playing cards!! 
shuffle(shuffled_cards);

//initialize all of the playing cards
var card_values = new Array();
for(i = 0; i < 52; i++)
{
	card_values[i] = ((i%13) > 9)? 10 : (i%13 + 1);
}


var player_score = 0;
var player_score_2 = 0; //to account for aces[-]
var dealer_score = 0;
var dealer_score_2 = 0;

function update_score(player, value)
{
	//for player_score
	if(player == true)
	{
		player_score += value;
		document.getElementById('player_score').innerHTML = player_score;
		if(value == 1)
			player_score_2 = player_score + 10;	
		else if (player_score_2 != 0)
			player_score_2 += value;
		if(player_score_2 != 0)
			document.getElementById('player_score').innerHTML = player_score + " / " + player_score_2;
		return;
	}
	dealer_score += value;
	document.getElementById('dealer_score').innerHTML = dealer_score;
	if(value == 1)
		dealer_score_2 = dealer_score + 10;
	else if (dealer_score_2 != 0)
		dealer_score_2 += value;
	if(dealer_score_2 != 0)
		document.getElementById('dealer_score').innerHTML = dealer_score + " / " + dealer_score_2;

	return;
}
//id correlates to dealer or player row
//element correlates to which card is being added in the row
function add_card(id)
{

		var element = shuffled_cards.pop();
		if(id == 'dealer_row')
			update_score(false, card_values[element]);
		else 
			update_score(true, card_values[element]);
		
		var canvas = document.createElement('canvas');
        div = document.getElementById(id); 
        canvas.id     = id + "_card_" + element ; //format follows: dealer_row_card_0
        canvas.width  = 70;
        canvas.height = 100;

        var ctx = canvas.getContext("2d");
        var img = cardimages[element];

        ctx.drawImage(img, 0, 0);
        div.appendChild(canvas);
}

var player_done = false;
function evaluate()
{
	if(player_score > 21)
	{
		alert('you lose!');
		document.getElementById("hit").disabled = true;
		return;
	}
	else if(player_score == 21 || player_score_2 == 21 || dealer_score > 21)
	{
		alert('you win!');
		document.getElementById("hit").disabled = true;
		return;
	}
	else if (player_done 
			&& ((dealer_score <= 21 && dealer_score > player_score)
				|| (dealer_score_2 <= 21 && dealer_score_2 > player_score)))
	{
		alert('you lose!');
		document.getElementById("hit").disabled = true;
		player_done = false;
		return;
	}
}

function start_game()
{
	add_card('dealer_row');
	add_card('player_row');
	add_card('player_row');
	evaluate();
}


window.onload = function(){
	start_game();
}

document.getElementById("hit").onclick = function(){
	add_card('player_row');
	evaluate();
}

document.getElementById("stand").onclick = function()
{
	player_done = true;
	player_score = Math.max(player_score, (player_score_2 > 0 && player_score_2 < 21) ? player_score_2 : 0);
	while(player_done
		&& dealer_score < 21 
		&& dealer_score <= player_score 
		&& ((player_score_2 != 0 && player_score_2 < 21) ? dealer_score < player_score_2 :1))
	{
		add_card('dealer_row');
		evaluate();
	}
}

