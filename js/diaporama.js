var indexDiapo = 1;

//Création de l'objet diaporama
var diaporama = {

	//Méthode d'intialisation
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

		//Masquer par défaut toutes les images
		for(i = 0; i < diapositives.length; i++) {
			diapositives[i].style.display = "none";
		};

		//Afficher 1 image à la fois
		diapositives[indexDiapo - 1].style.display = "block";
		
	},

	/*diapoEnCours : 	function(n) {
		this.initDiapo(indexDiapo = n);
	},*/

	changerDiapo : 	function(n) {
		this.initDiapo(indexDiapo += n);
	},

}


//Actions lors du clic sur les flèches à l'écran
$('#suivant').on('click', function() {
	diaporama.changerDiapo(1);
});

$('#precedent').on('click', function() {
	diaporama.changerDiapo(-1);
});

//Action lors de l'appui sur les flèches du clavier
$('body').keydown(function(e) {
	switch (e.which) {

		case 37://Flèche gauche
			diaporama.changerDiapo(-1);
			break;

		case 39://Flèche droite
			diaporama.changerDiapo(1);
			break;
	}
});

//Lancement du diaporama
diaporama.initDiapo(indexDiapo);