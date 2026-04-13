var SceneCarga = {
    key: 'SceneCarga',
    active: false,
    preload: C_carga,
    create: C_inicio
    //extends: Phaser.Scene
};

function C_carga()
{
	let camera = this.cameras.main;
	
	let cajaCarga = this.add.image(camera.width/2,camera.height-100,'cajaCarga').setScale(1,0.7);
	let barraCarga = this.add.image(camera.width/2,camera.height-100,'barraCarga').setScale(1,0.7);
	let txt = this.add.text(cajaCarga.x,cajaCarga.y).setFontFamily('Arial').setFontSize(20).setColor('Black').setOrigin(0.5,0);
	
	this.load.on('progress',(valor) => {
		let ancho = Math.round(barraCarga.width * valor);
		barraCarga.setCrop(0,0,ancho,cajaCarga.height);
		txt.setText(Math.round(valor * 100)+'%');
		
		if(valor === 1)
			txt.setText('Listo!');
	});
	
	this.load.image('fondo', './img/fondo.png');
	this.load.image('titulo', './img/titulo.png');
	this.load.image('base', './img/base.png');
	this.load.image('tbnSalir', './img/btnSalir.png');
	this.load.image('btnAudio', './img/btnAudio.png');
	this.load.image('btnAudioOff', './img/btnAudioOff.png');
	this.load.image('btnSalir', './img/btnSalir.png');
	this.load.image('flecha', './img/flecha.png');
	this.load.image('amarillo', './img/amarillo.png');
	this.load.image('azul', './img/azul.png');
	this.load.image('rojo', './img/rojo.png');
	this.load.image('verde', './img/verde.png');
	this.load.image('cuadradoVerde', './img/cuadradoVerde.png');
	this.load.image('mano', './img/mano2.png');
	this.load.image('star', './img/star3.png');
	this.load.image('nuevoRecord', './img/nuevoRecord.png');
	
	// Cargar los Audios del Juego
	this.load.audio('bien', './audios/bien.mp3');
	this.load.audio('nonono', './audios/NONONO.mp3');
	this.load.audio('azul', './audios/azul.mp3');
	this.load.audio('amarillo', './audios/amarillo.mp3');
	this.load.audio('rojo', './audios/rojo.mp3');
	this.load.audio('verde', './audios/verde.mp3');
	this.load.audio('victoria', './audios/audioVictoria.mp3');
}

function C_inicio()
{
	this.cameras.main.fadeOut(1000,0,0,0);
	
	this.cameras.main.once('camerafadeoutcomplete',() => {
		this.scene.start('main');
	});
}