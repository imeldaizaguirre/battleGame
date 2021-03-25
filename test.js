let squares = document.querySelectorAll(".board__square");
let squaresArray = Array.from(squares);
let board = document.querySelector(".board");
let player1WeaponContainer = document.querySelector('.board__player .board__weapon__current__image span');
let opponentWeaponContainer = document.querySelector('.board__opponent .board__weapon__current__image span');
const emptySquare = [];
const unavailableSquare = [];
let currentPlayer = null;
let hasClicked = false;

let playerStyles =`
        width:70px;
        height:70px;
        objectContain:contain;
        display:block;
        margin:0 auto;
    `

const offenseWeapons = [
    {name: 'yoda', power: 25, img: "weapon1.png"},
    {name:'light saber', power: 25, img: "weapon2.png"},
    {name: 'spaceship', power: 25 , img:"weapon3.png"},
    {name: 'robot', power:25 , img:"robot2.png"}
];

let weaponStyles =  `
    width:70px;
    height:70px;
    object-fit:cover;
    display:block;
    margin:0 auto;
    `
let nextMoveStyles = `
    width:70px;
    height:70px;
    object-contain:contain;
    display:block;
    margin:0 auto;
    `

//player object schema
function Player(name, position, image, possibleMoves, defaultWeapon, startingPositionId = null) {
    this.name = name,
    this.position = position,
    this.image = image,
    this.possibleMoves = possibleMoves,
    this.defaultWeapon = defaultWeapon,
    this.startingPositionId = startingPositionId
    };

let player1 = new Player('player', null,'player.png', [], "images/defaultWeapon.png");
let player2 = new Player('opponent', null,'opponent.png', [], "images/defaultWeapon.png");
currentPlayer = player1;

//randomly generate the game map.
const randomBoard = () =>{
    squaresArray.forEach((square, index) => {
        setTimeout( () => {
            square.style.visibility = "visible";
        }, index * 50)
    })
    displayRandomWeapons();
}
//randomly display weapons
function  displayRandomWeapons() {
    setTimeout( () => {
        let randomNum = [];
        offenseWeapons.forEach( (weapon) =>{
            let grabRandomSquare = Math.floor(Math.random() * squaresArray.length);
            while(randomNum.includes(grabRandomSquare)) {
                grabRandomSquare = Math.floor(Math.random() * squaresArray.length);
                let displayWeapon = squaresArray[grabRandomSquare];
                //create an element
                let weaponElement = document.createElement("img");
                weaponElement.style = weaponStyles;
                weaponElement.src = `images/${weapon.img}`;
                displayWeapon.appendChild(weaponElement);     
            }
            randomNum.push(grabRandomSquare);
            let displayWeapon = squaresArray[grabRandomSquare];
            //create an element
            let weaponElement = document.createElement("img");
            weaponElement.style = weaponStyles;
            weaponElement.src = `images/${weapon.img}`;
            displayWeapon.appendChild(weaponElement);           
        })
        obstacles();
    }, squaresArray.length * 50)
}
//set unavailable obstacle squares squares 
const obstacles = (element) => {
    let dimmed = 0;
    while(dimmed <= 12) {
        let randomPosition = Math.floor(Math.random() * squaresArray.length);
        let square = squaresArray[randomPosition];
        if(square.children.length === 0){
            square.style.backgroundColor = "rgb(247, 202, 1)";
            dimmed++;           
        } 
    }
    setAvailability();
}

const setAvailability = () => {
    squaresArray.map(square => {
        if(square.childNodes.length !==0){
            let foundImage = square.childNodes[0].tagName;
            if(foundImage === "IMG"){
                let imageSrc = square.childNodes[0].getAttribute('src');
                if(imageSrc === 'images/player.png'){
                    unavailableSquare.push(square);
                }else if(imageSrc === 'images/opponent.png') {
                    unavailableSquare.push(square);
                }else {emptySquare.push(square)}
            }
    }
    if(square.children.length === 0 & square.style.backgroundColor !== "rgb(247, 202, 1)") (emptySquare.push(square));
    if(square.style.backgroundColor === "gb(247, 202, 1)") (unavailableSquare.push(square));
    });
}

//startGame
const startGame = () => {
    let button = document.querySelector(".start__game__button")
    setPlayer(player1);
    setPlayer(player2); 
    highlight();
    startGame ? button.style.pointerEvents = 'none' : button.style.cursor = "pointer"
}

