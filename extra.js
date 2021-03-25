const setAvailability = () => {
    squaresArray.map(square => {
    if(square.childNodes.length !== 0) {
        let foundImage = square.childNodes[0].tagName
        if(foundImage === "IMG") {
             let imageSrc = square.childNodes[0].getAttribute('src');
             if(imageSrc === 'images/player.png' || square.style.backgroundColor === "rgb(247, 202, 1)"){
                 if(imageSrc === 'images/opponent.png' || square.style.backgroundColor === "rgb(247, 202, 1)") {
                     unavailableSquare.push(square);
        }
     }
         
    } } else { emptySquare.push(square)}
});
}