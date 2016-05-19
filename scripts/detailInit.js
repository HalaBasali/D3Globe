'use strict';
define(["detailInfo", "jquery", "d3"], function(DETAILS) {
	function showDetails() {
		$(document).ready(function($) {
			var countries = DETAILS.data;
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
			    $("#overlay").hide();
			});
			var bubbleText = $("#bubbletxt");

			function onClickInfoButton(event) {
				var id = event.target.id;
				//console.log(id + " CLICKED!");

				switch(id) {
					case "animalbtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + animalsInfo);break;
					case "foodbtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + foodInfo);break;
					case "monumentsbtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + monumentsInfo);break;
					case "clothesbtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + clothesInfo);break;
					case "historybtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + historyInfo);break;
					case "plantsbtn": bubbleText.html("<b>" + currentCountry + " </b><br/> " + plantsInfo);break;
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
					$("#mapimage").attr("src","img/fr_big.jpg");
				}
			}

			function setCountryInfos() {
			    var country = countries[currentCountry];
			    animalsInfo = country.animals;
			    foodInfo = country.food;
			    monumentsInfo = country.monuments;
			    clothesInfo = country.clothes;
			    historyInfo = country.history;
			    plantsInfo = country.plants;
			}
		});
	}

	var DETAILVIEW = {
		showDetails: showDetails
	};
	return DETAILVIEW;
});