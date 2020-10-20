// Default class for all showable objects in game
class Drawable {
    constructor(game) {
        this.game = game;
        this.$element = this.createElement();
        this.position = {
            x: 0,
            y: 0,
        }
        this.size = {
            w: 0,
            h: 0,
        }
        this.offsets = {
            x: 0,
            y: 0,
        }
    }
    createElement() {
        let $element = $(`<div class="element ${this.constructor.name.toLowerCase()}"></div>`);
        this.game.$zone.append($element);
        return $element;
    }
    update() {
        this.position.x += this.offsets.x;
        this.position.y += this.offsets.y;
    }
    draw() {
        this.$element.css({
            left: this.position.x + 'px',
            top: this.position.y + 'px',
            width: this.size.w + 'px',
            height: this.size.h + 'px',
        })
    }
}
// Class for player
class Player extends Drawable {
    constructor(game) {
        super(game);
        this.size = {h: 20, w: 100};
        this.position = {
            x: this.game.$zone.width() / 2 - this.size.w / 2,
            y: this.game.$zone.height() - this.size.h};
    }
}
class Game {
    // Default settings of game
    constructor() {
        this.$zone = $('#game .elements');
        this.elements = [];
        this.player = this.generate(Player);
    }
    // Generation of elements
    generate(ClassName) {
        let element = new ClassName(this);
        this.elements.push(element);
        return element;
    }
    // Start of the game
    start() {
        this.loop();
    }
    // Endless game's cycle
    loop() {
        requestAnimationFrame(()=>{
            this.updateElements();
            this.loop();
        });
    }
    // Update of all game's elements
    updateElements() {
        this.elements.forEach(element => {
            element.update();
            element.draw();
        })
    }
}

const game = new Game();
game.start();




















