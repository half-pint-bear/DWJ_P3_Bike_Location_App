var canvas = document.getElementById('canvas');

var signature = {

	//Position du curseur lors du clic
	mouseX : 0,
	mouseY : 0,
	mouseDown : 0,

	//Position du doigt pour écran tactile
	touchX : 0,
	touchY : 0,

	//Dernière position enregistrée
	lastX : 0,
	lastY : 0,

	init : function() {
		contexte = canvas.getContext('2d');

		//Dessin à la souris
		canvas.addEventListener('mousedown', signature.clicSouris, false);
		canvas.addEventListener('mousemove', signature.deplacementSouris, false);
		canvas.addEventListener('mouseup', signature.relachementSouris, false);

		//Dessin au doigt
		canvas.addEventListener('touchstart', signature.pressionDoigt, false);
		canvas.addEventListener('touchmove', signature.deplacementDoigt, false);
		canvas.addEventListener('touchend', signature.relachementDoigt, false);

		//Dimensionnement canvas selon taille écran
		signature.canvasResponsive();

	},

	dessiner : function(contexte, x, y) {
		if (signature.lastX === 0) {
			signature.lastX = x;
			signature.lastY = y;
		}

		contexte.beginPath();
		contexte.moveTo(signature.lastX, signature.lastY);
		contexte.lineWidth = 5;
		contexte.lineJoin = "round";
		contexte.lineTo(x, y);
		contexte.stroke();
		contexte.closePath();

		signature.lastX = x;
		signature.lastY = y;
	},

	clicSouris : function() {
		signature.mouseDown = 1;
		signature.dessiner(contexte, signature.mouseX, signature.mouseY);

		sessionStorage.setItem('verification', 'ok');
	},

	relachementSouris : function() {
		signature.mouseDown = 0;

		signature.lastX = 0;
		signature.lastY = 0;
	},

	deplacementSouris : function(e) {
		signature.positionSouris(e);

		if(signature.mouseDown === 1) {
			signature.dessiner(contexte, signature.mouseX, signature.mouseY);
		}
	},

	positionSouris : function(e) {
		if(e.offsetX) {
			signature.mouseX = e.offsetX;
			signature.mouseY = e.offsetY;
		} else if(e.layerX) {
			signature.mousex = e.layerX;
			signature.mouseY = e.layerY;
		}
	},

	pressionDoigt : function(e) {
		signature.positionDoigt(e);
		signature.dessiner(contexte, signature.touchX, signature.touchY);

		sessionStorage.setItem('verification', 'ok');
		e.preventDefault();
	},

	relachementDoigt : function() {
		signature.lastX = 0;
		signature.lastY = 0;
	},

	deplacementDoigt : function(e) {
		signature.positionDoigt(e);
		signature.dessiner(contexte, signature.touchX, signature.touchY);
		e.preventDefault();
	},

	positionDoigt : function(e) {

		if(e.touches) {
			if(e.touches.length === 1) {
				var touch = e.touches[0];
				signature.touchX = touch.pageX - touch.target.offsetLeft;
				signature.touchY = touch.pageY - touch.target.offsetTop;
			}
		}
	},

	effacerCanvas : function() {
		contexte.clearRect(0, 0, canvas.width, canvas.height);
	},

	canvasResponsive : function() {
		this.canvasWidth();
		this.canvasHeight();
	},

	canvasWidth : function() {
		if($(window).width() <= 440) {
			canvas.width = 250;
		}
		else if($(window).width() <= 736 && $(window).width() > 440) {
			canvas.width = 350;
		}
		else {
			canvas.width = 490;
		}
	},

	canvasHeight : function() {
		if($(window).height() < 640) {
			canvas.height = 120;
		}
		else if($(window).height() < 736 && $(window).height() >= 640) {
			canvas.height = 200;
		}
		else {
			canvas.height = 320;
		}
	}

}