  "use strict";
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

    var uncoloredTex;
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

    uncoloredTex = texLoader.load("img/worldmap_pappe_uncolored.jpg");
    // Move camera with drag & drop
    // controls = new THREE.OrbitControls(camera, root);
    // controls.addEventListener('change', render);

    // add base map layer with all countries
    var worldTexture = MAPTEXTURE.mapTexture(countries, null);
    var mapMaterial  = new THREE.MeshPhongMaterial({map: worldTexture, transparent: true});
    var baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
    baseMap.rotation.y = Math.PI;
    // create a container node and add the two meshes
    root = new THREE.Object3D();
    root.scale.set(2.5, 2.5, 2.5);
    root.add(baseMap);
    root.add(earth);
    // root.position.setX(80);
    scene.add(root);

    function onGlobeClick(event) {
      var map, material;
      // show more information about the country
      COUNTRY.slideDownInfo();

      // Get pointc, convert to latitude/longitude
      var latlng = GEO.getEventCenter.call(this, event);

      // Get new camera position
      var temp = new THREE.Mesh();
      temp.position.copy(GEO.convertToXYZ(latlng, 1000));
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

      // Look for country at that latitude/longitude
      var country = geo.search(latlng[0], latlng[1]);
             // Overlay the selected country
        map = textureCache(country.code, "rgba(225, 90, 0, 1.0)");
        material = new THREE.MeshPhongMaterial({map: map, transparent: true});
        if (!overlay) {
          overlay = new THREE.Mesh(new THREE.SphereGeometry(201, 40, 40), material);
          overlay.rotation.y = Math.PI;
          root.add(overlay);
        } else {
          overlay.material = material;
        }

        // earth.material.map = uncoloredTex;
        // earth.material.needsUpdate = true;

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
			// console.log("Init.js, currentCountry: " + currentCountry);
        	if(currentCountry == "Deutschland" || currentCountry == "Frankreich" || currentCountry == "Italien") {
	        localStorage.setItem("currentcountry", currentCountry);
        	} else {
        		localStorage.setItem("currentcountry", "default");
        	}
		} else {
		    console.log("Sorry! No Web Storage support..");
		}

        // console.log("currentCountry: " + currentCountry);

		// if(currentCountry == "Deutschland" || currentCountry == "Frankreich") {
	 //        COUNTRY.setCountryInfos(currentCountry);
		// }
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
	 var rotSpeed = .02;

	function checkRotation(){

	    var x = camera.position.x,
	        y = camera.position.y,
	        z = camera.position.z;

	    if (window.isRightDown){
	        camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
	        camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
	    } else if (window.isLeftDown){
	        camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
	        camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
	    }

    	camera.lookAt(scene.position);
	}

  var glow = $("#glow");
  var valueWH = 64;
  var valueTL = 32;

  function scaleUpGlow() {
    $(document).ready(function($) {
      glow.css("width",'+=' + valueWH + 'px');
      glow.css("height",'+=' + valueWH + 'px');
      glow.css("top",'-=' + valueTL + 'px');
      glow.css("left",'-=' + valueTL + 'px');
    });
  }

  function scaleDownGlow() {
    $(document).ready(function($) {
      glow.css("width",'-=' + valueWH + 'px');
      glow.css("height",'-=' + valueWH + 'px');
      glow.css("top",'+=' + valueTL + 'px');
      glow.css("left",'+=' + valueTL + 'px');
    });
  }

  function animate() {
  	checkRotation();

  	if (window.isTopDown) {
  		if(camera.zoom < 2.4) {
    		camera.zoom += zoomFactor;
    		camera.updateProjectionMatrix();
        scaleUpGlow() ;
  		}
  	}
  	if (window.isDownDown) {
  		if(camera.zoom > 1) {
    		camera.zoom -= zoomFactor;
    		camera.updateProjectionMatrix();
        scaleDownGlow();
  		}
  	}

    requestAnimationFrame(animate);
    render();
  }
  animate();
});
