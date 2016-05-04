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
    var earthTexture = texLoader.load("img/worldmap_animal.jpg");
    var earthGeometry = new THREE.SphereGeometry(200, segments, segments); // radius, segments in width, segments in height
    var earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = Math.PI ;
    earth.addEventListener('click', onGlobeClick);
    earth.addEventListener('mousemove', onGlobeMousemove);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);


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
    var root = new THREE.Object3D();
    root.scale.set(2.5, 2.5, 2.5);
    root.add(baseMap);
    root.add(earth);
    scene.add(root);

    function onGlobeClick(event) {
      controls.enabled = false;
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
            controls.enabled = true;


    }

    function toScreenXY( position) {
      var projector = new THREE.Projector();
      // projectVector will translate position to 2d
      var v = position.unproject(camera);

      // translate our vector so that percX=0 represents
      // the left edge, percX=1 is the right edge,
      // percY=0 is the top edge, and percY=1 is the bottom edge.
      var percX = (v.x + 1) / 2;
      var percY = (-v.y + 1) / 2;

      // scale these values to our viewport size
      var left = percX * canvas.width;
      var top = percY * canvas.height;

      var x = (left - earth.width / 2);
      var y =(top - earth.height / 2);
      return { x: percX, y: percY };
    }

    function onGlobeMousemove(event) {
      controls.enabled = false;
      var map, material;

      // Get pointc, convert to latitude/longitude
      var latlng = GEO.getEventCenter.call(this, event);

      // Look for country at that latitude/longitude
      var country = geo.search(latlng[0], latlng[1]);
        // console.log("lat: " + latlng[0] + ", " + "lon: " + latlng[1]); 

      // Get new camera position
      var temp = new THREE.Mesh();
      temp.position.copy(GEO.convertToXYZ(latlng, 900));
      temp.lookAt(root.position);
      temp.rotateY(Math.PI);

      // scene.updateMatrixWorld();

      if (country !== null && country.code !== currentCountry) {

        // Track the current country displayed
        currentCountry = country.code;

        // this will give us position relative to the world
        var p = temp.position.clone();
        // console.log("p.x, p.y: " + p.x + " " + p.y);


        var xy_Values = toScreenXY(p);
        // console.log("x, y: " + xy_Values[0] + " " + xy_Values[1]);

        // console.log("currentCountry: " + currentCountry);

        COUNTRY.updateTextfield(currentCountry);
        // COUNTRY.updateTextfield(country.code, xy_Values[0], xy_Values[1]);
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
      controls.enabled = true;

    }

    EVENTS.setEvents(camera, [earth], 'click');
    EVENTS.setEvents(camera, [earth], 'mousemove', 10);
  });

  renderer.autoClear = false;

  function render() {
    renderer.clear();
    renderer.render(skyScene, skyCamera);
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  animate();
});
