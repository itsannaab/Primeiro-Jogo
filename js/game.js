(function (){

    const TAMX = 600; //largura da view do jogo
    const TAMY = 800; //altura da view do jogo
    const FPS = 100;

    const PROB_ENEMY_SHIP = 0.5;//probabilidade de inimigo aparecer num frame

    let points, life;

    let space,ship;
    let enemies = [];

    function init(){ //inicializa todos os elementos do jogo
        space = new Space();
        ship = new Ship();
        points = 0;
        life = 3;
        const interval = window.setInterval(run, 1000 / FPS) //looping infinito, funcao executada a cada x milisegundo (FPS)
    } 

    window.addEventListener("keydown", (e) => { //keydown -> ao pressionar teclado o evento é disparado
        if (e.key === 'ArrowLeft') ship.mudaDirecao(-1);
        else if (e.key === 'ArrowRight') ship.mudaDirecao(1);
    }); 

    class Space {
        constructor(){
            this.element = document.getElementById("space"); //referencia a div de id space do index.html
            this.element.style.width = `${TAMX}px`;
            this.element.style.height = `${TAMY}px`;
            this.element.style.backgroundPositionY = "0px";
        }

        move(){
            this.element.style.backgroundPositionY = `${parseInt(this.element.style.backgroundPositionY)  + 1}px`;
        }
    }

    class Ship {
        constructor(){
            this.element = document.getElementById("ship"); //referencia a img de id ship do index.html
            this.AssetsDirecoes =  [
                "assets/playerLeft.png", //0
                "assets/player.png", //1
                "assets/playerRight.png", //2
            ];

            this.direcao = 1; //posicao do array que corresponde a imagem que o usuario esta vendo
            this.element.src = this.AssetsDirecoes[this.direcao];
            this.element.style.bottom = "20px"; //propriedade que diz distancia da nave em relação ao fundo
            this.element.style.left = `${parseInt(TAMX / 2) - 50}px`; //distancia em relação a margem esquerda
        }

        mudaDirecao(giro){
            if (this.direcao + giro >=0 && this.direcao + giro <= 2){
                this.direcao += giro;
                this.element.src = this.AssetsDirecoes[this.direcao];
            }
        }

        move(){
            if (this.direcao === 0)
                this.element.style.left = `${parseInt(this.element.style.left) - 1}px`; //ship se aproxima da esquerda
                
            if(this.direcao === 2)
                this.element.style.left = `${parseInt(this.element.style.left) + 1}px`; //ship se afasta da esquerda
            
            space.move();
        }
    }

    class EnemyShip {
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "enemy-ship"; //criada classe, nao ID, pois sao muitos objetos de inimigo
            this.element.src = "assets/enemyShip.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`; //gerar uma posicao aleatoria entre 0 e TAMX
            space.element.appendChild(this.element); //adiciona o elemento ao espaço
        }

        move(){
            this.element.style.top = `${parseInt(this.element.style.top) + 1}px`; //faz o inimigo descer, incrementando o topo para se distanciar
        }
    }

    class EnemyUFO{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "enemy-ufo";
            this.element.src = "assets/enemyUFO.png";
        }
    }

    class MeteorBig{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "meteor-big";
            this.element.src = "assets/meteorBig.png";
        }

    }

    class MeteorSmall{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "meteor-small";
            this.element.src = "assets/meteorSmall.png";
        }
    }

    function run(){ //define o que vai acontecer no jogo, executa 100x por segundo
        const random_enemy_ship = Math.random() * 100; 
        if (random_enemy_ship <= PROB_ENEMY_SHIP) {
            enemies.push(new EnemyShip()); //1x a cada 200 vezes +- que a funcao for executada, cria inimigo
        }
        enemies.forEach((e) => e.move()); //função para cada inimigo do array descer
        ship.move();
    }

    init()
})(); //funcao imediata