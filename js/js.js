class Jogo {
  constructor() {
    this.game = {
      timer: 0,
      pressionou: [],
    };
    this.TECLA = {
      W: 87,
      S: 83,
      D: 68,
    };
    this.valocidadeDoInimigo = 5;
    this.posicaoY = parseInt(Math.random() * 334);
    this.podeAtirar = true;
    this.tempoDisparo = null;
    this.tempoExplosao = null;
    this.fimdejogo = false;
  }

  start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

    $(document).keydown((e) => {
      this.game.pressionou[e.which] = true;
    });

    $(document).keyup((e) => {
      this.game.pressionou[e.which] = false;
    });

    this.game.timer = setInterval(()=>{
        this.moveJogador();
        this.moveAmigo();
        this.moveInimigo1();
        this.moveInimigo2();
        this.moveFundo();
        this.colisao();
    }, 30);
  }

  loop() {
    this.moveFundo();
  }

  moveFundo() {
    let esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
  }

  moveJogador() {
    if (this.game.pressionou[this.TECLA.W]) {
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 10);

      if (topo<=0) {
        $("#jogador").css("top", topo + 10);
      }
    }

    if (this.game.pressionou[this.TECLA.S]) {
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo + 10);

      if (topo>=434) {
        $("#jogador").css("top", topo - 10);
      }
    }

    if (this.game.pressionou[this.TECLA.D]) {
      console.log("Rodou");
      this.disparo();
    }
  }

  moveInimigo1() {
    
    let posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX-this.valocidadeDoInimigo);
    $("#inimigo1").css("top", this.posicaoY);

    if (posicaoX <= 50) {
        this.posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", this.posicaoY);
    }
  }

  moveInimigo2() {
    
    let posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX-3);

    if (posicaoX <= 0) {
        $("#inimigo2").css("left", 775);
    }
  }

  moveAmigo() {
    let posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX+1);

    if (posicaoX > 906) {
      $("#amigo").css("left", 0);
      
    }
  }

  disparo() {
    if (this.podeAtirar === true) {
      this.podeAtirar = false;
      let topo = parseInt($("#jogador").css("top"));
      let posicaoX = parseInt($("#jogador").css("left"));
      let tiroX = posicaoX + 190;
      let topoTiro = topo+37;
      $("#fundoGame").append("<div id='disparo'></div>");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      this.tempoDisparo = setInterval(()=>{
        this.executaDisparo();
      }, 50);
    } 
  }

  executaDisparo() {
    let posicaoX = parseInt($("#disparo").css("left"));
    $("#disparo").css("left", posicaoX+15);
      if (posicaoX>900) {
        window.clearInterval(this.tempoDisparo);
        this.tempoDisparo = null;
        $("#disparo").remove();
        this.podeAtirar = true;
      }
      return;
  } 

  colisao() {
    let colisao1 = ($("#jogador").collision($("#inimigo1")));
    let colisao2 = ($("#jogador").collision($("#inimigo2")));
    let colisao3 = ($("#disparo").collision($("#inimigo1")));
    let colisao4 = ($("#disparo").collision($("#inimigo2")));
    let colisao5 = ($("#jogador").collision($("#amigo")));
    let colisao6 = ($("#inimigo2").collision($("#amigo")));
    if (colisao1[0] !== undefined) {
      let inimigo1X = parseInt($('#inimigo1').css("left"));
      let inimigo1y = parseInt($('#inimigo1').css("top"));
      this.explosao1(inimigo1X, inimigo1y);

      this.posicaoY = parseInt(Math.random()*334);
      $('#inimigo1').css("left", 694);
      $('#inimigo1').css("top", this.posicaoY);
    }

    if (colisao2[0] !== undefined) {
	
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      this.explosao2(inimigo2X,inimigo2Y);
          
      $("#inimigo2").remove();
        
      reposicionaInimigo2();
        
      }	

    if (colisao3[0] !== undefined) {
  
  
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
        
      this.explosao1(inimigo1X,inimigo1Y);
      $("#disparo").css("left",950);
        
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left",694);
      $("#inimigo1").css("top",posicaoY);
        
      }

    if (colisao4[0] !== undefined) {

      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();
    
      this.explosao2(inimigo2X,inimigo2Y);
      $("#disparo").css("left",950);
      
      reposicionaInimigo2();
        
      }

    if (colisao5[0] !== undefined) {

      reposicionaAmigo();
      $("#amigo").remove();
    }
  }

  explosao1(inimigo1X, inimigo1Y) {
    $('#fundoGame').append("<div id='explosao1'></div>");
    $('#explosao1').css("background-image", "url('../imgs/explosao.png')");
    let div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({width:200, opacity:0}, "slow");

    this.tempoExplosao = setInterval(()=>{
      div.remove();
      window.clearInterval(this.tempoExplosao);
      this.tempoExplosao = null;
    }, 1000);
    
  }


  explosao2(inimigo2X,inimigo2Y) {
	
    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url('../imgs/explosao.png')");
    var div2=$("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
    
      function removeExplosao2() {
        
        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2=null;
        
      }
      
      
  }

  reposicionaInimigo2() {
	
    var tempoColisao4=window.setInterval(reposiciona4, 5000);
      
      function reposiciona4() {
      window.clearInterval(tempoColisao4);
      tempoColisao4=null;
        
        if (fimdejogo==false) {
        
        $("#fundoGame").append("<div id='inimigo2'></div");
        
      }
        
    }	
  }
  
  reposicionaAmigo() {
	
    var tempoAmigo=window.setInterval(reposiciona6, 6000);
    
      function reposiciona6() {
      window.clearInterval(tempoAmigo);
      tempoAmigo=null;
      
      if (fimdejogo==false) {
      
      $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      
      }
      
    }
    
  }
  
}
