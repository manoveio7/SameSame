
var main = {
		key: 'main',
		active: false,
		create: inicio
		//extends: Phaser.Scene
	};
var estaScena;	
var fondo;
var camera;
var btnAudio;
var flecha;
var amarillo;
var azul;
var rojo;
var verde;
var LUCES;
var BOTONES;
var LISTA;
var vueltas;
var texto;
var txtVuelta;
var audioBien;
var audioNonono;
var audioAmarillo;
var audioRojo;
var audioAzul;
var audioVerde;
var audioVictoria;
var AUDIOS;
var respuesta;
var btnNovale;
var gameOver;
var nuevoGanador;
var element;
var mano;
var particulaWIn;
var puntosGuadados = [];
var nuevoRecord;

function inicio()
{
	//localStorage.removeItem('puntosGuadados');
	
	puntosGuadados = localStorage.getItem('puntosGuadados');
	
	if(puntosGuadados === null)
	{
		puntosGuadados = [
		{
			nombre: 'aaaaa',
			puntos: 20
		},
		{
			nombre: 'bbbbb',
			puntos: 15
		},
		{
			nombre: 'ccccc',
			puntos: 10
		}];
	}
	else
		puntosGuadados = JSON.parse(puntosGuadados);

	gameOver = false;
	respuesta = 0;
	vueltas = 0;
	LUCES = [];
	BOTONES = [];
	LISTA = [];
	AUDIOS = [];
	
	estaScena = this;
	camera  = this.cameras.main;
	
	camera.fadeIn(500,0,0,0);
	
	/*
	camera.once('camerafadeincomplete',() =>{
	alert('listo ya se puede empezar a jugar')
	});
	*/
	
	audioBien = this.sound.add('bien');
	audioNonono = this.sound.add('nonono');
	audioAmarillo = this.sound.add('amarillo');
	audioRojo = this.sound.add('rojo');
	audioAzul = this.sound.add('azul');
	audioVerde = this.sound.add('verde');
	audioVictoria = this.sound.add('victoria');
	AUDIOS.push(audioVerde,audioRojo,audioAzul,audioAmarillo,audioBien,audioNonono,audioVictoria);
	
	let margenX = camera.width/5;
	let margenY = camera.height;
	
	fondo = this.add.image(camera.width/2,camera.height/2,'fondo').setOrigin(0.5).setDisplaySize(camera.height,camera.width).setAngle(90);
	
	let base = this.add.image(camera.width/2,camera.height/2,'base').setDisplaySize(camera.width - margenX, camera.width - margenX);
	let puntoYTitulo = base.y- base.height / 2

	let titulo = this.add.image(camera.width/2,puntoYTitulo,'titulo').setDisplaySize(camera.width - margenX,(camera.width - margenX) / 2);
	let tamBtn = camera.width/8;
	btnAudio = this.add.image(margenX,camera.height-tamBtn,'btnAudio').setDisplaySize(tamBtn,tamBtn).setInteractive();
	btnAudio.on('pointerdown',controlAudio);
	
	txtVuelta = this.add.text(camera.width/2,camera.height/2,vueltas).setFontFamily('Arial').setFontSize(50).setColor('White').setOrigin(0.5).setVisible(false);
	
	flecha = this.add.image(camera.width/2,camera.height/2,'flecha').setDisplaySize(camera.width/7,camera.width/7).setInteractive();
	flecha.on('pointerdown', iniciaJuego);
	
	amarillo = this.add.image(camera.width/2,camera.height/2,'amarillo').setDisplaySize(camera.width - margenX, camera.width - margenX).setVisible(false);;
	azul = this.add.image(camera.width/2,camera.height/2,'azul').setDisplaySize(camera.width - margenX, camera.width - margenX).setVisible(false);;
	rojo = this.add.image(camera.width/2,camera.height/2,'rojo').setDisplaySize(camera.width - margenX, camera.width - margenX).setVisible(false);;
	verde = this.add.image(camera.width/2,camera.height/2,'verde').setDisplaySize(camera.width - margenX, camera.width - margenX).setVisible(false);;
	LUCES.push(verde,rojo,azul,amarillo);
	//this.input.on('pointerdown', toque);

	var piscar = this.time.addEvent({
	delay: 300,                // ms
	callback: PiscarFlecha,
	//args: [],
	//callbackScope: this,
	loop: true,
	//repeat: 0,
	//startAt: 0,
	//timeScale: 1,
	 
	 pause: false
	});
	
	// Crear los 4 botones...
	for(let i = 0; i < 4; i++){
	 	let btn = this.add.image(camera.width/2,camera.height/2,'cuadradoVerde');
	 	btn.setInteractive().setVisible(false);
	 	btn.on('pointerdown', responder);
	 	btn.setAlpha(0.000001).setDisplaySize(camera.width/3,camera.width/3);
	 	
	 	switch (i) {
		 	case 0:
		 		btn.setOrigin(1,1);	
		 		btn.codigo = i	
		 	break;
		 	case 1:
		 		btn.setOrigin(0,1);
		 		btn.codigo = i	
		 	break;
		 	case 2:
		 		btn.setOrigin(0,0);
		 		btn.codigo = i	
		 	break;
		 	case 3:
		 		btn.setOrigin(1,0);
		 		btn.codigo = i	
		 	break;
	 	}
	 	BOTONES.push(btn);
	 }
	texto = this.add.text(camera.width/2,camera.height/2+base.displayWidth/2,'ATENCION!').setFontFamily('Arial').setFontSize(30).setColor('White').setOrigin(0.5,0).setVisible(false);
	texto.setFontStyle('bold italic').setFontFamily('Open Sans');
	btnNovale = this.add.image(camera.width/2,camera.height/2,'cuadradoVerde').setDisplaySize(camera.width - margenX, camera.width - margenX);
	btnNovale.setInteractive().setAlpha(0.000001).setVisible(false);
	btnNovale.on('pointerdown', ()=>{
		if(!texto.visible)
			texto.setVisible(true);
			texto.setText('Espere terminar la secuencia.');
		
		estaScena.time.addEvent({
			delay: 3000,
			callback: ()=> {
				texto.setVisible(false);
			}
		});
	});
	
	mano = this.add.image(camera.width/2,camera.height/2,'mano').setDisplaySize(tamBtn*2,tamBtn*2).setVisible(false);
	mano.flipX = true;
	
	let tamNuevoRec = camera.width/1.5;
	nuevoRecord = this.add.image(camera.width/2,camera.height+500,'nuevoRecord').setDisplaySize(tamNuevoRec,tamNuevoRec/3).setVisible(false);
	
}

