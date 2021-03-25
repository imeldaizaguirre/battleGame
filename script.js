let squares = document.querySelectorAll(".board__square");
let squaresArray = Array.from(squares);
let board = document.querySelector(".board");
let player1WeaponContainer = document.querySelector('.board__player .board__weapon__current__image span');
let opponentWeaponContainer = document.querySelector('.board__opponent .board__weapon__current__image span');
let gameOverText = document.querySelector('.header__heading__title');
let playersBoard = document.querySelector('.board__players');
let playerImages = document.querySelector('.board__players__images');
let player1lifePointsDisplay = document.querySelector('.board__player__highestPoint')
let opponent1lifePointsDisplay = document.querySelector('.board__opponent__highestPoint')
let playAgainButton = document.querySelector('.playAgainButton'); 
let playerScoreCard = document.querySelector('.board__player__score__card')
let opponentScoreCard = document.querySelector('.board__opponent__score__card:after')


const emptySquare = []; 
const unavailableSquare = [];
let currentPlayer = null;
let hasClicked = false;
let firstFight = false;

let playerStyles = `
        width:40px;
        height:40px;
        objectContain:contain;
        display:block;
        margin:0 auto;
    `

const offenseWeapons = [
    {name: 'yoda', power: 25, img: "weapon1.png", position: null},
    {name:'light saber', power: 25, img: "weapon2.png", position: null},
    {name: 'spaceship', power: 25 , img:"weapon3.png", position: null},
    {name: 'robot', power:25 , img:"robot2.png", position: null}
];

let weaponStyles =  `
    width:40px;
    height:40px;
    object-fit:cover;
    display:block;
    margin:0 auto;
    `
let nextMoveStyles = `
    width:40px;
    height:40px;
    object-contain:contain;
    display:block;
    margin:0 auto;
    `
//player object schema
function Player(name, position, image, possibleMoves, defaultWeapon, startingPositionId = null, lifeScore) {
    this.name = name,
    this.position = position,
    this.image = image,
    this.possibleMoves = possibleMoves,
    this.defaultWeapon = defaultWeapon,
    this.startingPositionId = startingPositionId,
    this.lifeScore = lifeScore
    };

let player1 = new Player('Ray', null,'player.png', [], "images/defaultWeapon.png");
let player2 = new Player('Kylo', null,'opponent.png', [], "images/defaultWeapon.png");
currentPlayer = player1;

//randomly generate the game map.
const randomBoard = () =>{
    squaresArray.forEach((square, index) => {
            square.style.visibility = "visible";
    })
    displayRandomWeapons();
}
//randomly display weapons
let randomNum = [];
function  displayRandomWeapons() {
        offenseWeapons.forEach( (weapon) => {
            let randomNumber = Math.floor(Math.random() * squaresArray.length);
            for(let i = 0; i <= randomNum.length; i++){
                if(i === randomNumber);
                randomNum.splice(i, 1);
            }
            randomNum.push(randomNumber);
            let squareToPlaceWeapon = squaresArray[randomNumber];
            let addWeaponToSquare = document.createElement("img");
            addWeaponToSquare.style = weaponStyles;
            addWeaponToSquare.setAttribute('src', `images/${weapon.img}`);
            squareToPlaceWeapon.appendChild(addWeaponToSquare); 
            weapon.position = squareToPlaceWeapon;        
        })
        obstacles();
}

//set unavailable obstacle squares 
const obstacles = () => {
    let dimmed = 0;
    while(dimmed <= 20) {
        let randomPosition = Math.floor(Math.random() * squaresArray.length);
        let square = squaresArray[randomPosition];
        if(square.children.length === 0){
            // square.style.backgroundColor = "rgb(247, 202, 1)";
            square.style.background = "url(images/extra.png)";
            square.style.backgroundPosition = "center";
            square.style.backgroundSize = "49px 49px";
            dimmed++;           
        } 
    }
    setAvailability();
}

