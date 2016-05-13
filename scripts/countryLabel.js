define(["three", "d3", "utils", "jquery"], function(THREE, d3, UTILS, $) {

	var countries;
	var country;
	var capital;
	var inhabitants;
	var area;

	var text;
	var title;

	var img;

	function setCountryInfos(name) {
		d3.json('data/countries.json', function (err, json) {
			d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
		    countries = json;
		    console.log("countries: " + countries);
		    country = countries[name];
		    capital = country.capital;
		    inhabitants = country.inhabitants;
		    area = country.area;
		});
	}

	function createTextfield(name) {
		if(name == "Deutschland" || name == "Frankreich" || name == "Italien") {
			setCountryInfos(name);
		}
		text = document.createElement('div');
		text.className = 'countryinfo';
		insertFlagImage(name);

		title = document.createElement('h2');
		title.innerText = name.toUpperCase();
		text.appendChild(title);

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
		} else if(name == "Italien") {
			img.src = "img/map_de.jpg";
		} else {
			img.src = "img/map_de.jpg";
		}
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
		}

		if(name == "Deutschland" || name == "Frankreich" || name == "Italien") {
			// var listCountry = countries[name];
			// console.log("listCountry: " + listCountry.name);

			capitalElem.innerText = "Hauptstadt: " + capital;
			inhabitantsElem.innerText = "Einwohner: " + inhabitants;
			areaElem.innerText = "Fläche: " +  area;

			furtherButton.addEventListener("click", openDetailpage);
		} else {
			capitalElem.innerText = "Hauptstadt: " +  "capital";
			inhabitantsElem.innerText = "Einwohner: " +  "inhabitants";
			areaElem.innerText = "Fläche: " + "area";
		}

		list.appendChild(capitalElem);
		list.appendChild(inhabitantsElem);
		list.appendChild(areaElem);
		text.appendChild(list);

		furtherButton.className = 'button';
		furtherButton.innerText = "Erfahre mehr Spannendes!";
		text.appendChild(furtherButton);
	}

	function openDetailpage(event) {
		window.location.href = "detail.html";
	}

	function deleteTextfield() {
		var div = document.getElementsByTagName('div')[0];
		document.body.removeChild(div);
	}

	function updateTextfield(name) {
		if(text != null) {
			deleteTextfield();
		}
		createTextfield(name);
	}

	var COUNTRY = {
		updateTextfield: updateTextfield
	};
	return COUNTRY;
});