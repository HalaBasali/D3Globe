'use strict';
requirejs.config({
	paths: {
		"jquery":		"jquery-2.1.4.min",
		"init": 		"init",
		"three" : 		"three.min",
		"d3": 			"d3",
		"topojson":		"topojson",
		"scene": 		"scene",
		"geo": 			"geoHelpers",
		"utils": 		"utils",
		"setEvents":	"setEvents",
		"trackback":	"TrackballControls",
		"country": 	 	"countryLabel",
		"dynamicText": 	"threex.dynamictexture"
	}
});

require(["init"]);