const setAvailability = () => {
    let obstacle = `"url("images/extra.png")"`
    for(let i = 0; i <= squaresArray.length -1; i++){
        let square = squaresArray[i];
        if(square.childNodes.length !== 0){
            let foundImage = square.childNodes[0].tagName;
            if(foundImage === "IMG"){
                let imageSrc = square.childNodes[0].getAttribute('src');
                if(imageSrc === 'images/player.png'){
                    unavailableSquare.push(squaresArray[square.id - 1]);
                }if(imageSrc === 'images/opponent.png') {
                    unavailableSquare.push(squaresArray[square.id - 1]);
                }else {emptySquare.push(squaresArray[square.id - 1])}
            }
    }
        if(square.children.length === 0 && square.style.backgroundImage.length === 0) {
            emptySquare.push(squaresArray[square.id - 1]);
        }
        
        if(square.style.backgroundImage.length !== 0){
            unavailableSquare.push(squaresArray[square.id - 1]); 
        } 
    }
}

//startGame
const startGame = () => {
    let button = document.querySelector(".start__game__button")
    setPlayer(player1);
    setPlayer(player2); 
    highlight();
    startGame ? button.style.pointerEvents = 'none' : button.style.cursor = "pointer";
    player1.lifeScore = 100;
    player2.lifeScore = 100;
}

// highlight moves
const highlight = () => {
    currentPlayer.possibleMoves.map(possibleMove => { 
    let position = squaresArray[possibleMove -1];
        position.onmouseover = function () {
            position.style.pointerEvents ="initial";
            position.style.backgroundColor = "rgba(247, 202, 1, 0.5)"; //yoda green color
        position.onmouseout = function () {
            position.style.pointerEvents ="initial";
            position.style.backgroundColor = "rgba(204, 255, 204, 0.2)";
            }    
        }
        
    })
}

//clearhighlight and possibleMoves
const clearHighlight = () => {
    currentPlayer.possibleMoves.map(possibleMove => {
        let position = squaresArray[possibleMove -1];
        position.style.backgroundColor = "rgba(204, 255, 204, 0.2)";
        currentPlayer.possibleMoves = [];
    })
}

//listen for next move
const nextMove = (e) => {
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
        readyToAttack(currentPlayer);
    } else {
        boxClicked.style.pointerEvents = "none"
    }
}

//move click event listener
for(var i = 0; i < squaresArray.length -1; i++){
squaresArray[i].addEventListener('click', function (e) {
    nextMove(e);
});
}

const findNewPlayerPosition = (player) =>{
    let position = findAvailableRandomPosition();
    player.startingPositionId = position;
    if(player !== currentPlayer){ 
        if(currentPlayer.possibleMoves.find(move =>  move === position)){
            findNewPlayerPosition(player);
        } 
    }
    return player.startingPositionId;
}

const findAvailableRandomPosition = () => {
    let emptySquaresWithoutWeapons = emptySquare.filter(square => square.children.length === 0 && square.style.backgroundImage.length === 0)
    let randomIndex = Math.floor(Math.random() * emptySquaresWithoutWeapons.length)
    return parseInt(emptySquaresWithoutWeapons[randomIndex].id);
}

//set Players 
const setPlayer= (player) =>{
    debugger;
    let position = findNewPlayerPosition(player);
    let box = emptySquare.find( div => parseInt(div.id) === position);
    // emptySquare[position];
    player.position = box;
    let displayImage  = document.createElement("img");
    displayImage.setAttribute('src', `images/${player.image}`);
    displayImage.style = playerStyles;
    box.appendChild(displayImage);
    unavailableSquare.push(emptySquare[position]);
    emptySquare.splice(position, 1);
    setPlayerPossibleMoves(player);
}



