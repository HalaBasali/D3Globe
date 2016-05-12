'use strict';
requirejs.config({
	paths: {
		"jquery":		"jquery-2.1.4.min",
		"init": 		"init",
		"three" : 		"three",
		"d3": 			"d3",
		"topojson":		"topojson",
		"scene": 		"scene",
		"geo": 			"geoHelpers",
		"utils": 		"utils",
		"setEvents":	"setEvents",
		"trackback":	"TrackballControls",
		"country": 	 	"countryLabel",
		"orbit": 		"OrbitControls",
		"projector": 	"Projector",
		"detailInit": 	"detailInit",
		"keyboard": 	"THREEx.KeyboardState"
	}
});

require(["init"]);
