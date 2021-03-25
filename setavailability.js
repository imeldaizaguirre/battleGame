const setAvailability = () => {
    for(let i = 1; i <= squaresArray.length; i++){
        debugger;
        let square = squaresArray[i];
        console.log("this is square >>>", square)
        if(square.childNodes.length !== 0){
            let foundImage = square.childNodes[0].tagName;
            if(foundImage === "IMG"){
                let imageSrc = square.childNodes[0].getAttribute('src');
                if(imageSrc === 'images/player.png'){
                    unavailableSquare.push(square);
                }if(imageSrc === 'images/opponent.png') {
                    unavailableSquare.push(square);
                }else {emptySquare.push(square)}
            }
        }
    if(square.children.length === 0 & square.style.backgroundImage.length === 0) (emptySquare.push(square));
     
    if(square.style.backgroundColor === 'rgba(204, 255, 204, 0.2)') (emptySquare.push(square))
    
    if(square.style.backgroundImage.length !== 0)(unavailableSquare.push(square)); 
    
    }
}



>>>>>>>>>>>>>>>>>>>>>>>





const setAvailability = () => {
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
    if(square.children.length === 0 & square.style.backgroundImage.length === 0) {
        emptySquare.push(squaresArray[square.id - 1]);
    }
    
    if(square.style.backgroundImage.length !== 0){
        unavailableSquare.push(squaresArray[square.id - 1]); 
    } 
    }
}