function controlAudio()
{
	for(let i = 0; i < AUDIOS.length; i++)
	{
		if(AUDIOS[i].volume === 0)
		{
			AUDIOS[i].volume = 1;
			btnAudio.setTexture('btnAudio');
		}
		else 
		{
			AUDIOS[i].volume = 0;
			btnAudio.setTexture('btnAudioOff');
		}
	}
}

function PiscarFlecha()
{
	let a = flecha.alpha > 0.5 ? 0.5 : 1;
	flecha.setAlpha(a);
	flecha.setAlpha(a);	
}

function PiscarVuelta()
{
	let a = texto.alpha > 0.5 ? 0.5 : 1;
	texto.setAlpha(a);
	texto.setAlpha(a);	
}

function iniciaJuego()
{
	if(gameOver)
	{
		estaScena.cameras.main.fadeOut(1000,0,0,0);
		
		estaScena.cameras.main.once('camerafadeoutcomplete',() => {
			estaScena.scene.restart();
		});
	}
	else
	{
		//Ovultar flecha de play...
		if(flecha.visible)
			flecha.setVisible(false);
			
	// Mostrar Vurltas...
		txtVuelta.setVisible(true);
			
			btnNovale.setVisible(true);
		//Ocultamos los 4 botones...
		for(let i = 0; i < BOTONES.length; i++)
		{
			BOTONES[i].setVisible(false);
		}
		
		// Mostrar texto de ATENCION...
		texto.setVisible(true).setText('Atención!');;	
		
		estaScena.time.addEvent({
			delay: 1000,
			callback: ()=> {
				texto.setVisible(false);
				iniciarVuelta();
			}
		});
	}
}

function iniciarVuelta()
{
	let v = Phaser.Math.Between(0,3);
	
	mano.setVisible(true);	
	
	LISTA.push(v);
	
	let m = 1;
	let t = 1000;
	
	for(let i = 0; i < LISTA.length; i++){
		let r = t * m;
		prenderApagarLuz(i,false,true,r)//aqui prende la luz...
		m++;
		prenderApagarLuz(i,true,false,r+200)//aqui apaga la luz...
	}
	
}

function prenderApagarLuz(i,apaga = false, prende = false,t)
{
	estaScena.time.addEvent({
		delay: t,
		callback: ()=> {
			if(apaga)
			{
				LUCES[LISTA[i]].setVisible(false);
				
				if(i === LISTA.length-1)
				{
					// Activar botones para responder...
					for(let a = 0; a < BOTONES.length; a++)
					{
						BOTONES[a].setVisible(true);
						texto.setText('Listo!').setVisible(true);
						btnNovale.setVisible(false);
						mano.setVisible(false);
					}
				}
				
			}
			if(prende)
			{
				LUCES[LISTA[i]].setVisible(true);
				AUDIOS[LISTA[i]].play();
			}
		}
	});
}

