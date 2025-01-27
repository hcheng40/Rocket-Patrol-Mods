// Hao-Tien Cheng
// Rocket Patrol Mods
// About 12 hours
// ===========================================================================================================================
// Allow the player to control the Rocket after it's fired (1), 
// Implement the speed increase that happens after 30 seconds in the original game (1), 
// Display the time remaining (in seconds) on the screen (3), 
// Implement an alternating two-player mode (5), 
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5), 
// Implement mouse control for player movement and left mouse click to fire (5)
// ===========================================================================================================================
// https://labs.phaser.io and https://docs.phaser.io/


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyA, keyD, keyFIRE2

// mouse control
let mouseX

// two-player mode
let twoPlayer = false