(function (){

    const TAMX = 600; //largura da view do jogo
    const TAMY = 800; //altura da view do jogo
    const FPS = 100;

    const PROB_ENEMY_SHIP = 0.5;//probabilidade de inimigo aparecer num frame
    const PROB_ENEMY_UFO = 0.3;
    const PROB_METEOR_BIG = 0.1;
    const PROB_METEOR_SMALL = 0.2;

    let enemy_l = ["assets/enemyShip.png", "assets/meteorBig.png", "assets/meteorSmall.png", "assets/enemyUFO.png"];
    let life, interval, laser, space, ship, inicio, restartB, score, aumenta,speed,vmin,vmax;
    let enemies = [];
    let enemiesU = [];
    let meteorB = [];
    let meteorS = [];
    let lasers = [];
    let lifes = [];
    let iniciar = false;

    function init(){ //inicializa todos os elementos do jogo
        vmin = 1;
        vmax = 4;
        score = "000000"
        tempo = setInterval(aumentaVel, 60000);
        aumenta = 1;
        space = new Space();
        ship = new Ship();
        ponto = new Score();
        inicio = new Inicio();
       
        
        for(let x = 0; x < 3; x++){
            life = new Life();
            lifes.push(life);
        }
    } 

    function aumentaVel(){
        vmin += aumenta;
        vmax += aumenta;
    }

    window.addEventListener("keydown", (e) => { //keydown -> ao pressionar teclado o evento é disparado
        if (e.key === 'ArrowLeft') ship.mudaDirecao(-1);
        else if (e.key === 'ArrowRight') ship.mudaDirecao(1);
    }); 

    window.addEventListener("keydown", (e) => {
        if(!restartB){
            if(e.key === " "){ 
                if(!iniciar){
                    interval = window.setInterval(run, 1000 / FPS); //looping infinito, funcao executada a cada x milisegundo (FPS)
                    //inicio.remove();
                    space.element.removeChild(inicio.element);
                    iniciar = true;
                }
                else{
                    laser = new LaserRed();
                    lasers.push(laser);
                }
            }
        }

        if(!restartB){
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
                this.element.style.left = `${parseInt(this.element.style.left) - 3}px`; //ship se aproxima da esquerda
                
            if(this.direcao === 2 && parseInt(this.element.style.left) < (TAMX - 100)) //limitacao borda 
                this.element.style.left = `${parseInt(this.element.style.left) + 3}px`; //ship se afasta da esquerda
            
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
            speed = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
            this.element.style.top = `${parseInt(this.element.style.top) + speed}px`; //faz o inimigo descer, incrementando o topo para se distanciar
        }

        //colisao com nave
        colisao(ship){
            let distX = this.element.offsetLeft - ship.element.offsetLeft;
            let distY = this.element.offsetTop - ship.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + ship.element.offsetWidth / 2;
            return distancia < soma;   
        }

        //colisao com laser
        tiro(laser){
            let distX = this.element.offsetLeft - laser.element.offsetLeft;
            let distY = this.element.offsetTop - laser.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + laser.element.offsetWidth / 2;
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
            this.vel = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
            space.element.appendChild(this.element);
        }

        move(){
            speed = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
            this.element.style.top = `${parseInt(this.element.style.top) + speed}px`; 
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

    class MeteorBig{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "meteor-big";
            this.element.src = "assets/meteorBig.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`
            this.vel = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
            space.element.appendChild(this.element);
        }

        move(){
            speed = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
            this.element.style.top = `${parseInt(this.element.style.top) + speed}px`; //faz o inimigo descer, incrementando o topo para se distanciar
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
            speed = Math.floor(Math.random() * (vmax - vmin + 1)) + vmin;
            this.element.style.top = `${parseInt(this.element.style.top) + speed}px`;
        }

        colisao(ship){
            let distX = this.element.offsetLeft - ship.element.offsetLeft;
            let distY = this.element.offsetTop - ship.element.offsetTop;
            let distancia = Math.sqrt(distX * distX + distY * distY);
            let soma = this.element.offsetWidth / 2 + ship.element.offsetWidth / 2;
            return distancia < soma;  
        }

        //colisao com laser
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
            this.element.style.bottom = `${parseInt(this.element.style.bottom) + 2}px`;


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

    class Score{
        constructor(){
            this.element = document.createElement("p1");
            this.element.innerText = score;
            this.element.className = "score";
            space.element.appendChild(this.element);
        }

        incrementa(enemy){
            let pts = parseInt(score);
            if (enemy.element.src.includes(enemy_l[0])) {
                pts += 50;
            } else if (enemy.element.src.includes(enemy_l[1])) {
                pts += 10;
            } else if (enemy.element.src.includes(enemy_l[2])) {
                pts += 100;
            } else if (enemy.element.src.includes(enemy_l[3])) {
                pts += 20;
            }
            score = pts.toString().padStart(6, "0");
            this.element.innerText = score;  
        }
    }

    class Restart{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "restart";
            this.element.src = "assets/restartButton.png"; //criação autoral hehe
            this.element.style.top = "400px";
            this.element.style.left = "210px";
            this.element.addEventListener("click", removeElemento);
            space.element.appendChild(this.element);
        }
    }

    class Inicio{
        constructor(){
            this.element = document.createElement("img");
            this.element.className = "inicio";
            this.element.src = "assets/inicioGame.png"; //criação autoral hehe
            this.element.style.top = "100px";
            this.element.style.left = "-200px";
            space.element.appendChild(this.element);
        }
    }

    //funcao para remover elemento da div
    function removeEnemy(enemy, lista) {
        let index = lista.indexOf(enemy);
        if (index !== -1) {
            lista[index].element.remove();
            lista.splice(index, 1);
        }
    }

    function gameOver() {
        if(lifes.length == 0){
            clearInterval(interval);
            iniciar= false;
            restartB = new Restart();
        }
      }  

    function removeElemento(){
        enemies.forEach((e) => e.element.remove()); //função para cada inimigo do array descer
        enemiesU.forEach((e) =>e.element.remove());
        meteorB.forEach((e) => e.element.remove())
        meteorS.forEach((e) => e.element.remove());
        lasers.forEach((e) => e.element.remove());
        enemies = [];
        enemiesU = [];
        meteorB = [];
        meteorS = [];
        lasers = [];
        vmin = 1;
        vmax = 4;
        restartB.element.remove();
        ponto.element.remove();
       
        restartB = false;

        init();
        space.element.removeChild(inicio.element);
        interval = window.setInterval(run, 1000 / FPS);
        iniciar = true;
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
              space.element.removeChild(lifes.pop().element);
            }
        }

        for (let i = 0; i < enemiesU.length; i++) {
            if (ship.colisao(enemiesU[i])) {
              space.element.removeChild(enemiesU[i].element);
              space.element.removeChild(lifes.pop().element);
            }
        }

        for (let i = 0; i < meteorB.length; i++) {
            if (ship.colisao(meteorB[i])) {
              space.element.removeChild(meteorB[i].element);
              space.element.removeChild(lifes.pop().element);
            }
        }

        for (let i = 0; i < meteorS.length; i++) {
            if (ship.colisao(meteorS[i])) {
              space.element.removeChild(meteorS[i].element);
              space.element.removeChild(lifes.pop().element);
            }
        }

        //funcao para atirar
        
        for (let i = 0; i < enemies.length; i++) {
            for (let j =0; j <lasers.length; j++){
                if (lasers[j].colisao(enemies[i])) {
                    space.element.removeChild(enemies[i].element);
                    space.element.removeChild(lasers[j].element);
                    ponto.incrementa(enemies[i]);
                }
            }
        }

        for (let i = 0; i < enemiesU.length; i++) {
            for (let j =0; j <lasers.length; j++){
                if (lasers[j].colisao(enemiesU[i])) {
                    space.element.removeChild(enemiesU[i].element);
                    space.element.removeChild(lasers[j].element);
                    ponto.incrementa(enemiesU[i]);
                }
            }   
        }

        for (let i = 0; i < meteorB.length; i++) {
            for (let j =0; j <lasers.length; j++){
                if (lasers[j].colisao(meteorB[i])) {
                    space.element.removeChild(meteorB[i].element);
                    space.element.removeChild(lasers[j].element);
                    ponto.incrementa(meteorB[i]);
                }
            }
        }

        for (let i = 0; i < meteorS.length; i++) {
            for (let j =0; j <lasers.length; j++){
                if (lasers[j].colisao(meteorS[i])) {
                    space.element.removeChild(meteorS[i].element);
                    space.element.removeChild(lasers[j].element);
                    ponto.incrementa(meteorS[i]);
                }
            }
        }
        
    
        //remover elementos da dom -> problema
        for(let i=0 ; i<enemies.length; i++){
            if(parseInt(enemies[i].element.style.top) > TAMY){
                removeEnemy(enemies[i],enemies);
            }
        }

        for(let i=0 ; i<enemiesU.length; i++){
            if(parseInt(enemiesU[i].element.style.top) > TAMY){
                removeEnemy(enemiesU[i],enemiesU);
            }
        }

        for(let i=0 ; i<meteorB.length; i++){
            if(parseInt(meteorB[i].element.style.top) > TAMY){
                removeEnemy(meteorB[i],meteorB);
            }
        }

        for(let i=0 ; i<meteorS.length; i++){
            if(parseInt(meteorS[i].element.style.top) > TAMY){
                removeEnemy(meteorS[i],meteorS);
            }
        }

        //funcao para remover os lasers quando eles saem da dom
        for(let i = 0; i < lasers.length; i++){
            if(parseInt(lasers[i].element.y) < 0){
                //space.element.removeChild(lasers[i].element);
                lasers[i].element.remove();
                lasers.splice(i, 1);
                i--;
            }
        }
        gameOver();
        ship.move();
    }


        

    init();
})(); //funcao imediata