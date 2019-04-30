/*Factorisation du code d'exécution d'une requête HTTP asynchrone
==>Écriture d'un appel (fonction) AJAX

Éxécute un appel AJAX GET
Prend en paramètre l'URL cible et la fonction callback appelée en cas de succès*/
function ajaxGet(url, callback) {
	var req = new XMLHttpRequest();
	req.open("GET", url);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			//Appelle la fonction callback en lui passant la réponse de la requête
			callback(req.responseText);
		} else {
			console.error(req.status + " " + req.statusText + "" + url);
		}
	});
	req.addEventListener('error', function() {
		console.error("Erreur réseau avec l'URL" + url);
	});
	req.send(null);
};

/*Éxécute un appel AJAX POST
Prend en paramètres l'URL cible, la donnée à envoyer
et la fonction callback appelée en cas de succès */
function ajaxPost(url, data, callback, isJson) {
	var req = new XMLHttpRequest();
	req.open("POST", url);
	req.addEventListener('load', function() {
		if (req.status >=200 && req.status < 400) {
			//Appelle la fonction callback en lui passant la réponse de la requête
			callback(req.responseText);
		} else {
			console.error(req.status + " " + req.statusText + " " + url);
		}
	});
	req.addEventListener("error", function() {
		console.error("Erreur réseau avec l'URL " + url);
	});

	if(isJson) {
		//Définit le contenu de la requête comme étant du JSON
		req.setRequestHeader("Content-Type", "application/json");
		//Transformer la donnée du format JSON vers le format texte avant l'envoi
		data = JSON.stringify(data);
	}
	
	req.send(data);
}