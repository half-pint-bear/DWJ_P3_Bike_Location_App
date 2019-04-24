var indexDiapo = 1;

//CrÃ©ation de l'objet diaporama
var diaporama = {

	//MÃ©thode d'intialisation
	initDiapo : function(n) {
		var i; 
		var diapositives = document.getElementsByClassName('diapo');
		
		//Afficher images en boucle
		if(n > diapositives.length) {
			indexDiapo = 1;
		};

		if(n < 1) {
			indexDiapo = diapositives.length;
		};

		//Masquer par dÃ©faut toutes les images
		for(i = 0; i < diapositives.length; i++) {
			diapositives[i].style.display = "none";
		};

		//Afficher 1 image Ã  la fois
		diapositives[indexDiapo - 1].style.display = "block";
		
	},

	/*diapoEnCours : 	function(n) {
		this.initDiapo(indexDiapo = n);
	},*/

	changerDiapo : 	function(n) {
		this.initDiapo(indexDiapo += n);
	},

}


//Actions lors du clic sur les flÃ¨ches Ã  l'Ã©cran
$('#suivant').on('click', function() {
	diaporama.changerDiapo(1);
});

$('#precedent').on('click', function() {
	diaporama.changerDiapo(-1);
});

//Action lors de l'appui sur les flÃ¨ches du clavier
$('body').keydown(function(e) {
	switch (e.which) {

		case 37://FlÃ¨che gauche
			diaporama.changerDiapo(-1);
			break;

		case 39://FlÃ¨che droite
			diaporama.changerDiapo(1);
			break;
	}
});

//Lancement du diaporama
diaporama.initDiapo(indexDiapo);