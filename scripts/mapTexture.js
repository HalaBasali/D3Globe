define(["three", "d3"], function(THREE, d3) {

var projection = d3.geo.equirectangular()
  .translate([1024, 512])
  .scale(325);

function mapTexture(geojson, color) {
  var texture, context, canvas;

  canvas = d3.select("body").append("canvas")
    .style("display", "none")
    .attr("width", "2048px")
    .attr("height", "1024px");
  context = canvas.node().getContext("2d");

  var path = d3.geo.path()
    .projection(projection)
    .context(context);

  context.strokeStyle = "#eee";
  context.lineWidth = 0.8;
  context.fillStyle = color || "#00B380";
  context.globalAlpha = 0.4;



  context.beginPath();

  path(geojson);

  if (color) {
    context.fill();
  }

  context.stroke();

  // DEBUGGING - Really expensive, disable when done.
  // console.log(canvas.node().toDataURL());

  texture = new THREE.Texture(canvas.node());
  texture.needsUpdate = true;

  canvas.remove();

  return texture;
}

  var MAPTEXTURE = {
    mapTexture: mapTexture
  };

  return MAPTEXTURE;

});
