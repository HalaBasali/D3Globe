  'use strict';
  define(["three", "jquery", "d3", "topojson", "scene", "geo", "utils", "mapTexture", "setEvents", "label", "trackback"],
    function(THREE, $, d3, topojson, SCENE, GEO, UTILS, MAPTEXTURE, EVENTS, COUNTRY) {

    var renderer = SCENE.renderer;
    var scene = SCENE.scene;
    var camera = SCENE.camera;

    // Create sky background scene
    var skyScene = new THREE.Scene();
    var skyCamera = new THREE.Camera();

    var controls = new THREE.TrackballControls(camera);

    d3.json('data/world.json', function (err, data) {

    d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
    var segments = 300; // number of vertices. Higher = better mouse accuracy


    var currentCountry, overlay;


    // Setup cache for country textures
    var countries = topojson.feature(data, data.objects.countries);
    var geo = GEO.geodecoder(countries.features);

    var textureCache = UTILS.memoize(function (cntryID, color) {
      var country = geo.find(cntryID);
      return MAPTEXTURE.mapTexture(country, color);
    });

    var texLoader = new THREE.TextureLoader();

    // Globe with NASA earth map
    var earthTexture = texLoader.load("img/earth.jpg");
    var earthGeometry = new THREE.SphereGeometry(200, segments, segments); // radius, segments in width, segments in height
    var earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = Math.PI ;
    earth.addEventListener('click', onGlobeClick);
    earth.addEventListener('mousemove', onGlobeMousemove);


    // add base map layer with all countries
    let worldTexture = MAPTEXTURE.mapTexture(countries, null);
    let mapMaterial  = new THREE.MeshPhongMaterial({map: worldTexture, transparent: true});
    var baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
    baseMap.rotation.y = Math.PI;
    // create a container node and add the two meshes
    var root = new THREE.Object3D();
    root.scale.set(2.5, 2.5, 2.5);
    root.add(baseMap);
    root.add(earth);
    scene.add(root);

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
      // COUNTRY.displayCountry("germany");
      var map, material;

      // Get pointc, convert to latitude/longitude
      var latlng = GEO.getEventCenter.call(this, event);

      // Look for country at that latitude/longitude
      var country = geo.search(latlng[0], latlng[1]);

      if (country !== null && country.code !== currentCountry) {

        // Track the current country displayed
        currentCountry = country.code;

        // Update the html
        d3.select("#msg").html(country.code);

         // Overlay the selected country
        map = textureCache(country.code, "rgba(3, 121, 0, 0.4)");
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

  function animate() {
    requestAnimationFrame(animate);
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(skyScene, skyCamera);
    renderer.render(scene, camera);
  }
  animate();
});
