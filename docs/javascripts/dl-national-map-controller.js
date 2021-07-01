/* global DLMaps, maplibregl */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function MapController($layerControlsList, $zoomControls) {
  this.$layerControlsList = $layerControlsList;
  this.$zoomControls = $zoomControls;
}

MapController.prototype.init = function (params) {
  // check maplibregl is available
  // if not return
  this.setupOptions(params); // create the maplibre map

  this.map = this.createMap(); // perform setup once map is loaded

  var boundSetup = this.setup.bind(this);
  this.map.on('load', boundSetup); // run debugging code

  this.debug();
  return this;
};

MapController.prototype.createMap = function () {
  var mappos = DLMaps.Permalink.getMapLocation(6, [0, 52]);
  var map = new maplibregl.Map({
    container: this.mapId,
    // container id
    style: './base-tile.json',
    // open source tiles?
    center: mappos.center,
    // starting position [lng, lat]
    zoom: mappos.zoom // starting zoom

  });
  DLMaps.Permalink.setup(map);
  return map;
};

MapController.prototype.setup = function () {
  // add source to map
  this.addSource(); // add zoom controls

  this.zoomControl = new DLMaps.ZoomControls(this.$zoomControls, this.map, this.map.getZoom()).init({}); // setup layers

  console.log(this.$layerControlsList, this.map);
  this.layerControlsComponent = new DLMaps.LayerControls(this.$layerControlsList, this.map, this.sourceName).init(); // register click handler

  var boundClickHandler = this.clickHandler.bind(this);
  this.map.on('click', boundClickHandler);
};

MapController.prototype.addSource = function () {
  var sourceName = this.sourceName;
  this.map.addSource(sourceName, {
    type: 'vector',
    tiles: [this.vectorSource],
    minzoom: this.minMapZoom,
    maxzoom: this.maxMapZoom
  });
};

MapController.prototype.createPopupHTML = function (feature) {
  var featureType = capitalizeFirstLetter(feature.sourceLayer).replaceAll('-', ' ');
  var html = ["<p class=\"secondary-text govuk-!-margin-bottom-0\">".concat(featureType, "</p>"), '<p class="dl-small-text govuk-!-margin-top-0">', "<a href=\"".concat(this.baseURL).concat(feature.properties.slug, "\">").concat(feature.properties.name, "</a>"), '</p>'];
  return html.join('\n');
};

MapController.prototype.clickHandler = function (e) {
  var map = this.map;
  console.log('click at', e);
  var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
  var that = this; // returns a list of layer ids we want to be 'clickable'

  var enabledControls = this.layerControlsComponent.enabledLayers();
  var enabledLayers = enabledControls.map(function ($control) {
    return that.layerControlsComponent.getDatasetName($control);
  });
  var clickableLayers = enabledLayers.map(function (layer) {
    var components = that.layerControlsComponent.availableLayers[layer];

    if (components.includes(layer + 'Fill')) {
      return layer + 'Fill';
    }

    return components[0];
  });
  console.log('Clickable layers: ', clickableLayers); // need to get all the layers that are clickable

  var features = map.queryRenderedFeatures(bbox, {
    layers: clickableLayers
  });
  console.log(features);
  var coordinates = e.lngLat;
  features.forEach(function (feature) {
    console.log(feature.properties.name, feature);
    var popupHTML = that.createPopupHTML(feature);
    new maplibregl.Popup().setLngLat(coordinates).setHTML(popupHTML).addTo(map);
  });
};

MapController.prototype.getMap = function () {
  return this.map;
};

MapController.prototype.setupOptions = function (params) {
  params = params || {};
  this.mapId = params.mapId || 'mapid';
  this.sourceName = params.sourceName || 'dl-vectors';
  this.vectorSource = params.vectorSource || 'https://datasette-tiles.digital-land.info/-/tiles/dataset_tiles/{z}/{x}/{y}.vector.pbf';
  this.minMapZoom = params.minMapZoom || 5;
  this.maxMapZoom = params.maxMapZoom || 15;
  this.baseURL = params.baseURL || 'https://digital-land.github.io';
};

MapController.prototype.debug = function () {
  var that = this;

  function countFeatures(layerName) {
    var l = that.map.getLayer(layerName);

    if (l) {
      return that.map.queryRenderedFeatures({
        layers: [layerName]
      }).length;
    }

    return 0;
  }

  this.map.on('moveend', function (e) {
    console.log('moveend');
    console.log('Brownfield', countFeatures('brownfieldland'));
    console.log('LA boundaries', countFeatures('ladFill'));
    console.log('conservation area', countFeatures('conservationareaFill'));
  });
};