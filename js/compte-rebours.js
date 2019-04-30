var declenchement;

var compteARebours = {
	initCompteur : function(station) {

		$('#compteur').html("Votre réservation à la station <span id='station'></span> est effective pendant <span id='compteurMinutes'></span> minutes et <span id='compteurSecondes'></span> secondes.");
		
		var fin = new Date().getTime() + 1200000;
		
		declenchement = setInterval(function() {
			var debut = new Date().getTime();


			if(sessionStorage.getItem("tempsRestant")){
				var tempsRestant = sessionStorage.getItem("tempsRestant") - 1000;
			}else{
				var tempsRestant = fin - debut;
			}
			sessionStorage.setItem("tempsRestant", tempsRestant);

			var minutes = Math.floor((tempsRestant % (1000 * 60 * 60)) / (1000 * 60));
			var secondes = Math.floor((tempsRestant % (1000 * 60)) / 1000);

			document.getElementById('station').textContent = station;
			document.getElementById("compteurMinutes").textContent = minutes;
			document.getElementById("compteurSecondes").textContent = secondes;

			if(tempsRestant < 0) {
				clearInterval(declenchement);
				$('#compteur').html('Votre réservation a expiré.');
				sessionStorage.clear();
			}
		}, 1000);
	},

	resetCompteur : function() {
		clearInterval(declenchement);
	}

}