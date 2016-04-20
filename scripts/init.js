  'use strict';
  define(["three", "jquery", "d3", "topojson", "scene", "geo", "utils", "mapTexture", "setEvents", "label", "trackback"],
    function(THREE, $, d3, topojson, SCENE, GEO, UTILS, MAPTEXTURE, EVENTS, LABELS) {

    var renderer = SCENE.renderer;
    var scene = SCENE.scene;
    var camera = SCENE.camera;

    var controls = new THREE.TrackballControls(camera);

    d3.json('data/world.json', function (err, data) {

    d3.select("#loading").transition().duration(500).style("opacity", 0).remove();
    var segments = 200; // number of vertices. Higher = better mouse accuracy

    var texLoader = new THREE.TextureLoader();

    var currentCountry, overlay;


    // Setup cache for country textures
    var countries = topojson.feature(data, data.objects.countries);
    var geo = GEO.geodecoder(countries.features);

    var textureCache = UTILS.memoize(function (cntryID, color) {
      var country = geo.find(cntryID);
      return MAPTEXTURE.mapTexture(country, color);
    });

    // Globe with NASA earth map
    var mapUrlEarth = "img/earth.jpg";
    var mapEarth = texLoader.load(mapUrlEarth);
    var earthMaterial = new THREE.MeshPhongMaterial({ map: mapEarth});
    var earthGeometry = new THREE.SphereGeometry(200, segments, segments); // radius, segments in width, segments in height
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = Math.PI ;
    earth.addEventListener('click', onGlobeClick);
    earth.addEventListener('mousemove', onGlobeMousemove);

    // Base globe with blue "water"
    // let blueMaterial = new THREE.MeshPhongMaterial({color: '#668B8B', transparent: true, opacity: 0.1});
    // let sphere = new THREE.SphereGeometry(200, segments, segments);
    // let baseGlobe = new THREE.Mesh(sphere, blueMaterial);
    // baseGlobe.rotation.y = Math.PI;
    // baseGlobe.addEventListener('click', onGlobeClick);
    // baseGlobe.addEventListener('mousemove', onGlobeMousemove);

    // add base map layer with all countries
    let worldTexture = MAPTEXTURE.mapTexture(countries, null);
    let mapMaterial  = new THREE.MeshPhongMaterial({map: worldTexture, transparent: true});
    var baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
    baseMap.rotation.y = Math.PI;
    // create a container node and add the two meshes
    var root = new THREE.Object3D();
    root.scale.set(2.5, 2.5, 2.5);
    // root.add(baseGlobe);
    root.add(baseMap);
    root.add(earth);
    scene.add(root);


    function onGlobeClick(event) {
    // console.log(LABELS.text);
    // scene.add(LABELS.text);

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

      if (country !== null && country.code !== currentCountry) {

        // Track the current country displayed
        currentCountry = country.code;

        // Update the html
        d3.select("#msg").html(country.code);

         // Overlay the selected country
        map = textureCache(country.code, '#006400');
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
    renderer.render(scene, camera);
  }
  animate();
});
