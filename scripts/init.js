  'use strict';
  define(["three", "jquery", "d3", "topojson", "scene", "geo", "utils", "mapTexture", "setEvents", "country", "orbit", "projector"],
    function(THREE, $, d3, topojson, SCENE, GEO, UTILS, MAPTEXTURE, EVENTS, COUNTRY) {
    var renderer = SCENE.renderer;
    var scene = SCENE.scene;
    var camera = SCENE.camera;
    var canvas = SCENE.canvas;
    var controls;
    // Create sky background scene
    var skyScene = new THREE.Scene();
    var skyCamera = new THREE.Camera();
	var root;
    var currentCountry;

    d3.json('data/world.json', function (err, data) {

    d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
    var segments = 300; // number of vertices. Higher = better mouse accuracy

    var overlay;

    // Setup cache for country textures
    var countries = topojson.feature(data, data.objects.countries);
    var geo = GEO.geodecoder(countries.features);
    var textureCache = UTILS.memoize(function (cntryID, color) {
	    var country = geo.find(cntryID);
	    return MAPTEXTURE.mapTexture(country, color);
    });

    var texLoader = new THREE.TextureLoader();

    // Load the sky background
    var skyTexture = texLoader.load("img/sky.jpg");
    var skyGeometry = new THREE.PlaneGeometry(2, 2, 0);
    var skyMaterial = new THREE.MeshBasicMaterial({map: skyTexture});
    var sky = new THREE.Mesh(skyGeometry, skyMaterial);

    skyMaterial.depthTest = false;
    skyMaterial.depthWrite = false;

    // Add sky to the background scene
    skyScene.add(skyCamera);
    skyScene.add(sky);

    // Globe with NASA earth map
    var earthTexture = texLoader.load("img/worldmap_pappe.jpg");
    var earthGeometry = new THREE.SphereGeometry(200, segments, segments); // radius, segments in width, segments in height
	
    var earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set( 0, 0, 0 );
    earth.rotation.y = Math.PI ;
    earth.addEventListener('click', onGlobeClick);
    earth.addEventListener('mousemove', onGlobeMousemove);
    // controls = new THREE.OrbitControls(camera, root);
    // controls.addEventListener('change', render);


 //    var customMaterial = new THREE.ShaderMaterial({
	//     uniforms: {
	// 		"c":   { type: "f", value: 0.8 },
	// 		"p":   { type: "f", value: 2.0 },
	// 		glowColor: { type: "c", value: new THREE.Color(0xffffff) },
	// 		viewVector: { type: "v3", value: camera.position }
	// 	},
	// 	vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
	// 	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
	// 	side: THREE.BackSide,
	// 	blending: THREE.AdditiveBlending,
	// 	transparent: true
	// });

	// var moonGlow = new THREE.Mesh( earthGeometry.clone(), customMaterial.clone() );
 //    // moonGlow.position.set( 0, 0, 0 );
	// moonGlow.scale.multiplyScalar(1.2);
	// var glow = new THREE.Object3D();
 //    glow.scale.set(2.5, 2.5, 2.5);
	// glow.add(moonGlow);
 //    glow.position.setX(80);
 //    scene.add(glow);
    /***** Todo: GLOW EFFECT **********
      // add glow to earth sphere
      var glowLight = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);

      var glowObject = new THREE.Object3D();
     ***************************/

    // add base map layer with all countries
    let worldTexture = MAPTEXTURE.mapTexture(countries, null);
    let mapMaterial  = new THREE.MeshPhongMaterial({map: worldTexture, transparent: true});
    var baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
    baseMap.rotation.y = Math.PI;
    // create a container node and add the two meshes
    root = new THREE.Object3D();
    root.scale.set(2.5, 2.5, 2.5);
    root.add(baseMap);
    root.add(earth);
    root.position.setX(80);
    scene.add(root);

	$(document).ready(function($) {
		 $("#leftarrow").click(function(){
		 	 root.rotateY( - Math.PI / 32 );
		 });
		 $("#rightarrow").click(function(){
		 	root.rotateY( Math.PI / 32 );
		 });
	});

    function onGlobeClick(event) {
      // Get pointc, convert to latitude/longitude
      var latlng = GEO.getEventCenter.call(this, event);

      // Get new camera position
      var temp = new THREE.Mesh();
      temp.position.copy(GEO.convertToXYZ(latlng, 900));
      temp.lookAt(root.position);
      temp.rotateY(Math.PI);

      for (let key in temp.rotation) {
        if (temp.rotation[key] - camera.rotation[key] > Math.PI) {
          temp.rotation[key] -= Math.PI * 2;
        } else if (camera.rotation[key] - temp.rotation[key] > Math.PI) {
          temp.rotation[key] += Math.PI * 2;
        }
      }
      var tweenPos = UTILS.getTween.call(camera, 'position', temp.position);
      d3.timer(tweenPos);

      var tweenRot = UTILS.getTween.call(camera, 'rotation', temp.rotation);
      d3.timer(tweenRot);
    }

    function onGlobeMousemove(event) {
      var map, material;

      // Get pointc, convert to latitude/longitude
      var latlng = GEO.getEventCenter.call(this, event);

      // Look for country at that latitude/longitude
      var country = geo.search(latlng[0], latlng[1]);
        // console.log("lat: " + latlng[0] + ", " + "lon: " + latlng[1]); 

      if (country !== null && country.code !== currentCountry) {

        // Track the current country displayed
        currentCountry = country.code;

        // Set local storage for detail page
        if(typeof(Storage) !== "undefined") {
			console.log("Init.js, currentCountry: " + currentCountry);
        	if(currentCountry == "Deutschland" || currentCountry == "Frankreich" || currentCountry == "Italien") {
	        localStorage.setItem("currentcountry", currentCountry);
        	} else {
        		localStorage.setItem("currentcountry", "default");
        	}
		} else {
		    console.log("Sorry! No Web Storage support..");
		}

        // console.log("currentCountry: " + currentCountry);

        COUNTRY.updateTextfield(currentCountry);
        // Update the html
        d3.select("#msg").html(country.code);

         // Overlay the selected country
        map = textureCache(country.code, "rgba(255, 125, 0, 0.7)");
        material = new THREE.MeshPhongMaterial({map: map, transparent: true});
        if (!overlay) {
          overlay = new THREE.Mesh(new THREE.SphereGeometry(201, 40, 40), material);
          overlay.rotation.y = Math.PI;
          root.add(overlay);
        } else {
          overlay.material = material;
        }
      }
    }

    EVENTS.setEvents(camera, [earth], 'click');
    EVENTS.setEvents(camera, [earth], 'mousemove', 10);
  });

  renderer.autoClear = false;

	function render() {
    	renderer.clear();
	    renderer.render(skyScene, skyCamera);
	    renderer.render(scene, camera);
    	// controls.update();
 	}

	function handleKeyDown(event) {
		event.preventDefault();

		if(event.keyCode === 37) {
		    window.isLeftDown = true;
		}
		if(event.keyCode === 39) {
		    window.isRightDown = true;
		}
		if(event.keyCode === 38) {
		    window.isTopDown = true;
		}
		if (event.keyCode === 40) {
		    window.isDownDown = true;
		}
	}

	function handleKeyUp(event) {
		event.preventDefault();

		if(event.keyCode === 37) {
	    	window.isLeftDown = false;
		}
	  	if(event.keyCode === 39) {
		    window.isRightDown = false;
	  	}
	  	if(event.keyCode === 38) {
		    window.isTopDown = false;
		}
		if(event.keyCode === 40) {
		    window.isDownDown = false;
	    }
	}

	window.addEventListener('keydown', handleKeyDown, false);
	window.addEventListener('keyup', handleKeyUp, false);
 var zoomFactor = 0.1;

  function animate() {
  	if (window.isLeftDown) {
		root.rotateY( - Math.PI / 64 );
  	}
  	if (window.isRightDown) {
		root.rotateY( Math.PI / 64 );
  	}
  	if (window.isTopDown) {
  		if(camera.zoom < 2.4) {
		camera.zoom += zoomFactor;
		camera.updateProjectionMatrix();
		// console.log("zoom: " + camera.zoom);
  		}
  	}
  	if (window.isDownDown) {
  		if(camera.zoom > 1) {
		camera.zoom -= zoomFactor;
		camera.updateProjectionMatrix();
		// console.log("zoom: " + camera.zoom);
  		}
  	}

    requestAnimationFrame(animate);
    render();
  }
  animate();

  var INIT = {
      currentCountry: currentCountry
  }

  return INIT;
});