// highlight moves
const highlight = () => {
    currentPlayer.possibleMoves.map(possibleMove => { 
    let position = squaresArray[possibleMove -1];
    position.style.backgroundColor = "rgba(172,183,166,0.7)"; //yoda green color
    })
}

//clearhighlight and possibleMoves
const clearHighlight = () => {
    currentPlayer.possibleMoves.map(possibleMove => {
        let position = squaresArray[possibleMove -1];
        position.style.backgroundColor = "rgba(204, 255, 204, 0.2)";
    })
}

//listen for next move
const nextMove = (e) => {
    debugger
    e.preventDefault();
    let boxClicked = e.path[0].src ? e.path[1] : e.path[0];
    let oldPosition = currentPlayer.position;
    if(currentPlayer.possibleMoves.includes(parseInt(boxClicked.id))) {
        //if weapon remove it
        if(boxClicked.children.length !== 0) (boxClicked.removeChild(boxClicked.childNodes[0]));
       //remove the player from current position 
       oldPosition.removeChild(oldPosition.childNodes[0])
        let createNewMove = document.createElement("img");
        createNewMove.src = `images/${currentPlayer.image}`;
        let newPosition = boxClicked.appendChild(createNewMove);
        createNewMove.style = nextMoveStyles;
        emptySquare.push(oldPosition);
        currentPlayer.position = boxClicked;
        getWeapon(e,currentPlayer,oldPosition)
        setAvailability();
        clearHighlight();
        currentPlayer.possibleMoves = [];
        if(currentPlayer === player1) {
            currentPlayer = player2;
            setPlayerPossibleMoves(currentPlayer);    
        } else {
            currentPlayer = player1;
            setPlayerPossibleMoves(currentPlayer);
        } 
        console.log("this is end of the if statement")       
    } else {
        boxClicked.style.pointerEvents = "none"
        console.log("this is the end of the else statement")
    }
    console.log("I clicked you box", boxClicked);   
}

//click event listener
for(var i = 0; i < squaresArray.length -1; i++){
squaresArray[i].addEventListener('click', function (e) {
    nextMove(e);
});
}

const findNewPlayerPosition = (player) =>{
    let position = Math.floor(Math.random() * emptySquare.length);
    player.startingPositionId = position
    if(player !== currentPlayer){  
        if(currentPlayer.possibleMoves.find(move =>  move === parseInt(emptySquare[position].id, 10))){
            findNewPlayerPosition(player);
        } 
    }
    return player.startingPositionId;
}

//set Players 
const setPlayer= (player) =>{
    position = findNewPlayerPosition(player);
    let box = emptySquare[position];
    player.position = box;
    let displayImage  = document.createElement("img");
    displayImage.src = `images/${player.image}`;
    displayImage.style = playerStyles;
    box.appendChild(displayImage);
    unavailableSquare.push(emptySquare[position]);
    emptySquare.splice(position, 1);
    setPlayerPossibleMoves(player);
}



const setPlayerPossibleMoves = (player) => {
    const position = parseInt(player.position.id);
    //move right
    if(position % 9 === 0 ) {
        player.possibleMoves.push(position)
    }else if (position % 9 === 8){
        if(emptySquare.find(square => parseInt(square.id) === (position + 1))) player.possibleMoves.push(position + 1) 
    }else if (position % 9 === 7 ) {
        if(emptySquare.find(square => parseInt(square.id) === (position + 1))) {
            player.possibleMoves.push(position + 1)
            if(emptySquare.find(square => parseInt(square.id) === (position + 2))) player.possibleMoves.push(position + 2)
        }
    } else { 
        if(emptySquare.find(square => parseInt(square.id) === (position + 1))) {
            player.possibleMoves.push(position + 1)
            if(emptySquare.find(square => parseInt(square.id) === (position + 2))) {
                player.possibleMoves.push(position + 2) 
                if(emptySquare.find(square => parseInt(square.id) === (position + 3))) player.possibleMoves.push(position + 3)  
            }
        }    
    }   
    //move left
    if(position % 9 === 1 ) {
        player.possibleMoves.push(position);
    } else if(position % 9 === 2){
        if(emptySquare.find(square => parseInt(square.id) === (position - 1)))player.possibleMoves.push(position - 1)
    } else if(position % 9 === 3){
        if(emptySquare.find(square => parseInt(square.id) === (position - 1))) {
            player.possibleMoves.push(position - 1)
            if(emptySquare.find(square => parseInt(square.id) === (position - 2)))  player.possibleMoves.push(position - 2)           
        }         
    } 
    else {
        if(emptySquare.find(square => parseInt(square.id) === (position - 1))) {
            player.possibleMoves.push(position - 1)
            if(emptySquare.find(square => parseInt(square.id) === (position - 2))) {
                player.possibleMoves.push(position - 2)
                if(emptySquare.find(square => parseInt(square.id) === (position - 3))) player.possibleMoves.push(position - 3)
            }
        }
    }
    //move down
    if(emptySquare.find(square => parseInt(square.id) === (position + 9)) && position + 9 <= 71) {
        player.possibleMoves.push(position + 9);
        if(emptySquare.find(square => parseInt(square.id) === (position + 18)) && position + 18 <= 71) {
            player.possibleMoves.push(position + 18)
            if(emptySquare.find(square => parseInt(square.id) === (position + 27)) && position + 27 <= 71) player.possibleMoves.push(position + 27)
        }
    } 
    //move up
    if(emptySquare.find(square => parseInt(square.id) === (position - 9)) && position - 9 >= 0) {
        player.possibleMoves.push(position - 9)
        if(emptySquare.find(square => parseInt(square.id) === (position - 18)) && position - 18 >= 0){
            player.possibleMoves.push(position - 18)
            if(emptySquare.find(square => parseInt(square.id) === (position - 27)) && position - 27 >= 0) player.possibleMoves.push(position - 27)
        } 
    }
    highlight();
}

