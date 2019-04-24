/*Factorisation du code d'exÃ©cution d'une requÃªte HTTP asynchrone
==>Ã‰criture d'un appel (fonction) AJAX

Ã‰xÃ©cute un appel AJAX GET
Prend en paramÃ¨tre l'URL cible et la fonction callback appelÃ©e en cas de succÃ¨s*/
function ajaxGet(url, callback) {
	var req = new XMLHttpRequest();
	req.open("GET", url);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			//Appelle la fonction callback en lui passant la rÃ©ponse de la requÃªte
			callback(req.responseText);
		} else {
			console.error(req.status + " " + req.statusText + "" + url);
		}
	});
	req.addEventListener('error', function() {
		console.error("Erreur rÃ©seau avec l'URL" + url);
	});
	req.send(null);
};

/*Ã‰xÃ©cute un appel AJAX POST
Prend en paramÃ¨tres l'URL cible, la donnÃ©e Ã  envoyer
et la fonction callback appelÃ©e en cas de succÃ¨s */
function ajaxPost(url, data, callback, isJson) {
	var req = new XMLHttpRequest();
	req.open("POST", url);
	req.addEventListener('load', function() {
		if (req.status >=200 && req.status < 400) {
			//Appelle la fonction callback en lui passant la rÃ©ponse de la requÃªte
			callback(req.responseText);
		} else {
			console.error(req.status + " " + req.statusText + " " + url);
		}
	});
	req.addEventListener("error", function() {
		console.error("Erreur rÃ©seau avec l'URL " + url);
	});

	if(isJson) {
		//DÃ©finit le contenu de la requÃªte comme Ã©tant du JSON
		req.setRequestHeader("Content-Type", "application/json");
		//Transformer la donnÃ©e du format JSON vers le format texte avant l'envoi
		data = JSON.stringify(data);
	}
	
	req.send(data);
}