function responder()
{
	if(LISTA.length < 1)
		return;
		
	texto.setVisible(false);
	
	if(this.codigo === LISTA[respuesta])
	 {	 	
	 	if(respuesta === LISTA.length-1)
			vueltacompletada();
		else
	 		respuestaCorrecta(LISTA[respuesta]);
	 }
	else
		pierde(LISTA[respuesta]);
	
}

function pierde(num)
{
	gameOver = true;
	
	let resp = num;
	
	LISTA = [];
	
	audioNonono.play();
	
	for(let i = 0; i < BOTONES.length; i++)
	{
		BOTONES[i].setVisible(false);
	}
	
	//Mostrar cual era el btn correcto...
	let t = 400;
	
	for(let i = 0; i < 4; i++)
	{
		//Prende la luz del btn...
		estaScena.time.addEvent({
			delay: t*i,
			callback: ()=> {
				LUCES[resp].setVisible(true);	
			}
		});
		//Apaga la luz del btn...
		estaScena.time.addEvent({
			delay: t*i + 200,
			callback: ()=> {
				LUCES[resp].setVisible(false);	
			}
		});
			
			//Animar luces...
		estaScena.time.addEvent({
			delay: t*i+400,
			callback: ()=> {
				if(i === 3)
					animacionLuces();
			}
		});
	}
}

function respuestaCorrecta(resp)
{
	respuesta++;
	AUDIOS[resp].play();
	LUCES[resp].setVisible(true);
		
	estaScena.time.addEvent({
		delay: 200,
		callback: ()=> {
				LUCES[resp].setVisible(false);	
			}
		});
	
	estaScena.time.addEvent({
		delay: 500,
		callback: ()=> {
			//iniciaJuego();
			for(let a = 0; a < BOTONES.length; a++)
			{
				BOTONES[a].setVisible(true);
			}
		}
	});
}

function vueltacompletada()
{
	for(let i = 0; i < BOTONES.length; i++)
	{
		BOTONES[i].setVisible(false)//.setActive(false);
	}
	
	audioBien.play();
//Revisar si alcanso algun record...
	for(let i = 0; i < puntosGuadados.length; i++)
		{
			if(vueltas > puntosGuadados[i].puntos)
			{
				particulas(vueltas*2);
				audioVictoria.play();
				break;
			}
		}
	
	estaScena.tweens.add({
		targets: txtVuelta,
		duration: 200,
		scale: 2,
		ease: 'sine',//'back',
		onComplete: () =>{
			vueltas++;
			txtVuelta.setText(vueltas);
			estaScena.tweens.add({
				targets: txtVuelta,
				duration: 300,
				scale: 1,
				ease: 'sine'
			});
		} 
	});
	
	txtVuelta.setText(vueltas);
	
	for(let i = 0; i < LUCES.length; i++)
	{
		LUCES[i].setVisible(true);
		
		estaScena.time.addEvent({
		delay: 200,
		callback: ()=> {
				LUCES[i].setVisible(false);	
			}
		});
	}
	estaScena.time.addEvent({
		delay: 500,
		callback: ()=> {
			iniciaJuego();
			respuesta = 0;
		}
	});
}

function animacionLuces()
{
	let t = 100;
	
	for(let i = 0; i < 8; i++)
	{
		luz(t*i,true,i);
		luz(t*i,false,i);
	}
}

function luz(t,a,b)
{
	let k = b > 3 ? b - 4 : b - 0;
//	if(b > 3)
//		b - 4
		
	if(a)
	{
		estaScena.time.addEvent({
			delay: t,
			callback: ()=> {
			LUCES[k].setVisible(true);	
			}
		});
	}
	else
	{
		estaScena.time.addEvent({
			delay: t+125,
			callback: ()=> {
				LUCES[k].setVisible(false);
				if(b === 7)
				{
					texto.setVisible(true).setText('GAME OVER');	
					
					estaScena.time.addEvent({
					delay: 300,                // ms
					callback: PiscarVuelta,
					//args: [],
					//callbackScope: this,
					loop: true,
					//repeat: 0,
					//startAt: 0,
					//timeScale: 1,
					
					pause: false
					});
				
					animacionFinal();
				}
			}
		});
	}
}

function animacionFinal()
{
	let t = 200;
	
	for(let i = 0; i < 1; i++)
	{
	//Prende la luz del btn...
	estaScena.time.addEvent({
		delay: t*i,
		callback: ()=> {
			for(let a = 0; a <  LUCES.length; a++)
			{
				LUCES[a].setVisible(true);
			}	
		}
	});
	//Apaga la luz del btn...
	estaScena.time.addEvent({
		delay: t*i + 100,
		callback: ()=> {
			for(let a = 0; a <  LUCES.length; a++)
			{
			LUCES[a].setVisible(false);
			}		
		}
	});
	
	//Animar luces...
	estaScena.time.addEvent({
		delay: t*i+400,
		callback: ()=> {
			if(i === 0)
				finalJuego();
			}
		});
	}
}