const setPlayerPossibleMoves = (player) => {
    const position = parseInt(player.position.id);
    //move right
    if(position % 10 === 0 ) {
        player.position.style.backgroundColor = '204, 255, 204, 0.2)'
    }else if (position % 10 === 9){
        if(emptySquare.find(square => parseInt(square.id) === (position + 1))) player.possibleMoves.push(position + 1) 
    }else if (position % 10 === 8 ) {
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
    if(position % 10 === 1 ) {
        player.position.style.backgroundColor = '204, 255, 204, 0.2)'
    } else if(position % 10 === 2){
        if(emptySquare.find(square => parseInt(square.id) === (position - 1)))player.possibleMoves.push(position - 1)
    } else if(position % 10 === 3){
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
    if(emptySquare.find(square => parseInt(square.id) === (position + 10)) && position + 10 <= 100) {
        player.possibleMoves.push(position + 10);
        if(emptySquare.find(square => parseInt(square.id) === (position + 20)) && position + 20 <= 100) {
            player.possibleMoves.push(position + 20)
            if(emptySquare.find(square => parseInt(square.id) === (position + 30)) && position + 30 <= 100) player.possibleMoves.push(position + 30)
        }
    } 
    //move up
    if(emptySquare.find(square => parseInt(square.id) === (position - 10)) && position - 10 >= 0){
        player.possibleMoves.push(position - 10)
        if(emptySquare.find(square => parseInt(square.id) === (position - 20)) && position - 20 >= 0){
            player.possibleMoves.push(position - 20)
            if(emptySquare.find(square => parseInt(square.id) === (position - 30)) && position - 30 >= 0) player.possibleMoves.push(position - 30)
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
        currentPlayer.defaultWeapon = currentWeapon;
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
        currentPlayer.defaultWeapon = currentWeapon;
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

// set attack 
const readyToAttack = (player) => {
    let startGameButton = document.querySelector('.start__game__button');
    let boardPlayersScoreCards = document.querySelector('.board__players');
    let attackButtons = document.querySelectorAll('.attack__board__buttons');
    let opponenetPosition;
    let currentPlayerPosition = parseInt(player.position.id) -1;
    player === player1 ? opponenetPosition = parseInt(player2.position.id)-1 : opponenetPosition = parseInt(player1.position.id)-1;
    if(currentPlayerPosition + 1 === opponenetPosition) {
        playerImages.style.visibility = "hidden";
        board.remove();
        startGameButton.remove();
        boardPlayersScoreCards.style.justifyContent = "center";
        Array.from(attackButtons).map(button => button.style.visibility ="visible");
        document.querySelector('.board__player__score__card').style.opacity = "1";
        document.querySelector('.board__opponent__score__card').style.opacity = "1";
        currentPlayer === player1 ? enable(player1) : enable(player2)
        currentPlayer === player1 ? disable(player1) : disable(player2)
    }
    if(currentPlayerPosition - 1 === opponenetPosition) { 
        playerImages.style.visibility = "hidden";     
        board.remove();
        startGameButton.remove();
        boardPlayersScoreCards.style.justifyContent = "center";
        Array.from(attackButtons).map(button => button.style.visibility ="visible");
        document.querySelector('.board__player__score__card').style.opacity = "1";
        document.querySelector('.board__opponent__score__card').style.opacity = "1";
        currentPlayer === player1 ? enable(player1) : enable(player2)
        currentPlayer === player1 ? disable(player1) : disable(player2)
    };
    if(currentPlayerPosition + 10 === opponenetPosition) { 
        playerImages.style.visibility = "hidden";     
        board.remove();
        startGameButton.remove();
        boardPlayersScoreCards.style.justifyContent = "center";
        Array.from(attackButtons).map(button => button.style.visibility ="visible");
        document.querySelector('.board__player__score__card').style.opacity = "1";
        document.querySelector('.board__opponent__score__card').style.opacity = "1";
        currentPlayer === player1 ? enable(player1) : enable(player2)
        currentPlayer === player1 ? disable(player1) : disable(player2)
    };
    if(currentPlayerPosition - 10 === opponenetPosition) { 
        playerImages.style.visibility = "hidden";      
        board.remove();
        startGameButton.remove();
        boardPlayersScoreCards.style.justifyContent = "center";
        Array.from(attackButtons).map(button => button.style.visibility ="visible");
        document.querySelector('.board__player__score__card').style.opacity = "1";
        document.querySelector('.board__opponent__score__card').style.opacity = "1";
        currentPlayer === player1 ? enable(player1) : enable(player2)
        currentPlayer === player1 ? disable(player1) : disable(player2)
    };
}


const attack = () => {
    let weaponforAttack = currentPlayer.defaultWeapon.replace("images/", '');
    if(weaponforAttack !== "defaultWeapon.png") {
        offenseWeapons.map(weapon => {
            if(weaponforAttack === weapon.img) {
                let damageInflicted = weapon.power;
                if(currentPlayer === player1) {
                    document.querySelector('.board__player__attack').innerText = damageInflicted;
                    let newLife = player2.lifeScore - damageInflicted;
                    opponent1lifePointsDisplay.innerText = newLife;
                    player2.lifeScore = newLife;
                    if(player2.lifeScore <= 0) {
                        document.querySelector('.attack__board__player1__attack').style.pointerEvents = "none";
                        playersBoard.parentNode.removeChild(playersBoard)
                        playerImages.parentNode.removeChild(playerImages)
                        // chewbaccaImage.style.visibility = "visible";
                        gameOverText.innerText = `${player2.name}, GAME OVER`
                        gameOverText.style.marginTop = "20%";
                        gameOverText.style.fontSize = "120px";
                        playAgainButton.style.visibility = "initial";
                        
                    }
                } else if(currentPlayer === player2){
                    document.querySelector('.board__opponent__attack').innerText = damageInflicted;
                    let newLife = player1.lifeScore - damageInflicted;
                    player1lifePointsDisplay.innerText = newLife;
                    player1.lifeScore = newLife;
                    if(player1.lifeScore <= 0) {
                        document.querySelector('.attack__board__player2__attack').style.pointerEvents = "none";
                        playersBoard.parentNode.removeChild(playersBoard);
                        playerImages.parentNode.removeChild(playerImages);
                        // chewbaccaImage.style.visibility = "visible";
                        gameOverText.innerText = `${player1.name}, GAME OVER`
                        gameOverText.style.marginTop = "20%";
                        gameOverText.style.fontSize = "120px";
                        playAgainButton.style.visibility = "initial"

                    }
                }
            }
        })
    } else {
        let damageInflicted = 10;
        if(currentPlayer === player1){
            let newLife = player2.lifeScore - damageInflicted;
            opponent1lifePointsDisplay.innerText = newLife;
            player2.lifeScore = newLife;
            if(player2.lifeScore <= 0) {
                document.querySelector('.attack__board__player1__attack').style.pointerEvents = "none";
                playersBoard.parentNode.removeChild(playersBoard)
                playerImages.parentNode.removeChild(playerImages)
                // chewbaccaImage.style.visibility = "visible";
                gameOverText.innerText = `${player2.name}, GAME OVER`
                gameOverText.style.marginTop = "20%";
                gameOverText.style.fontSize = "120px";
                playAgainButton.style.visibility = "initial";

            }
        }
        if(currentPlayer === player2) {
            let newLife = player1.lifeScore - damageInflicted;
            player1lifePointsDisplay.innerText = newLife;
            player1.lifeScore = newLife;
            if(player1.lifeScore <= 0) {
                document.querySelector('.attack__board__player2__attack').style.pointerEvents = "none";
                playersBoard.parentNode.removeChild(playersBoard)
                playerImages.parentNode.removeChild(playerImages)
                // chewbaccaImage.style.visibility = "visible";
                gameOverText.innerText = `${player1.name}, GAME OVER`
                gameOverText.style.marginTop = "20%";
                gameOverText.style.fontSize = "120px";
                playAgainButton.style.visibility = "initial";

            }
        }
    }
    currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1
    enable(currentPlayer)
    disable(currentPlayer);
    enableforDefend(currentPlayer);
    disableforDefend(currentPlayer);

}

const defend  = (player) => {
        if(player === player1){
            let opponentsWeapon = player2.defaultWeapon.replace("images/", '');
            let opponentsWeaponDamagePoints;
            if(opponentsWeapon !== 'defaultWeapon.png'){
                offenseWeapons.map(weapon => {
                    if(opponentsWeapon === weapon.img) {
                        opponentsWeaponDamagePoints = weapon.power;
                    }
                })
                let damageInflicted = opponentsWeaponDamagePoints / 2;
                let newLife = player1.lifeScore - damageInflicted;
                player1lifePointsDisplay.innerText = newLife;
                player1.lifeScore = newLife;
                if(player1.lifeScore <= 0) {
                    document.querySelector('.attack__board__player2__attack').style.pointerEvents = "none";
                    playersBoard.parentNode.removeChild(playersBoard)
                    playerImages.parentNode.removeChild(playerImages)
                    gameOverText.innerText = `${player1.name}, GAME OVER`
                    gameOverText.style.marginTop = "25%";
                    gameOverText.style.fontSize = "120px";
                }
            } else if(player === player2){
            let opponentsWeapon = player1.defaultWeapon.replace("images/", '');
            let opponentsWeaponDamagePoints;
            if(opponentsWeapon !== 'defaultWeapon.png') {
                offenseWeapons.map(weapon => {
                    if(opponentsWeapon === weapon.img) {
                        opponentsWeaponDamagePoints = weapon.power;
                    }
                })
                let damageInflicted = opponentsWeaponDamagePoints / 2;
                let newLife = player2.lifeScore - damageInflicted;
                opponent1lifePointsDisplay.innerText = newLife;
                player2.lifeScore = newLife;
                if(player2.lifeScore <= 0) {
                    document.querySelector('.attack__board__player1__attack').style.pointerEvents = "none";
                    playersBoard.parentNode.removeChild(playersBoard)
                    playerImages.parentNode.removeChild(playerImages)
                    gameOverText.innerText = `${player2.name}, GAME OVER`
                    gameOverText.style.marginTop = "25%";
                    gameOverText.style.fontSize = "120px";
                }
            }

        }
    } 
    if(player === player1) {
                let damageInflicted = 10 / 2;
                let newLife = player1.lifeScore - damageInflicted;
                player1lifePointsDisplay.innerText = newLife;
                player1.lifeScore = newLife;
                if(player1.lifeScore <= 0) {
                    document.querySelector('.attack__board__player2__attack').style.pointerEvents = "none";
                    playersBoard.parentNode.removeChild(playersBoard)
                    playerImages.parentNode.removeChild(playerImages)
                    gameOverText.innerText = `${player1.name}, GAME OVER`
                    gameOverText.style.marginTop = "25%";
                    gameOverText.style.fontSize = "120px";
                }
        }
        if(player === player2) {
            let damageInflicted = 10 / 2;
            let newLife = player2.lifeScore - damageInflicted;
            opponent1lifePointsDisplay.innerText = newLife;
            player2.lifeScore = newLife;
            if(player2.lifeScore <= 0) {
                document.querySelector('.attack__board__player1__attack').style.pointerEvents = "none";
                playersBoard.parentNode.removeChild(playersBoard)
                playerImages.parentNode.removeChild(playerImages)
                gameOverText.innerText = `${player1.name}, GAME OVER`
                gameOverText.style.marginTop = "25%";
                gameOverText.style.fontSize = "120px";
            }
        }
    
    currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1
    enable(currentPlayer)
    disable(currentPlayer);
    enableforDefend(currentPlayer);
    disableforDefend(currentPlayer);
   
}

//if defend enable the next player attack button
const disable = (player) => {
    if(player === player1) {
        document.querySelector('.attack__board__player2__attack').style.pointerEvents = "none"
    }else if(player === player2) {
    document.querySelector('.attack__board__player1__attack').style.pointerEvents = "none"
    }
}

const enable = (player) => {
    if( player === player1) {
        let enableButton = document.querySelector('.attack__board__player1__attack').style.pointerEvents = "initial"
       
    }
    if(player === player2) {
        let enableButton = document.querySelector('.attack__board__player2__attack').style.pointerEvents = "initial"
    }
}

const fightSelectors = [
    '.attack__board__player1__attack',
    '.attack__board__player2__attack',
         
]

const defendControllers = [
    '.attack__board__player1__defend',
    '.attack__board__player2__defend', 
] 

const disableforDefend = (player) => {
    if(player === player1) {
        document.querySelector('.attack__board__player2__defend').style.pointerEvents = "none"
    }else if(player === player2) {
    document.querySelector('.attack__board__player1__defend').style.pointerEvents = "none"
    }
}

const enableforDefend = (player) => {
    if(player === player1) {
        let enableButton = document.querySelector('.attack__board__player1__defend').style.pointerEvents = "initial"
       
    }
    if(player === player2) {
        let enableButton = document.querySelector('.attack__board__player2__defend').style.pointerEvents = "initial"
    }
}

fightSelectors.map(selector => {
        document.querySelector(selector).addEventListener('click', function () {
            attack();           
        })
})


defendControllers.map(controller => {
    document.querySelector(controller).addEventListener('click', function () {
        defend(currentPlayer);          
    })
})

playAgainButton.addEventListener('click', function () {
    window.location.reload();
})


