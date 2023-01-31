(function (){

    const TAMX = 600; //largura da view do jogo
    const TAMY = 800; //altura da view do jogo
    const FPS = 100;

    const PROB_ENEMY_SHIP = 0.5;//probabilidade de inimigo aparecer num frame
    const PROB_ENEMY_UFO = 0.3;
    const PROB_METEOR_BIG = 0.1;
    const PROB_METEOR_SMALL = 0.2;

    let points, vida, laser, life, interval;

    let space,ship;
    let enemies = [];
    let enemiesU = [];
    let meteorB = [];
    let meteorS = [];
    let lasers = [];
    let lifes = [];

    let iniciar = false;

    function init(){ //inicializa todos os elementos do jogo
        space = new Space();
        ship = new Ship();
        points = 0;
        
        for(let x = 0; x < 3; x++){
            life = new Life();
            lifes.push(life);
        }
    } 

    window.addEventListener("keydown", (e) => { //keydown -> ao pressionar teclado o evento é disparado
        if (e.key === 'ArrowLeft') ship.mudaDirecao(-1);
        else if (e.key === 'ArrowRight') ship.mudaDirecao(1);
    }); 

    window.addEventListener("keydown", (e) => {
        if(e.key === " "){ 
            if(!iniciar){
                interval = window.setInterval(run, 1000 / FPS); //looping infinito, funcao executada a cada x milisegundo (FPS)
                iniciar = true;
            }
            else{
                laser = new LaserRed();
                lasers.push(laser);
            }
        }

        if((e.key === "p") || (e.key === "P")){
            if(iniciar){
                clearInterval(interval);
                iniciar = false;
            }
            else{
                interval = window.setInterval(run, 1000 / FPS);
                iniciar = true;
            }
        }
        
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
            if (this.direcao === 0 && parseInt(this.element.style.left) > 0) //limitacao borda
                this.element.style.left = `${parseInt(this.element.style.left) - 2}px`; //ship se aproxima da esquerda
                
            if(this.direcao === 2 && parseInt(this.element.style.left) < (TAMX - 100)) //limitacao borda 
                this.element.style.left = `${parseInt(this.element.style.left) + 2}px`; //ship se afasta da esquerda
            
            space.move();
        }

        colisao(enemy){
            return enemy.colisao(this);
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

        colisao(ship){
            let distX = this.element.offsetLeft - ship.element.offsetLeft;
            let distY = this.element.offsetTop - ship.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + ship.element.offsetWidth / 2;
            return distancia < soma;   
        }
    }

    class EnemyUFO{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "enemy-ufo";
            this.element.src = "assets/enemyUFO.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`
            space.element.appendChild(this.element);
        }

        move(){
            this.element.style.top = `${parseInt(this.element.style.top) + 1}px`; 
        }

        colisao(ship){
            let distX = this.element.offsetLeft - ship.element.offsetLeft;
            let distY = this.element.offsetTop - ship.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + ship.element.offsetWidth / 2;
            return distancia < soma;
              
        }
    }

    class MeteorBig{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "meteor-big";
            this.element.src = "assets/meteorBig.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`
            space.element.appendChild(this.element);
        }

        move(){
            this.element.style.top = `${parseInt(this.element.style.top) + 1}px`; //faz o inimigo descer, incrementando o topo para se distanciar
        }

        colisao(ship){
            let distX = this.element.offsetLeft - ship.element.offsetLeft;
            let distY = this.element.offsetTop - ship.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + ship.element.offsetWidth / 2;
            return distancia < soma;
              
        }

    }

    class MeteorSmall{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "meteor-small";
            this.element.src = "assets/meteorSmall.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`
            space.element.appendChild(this.element);
        }

        move(){
            this.element.style.top = `${parseInt(this.element.style.top) + 1}px`;
        }

        colisao(ship){
            let distX = this.element.offsetLeft - ship.element.offsetLeft;
            let distY = this.element.offsetTop - ship.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + ship.element.offsetWidth / 2;
            return distancia < soma;  
        }

        tiro(laser){
            let distX = this.element.offsetLeft - laser.element.offsetLeft;
            let distY = this.element.offsetTop - laser.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + laser.element.offsetWidth / 2;
            return distancia < soma;  
        }
    }

    class LaserRed{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "laser-red";
            this.element.src = "assets/laserRed.png";
            this.element.style.bottom = `${parseInt(ship.element.style.bottom )+77}px`; 
            this.element.style.left = `${parseInt(ship.element.style.left) +50}px`
            space.element.appendChild(this.element);
        }

        move(){
            this.element.style.bottom = `${parseInt(this.element.style.bottom) + 1}px`;

            //funcao de colisao para deletar laser e inimigo acertado - problema
        }

        colisao(enemy){
            return enemy.colisao(this);
        }
    }

    class Life{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "life";
            this.element.src = "assets/life.png";
            this.element.style.top = "0px";
            this.element.style.left = "400px";
            space.element.appendChild(this.element);
        }

    }

    function run(){ //define o que vai acontecer no jogo, executa 100x por segundo
        const random_enemy_ship = Math.random() * 100; 
        const random_enemy_ufo = Math.random() * 95; 
        const random_meteor_big = Math.random() * 80; 
        const random_meteor_small = Math.random() * 80; 
        if (random_enemy_ship <= PROB_ENEMY_SHIP) {
            enemies.push(new EnemyShip()); //1x a cada 200 vezes +- que a funcao for executada, cria inimigo
        }

        if (random_enemy_ufo <= PROB_ENEMY_UFO) {
            enemiesU.push(new EnemyUFO()); 
        }

        if(random_meteor_big <= PROB_METEOR_BIG){
            meteorB.push(new MeteorBig());
        }

        if(random_meteor_small <= PROB_METEOR_SMALL){
            meteorS.push(new MeteorSmall());
        }


        enemies.forEach((e) => e.move()); //função para cada inimigo do array descer
        enemiesU.forEach((e) => e.move());
        meteorB.forEach((e) => e.move());
        meteorS.forEach((e) => e.move());
        lasers.forEach((e) => e.move());
    
    
       for (let i = 0; i < enemies.length; i++) { //funcao de colisao com os inimigos
            if (ship.colisao(enemies[i])) {
              space.element.removeChild(enemies[i].element);
              lifes.pop().element;

              //if(lifes.lenght == 0){
              //  clearInterval(interval);
              //}
            }
        }

        for (let i = 0; i < enemiesU.length; i++) {
            if (ship.colisao(enemiesU[i])) {
              space.element.removeChild(enemiesU[i].element);
            }
        }

        for (let i = 0; i < meteorB.length; i++) {
            if (ship.colisao(meteorB[i])) {
              space.element.removeChild(meteorB[i].element);
            }
        }

        for (let i = 0; i < meteorS.length; i++) {
            if (ship.colisao(meteorS[i])) {
              space.element.removeChild(meteorS[i].element);
            }
        }

        //funcao para atirar
        
        for (let i = 0; i < enemies.length; i++) {
            if (laser.colisao(enemies[i])) {
              space.element.removeChild(meteorS[i].element);
            }
        }
        
    
        /*remover elementos da dom -> problema

        */
        ship.move();
    }


        

    init();
})(); //funcao imediata