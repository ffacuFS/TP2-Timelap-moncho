export default class Nivel3 extends Phaser.Scene {
  constructor() {
    super("nivel3");
  }

  init(data) {
    this.cantidadEstrellas = data.cantidadEstrellas;
    console.log("Prueba !");
  }

  create() {
    // todo / para hacer: texto de puntaje
    const map = this.make.tilemap({ key: "map4" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const capaFondo = map.addTilesetImage("sky", "tilesFondo");
    const capaPlataformas = map.addTilesetImage("platform", "tilesPlataforma");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const fondoLayer = map.createLayer("fondo", capaFondo, 0, 0);
    const plataformaLayer = map.createLayer(
      "plataformas",
      capaPlataformas,
      0,
      0
    );
    const objectosLayer = map.getObjectLayer("objetos");

    plataformaLayer.setCollisionByProperty({ colision: true });

    console.log("spawn point player", objectosLayer);

    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    let spawnPoint = map.findObject("objetos", (obj) => obj.name === "jugador");
    console.log(spawnPoint);
    // The player and its settings
    this.jugador = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);

    spawnPoint = map.findObject("objetos", (obj) => obj.name === "salida");
    console.log("spawn point salida ", spawnPoint);
    this.salida = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "salida")
      .setScale(0.2);

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create empty group of starts
    this.estrellas = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectosLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.estrellas.create(x, y, "star");
          break;
        }
      }
    });

    this.physics.add.collider(this.jugador, plataformaLayer);
    this.physics.add.collider(this.estrellas, plataformaLayer);
    this.physics.add.collider(
      this.jugador,
      this.estrellas,
      this.recolectarEstrella,
      null,
      this
    );
    this.physics.add.collider(this.salida, plataformaLayer);
    this.physics.add.overlap(
      this.jugador,
      this.salida,
      this.esVencedor,
      () => this.cantidadEstrellas >= 1, // condicion de ejecucion
      this
    );

    /// mostrar cantidadEstrella en pantalla
    this.cantidadEstrellasTexto = this.add.text(
      15,
      15,
      "Estrellas recolectadas: " + this.cantidadEstrellas,
      { fontSize: "15px", fill: "#FFFFFF" }
    );

    this.cameras.main.startFollow(this.jugador);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cantidadEstrellasTexto.setScrollFactor(0);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-160);
      this.jugador.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(160);
      this.jugador.anims.play("right", true);
    }
    //stop
    else {
      this.jugador.setVelocityX(0);
      this.jugador.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.jugador.body.blocked.down) {
      this.jugador.setVelocityY(-330);
    }
  }

  recolectarEstrella(jugador, estrella) {
    estrella.disableBody(true, true);

    // todo / para hacer: sumar puntaje
    //this.cantidadEstrellas = this.cantidadEstrellas + 1;
    this.cantidadEstrellas++;

    this.cantidadEstrellasTexto.setText(
      "Estrellas recolectadas: " + this.cantidadEstrellas
    );
  }
  esVencedor(jugador, salida) {
    // if (this.cantidadEstrellas >= 5)
    // sacamos la condicion porque esta puesta como 4to parametro en el overlap

    console.log("estrellas recolectadas", this.cantidadEstrellas);

    this.scene.start("fin", {
      cantidadEstrellas: this.cantidadEstrellas,
      y: "este es un dato de muestra",
      z: "este es otro atributo enviado a otro escena",
    });
  }
}
