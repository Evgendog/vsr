function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//базовый класс для всех отображаемых объектов в игре
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
        this.speedPerFrame = 0;
    }

    createElement() {
        let $element = $(`<div class="element ${this.constructor.name.toLowerCase()}"></div>`);
        this.game.$zone.append($element);
        return $element;
    }

    removeElement() {
        this.$element.remove();
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

    isCollision(elements) {
        let a = {
            x1: this.position.x,
            x2: this.position.x + this.size.w,
            y1: this.position.y,
            y2: this.position.y + this.size.h,
        }
        let b = {
            x1: elements.position.x,
            x2: elements.position.x + elements.size.w,
            y1: elements.position.y,
            y2: elements.position.y + elements.size.h,
        }
        return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    }

    isLeftBorderCollision() {
        return this.position.x < this.speedPerFrame;
    }

    isRightBorderCollision() {
        return this.position.x > this.game.$zone.width() - this.size.w - this.speedPerFrame;
    }

    isTopBorderCollision() {
        return this.position.y < this.speedPerFrame;
    }
}

//класс для игрока
class Player extends Drawable {

    constructor(game) {
        super(game);
        this.size = {
            h: 20,
            w: 100
        };
        this.position = {
            x: this.game.$zone.width() / 2 - this.size.w / 2,
            y: this.game.$zone.height() - this.size.h
        };
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false
        }
        this.speedPerFrame = 20;
        this.bindKeyEvents();
    }

    bindKeyEvents() {
        document.addEventListener('keydown', ev => this.changeKeyStatus(ev.code, true));
        document.addEventListener('keyup', ev => this.changeKeyStatus(ev.code, false));
    }

    changeKeyStatus(code, value) {
        if (code in this.keys) {
            this.keys[code] = value;
        }
    }

    update() {
        if (this.isLeftBorderCollision() && this.keys.ArrowLeft) {
            this.position.x = 0;
            return;
        }
        if (this.isRightBorderCollision() && this.keys.ArrowRight) {
            this.position.x = this.game.$zone.width() - this.size.w;
            return;
        }

        switch (true) {
            case this.keys.ArrowLeft:
                this.offsets.x = -this.speedPerFrame;
                break;
            case this.keys.ArrowRight:
                this.offsets.x = this.speedPerFrame;
                break;
            default:
                this.offsets.x = 0;
        }

        super.update();
    }
}

class Ball extends Drawable {
    constructor(game) {
        super(game);
        this.speedPerFrame = 5;
        this.size = {
            h: 20,
            w: 20
        };
        this.position = {
            x: this.game.$zone.width() / 2 - this.size.w / 2,
            y: this.speedPerFrame + 5,
        };

        this.offsets.y = this.speedPerFrame;
    }

    update() {
        if (this.isCollision(this.game.player) || this.isTopBorderCollision()) {
            this.changeDirection();
        }

        if (this.isLeftBorderCollision() || this.isRightBorderCollision()) {
            this.changeDirectionX();
        }

        super.update();
    }

    changeDirectionY() {
        this.offsets.y *= -1;
    }

    changeDirection() {
        if (random(0, 1)) {
            this.changeDirectionY();
        } else {
            this.changeDirectionY();
            this.offsets.x = random(-5, 5);
        }
    }

    changeDirectionX() {
        this.offsets.x *= -1;
    }
}

class Block extends Drawable {
    constructor(game) {
        super(game);
        this.size = {
            h: 20,
            w: 100
        };
    }

    update() {
        if (this.isCollision(this.game.ball)) {
            if (this.game.remove(this)) {
                this.removeElement();
                this.game.ball.changeDirection();
            }
        }
        super.update();
    }
}

class Game {
    //Базовые настройки игры
    constructor() {
        this.$zone = $('#game .elements');
        this.elements = [];
        this.player = this.generate(Player);
        this.ball = this.generate(Ball);
        //this.blockGenerate(Block, {x: 200, y: 200});
        this.blocksGenerate();
    }

    // Генерация элемента
    generate(ClassName) {
        let element = new ClassName(this);
        this.elements.push(element);
        return element;
    }

    remove(element) {
        let ind = this.elements.indexOf(element);
        if (ind === -1) return false;
        return this.elements.splice(ind, 1);
    }

    // Генерация блока
    blockGenerate(ClassName, position) {
        let block = this.generate(ClassName);
        block.position = position;
    }

    // Генерация блоков в игре
    blocksGenerate() {
        for (let x = 0; x < this.$zone.width(); x += 200) {
            for (let y = 100; y < 300; y += 100) {
                this.blockGenerate(Block, {x: x, y: y});
            }
        }
    }

    //старт игры
    start() {
        this.loop();
    }

    //бесконечный игровой цикл
    loop() {
        requestAnimationFrame(() => {
            this.updateElements();
            this.loop();
        });
    }

    //обновление всех игровых элементов
    updateElements() {
        this.elements.forEach(element => {
            element.update();
            element.draw();
        })
    }
}

const game = new Game();
game.start();