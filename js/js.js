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
        this.moveInimigo1();
        this.moveFundo();
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
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 10);


    }
  }

  moveInimigo1() {
    
    let posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX-this.valocidadeDoInimigo);
    $("#inimigo1").css("top", this.posicaoY);

    console.log(posicaoX);

    if (posicaoX <= 50) {
        this.posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", this.posicaoY);
    }
  }
}
