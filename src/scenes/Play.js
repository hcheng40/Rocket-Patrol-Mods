class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        if (game.settings.spaceshipSpeed == 6) {
            game.settings.spaceshipSpeed = 3
        }
        else {
            game.settings.spaceshipSpeed = 4
        }
        
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // add rocket (p2)
        if (twoPlayer) {
            this.p2Rocket = new Rocket2(this, game.config.width / 2 + 50, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        }

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyFIRE2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        // initialize score
        this.p1Score = 0
        this.p2Score = 0

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        if (twoPlayer) {
            scoreConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'left',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 100
            }
            this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, "P1:" + this.p1Score, scoreConfig)
            this.scoreRIGHT = this.add.text(game.config.width - 100 - borderUISize - borderPadding, borderUISize + borderPadding * 2, "P2:" + this.p2Score, scoreConfig)
        }
        else {
            this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig)
        }

        // time remaining
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#ED8DED',
            color: '#443040',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 50
        }
        this.timeText = this.add.text(game.config.width / 2 - timeConfig.fixedWidth / 2, borderUISize + borderPadding * 2, this.timeLeft, timeConfig)

        // GAME OVER flag
        this.gameOver = false

        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.timeLeft = game.settings.gameTimer / 1000
        this.clock = this.time.addEvent({
            delay: 1000,
            callback: this.updateClock,
            callbackScope: this,
            repeat: -1
        })

        // speed increase after 30 seconds
        this.clock1 = this.time.delayedCall(30000, () => { game.settings.spaceshipSpeed += 3 }, null, this)
    }

    update() {

        this.starfield.tilePositionX -= 4
        this.timeText.text = Math.floor(this.timeLeft)

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.p1Rocket, this.ship03)
            if (!twoPlayer) {
                this.addTime(3)
            }
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.p1Rocket, this.ship02)
            if (!twoPlayer) {
                this.addTime(3)
            }
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.p1Rocket, this.ship01)
            if (!twoPlayer) {
                this.addTime(3)
            }
        }

        if (twoPlayer) {
            if (this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset()
                this.shipExplode(this.p2Rocket, this.ship03)
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset()
                this.shipExplode(this.p2Rocket, this.ship02)
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset()
                this.shipExplode(this.p2Rocket, this.ship01)
            }
        }

        if (!this.gameOver) {
            this.p1Rocket.update()
            if (twoPlayer) {
                this.p2Rocket.update()
            }
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
        }

        // check key input for return to menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }

        // no time left
        if (this.timeLeft <= 0 && !this.gameOver) {
            let conf = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'center',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 0
            }
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', conf).setOrigin(0.5)
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', conf).setOrigin(0.5)
            this.gameOver = true
            this.clock.remove()
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true
        }
        else {
            return false
        }
    }

    shipExplode(rocket, ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })

        // score add and text update
        if (rocket == this.p1Rocket) {
            this.p1Score += ship.points
            if (!twoPlayer) {
                this.scoreLeft.text = this.p1Score
            }
            else {
                this.scoreLeft.text = "P1:" + this.p1Score
            }
        }
        else {
            this.p2Score += ship.points
            this.scoreRIGHT.text = "P2:" + this.p2Score
        }

        this.sound.play('sfx-explosion')
    }

    // track the remaining time
    updateClock() {
        this.timeLeft--
    }
    addTime(seconds) {
        this.timeLeft += seconds
    }
    subtractTime(seconds) {
        this.timeLeft -= seconds
        if (this.timeLeft < 0) {
            this.timeLeft = 0
        }
    }
}