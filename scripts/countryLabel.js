define(["three", "d3", "utils", "geo"], function(THREE, d3, UTILS, GEO) {
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

	document.onmousemove = getMouseXY;

	var tempX = 0;
	var tempY = 0;

	function getMouseXY(e) {  // grab the x-y pos.s if browser is NS
	    tempX = e.pageX;
	    tempY = e.pageY;
	  // catch possible negative values in NS4
	  if (tempX < 0){tempX = 0}
	  if (tempY < 0){tempY = 0}
	  // console.log("x: " + tempX + ", " + "y: " + tempY);
	  return true;
}

	var text;
	var title;

	function createTextfield(name, x, y) {
		text = document.createElement('div');
		text.style.fontSize = 12 + 'px';
		text.style.position = 'absolute';
		text.style.width = 250 + 'px';
		text.style.height = 100 + 'px';
		text.style.backgroundColor = "white";
		text.style.top = (tempX -200) + 'px';
		text.style.left = (tempY - 50) +'px';
		text.style.padding = 5 + 'px';

		title = document.createElement('h2');
		title.innerHTML = name;
		title.style.margin = 0 + 'px';
		title.style.position = 'absolute';
		text.appendChild(title);
		document.body.appendChild(text);

		if(name == "Deutschland" || name == "Frankreich" || name == "Italien") {
			insertFlagImage(name);
			updateList(name);
		}
		/*** Todo: Load countries data from JSON ***
		country = geo.search(name);
     	***************************/
	}

	var img;

	function insertFlagImage(name) {
		if(img == null) {
			img = document.createElement("img");
		}
		img.style.width = 70 + 'px';
		img.style.position = 'absolute';
		img.style.right = 0 +'px';

		if(name == "Deutschland") {
			img.src = "img/flagge_de.png";
		} else if(name == "Frankreich") {
			img.src = "img/flagge_fr.png";
		} else if(name == "Italien") {
			img.src = "img/flagge_it.png";
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
			list.style.width = 180 + 'px';
			list.style.marginTop = 25 + 'px';
			capitalElem = document.createElement("li");
			inhabitantsElem = document.createElement("li");
			areaElem = document.createElement("li");
			furtherButton = document.createElement("input");
		}
		var listCountry = countries[name];
		console.log("listCountry: " + listCountry.name);

		capitalElem.innerText = listCountry.capital;
		inhabitantsElem.innerText = listCountry.inhabitants;
		areaElem.innerText = listCountry.area;

		list.appendChild(capitalElem);
		list.appendChild(inhabitantsElem);
		list.appendChild(areaElem);
		text.appendChild(list);

		furtherButton.type = "button";
		furtherButton.value = "Erfahre mehr über das Land!";
		furtherButton.addEventListener("click", openDetailpage);
		text.appendChild(furtherButton);
	}

	function openDetailpage(event) {
		window.location.href = "detail.html";
		console.log("CLICK!");
	}

	function showTextfield() {
		text.style.display = 'block';
	}

	function hideTextfield() {
		var div = document.getElementsByTagName('div')[0];
		document.body.removeChild(div);
	}
	function updateTextfield(name, x, y) {
		if(text != null) {
			hideTextfield();
		}
		createTextfield(name, x, y);
		if(name == "Deutschland" || name == "Frankreich" || name == "Italien") {
			insertFlagImage(name);
			updateList(name);
		}
	}

	function updateName(name) {
		title.innerHTML = name;
	}

	function updatePostion(x, y) {
		text.style.top = x +'px';
		text.style.left = y +'px';
	}

	var COUNTRY = {
		updateTextfield: updateTextfield
	};
	return COUNTRY;
});