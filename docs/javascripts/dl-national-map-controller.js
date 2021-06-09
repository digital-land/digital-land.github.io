function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* global L, fetch, DLMaps, AbortController */
function NationalMapController(mapId, $layerControls, $zoomControls) {
  this.mapId = mapId;
  this.$layerControls = $layerControls;
  this.$zoomControls = $zoomControls;
}

NationalMapController.prototype.init = function (params) {
  // use options provided
  this.setupOptions(params); // init controller - used to cancel in flight fetch chains

  this.controller = undefined; // create the map

  this.map = this.createMap(this.mapId); // initialise the layer and zoom controls

  this.initControls(); // kick it all off

  this.fetchAll();
};

NationalMapController.prototype.createMap = function (mapId) {
  // default location and zoom level if not set by URL params
  var mappos = L.Permalink.getMapLocation(this.defaultZoomLevel, [53.865, -5.101]);
  var theMap = L.map(mapId, {
    center: mappos.center,
    zoom: mappos.zoom
  });
  L.Permalink.setup(theMap);
  this.addTileLayer(theMap); // listen for moveend events

  var boundMoveEndHandler = this.moveEndHandler.bind(this);
  theMap.on('moveend', boundMoveEndHandler);
  return theMap;
};

NationalMapController.prototype.addTileLayer = function (map) {
  // add the OpenStreetMap tiles
  L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
};

NationalMapController.prototype.initControls = function () {
  console.log(this.$layerControls, this.$zoomControls);

  if (!this.$layerControls || !this.$zoomControls) {
    console.log('No control elements defined');
    return undefined;
  }

  this.zoomComponent = new DLMaps.ZoomControls(this.$zoomControls, this.map, this.map.getZoom()).init({});
  var boundToggleDataLayer = this.toggleDataLayer.bind(this);
  this.layerControlsComponent = new DLMaps.LayerControls(this.$layerControls, this.map).init({
    toggleControlCallback: boundToggleDataLayer
  });
};

NationalMapController.prototype.moveEndHandler = function (e) {
  var bounds = e.target.getBounds();
  this.fetchAll(bounds);
  this.map._fetchSinceControlAction = true;
};

NationalMapController.prototype.toggleDataLayer = function (map, datasetName, adding) {
  var layer = this.layerControlsComponent.layerMap[datasetName];

  if (adding) {
    console.log('Debug: ', layer, datasetName);
    map.addLayer(layer);
    /* Not sure this is efficient
        What to limit the number of fetch requests. If layer toggled off then on
        with no move of the map there is no need to fetch all the features again */

    if (map._fetchSinceControlAction) {
      // if something has changed since layer last shown then trigger fetch all
      // can further improve by fetching only reenable layer
      this.fetchAll();
      map._fetchSinceControlAction = false;
    }

    if (layer.getLayers().length === 0) {
      // if contains no layers then maybe no fetch has been done before
      this.fetchAll();
    }
  } else {
    map.removeLayer(layer);
  }
};

NationalMapController.prototype.fetchAll = function () {
  var _this = this;

  var bounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.map.getBounds();

  if (this.controller) {
    console.log('controller.abort()');
    this.controller && this.controller.abort();
  } // eslint-disable-next-line no-unused-vars


  for (var _i = 0, _Object$entries = Object.entries(this.layerControlsComponent.layerMap); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    value.clearLayers();
  }

  this.controller = new AbortController();
  this.layerControlsComponent.enabledLayers().forEach(function (layer) {
    var type_ = layer.dataset.layerControl;

    var zoom = _this.map.getZoom();

    var zoomConstraint = _this.layerControlsComponent.getZoomRestriction(layer); // check for zoom constraint and only fetch if map is zoomed that far


    if (typeof zoomConstraint !== 'undefined') {
      console.log(type_, 'ZoomConstraint', _this.layerControlsComponent.getZoomRestriction(layer));

      if (zoom < zoomConstraint) {
        return;
      }
    }

    console.log('fetching', type_);

    _this.fetchFeatures(_this.fetchProgressCallback, _this.buildDataUrl(bounds, zoom, type_), _this.layerControlsComponent.layerMap[type_], _this.controller.signal, type_).then(function (geoJsonLayer) {
      console.log('fetch complete', type_);
    }).catch(function (e) {
      console.log('caught error from fetch', type_, e);
    });
  });
}; // function to perform the fetch


NationalMapController.prototype.fetchFeatures = function (progress, url, geoJsonLayer, signal, type_) {
  var that = this;
  return new Promise(function (resolve, reject) {
    return fetch(url, {
      signal: signal
    }).then(function (response) {
      if (response.status !== 200) {
        throw new Error("".concat(response.status, ": ").concat(response.statusText));
      }

      response.json().then(function (data) {
        geoJsonLayer.addData(data);

        if (data.length >= that.pageSize) {
          // why progress then call the func?
          progress && progress(geoJsonLayer, type_);
          var lastItem = data[data.length - 1]; // used to paginate the results

          var nextUrl = url;
          nextUrl.searchParams.set('after', lastItem.id); // self call if more results still to get

          that.fetchFeatures(progress, nextUrl, geoJsonLayer, signal, type_).then(resolve).catch(reject);
        } else {
          resolve(geoJsonLayer);
        }
      }).catch(reject);
    }).catch(reject);
  });
};

NationalMapController.prototype.buildDataUrl = function (bounds, zoomLevel) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var afterRowid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var query = 'bounded_geography_simplified_paged'; // controls whether to get simplified boundaries or full res

  if (zoomLevel > 11) {
    query = 'bounded_geography_full_paged';
  }

  if (type) {
    query = "".concat(query, "_by_type");
  }

  if (type === 'brownfield-land') {
    query = 'bounded_geography_brownfield_land';
  }

  var url = new URL("".concat(this.baseUrl, "/").concat(query, ".json?_json=geojson&_shape=arrayfirst&bbox_minx=").concat(bounds._southWest.lng, "&bbox_maxx=").concat(bounds._northEast.lng, "&bbox_miny=").concat(bounds._southWest.lat, "&bbox_maxy=").concat(bounds._northEast.lat, "&after=").concat(afterRowid));
  if (type) url.searchParams.set('type', type);
  return url;
};

NationalMapController.prototype.fetchProgressCallback = function (geoJsonLayer, datasetName) {
  console.debug("".concat(geoJsonLayer.getLayers().length, " features fetched for ").concat(datasetName));
};

NationalMapController.prototype.setupOptions = function (params) {
  params = params || {};
  this.defaultZoomLevel = params.defaultZoomLevel || 6;
  this.baseUrl = params.baseUrl || 'https://datasette-demo.digital-land.info/view_model';
  this.pageSize = params.pageSize || 100;
};