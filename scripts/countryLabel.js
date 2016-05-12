define(["three", "d3", "utils", "geo", "jquery"], function(THREE, d3, UTILS, GEO, $) {
    
	var country;
	var countries = {
		"Deutschland": {
			"name": "Deutschland",
	 		"capital": "Berlin",
		 	"inhabitants": "2,7 Millionen Schulklassen",
		 	"area": "50 Millionen Fußballfelder",
		 	"flag": "flagge_de.png"
	 	},
		"Frankreich": {
			"name": "Frankreich",
	 		"capital": "Paris",
		 	"inhabitants": "2,2 Millionen Schulklassen",
		 	"area": "90 Millionen Fußballfelder",
		 	"flag": "flagge_fr.png"
		},
		"Italien": {
			"name": "Italien",
	 		"capital": "Rom",
		 	"inhabitants": "2 Millionen Schulklassen",
		 	"area": "42 Millionen Fußballfelder",
		 	"flag": "flagge_it.png"
	 	}
	};

	// d3.json('data/countries.json', function (err, json) {
	// 	d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
	//     countries = GEO.countrydecoder(json.countries);
	//     console.log(countries);
	// });


	function setCurrentCountry(currentCountry) {
		var funcs = [];
		for(var new_i =0; new_i<countries.length; new_i++){
		    (function(i){
		        funcs[i] = function(){
			    	console.log("currentCountry: " + currentCountry);
			    	if(countries[i].name == currentCountry) {
			    		// console.log("countries[i].name: " + countries[i].name);
						country = countries[i];
				    } else {
			    		return null;
			    	}
			    }
	    	})(new_i);
		}

		for(var j =0; j<3; j++){
		    funcs[j]();
		}
	}

	function getCurrentCountry() {
		return country;
	}

	function getCurrentName(currentCountry) {
		return getCurrentCountry().name;
	}

	function getCurrentCapital(currentCountry) {
		return getCurrentCountry().properties.capital;
	}

	function getCurrentInhabitants(currentCountry) {
		return getCurrentCountry().properties.inhabitants;
	}

	function getCurrentArea(currentCountry) {
		return getCurrentCountry().properties.area;
	}

	function getCurrentFlag(currentCountry) {
	    return getCurrentCountry().properties.flag;
	}

	var text;
	var title;

	// $(document).ready(function($) {
	// 	var p =  $('<p/>').appendTo('body').addClass( "myClass" );;
	// });

	function createTextfield(name) {
		text = document.createElement('div');
		text.className = 'countryinfo';
		insertFlagImage(name);

		title = document.createElement('h2');
		title.innerText = name.toUpperCase();
		text.appendChild(title);

		updateList(name);

		document.body.appendChild(text);
		/*** Todo: Load countries data from JSON ***
		country = geo.search(name);
     	***************************/
	}

	var img;

	function insertFlagImage(name) {
		if(img == null) {
			img = document.createElement("img");
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
			var listCountry = countries[name];
			// console.log("listCountry: " + listCountry.name);

			capitalElem.innerText = "Hauptstadt: " + listCountry.capital;
			inhabitantsElem.innerText = "Einwohner: " + listCountry.inhabitants;
			areaElem.innerText = "Fläche: " + listCountry.area;
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
		furtherButton.addEventListener("click", openDetailpage);
		text.appendChild(furtherButton);
	}

	function openDetailpage(event) {
		window.location.href = "detail.html";
		console.log("CLICK!");
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