const getWeapon = (e,currentPlayer, oldPosition) => {
    let lastPosition = oldPosition;
    let currentWeapon;
    let foundWeaponOnBox = e.path[0].src;
    //remove any weapon in old position
    while (oldPosition.firstChild) {
        oldPosition.removeChild(oldPosition.firstChild);
    }
    if(foundWeaponOnBox) {
            if(foundWeaponOnBox.includes('http')) {
                let splitUrl = foundWeaponOnBox.split('images');
                let createNewUrl = `images${splitUrl[1]}`;
                currentWeapon = createNewUrl;               
            } 
    } else {
        currentWeapon = foundWeaponOnBox;       
    }
//replace image on dashboard for each player
    if(foundWeaponOnBox && currentPlayer === player1) { 
        let oldWeapon = player1WeaponContainer.children[0].src;
        while (player1WeaponContainer.firstChild) {
            player1WeaponContainer.removeChild(player1WeaponContainer.firstChild);
        }
        let addWeaponToDashboard = document.createElement('img');
        addWeaponToDashboard.setAttribute('src', currentWeapon);
        player1WeaponContainer.appendChild(addWeaponToDashboard);
        //add default weapon to players old position
        let addPreviousWeapon = document.createElement('img');
        addPreviousWeapon.setAttribute('src', oldWeapon);
        oldPosition.appendChild(addPreviousWeapon);
        addPreviousWeapon.style.height = "50px"; 
        addPreviousWeapon.style.width= "50px";
        addPreviousWeapon.style.alignItems = "center";
        //reset value of oldweapon
        oldWeapon = currentWeapon;
    }
    if (foundWeaponOnBox && currentPlayer === player2) {
        let oldWeapon = opponentWeaponContainer.children[0].src;
        while (opponentWeaponContainer.firstChild) {
            opponentWeaponContainer.removeChild(opponentWeaponContainer.firstChild);
        }        
        let addWeaponToDashboard = document.createElement('img');
        addWeaponToDashboard.setAttribute('src', currentWeapon)
        opponentWeaponContainer.appendChild(addWeaponToDashboard);
        //add default weapon to players old position
        let addPreviousWeapon = document.createElement('img');
        addPreviousWeapon.setAttribute('src', oldWeapon);
        oldPosition.appendChild(addPreviousWeapon);
        addPreviousWeapon.style.height = "50px"; 
        addPreviousWeapon.style.width= "50px"; 
        //reset value of oldweapon
        oldWeapon = currentWeapon;
    } 
}


//there should be two players
//each box should be empty or unavailable ✅
//create 4 weapons that appear randomly    ✅     
// weapons can be collected by players who pass through them ✅
//create 4 weapons ✅
//each weapon should have a name and a visual ✅
//each weapon with different damage inflicted ✅
//default weapon should inflict 10pts of damage ✅
//the placement of the two players should be randomly ✅
//For each turn, a player can move from one to three boxes from the available boxes ✅
// If a player passes over a box containing a weapon, they leave their current weapon on site and replace it with the new one. ✅