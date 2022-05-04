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
    this.pontos = 0;
    this.salvos = 0;
    this.perdidos = 0;
    this.energia = 3;
    this.somDisparo = document.getElementById("somDisparo");
    this.somExplosao = document.getElementById("somExplosao");
    this.musica = document.getElementById("musica");
    this.somGameover = document.getElementById("somGameover");
    this.somPerdido = document.getElementById("somPerdido");
    this.somResgate = document.getElementById("somResgate");
  }

  start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    $(document).keydown((e) => {
      this.game.pressionou[e.which] = true;
    });

    $(document).keyup((e) => {
      this.game.pressionou[e.which] = false;
    });

    this.game.timer = setInterval(() => {
      this.moveJogador();
      this.moveAmigo();
      this.moveInimigo1();
      this.moveInimigo2();
      this.moveFundo();
      this.colisao();
      this.placar();
      this.exibirEnergia();
      this.musicaDeFundo();
    }, 30);
  }

  musicaDeFundo() {
    this.musica.addEventListener(
      "ended",
      () => {
        this.musica.currentTime = 0;
        this.musica.play();
      },
      false
    );
    this.musica.play();
  }

  moveFundo() {
    let esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
  }

  moveJogador() {
    if (this.game.pressionou[this.TECLA.W]) {
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 10);

      if (topo <= 0) {
        $("#jogador").css("top", topo + 10);
      }
    }

    if (this.game.pressionou[this.TECLA.S]) {
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo + 10);

      if (topo >= 434) {
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
    $("#inimigo1").css("left", posicaoX - this.valocidadeDoInimigo);
    $("#inimigo1").css("top", this.posicaoY);

    if (posicaoX <= 50) {
      this.posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", this.posicaoY);
    }
  }

  moveInimigo2() {
    let posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - 3);

    if (posicaoX <= 0) {
      $("#inimigo2").css("left", 775);
    }
  }

  moveAmigo() {
    let posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX + 1);

    if (posicaoX > 906) {
      $("#amigo").css("left", 0);
    }
  }

  disparo() {
    if (this.podeAtirar === true) {
      this.somDisparo.play();
      this.podeAtirar = false;
      let topo = parseInt($("#jogador").css("top"));
      let posicaoX = parseInt($("#jogador").css("left"));
      let tiroX = posicaoX + 190;
      let topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div>");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      this.tempoDisparo = setInterval(() => {
        this.executaDisparo();
      }, 50);
    }
  }

  executaDisparo() {
    let posicaoX = parseInt($("#disparo").css("left"));
    $("#disparo").css("left", posicaoX + 15);
    if (posicaoX > 900) {
      window.clearInterval(this.tempoDisparo);
      this.tempoDisparo = null;
      $("#disparo").remove();
      this.podeAtirar = true;
    }
    return;
  }

  colisao() {
    let colisao1 = $("#jogador").collision($("#inimigo1"));
    let colisao2 = $("#jogador").collision($("#inimigo2"));
    let colisao3 = $("#disparo").collision($("#inimigo1"));
    let colisao4 = $("#disparo").collision($("#inimigo2"));
    let colisao5 = $("#jogador").collision($("#amigo"));
    let colisao6 = $("#inimigo2").collision($("#amigo"));
    if (colisao1[0] !== undefined) {
      let inimigo1X = parseInt($("#inimigo1").css("left"));
      let inimigo1y = parseInt($("#inimigo1").css("top"));
      this.explosao1(inimigo1X, inimigo1y);

      this.posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", this.posicaoY);
      this.energia--;
    }

    if (colisao2[0] !== undefined) {
      let inimigo2X = parseInt($("#inimigo2").css("left"));
      let inimigo2Y = parseInt($("#inimigo2").css("top"));
      this.explosao2(inimigo2X, inimigo2Y);

      $("#inimigo2").remove();

      this.reposicionaInimigo2();
      this.energia--;
    }

    if (colisao3[0] !== undefined) {
      let inimigo1X = parseInt($("#inimigo1").css("left"));
      let inimigo1Y = parseInt($("#inimigo1").css("top"));

      this.explosao1(inimigo1X, inimigo1Y);
      $("#disparo").css("left", 950);

      let posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
      this.pontos = this.pontos + 100;
      this.valocidadeDoInimigo = this.valocidadeDoInimigo + 0.3;
    }

    if (colisao4[0] !== undefined) {
      let inimigo2X = parseInt($("#inimigo2").css("left"));
      let inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();

      this.explosao2(inimigo2X, inimigo2Y);
      $("#disparo").css("left", 950);

      this.reposicionaInimigo2();
      this.pontos = this.pontos + 50;
    }

    if (colisao5[0] !== undefined) {
      this.somResgate.play();
      this.reposicionaAmigo();
      $("#amigo").remove();
      this.salvos++;
    }

    if (colisao6[0] !== undefined) {
      let amigoX = parseInt($("#amigo").css("left"));
      let ammigoY = parseInt($("#amigo").css("top"));
      this.explosao3(amigoX, ammigoY);
      $("#amigo").remove();
      this.perdidos++;
      if (this.perdidos>3) {
        this.gameOver();
      } else {
        this.reposicionaAmigo();
      }
    }
  }

  explosao1(inimigo1X, inimigo1Y) {
    this.somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div>");
    $("#explosao1").css("background-image", "url('../imgs/explosao.png')");
    let div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    this.tempoExplosao = setInterval(() => {
      div.remove();
      window.clearInterval(this.tempoExplosao);
      this.tempoExplosao = null;
    }, 1000);
  }

  explosao2(inimigo2X, inimigo2Y) {
    this.somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url('../imgs/explosao.png')");
    var div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    function removeExplosao2() {
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
    }
  }

  explosao3(amigoX, amigoY) {
    this.somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);

    let tempoExplosao3 = setInterval(() => {
      $("#explosao3").remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3 = null;
    }, 1000);
    this.fimdejogo = true;
  }

  reposicionaInimigo2() {
    let tempoColisao4 = setInterval(() => {
      window.clearInterval(tempoColisao4);
      tempoColisao4 = null;
      if (this.fimdejogo == false) {
        $("#fundoGame").append("<div id='inimigo2'></div");
      }
    }, 5000);
  }

  reposicionaAmigo() {
    let tempoAmigo = setInterval(() => {
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;

      if (this.fimdejogo == false) {
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      }
    }, 6000);
  }

  placar() {
    $("#placar").html(
      "<h2> Pontos: " +
        this.pontos +
        " Salvos: " +
        this.salvos +
        " Perdidos: " +
        this.perdidos +
        "</h1>"
    );
  }

  exibirEnergia() {
    if (this.energia == 3) {
      $("#energia").css("background-image", "url('../imgs/energia3.png')");
      this.somPerdido.play();
    }

    if (this.energia == 2) {
      $("#energia").css("background-image", "url('../imgs/energia2.png')");
      this.somPerdido.play();
    }

    if (this.energia == 1) {
      $("#energia").css("background-image", "url('../imgs/energia1.png')");
      this.somPerdido.play();
    }

    if (this.energia == 0) {
      this.gameOver();
    }
  }

  gameOver() {
    $("#energia").css("background-image", "url('../imgs/energia0.png')");
    this.fimdejogo = true;
    this.musica.pause();
    this.somGameover.play();

    window.clearInterval(this.game.timer);
    this.game.timer = null;

    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html(
      "<h1> Game Over </h1><p>Sua pontuação foi: " +
        this.pontos +
        "</p>" +
        "<div id='reinicia' onClick=inicio.reiniciaJogo()><h3>Jogar Novamente</h3></div>"
    );
  }

  reiniciaJogo() {
    this.somGameover.pause();
    $("#fim").remove();
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
    this.pontos = 0;
    this.salvos = 0;
    this.perdidos = 0;
    this.energia = 3;
    this.somDisparo = document.getElementById("somDisparo");
    this.somExplosao = document.getElementById("somExplosao");
    this.musica = document.getElementById("musica");
    this.somGameover = document.getElementById("somGameover");
    this.somPerdido = document.getElementById("somPerdido");
    this.somResgate = document.getElementById("somResgate");
    this.start();
  }
}
