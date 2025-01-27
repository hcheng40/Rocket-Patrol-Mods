class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        // load images/tile sprites
        this.load.image("rocket", "./assets/rocket.png")
        this.load.image("spaceship", "./assets/spaceship.png")
        this.load.image("starfield", "./assets/starfield.png")

        // load spritesheet
        this.load.spritesheet("explosion", "./assets/explosion.png", {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        // animation configuration
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        })

        let menuConfig = {
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

        // display menu text
        this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding * 2, 'ROCKET PATROL', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2, 'Use ←(A) →(D) arrows to move\nENTER(F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#00FF00'
        menuConfig.color = '#000'
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding * 2, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 2 + borderPadding * 4, 'Press ↑ for Single Player\n or ↓ for Two Players', menuConfig).setOrigin(0.5)

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx-select')
            this.scene.start('playScene')
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx-select')
            this.scene.start('playScene')
        }

        // two-player mode
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            twoPlayer = false
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            twoPlayer = true
        }
    }
}
