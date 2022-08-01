import '../style.css'

window.addEventListener('load', function(){
    const canvas = document.getElementById('screen')
    const ctx = canvas.getContext('2d')
    canvas.width = 500;
    canvas.height = 500;

    class InputHandler{
        constructor(game) {
            this.game = game
            window.addEventListener('keydown', e => {
                if(((e.key === 'ArrowRight') || (e.key === 'ArrowLeft' || (e.key === 'ArrowUp') || (e.key === 'ArrowDown'))) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key)
                }else if(e.key === ' '){
                    this.game.player.shoot()
                }
            })
            window.addEventListener('keyup', e => {
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                }
            })
        }
    }

    class Projectile{
        constructor(game, x, y) {
            this.game = game
            this.x = x
            this.y = y
            this.width = 10
            this.height = 3
            this.speed = 5
            this.markedForDeletion = false
        }
        update(){
            this.x += this.speed
            if(this.x > this.game.width) this.markedForDeletion = true
        }
        draw(context){
            context.fillStyle = 'blue'
            context.fillRect(this.x + this.game.player.width - 30, this.y + this.game.player.height/3, this.width, this.height)
        }
    }

    class Particule{

    }

    class Player {
        constructor(game) {
            this.game = game
            this.width = 80
            this.height = 110
            this.x = 20
            this.y = this.game.height - this.height
            this.speedY = 0
            this.speedX = 0
            this.maxSpeed = 3
            this.projectiles = []
        }
        update(){
            if(this.game.keys.includes('ArrowRight')) this.speedX = this.maxSpeed
            else if(this.game.keys.includes('ArrowLeft')) this.speedX = -this.maxSpeed
            else this.speedX = 0
            this.y += this.speedY
            this.x += this.speedX
            this.projectiles.forEach(projectile => {projectile.update()})
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion)
        }

        draw(context){
            context.fillStyle = 'black'
            context.fillRect(this.x, this.y, this.width, this.height)
            this.projectiles.forEach(projectile => {
                projectile.draw(context)
            })
        }

        shoot(){
            if(this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x, this.y))
                this.game.ammo --
            }

        }
    }

    class Enemy {

    }

    class Layer{

    }

    class Background{

    }

    class UI{
        constructor(game) {
            this.game = game
            this.fontSize = 25
            this.fontFamily = 'Helvatica'
            this.color = 'black'
        }

        draw(context){
            context.fillStyle = this.color
            for(let i = 0; i < this.game.ammo; i++){
                context.fillRect(5 * i + 20 ,25,3,20)
            }
        }
    }

    class Game{
        constructor(width, height) {
            this.width = width
            this.height = height
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.ui = new UI(this)
            this.keys = []
            this.ammo = 25
            this.maxAmmo = 50
            this.ammoTimer = 0
            this.ammoInterval = 1000
        }
        update(deltaTime){
            this.player.update()
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo ++
                }
                this.ammoTimer = 0
            }else{
                this.ammoTimer += deltaTime
            }
        }

        draw(context){
            this.player.draw(context)
            this.ui.draw(context)
        }
    }

    const game = new Game(canvas.width, canvas.height)

    let lastTime = 0

    function animate(timestamp){
        const deltaTime = timestamp - lastTime
        lastTime = timestamp
        ctx.clearRect(0,0, canvas.width, canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        requestAnimationFrame(animate)
    }

    animate(0)
})