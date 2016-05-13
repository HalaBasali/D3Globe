'use strict';
require(["jquery-2.1.4.min", "d3"], function() {
	$(document).ready(function($) {

		var currentCountry = localStorage.currentcountry;
		console.log("DetailView, currentCountry: " + currentCountry);
		setImageSource(currentCountry);

		var animalsInfo;
		var foodInfo;
		var monumentsInfo;
		var clothesInfo;
		var historyInfo;
		var plantsInfo;
		setCountryInfos();

		var animalBtn = $("#animalbtn");
		var foodBtn = $("#foodbtn");
		var monumentsBtn = $("#monumentsbtn");
		var clothesBtn = $("#clothesbtn");
		var historyBtn = $("#historybtn");
		var plantsBtn = $("#plantsbtn");
		addlistenersToInfobuttons();

		var backbtn = $("#backbtn");
		backbtn.click(function goBack() {
		    window.history.back();
		});
		var bubbleText = $("#bubbletxt");

		function onClickInfoButton(event) {
			var id = event.target.id;
			//console.log(id + " CLICKED!");

			switch(id) {
				case "animalbtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + animalsInfo);break;
				case "foodbtn": bubbleText.text(foodInfo);break;
				case "monumentsbtn": bubbleText.text(monumentsInfo);break;
				case "clothesbtn": bubbleText.text(clothesInfo);break;
				case "historybtn": bubbleText.text(historyInfo);break;
				case "plantsbtn": bubbleText.text(plantsInfo);break;
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
			if(countryname == "Deutschland") {
				$("#mapimage").attr("src","img/de_big.jpg");
			}
			if(countryname == "Frankreich") {
				$("#mapimage").attr("src","img/de_big.jpg");
			}
		}

		function setCountryInfos() {
			d3.json('data/detailinfo.json', function (err, json) {
				d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
			    var countries = json;
			    var country = countries[currentCountry];
			    animalsInfo = country.animals;
			    foodInfo = country.food;
			    monumentsInfo = country.monuments;
			    clothesInfo = country.clothes;
			    historyInfo = country.history;
			    plantsInfo = country.plants;
			});
		}
	});
});