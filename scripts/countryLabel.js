define(["three", "d3", "utils", "jquery", "countries", "detailInit"], function(THREE, d3, UTILS, $, COUNTRIES, DETAILVIEW) {

	var countries = COUNTRIES.data;
	var country;
	var capital;
	var inhabitants;
	var area;

	var text;
	var title;

	var img;
	var closeButton;
	var infoDiv;

	function setCountryInfos(name) {
		    country = countries[name];
		    capital = country.capital;
		    inhabitants = country.inhabitants;
		    area = country.area;
	}

	function createTextfield(name) {
		if(name == "Deutschland" || name == "Frankreich") {
			setCountryInfos(name);
		}

		text = document.createElement('div');
		text.className = 'countryinfo';
		insertFlagImage(name);

		title = document.createElement('h2');
		title.innerText = name.toUpperCase();
		text.appendChild(title);

		closeButton = document.createElement("input");
		closeButton.type = 'button';
		closeButton.id = 'closebutton';
		closeButton.addEventListener("click", deleteTextfield);
		text.appendChild(closeButton);

		infoDiv = document.createElement("div");
		infoDiv.id = 'infodiv';
		text.appendChild(infoDiv);

		updateList(name);

		document.body.appendChild(text);
	}

	function insertFlagImage(name) {
		if(img == null) {
			img = document.createElement("img");
			img.id = 'countryImg';
		}

		if(name == "Deutschland") {
			img.src = "img/map_de.jpg";
		} else if(name == "Frankreich") {
			img.src = "img/map_fr.jpg";
		} else {
			img.src = "img/map_default.jpg";
		}
		// onload Funktion definieren, damit das Bild zuerst geladen wird
		text.appendChild(img);
	}

	// list elements
	var list;
	var capitalElem;
	var inhabitantsElem;
	var areaElem;
	var furtherButton;

	function updateList(name) {
		if(list == null) {
			list = document.createElement("ul");

			capitalElem = document.createElement("li");
			inhabitantsElem = document.createElement("li");
			areaElem = document.createElement("li");
			furtherButton = document.createElement("a");
			furtherButton.id = 'furtherbutton';
		}

		if(name == "Deutschland" || name == "Frankreich") {
			capitalElem.innerText = "Hauptstadt: " + capital;
			inhabitantsElem.innerText = "Einwohner: " + inhabitants;
			areaElem.innerText = "Fläche: " +  area;
			furtherButton.addEventListener("click", showDetailOverlay);
		} else {
			capitalElem.innerText = "Hauptstadt: " +  "Hauptstadt";
			inhabitantsElem.innerText = "Einwohner: " +  "x,y Millionen Schulklassen";
			areaElem.innerText = "Fläche: " + "x Millionen Fußballfelder";
		}

		list.appendChild(capitalElem);
		list.appendChild(inhabitantsElem);
		list.appendChild(areaElem);
		infoDiv.appendChild(list);

		furtherButton.className = 'button';
		furtherButton.innerText = "Erfahre mehr Spannendes!";
		infoDiv.appendChild(furtherButton);
	}

	function showDetailOverlay(event) {
		$(document).ready(function($) {
			deleteTextfield();
			DETAILVIEW.showDetails();
			$("#overlay").show();
		});
	}

	function deleteTextfield() {
		var div = document.getElementsByClassName('countryinfo')[0];
		if(div != null) {
			document.body.removeChild(div);
		}
	}

	function updateTextfield(name) {
		if(text != null) {
			deleteTextfield();
		}
		createTextfield(name);
	}

	function slideDownInfo() {
		$(document).ready(function() {
		    $("#infodiv").slideDown(400);
		});
	}

	var COUNTRY = {
		updateTextfield: updateTextfield,
		slideDownInfo: slideDownInfo
	};
	return COUNTRY;
});