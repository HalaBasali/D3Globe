define(["three", "d3", "utils", "geo"], function(THREE, d3, UTILS, GEO) {
	var geo;
	var countries;
	var currentCountry;
	var capital;
	var inhabitants;
	var area;
	var flag;

	d3.json('data/countries.json', function (err, data) {
		d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
	    geo = GEO.countrydecoder(data.countries);
	   	// console.log("countries.length JSON: " + countries.length);
	});
	// TODO: countries aus Json Datei herausholen, für einzelnes Land EIgenschaften ermitteln
	function getCurrentCountryData(currentCountry) {

	    // for (let i = 0; i < countries.length; i++) {
	    //     console.log("Country JSON: " + countries[i].name);
     //      	if(currentCountry == countries[i].name) {
	    //      	return {
	    //         capital: countries[i].properties.capital,
	    //         inhabitants: countries[i].properties.inhabitants,
	    //         area: countries[i].properties.area,
	    //         flag: countries[i].properties.flag
		   //      };
		   //  }
     //    }
	}

	function displayCountry(countryname, position) {
		var text = document.createElement('div');
		text.style.position = 'absolute';
		text.style.width = 200 + 'px';
		text.style.height = 50 + 'px';
		text.style.backgroundColor = "white";
		text.innerHTML = countryname;
		text.style.top = 200 + 'px';
		text.style.left = 200 + 'px';
		document.body.appendChild(text);

		// var img = document.createElement("img");
		// img.src = 'img/flagge_de.png';
		// img.setAttribute("width", "50");
		// img.setAttribute("position", "right");
		// img.setAttribute("alt", "Flower");
		// text.appendChild(img);
	}

	var COUNTRY = {
		displayCountry: displayCountry,
		getCurrentCountryData: getCurrentCountryData
	};
	return COUNTRY;

});