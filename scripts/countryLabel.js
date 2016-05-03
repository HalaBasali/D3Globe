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
		console.log("isIn: " + isIn);
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

	function createTextfield(name, x, y) {
		text = document.createElement('div');
		text.style.fontSize = 12 + 'px';
		text.style.position = 'absolute';
		text.style.width = 250 + 'px';
		text.style.height = 100 + 'px';
		text.style.backgroundColor = "white";
		text.style.top = (tempX -200) + 'px';
		text.style.left = (tempY - 50) +'px';
		text.innerHTML = name;
		document.body.appendChild(text);

		updateList(name);

		// country = geo.search(name);
// 		if(isIn == true) {
// 			setCurrentCountry(name);
// 			console.log("Country: " + country);
// 			text.innerHTML = country.name;

		// var img = document.createElement("img");
		// img.src = getCurrentFlag();
		// img.setAttribute("width", "50");
		// img.setAttribute("position", "right");
		// img.setAttribute("alt", "Flower");
		// text.appendChild(img);
	}

	// list elements
	var list;
	var capitalElem;
	var inhabitantsElem;
	var areaElem;

	function updateList(name) {
		if(name == "Deutschland" || name == "Frankreich" || name == "Italien") {
			if(list == null) {
				list = document.createElement("ul");
				list.style.width = 180 + 'px';
				capitalElem = document.createElement("li");
				inhabitantsElem = document.createElement("li");
				areaElem = document.createElement("li");
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
		}
	}

	function showTextfield() {
		text.style.display = 'block';
	}

	function hideTextfield() {
		text.style.display = 'none';
	}
	function updateTextfield(name, x, y) {
		if(text != null) {
			updateName(name);
			updateList(name);
			updatePostion((tempX -200), (tempX -200));
		} else {
			createTextfield(name, x, y);
		}
	}

	function updateName(name) {
		text.innerHTML = name;
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