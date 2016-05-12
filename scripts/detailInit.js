'use strict';
require(["geoHelpers", "jquery-2.1.4.min", "d3"], function(GEO) {
	$(document).ready(function($) {
		var country = "Deutschland";
		setImageSource(country);

		var currentCountry = localStorage.currentcountry;
		console.log("DetailView, currentCountry: " + currentCountry);

		var animalBtn = $("#animalbtn");
		var foodBtn = $("#foodbtn");
		var monumentsBtn = $("#monumentsbtn");
		var clothesBtn = $("#clothesbtn");
		var historyBtn = $("#historybtn");
		var plantsBtn = $("#plantsbtn");
		var backbtn = $("#backbtn");
		addlistenersToInfobuttons();


		function onClickInfoButton(event) {
			var id = event.target.id;
			//console.log(id + " CLICKED!");

			switch(id) {
				case "animalbtn": console.log(id + " CLICKED!");break;
				case "foodbtn": console.log(id + " CLICKED!");break;
				case "monumentsbtn": console.log(id + " CLICKED!");break;
				case "clothesbtn": console.log(id + " CLICKED!");break;
				case "historybtn": console.log(id + " CLICKED!");break;
				case "plantsbtn": console.log(id + " CLICKED!");break;
				default: "Nichts angeclickt"; break;
			}
		}

		function addlistenersToInfobuttons() {
			animalBtn.click(onClickInfoButton);
			foodBtn.click(onClickInfoButton);
			monumentsBtn.click(onClickInfoButton);
			clothesBtn.click(onClickInfoButton);
			historyBtn.click(onClickInfoButton);
			plantsBtn.click(onClickInfoButton);
		}

		function setImageSource(countryname) {
			$("#mapimage").attr("src","img/deutschland-bundeslaender.jpg");
			console.log("Image set");
		}

	d3.json('data/detailinfo.json', function (err, json) {
		d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
	    // countries = GEO.infodecoder(json);
	    
	    console.log(json);
	});


	// function setCurrentCountry(currentCountry) {
	// 	var funcs = [];
	// 	for(var new_i =0; new_i<countries.length; new_i++){
	// 	    (function(i){
	// 	        funcs[i] = function(){
	// 		    	console.log("currentCountry: " + currentCountry);
	// 		    	if(countries[i].name == currentCountry) {
	// 		    		// console.log("countries[i].name: " + countries[i].name);
	// 					country = countries[i];
	// 			    } else {
	// 		    		return null;
	// 		    	}
	// 		    }
	//     	})(new_i);
	// 	}

	// 	for(var j =0; j<3; j++){
	// 	    funcs[j]();
	// 	}
	// }

	});
});