function finalJuego()
{
	txtVuelta.setVisible(false);
	revisarPuntuacion();
	flecha.setVisible(true);
}

function revisarPuntuacion()
{
	let w = false;
	
	for(let k = 0; k < puntosGuadados.length; k++)
	{	
		if(vueltas > puntosGuadados[k].puntos)
		{
			cajaDeTexto();
			break;
			w = true;
		}	
	}
	
	if(!w) 
	{
	
		for(let i = 0; i < puntosGuadados.length; i++)
		{
			let dg = i === 0 ? 1+'- '+puntosGuadados[i].nombre+': '+puntosGuadados[i].puntos : texto.text;
			texto.setText(i === 0 ? dg : dg += "\n" + (i+1) + "- "+ puntosGuadados[i].nombre+": "+puntosGuadados[i].puntos);
		}
		// Se guarda en localStorage despues de JSON stringificarlo 
		localStorage.setItem('puntosGuadados', JSON.stringify(puntosGuadados));
	}
}

function guardarDatos()
{	
	let a = false;
	
	let v;
	
	for(let k = 0; k < puntosGuadados.length; k++)
	{	
		if(vueltas > puntosGuadados[k].puntos && !a)
		{
			v = k;
			a = true;
		}
	}
	
	if(a)
	{
		puntosGuadados.splice(v,0,nuevoGanador);
		puntosGuadados.pop();
	}

	for(let i = 0; i < puntosGuadados.length; i++)
	{
		let dg = i === 0 ? 1+'- '+puntosGuadados[i].nombre+': '+puntosGuadados[i].puntos : texto.text;
		texto.setText(i === 0 ? dg : dg += "\n" + (i+1) + "- "+ puntosGuadados[i].nombre+": "+puntosGuadados[i].puntos);
	}
	// Se guarda en localStorage despues de JSON stringificarlo 
	localStorage.setItem('puntosGuadados', JSON.stringify(puntosGuadados));
}

function cajaDeTexto()
{
	//flecha.setVisible(false);
	flecha.removeInteractive();
	var text = estaScena.add.text(10, 10, 'Favor Ingrese su Nombre', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
	
	var element = estaScena.add.dom(200, 600).createFromCache('nameform');
	
	element.setPerspective(800);
	
	element.addListener('click');
	
	element.on('click', function (event) {
	
	if (event.target.name === 'loginButton')
	{
		var inputUsername = this.getChildByName('username');
		
		//  Have they entered anything?
		if (inputUsername.value !== '')
		{
			//  Turn off the click events
			this.removeListener('click');
			
			//  Tween the login form out
			this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });
			
			this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: camera.height+100, duration: 3000, ease: 'Power3',
			onComplete: function ()
				{
					element.setVisible(false);
					flecha.setInteractive();
				}
			});
			
			//  Populate the text with whatever they typed in as the username!
			text.setVisible(false);
			nuevoGanador = {nombre: inputUsername.value, puntos: vueltas};
			
			guardarDatos();
			}
			else
			{
			//  Flash the prompt
			this.scene.tweens.add({ targets: text, scale: 3, duration: 200, ease: 'Power3', yoyo: true });
			}
		}
	
	});
	
	estaScena.tweens.add({
		targets: element,
		y: 300,
		duration: 3000,
		ease: 'Power3'
	});
}

function particulas(cantidad)
{
	let part = estaScena.add.particles('star');
	part.createEmitter({
	x: camera.width/2,
	y: camera.height/2,
	speed: 300,
    //quantity: 40,
	//frequency: 500,
	lifespan: {min:1000,max:4500},
	rotate: {start: 0.1,end: 360},
	maxParticles: cantidad,
	scale: { start: 7, end: 0 },
	tint: [0xffffff,0xff0000, 0x00ff00,0x0000ff, 0xf0f0f0,0x0f0f0f],
	alpha: { start: 1, end: 0 },
	blendMode: 1// 'ADD',
	});
	
	llamarNuevoRecord();
}

function llamarNuevoRecord()
{
	nuevoRecord.setVisible(true);
	
	estaScena.tweens.add({
	targets: nuevoRecord,
	y: camera.height-70,
	duration: 1000,
	ease: 'Power3'
	});
	
	estaScena.time.addEvent({
	delay: 2000,
	callback: ()=> {
		estaScena.tweens.add({
			targets: nuevoRecord,
			y: camera.height+100,
			duration: 1500,
			ease: 'Power3'
			});
		}
	});
}