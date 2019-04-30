var carte = {
	initMap: 	function() {
		
		//Préparation taille zoom et coordonnées
		var options = {
			zoom: 13,
			center: new google.maps.LatLng(45.75, 4.85)
		};

		//Création de la carte
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Appel asynchrone de l'API JCDecaux
		ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=531af8cb9c9d84e9ebde3d3a4535920404321cfb", function (reponse) {
			if(sessionStorage.getItem("reservation") != "reservationEnCours") {
				sessionStorage.setItem("reservation", "pasDeReservation");
			};

			var stations = JSON.parse(reponse);
			var lattitude, longitude;

			var marqueurs = [];

			stations.forEach(function(station) {
				//Récupérer coordonnées de chaque station
				lattitude = station.position.lat;
				longitude = station.position.lng;

				/*Création des marqueurs

				Sélection de l'icône selon l'état de la station
				et des vélos disponibles */
				var disponibilite = (station.available_bikes * 100) / station.bike_stands;
		        var icone;

		        if (station.status != 'OPEN') {
		            icone = '../img/chantier.png';
		        } else if (disponibilite === 100) {
		            icone = '../img/station-100.png';
		        } else if (disponibilite < 100 && disponibilite >= 66) {
		            icone = '../img/station-75.png';
		        } else if (disponibilite < 66 && disponibilite >= 33) {
		            icone = '../img/station-50.png';
		        } else if (disponibilite < 33 && disponibilite > 0) {
		            icone = '../img/station-25.png';
		        } else if (disponibilite === 0 ) {
		            icone = '../img/station-0.png';
		        };

		        //Récupération des données attribuées aux marqueurs
				var marqueur = new google.maps.Marker({
					position: 	{
						lat: lattitude,
						lng: longitude
					},

					title:                  station.name,
		            station:                station.name,
		            address:                station.address,
		            bike_stands: 			station.bike_stands,
		            available_bikes:        station.available_bikes,
		            available_bike_stands:  station.available_bike_stands,
		            status:                 station.status,
		            icon: 					icone,
					//Envoi des marqueurs sur la map définie dans initMap
					map: 					map
				});

				marqueurs.push(marqueur);

				google.maps.event.addListener(marqueur, 'click', function() {
					//Fermer infobulle inactive
					if(typeof infoBulle != 'undefined') {
						infoBulle.close();
					}

					//Afficher infobulle
					infoBulle = new google.maps.InfoWindow({
						content: marqueur.station
					});

					infoBulle.open(map, marqueur);

					//Réduire taille carte et afficher encart réservation selon taille écran
					carte.voletInfoResponsive();
					
					//Informations sur la station choisie
					$('#nom').text('N°' + marqueur.station);
					$('#adresse').text(marqueur.address);

					//Vérification du nombre de vélos disponibles
					$('#capacite').html('Capacité totale : <strong>' + marqueur.bike_stands + '<strong>');
					$('#velos_dispos').html('Vélos disponibles : <strong>' + marqueur.available_bikes + '</strong>');
					$('#places_dispos').html('Emplacements libres : <strong>' + marqueur.available_bike_stands + '</strong>');

					//Vérification du statut de la station
					if(marqueur.status !== 'OPEN') {
						carte.stationFermee();
					} else if(marqueur.available_bikes === 0) {//Si aucun vélo disponible, avertir usager
						carte.stationVide();
					} else if(marqueur.available_bike_stands === 0) {
						carte.stationPleine();
					} else {
						carte.stationOuverte();
					};
								
					sessionStorage.setItem('station', marqueur.station);

				})


			})//Fin forEach

			//Regroupement des marqueurs selon zoom
			var groupeMarqueurs = new MarkerClusterer (map, marqueurs, {
					gridSize:       120,
		            maxZoom:        16,
					styles: [{
		                    url:        '../img/m6.png',
		                    textColor:  'white',
		                    width:      70,
		                    height:     70
		                }]
			});

			//Affichage du bloc Canvas
			$('#reservationActive').on('click', function() {
				$('#blocInitial').hide();
				$('#blocCanvas').css('display', 'block');
				signature.init();
				signature.effacerCanvas();

			});

			//Interactions avec boutons bloc Canvas
			$('#valider').on('click', function(){
				compteARebours.resetCompteur();
				if(sessionStorage.getItem('verification') != 'ok') {
					return false;
				} else {
					$('#blocCanvas').hide();
					$('#blocInitial').css('display', 'block');
					$('#compteur').css('display', 'block');
					
				};

				sessionStorage.setItem("reservation", "reservationEnCours");
				sessionStorage.removeItem('tempsRestant');
				carte.afficherStatutReservation();
			});

			$('#effacer').on('click', function() {
				signature.effacerCanvas();
			});

			$('#annuler').on('click', function() {
				$('#blocCanvas').hide();
				$('#blocInitial').show();
				signature.effacerCanvas();
			});
			
			//Fermeture volet réservation
			$('.fa-times').on('click', function() {
				$('#map').animate({width: '100%'}, 'slow', function() {
					$('#reservation').css('display', 'none');
				});

				$('#reservation').hide();
				$('#blocCanvas').hide();
				$('#blocInitial').show();
				signature.effacerCanvas();
			});

			//Afficher en permanence l'état de la réservation
			carte.afficherStatutReservation();

		})//Fin ajaxGet
	},

	voletInfoResponsive : function() {
		if($(window).width() <= 440) {
			$('#map').animate({width: '0%'}, 'slow', function() {
				$('#reservation').css('display', 'flex');
			});
		} else if($(window).width() <= 1366 && $(window).width() > 440) {
			$('#map').animate({width: '50%'}, 'slow', function() {
				$('#reservation').css('display', 'flex');
			});
		} else {
			$('#map').animate({width: '75%'}, 'slow', function() {
				$('#reservation').css('display', 'flex');
			});
		}
	},

	stationFermee : function() {
		$('#statut').html('Cette station est actuellement <strong>fermée</strong>');
		$('#statut strong').css('color', 'red');
		$('#reservationActive').hide();
		$('#reservationInactive').hide();
		$('#stationFermee').css('display', 'block');
		document.getElementById('stationFermee').disabled = true;
	},

	stationVide : function() {
		$('#statut').html('Cette station est actuellement <strong>ouverte</strong>');
		$('#statut strong').css('color', 'green');
		$('#velos_dispos strong').css('color', 'red');
		$('#reservationActive').hide();
		$('#stationFermee').hide();
		$('#reservationInactive').css('display', 'block');
		document.getElementById('reservationInactive').disabled = true;
	},

	stationPleine : function() {
		$('#statut').html('Cette station est actuellement <strong>ouverte</strong>');
		$('#statut strong').css('color', 'green');
		$('#places_dispos strong').css('color', 'red');
		$('#stationFermee').hide();
	},

	stationOuverte : function() {
		$('#statut').html('Cette station est actuellement <strong>ouverte</strong>');
		$('#statut strong').css('color', 'green');
		$('#reservationInactive').hide();
		$('#reservationActive').css('display', 'block');
		$('#stationFermee').hide();
	},

	afficherStatutReservation : function() {
		if(sessionStorage.getItem("reservation") === ("reservationEnCours")) {
			compteARebours.initCompteur(sessionStorage.getItem('station'));

		} else {
			$('#compteur').html("Vous n'avez pas encore effectué de réservation. Veuillez choisir une station");
		}
	}

};

carte.initMap();


