function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('DLMaps', ['exports'], factory) : factory(global.DLMaps = {});
})(this, function (exports) {
  'use strict';

  var utils = {};

  function camelCaseReplacer(match, s) {
    return s.toUpperCase();
  }

  utils.curie_to_url_part = function (curie) {
    return curie.replace(':', '/');
  };

  utils.toCamelCase = function (s) {
    // check to see string isn't already camelCased
    var nonWordChars = /\W/g;

    if (s && s.match(nonWordChars)) {
      return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, camelCaseReplacer);
    }

    return s;
  };

  utils.truncate = function (s, len) {
    if (typeof val === 'undefined') {
      console.log("Can't truncate undefined string");
      return '';
    }

    return s.slice(0, len) + '...';
  };
  /**
   * Create an organisation mapper. Maps organisation ids to names
   * @param  {Array} orgsObj Array of organisation objs. Must contain .id and .name propterties
   */


  utils.createOrgMapper = function (orgsObj) {
    var mapper = {};
    orgsObj.forEach(function (o) {
      mapper[o.id] = o.name;
    });
    return mapper;
  };

  utils.isFunction = function (x) {
    return Object.prototype.toString.call(x) === '[object Function]';
  };

  utils.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  /* global L, fetch, window */
  // govuk consistent colours


  var colours = {
    lightBlue: '#1d70b8',
    darkBlue: '#003078',
    brown: '#594d00',
    yellow_brown: '#a0964e',
    black: '#0b0c0c'
  };
  var boundaryStyle = {
    fillOpacity: 0.2,
    weight: 2,
    color: colours.darkBlue,
    fillColor: colours.lightBlue
  };
  var boundaryHoverStyle = {
    fillOpacity: 0.25,
    weight: 2,
    color: colours.black,
    fillColor: colours.darkBlue
  };

  function Map($module) {
    this.$module = $module;
    this.$wrapper = $module.closest('.dl-map__wrapper');
  }

  Map.prototype.init = function (params) {
    var _params = params || {}; // get element id from module


    this.mapId = this.$module.id || 'aMap';
    this.setupOptions(_params);
    this.tiles = this.setTiles();
    this.map = this.createMap();
    this.featureGroups = {};
    this.styles = {
      defaultBoundaryStyle: boundaryStyle,
      defaultBoundaryHoverStyle: boundaryHoverStyle
    };

    if (this.$wrapper) {
      this.$loader = this.$wrapper.querySelector('.dl-map__loader');
    } // add fullscreen control


    if (this.options.fullscreenControl) {
      // check fullscreen is available
      if (L.Control.Fullscreen) {
        this.map.addControl(new L.Control.Fullscreen({
          title: {
            false: 'View Fullscreen',
            true: 'Exit Fullscreen'
          }
        }));
      }
    }

    this.geojsonUrls = _params.geojsonURLs || [];
    var geojsonOptions = _params.geojsonOptions || {};
    this.geojsonUrls = this.extractURLS(); // have features been provided

    if (this.geojsonUrls.length || _params.geojsonFeatures) {
      // create a FeatureGroup layer to contain provided features
      // we want to use a FeatureGroup because it has getBounds()
      // FIXME: geojson urls might not be boundaries so fix name
      this.createFeatureGroup('initBoundaries').addTo(this.map);
      this.setupInitialZoomHook(this.featureGroups.initBoundaries); // if geojsonFeatures not defined then need to fetch geojson before plotting

      var needToFetchFeatures = true;
      var initialFeatures = this.geojsonUrls;

      if (typeof _params.geojsonFeatures !== 'undefined') {
        needToFetchFeatures = false;
        initialFeatures = _params.geojsonFeatures;
      }

      this.plotInitialFeatures(initialFeatures, geojsonOptions, needToFetchFeatures);
    }

    return this;
  };

  Map.prototype.setTiles = function () {
    return L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  };

  Map.prototype.addStyle = function (name, style) {
    this.styles[name] = style;
  };
  /**
   * Add event listeners for hovering a layer
   * @param  {Object} layer A leaflet layer (e.g. a polygon)
   * @param  {Object} options Options for configuring hover interaction
   *    {Func} .check Check to decide whether styles+ should be performed
   *    {Object} .defaultStyle Leaflet style object to apply when not hovered
   *    {Object} .hoverStyle Leaflet style object to apply when hovered
   *    {Func} .cb Optional callback to trigger, accepts cb(layer <- leaflet layer, hovered <- boolean)
   */


  Map.prototype.addLayerHoverState = function (layer, options) {
    var hasCheck = options.check && utils.isFunction(options.check);
    var defaultStyle = options.defaultStyle || this.styles.defaultBoundaryStyle;
    var hoverStyle = options.hoverStyle || this.styles.defaultBoundaryHoverStyle;
    layer.on('mouseover', function () {
      if (hasCheck ? options.check(layer) : true) {
        layer.setStyle(hoverStyle);

        if (options.cb && utils.isFunction(options.cb)) {
          options.cb(layer, true);
        }
      }
    });
    layer.on('mouseout', function () {
      if (hasCheck ? options.check(layer) : true) {
        layer.setStyle(defaultStyle);

        if (options.cb && utils.isFunction(options.cb)) {
          options.cb(layer, false);
        }
      }
    });
  };

  Map.prototype.createMap = function () {
    var opts = this.options;
    var latLng = L.latLng(opts.defaultPos[0], opts.defaultPos[1]);
    return L.map(this.mapId, {
      center: latLng,
      zoom: opts.default_zoom,
      minZoom: opts.minZoom,
      maxZoom: opts.maxZoom,
      layers: [this.tiles]
    });
  };

  Map.prototype.createFeatureGroup = function (name, options) {
    var _options = options || {};

    if (Object.prototype.hasOwnProperty.call(this.featureGroups, name)) {
      return this.featureGroups[name];
    }

    var fG = L.featureGroup([], _options);
    this.featureGroups[name] = fG;
    return fG;
  };

  function greaterThanViewport(h) {
    return h > window.innerHeight;
  }
  /**
   * Sets the height of the map
   * @param  {Integer} height Height in pixels
   */


  Map.prototype.setMapHeight = function (height) {
    var $map = this.$module;
    var h = height || 2 / 3;
    var offsetMin = 75;
    var minHeight = 300;
    var width = $map.offsetWidth;
    var v = h < 1 ? width * h : h; // limit height to less than viewport to help scrolling

    if (greaterThanViewport(v)) {
      var portion = window.innerHeight * 0.1;
      v = window.innerHeight - (portion < offsetMin ? offsetMin : portion);
    } // but should never be less than minHeight


    $map.style.height = (v < minHeight ? minHeight : v) + 'px';
    this.map.invalidateSize();
  };

  Map.prototype.zoomToLayer = function (layer) {
    this.map.fitBounds(layer.getBounds());
  };
  /**
   * Extracts URLs from the data-geojson-urls attribute
   * URLs added to the list - duplicates are ignored
   */


  Map.prototype.extractURLS = function () {
    var urlsStr = this.$module.dataset.geojsonUrls;
    var urlList = this.geojsonUrls;

    function isListed(value, arr) {
      return arr.indexOf(value) > -1;
    }

    if (typeof urlsStr !== 'undefined') {
      urlsStr.split(';').forEach(function (url) {
        if (!isListed(url, urlList)) {
          urlList.push(url);
        }
      });
    }

    return urlList;
  };

  Map.prototype.hideLoader = function () {
    if (this.$loader) {
      this.$loader.classList.add('js-hidden');
    }
  };

  Map.prototype.geojsonLayer = function (data, options) {
    var style = options.style || this.styles.defaultBoundaryStyle;

    var onEachFeature = options.onEachFeature || function () {};

    return L.geoJSON(data, {
      style: style,
      onEachFeature: onEachFeature,
      pointToLayer: options.pointToLayer || function (geoJsonPoint, latlng) {
        return L.marker(latlng);
      }
    });
  };

  Map.prototype.plotInitialFeatures = function (features, options, needToFetchData) {
    var _this = this;

    var that = this;
    var map = this.map;
    var defaultFG = this.featureGroups.initBoundaries;
    var count = 0;

    function addLayer(data) {
      var layer = utils.isFunction(options.geojsonDataToLayer) ? options.geojsonDataToLayer(data, options) : that.geojsonLayer(data, options);
      layer.addTo(defaultFG);
      count++; // check to see if all features have been added
      // only pan map once all boundaries have been added

      if (count === features.length) {
        map.fitBounds(defaultFG.getBounds());
        map.addControl(new L.Control.Recentre({
          layer: defaultFG
        }));
      }

      return layer;
    } // if needToFetchData is true then features is an array of urls that need to be fetched first


    if (needToFetchData) {
      Promise.allSettled(features.map(function (url) {
        return fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          return addLayer(data);
        }).catch(function (err) {
          console.log(url, 'error', err);
        });
      })).then(function (promiseResolutions) {
        // once initial boundaries have loaded execute callback
        if (utils.isFunction(_this.options.initGeoJsonLoadCallback)) {
          _this.options.initGeoJsonLoadCallback(features, defaultFG);
        }
      });
    } else {
      features.forEach(function (feature) {
        addLayer(feature);
      });
    }
  };

  Map.prototype.setupInitialZoomHook = function (featureGroup) {
    var that = this;
    var map = this.map; // hook for callback to trigger once inital zoom/fitbounds completes

    if (utils.isFunction(this.options.initZoomCallback)) {
      var moveEndHandler = function moveEndHandler(e) {
        console.log('inital map move/zoom handler triggered');
        that.options.initZoomCallback(featureGroup, map);
        map.off('moveend', moveEndHandler);
      };

      map.on('moveend', moveEndHandler);
    }
  };

  Map.prototype.setupOptions = function (params) {
    params = params || {};
    this.options = {
      defaultPos: params.defaultPos || [52.561928, -1.464854],
      default_zoom: params.minZoom || 6,
      minZoom: params.minZoom || 6,
      maxZoom: params.maxZoom || 18,
      fullscreenControl: params.fullscreenControl || true,
      // add fullscreen control by default
      initGeoJsonLoadCallback: params.initGeoJsonLoadCallback || undefined,
      initZoomCallback: params.initZoomCallback || undefined
    };
  }; // assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  // probably just needed by IE browsers


  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target, varArgs) {
        // .length of function is 2
        if (target === null || target === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }

        return to;
      },
      writable: true,
      configurable: true
    });
  }
  /* global L, fetch */
  // set up config variables


  var organisationMapper = {};
  var popupTemplate = '<div class="bfs">' + '{hasEndDate}' + '<div class="bfs__header">' + '<span class="govuk-caption-s">{site}</span>' + '<h3 class="govuk-heading-s bfs__addr">{site-address}</h3>' + '{ifCoords}' + '</div>' + '<div class="govuk-grid-row bfs__key-data">' + '<dl class="govuk-grid-column-one-half">' + '<dt>Hectare</dt>' + '<dd>{hectares}</dd>' + '</dl>' + '<dl class="govuk-grid-column-one-half">' + '<dt>Dwellings</dt>' + '<dd>{isRange}</dd>' + '</dl>' + '</div>' + '<div class="bfs__meta">' + '{orgLink}' + '{optionalFields}' + '{datesSection}' + '</div>' + '<div class="bfs__footer">' + '<a href="{slug}" class="govuk-link">View complete record</a>' + '</div>' + '</div>';
  var popupOptions = {
    minWidth: '270',
    maxWidth: '270',
    className: 'bfs-popup'
  };
  var brownfieldSiteStyle = {
    color: '#745729',
    fillColor: '#745729',
    fillOpacity: 0.5
  };
  var historicalBrownfieldSiteStyle = {
    color: '#d53880 ',
    fillColor: '#f3f2f1',
    fillOpacity: 0.5
  };
  var potentiallyNullFields = ['deliverable', 'hazardous-substances', 'ownership', 'planning-permission-status', 'planning-permission-type']; // private functions

  function ifCoords(data) {
    if (data.latitude && data.longitude) {
      return "<span class=\"bfs__coords\">".concat(data.latitude, ",").concat(data.longitude, "</span>");
    }

    return '';
  }

  function datesSection(data) {
    return definitionList('Date added', data['start-date']);
  }

  function definitionList(field, value) {
    return ['<dl>', "<dt>".concat(field, "</dt>"), "<dd>".concat(value, "</dd>"), '</dl>'].join('\n');
  }

  function hasEndDate(data) {
    if (data['end-date']) {
      return '<span class="bfs__end-banner">End date: ' + data['end-date'] + '</span>';
    }

    return '';
  }

  function isRange(data) {
    var str = data['minimum-net-dwellings'];

    if (data['minimum-net-dwellings'] != null) {
      if (parseInt(data['minimum-net-dwellings']) !== parseInt(data['maximum-net-dwellings']) || parseInt(data['maximum-net-dwellings']) === 0) {
        str = data['minimum-net-dwellings'] + '-' + data['maximum-net-dwellings'];
      }

      return str;
    }

    return '';
  }

  function linkToOrg(data) {
    var orgName = data.organisation;

    if (Object.prototype.hasOwnProperty.call(organisationMapper, data.organisation)) {
      orgName = organisationMapper[data.organisation];
    }

    return '<dl>' + '<dt>Organisation</dt>' + "<dd><a class=\"govuk-link\" href=\"https://digital-land.github.io/organisation/".concat(utils.curie_to_url_part(data.organisation), "\">").concat(orgName, "</a></dd>") + '</dl>';
  }

  function optionalFields(data) {
    var extras = '';
    potentiallyNullFields.forEach(function (field) {
      if (data[field]) {
        extras += definitionList(field, data[field]);
      }
    });
    return extras;
  }

  function processSiteData(row) {
    var templateFuncs = {
      ifCoords: ifCoords,
      isRange: isRange,
      hasEndDate: hasEndDate,
      datesSection: datesSection,
      orgLink: linkToOrg,
      optionalFields: optionalFields
    };
    return Object.assign(row, templateFuncs);
  }

  function bindBrownfieldPopup(feature, layer) {
    var popupHTML = createPopup(feature.properties);
    layer.bindPopup(popupHTML, popupOptions).on('popupopen', function (e) {
      console.log('Brownfield site selected', e.sourceTarget.feature);
    });
  }

  function plot(feature, latlng) {
    var style = feature.properties['end-date'] ? historicalBrownfieldSiteStyle : brownfieldSiteStyle;
    var size = siteSize(feature.properties.hectares);
    style.radius = size.toFixed(2);
    return L.circle(latlng, style);
  } // public methods - available on object


  function createPopup(row) {
    return L.Util.template(popupTemplate, processSiteData(row));
  }
  /**
   * Converts brownfield geojson data into points and popups on the map
   * @param  {Object} geojson Set of geojson features
   * @param  {Object} options Options overriding defaults
   *    {Func} .onEachFeature Function to execute on each feature layer created
   */


  function brownfieldGeojsonToLayer(geojson, options) {
    return L.geoJSON(geojson, {
      pointToLayer: plot,
      onEachFeature: options.onEachFeature || bindBrownfieldPopup
    });
  }

  function loadBrownfieldSites(map, url, groupName, options) {
    var groupNameCC = utils.toCamelCase(groupName); // check to see if already loaded data

    if (!Object.prototype.hasOwnProperty.call(map.featureGroups, groupNameCC)) {
      fetch(url).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        var l = map.createFeatureGroup(groupNameCC);
        var geojsonLayer = brownfieldGeojsonToLayer(data, options);
        geojsonLayer.addTo(l);

        if (typeof options.layerGroup !== 'undefined') {
          l.addTo(options.layerGroup);
        } // run any callback


        if (options.cb && utils.isFunction(options.cb)) {
          options.cb(l, groupName);
        }
      }).catch(function (err) {
        console.log('error loading brownfield sites', err);
      });
    }
  } // this feels messy!


  function registerMapper(mapper) {
    organisationMapper = mapper;
  }

  function siteSize(hectares) {
    if (isNaN(hectares)) {
      return 100; // give it a default size
    }

    return Math.sqrt(hectares * 10000 / Math.PI);
  }

  var brownfieldSites = {
    calcSiteSize: siteSize,
    createPopup: createPopup,
    geojsonToLayer: brownfieldGeojsonToLayer,
    loadSites: loadBrownfieldSites,
    popupOptions: popupOptions,
    popupTemplate: popupTemplate,
    registerOrganisationMapper: registerMapper
  };
  /* global L */

  var popupOptions$1 = {
    minWidth: '270',
    maxWidth: '270',
    className: 'bfs-popup'
  };
  var popupTemplate$1 = '<div class="bfs">' + '<div class="bfs__header">' + '<span class="govuk-caption-s">{dataType}</span>' + '<h3 class="govuk-heading-s bfs__addr">{identifier} - {name}</h3>' + '</div>' + '<div class="bfs__footer">' + '<a href="{slug}" class="govuk-link">View record</a>' + '</div>' + '</div>';

  function processRecord(row, idField) {
    function getId(data) {
      return data[idField];
    }

    var templateFuncs = {
      dataType: function dataType() {
        return idField;
      },
      identifier: getId
    };
    return Object.assign(row, templateFuncs);
  }

  function createPopup$1(row, idField) {
    return L.Util.template(popupTemplate$1, processRecord(row, idField));
  }
  /**
   * Creates an onEachFeature function with understanding of the identifier field
   * @param  {string} id the field name for the record identifier
   */


  function initOnEachFeature(id) {
    var identifierField = id || 'slug';

    function onEachFeature(feature, layer) {
      var popupHTML = createPopup$1(feature.properties, identifierField);
      layer.bindPopup(popupHTML, popupOptions$1).on('popupopen', function (e) {
        console.log('Polygon clicked', e.sourceTarget.feature);
      });
    }

    return onEachFeature;
  }

  var basicPopup = {
    initOnEachFeature: initOnEachFeature
  };
  /* global window */

  function LayerControls($module, map, source) {
    this.$module = $module;
    this.map = map;
    this.tileSource = source;
  }

  LayerControls.prototype.init = function (params) {
    this.setupOptions(params);
    this._initialLoadWithLayers = false; // returns a node list so convert to array

    var $controls = this.$module.querySelectorAll(this.layerControlSelector);
    this.$controls = Array.prototype.slice.call($controls); // find parent

    this.$container = this.$module.closest('.' + this.controlsContainerClass);
    this.$container.classList.remove('js-hidden'); // add buttons to open and close panel

    this.$closeBtn = this.createCloseButton();
    this.$openBtn = this.createOpenButton(); // list all datasets names

    this.datasetNames = this.$controls.map(function ($control) {
      return $control.dataset.layerControl;
    }); // create mapping between dataset and layer, one per control item

    this.availableLayers = this.createAllFeatureLayers();
    console.log(this.availableLayers); // listen for changes to URL

    var boundSetControls = this.setControls.bind(this);
    window.addEventListener('popstate', function (event) {
      console.log('URL has changed - back button');
      boundSetControls();
    }); // initial set up of controls (default or urlParams)

    var urlParams = new URL(document.location).searchParams;
    console.log('PARAMS', urlParams);

    if (!urlParams.has('layer')) {
      // if not set then use default checked controls
      console.log('NO layer params exist');
      this.updateURL();
    } else {
      // use URL params if available
      console.log('layer params exist');
      this.setControls();
      this._initialLoadWithLayers = true;
    } // listen for changes on each checkbox and change the URL


    var boundControlChkbxChangeHandler = this.onControlChkbxChange.bind(this);
    this.$controls.forEach(function ($control) {
      console.log(this);
      $control.addEventListener('change', boundControlChkbxChangeHandler, true);
    }, this);
    return this;
  };

  LayerControls.prototype.createCloseButton = function () {
    var button = document.createElement('button');
    button.classList.add('dl-map__close-btn');
    button.dataset.action = 'close';
    var label = document.createElement('span');
    label.textContent = 'Close layer panel';
    label.classList.add('govuk-visually-hidden');
    button.appendChild(label);
    this.$container.appendChild(button);
    var boundTogglePanel = this.togglePanel.bind(this);
    button.addEventListener('click', boundTogglePanel);
    return button;
  };

  LayerControls.prototype.createOpenButton = function () {
    var button = document.createElement('button');
    button.classList.add('dl-map__open-btn', 'dl-map__overlay', 'js-hidden');
    button.dataset.action = 'open';
    var label = document.createElement('span');
    label.textContent = 'Open layer panel';
    label.classList.add('govuk-visually-hidden');
    button.appendChild(label);
    this.map.getContainer().appendChild(button);
    var boundTogglePanel = this.togglePanel.bind(this);
    button.addEventListener('click', boundTogglePanel);
    return button;
  };

  LayerControls.prototype.togglePanel = function (e) {
    var action = e.target.dataset.action;
    var opening = action === 'open'; // set aria attributes

    this.$container.setAttribute('aria-hidden', !opening);
    this.$container.setAttribute('open', opening);

    if (opening) {
      this.$container.classList.remove('dl-map__side-panel--collapsed');
      this.$openBtn.classList.add('js-hidden'); // focus on the panel when opening

      this.$container.focus();
    } else {
      this.$container.classList.add('dl-map__side-panel--collapsed');
      this.$openBtn.classList.remove('js-hidden'); // focus on open btn when closing panel

      this.$openBtn.focus();
    }
  };

  LayerControls.prototype.onControlChkbxChange = function (e) {
    console.log('Has been toggled', e.target, this); // get the control containing changed checkbox
    // var $clickedControl = e.target.closest(this.layerControlSelector)
    // when a control is changed update the URL params

    this.updateURL();
  }; // should this return an array or a single control?


  LayerControls.prototype.getControlByName = function (dataset) {
    for (var i = 0; i < this.$controls.length; i++) {
      var $control = this.$controls[i];

      if ($control.dataset.layerControl === dataset) {
        return $control;
      }
    }

    return undefined;
  };

  LayerControls.prototype.createVectorLayer = function (layerId, datasetName, _type, paintOptions) {
    // if there is a tileSource for the layer use that or default to the group one
    var tileSource = this.map.getSource(datasetName + '-source') ? datasetName + '-source' : this.tileSource;
    console.log('TileSource:', tileSource);
    this.map.addLayer({
      id: layerId,
      type: _type,
      source: tileSource,
      'source-layer': datasetName,
      paint: paintOptions
    });
  };

  LayerControls.prototype.createAllFeatureLayers = function () {
    var availableDatasets = [];
    var that = this;
    this.$controls.forEach(function ($control) {
      var datasetName = that.getDatasetName($control);
      var dataType = that.getDatasetType($control);
      var styleProps = that.getStyle($control);
      var layers;

      if (dataType === 'point') {
        // set options for points as circle markers
        var paintOptions = {
          'circle-color': styleProps.colour,
          'circle-opacity': styleProps.opacity,
          'circle-radius': {
            base: 1.5,
            stops: [[6, 1], [22, 180]]
          },
          'circle-stroke-color': styleProps.colour,
          'circle-stroke-width': styleProps.weight
        }; // create the layer

        that.createVectorLayer(datasetName, datasetName, 'circle', paintOptions);
        layers = [datasetName];
      } else {
        // create fill layer
        that.createVectorLayer(datasetName + 'Fill', datasetName, 'fill', {
          'fill-color': styleProps.colour,
          'fill-opacity': styleProps.opacity
        }); // create line layer

        that.createVectorLayer(datasetName + 'Line', datasetName, 'line', {
          'line-color': styleProps.colour,
          'line-width': styleProps.weight
        });
        layers = [datasetName + 'Fill', datasetName + 'Line'];
      }

      availableDatasets[datasetName] = layers;
    });
    return availableDatasets;
  };

  LayerControls.prototype.enable = function ($control) {
    console.log('enable', this.getDatasetName($control));
    var $chkbx = $control.querySelector('input[type="checkbox"]');
    $chkbx.checked = true;
    $control.dataset.layerControlActive = 'true';
    $control.classList.remove(this.layerControlDeactivatedClass);
    this.toggleLayerVisibility(this.map, this.getDatasetName($control), true);
  };

  LayerControls.prototype.disable = function ($control) {
    console.log('disable', this.getDatasetName($control));
    var $chkbx = $control.querySelector('input[type="checkbox"]');
    $chkbx.checked = false;
    $control.dataset.layerControlActive = 'false';
    $control.classList.add(this.layerControlDeactivatedClass);
    this.toggleLayerVisibility(this.map, this.getDatasetName($control), false);
  };
  /**
   * Sets the checkboxes based on ?layer= URL params
   */


  LayerControls.prototype.setControls = function () {
    var _this2 = this;

    var urlParams = new URL(document.location).searchParams;
    var enabledLayerNames = [];

    if (urlParams.has('layer')) {
      // get the names of the enabled and disabled layers
      // only care about layers that exist
      enabledLayerNames = urlParams.getAll('layer').filter(function (name) {
        return _this2.datasetNames.indexOf(name) > -1;
      });
      console.log('Enable:', enabledLayerNames);
    }

    var datasetNamesClone = [].concat(this.datasetNames);
    var disabledLayerNames = datasetNamesClone.filter(function (name) {
      return enabledLayerNames.indexOf(name) === -1;
    }); // map the names to the controls

    var toEnable = enabledLayerNames.map(function (name) {
      return _this2.getControlByName(name);
    });
    var toDisable = disabledLayerNames.map(function (name) {
      return _this2.getControlByName(name);
    });
    console.log(toEnable, toDisable); // pass correct this arg

    toEnable.forEach(this.enable, this);
    toDisable.forEach(this.disable, this);
  };
  /**
   * Updates the URL by adding or removing ?layer= params based on latest changes to checkboxes
   */


  LayerControls.prototype.updateURL = function () {
    var _this3 = this;

    var urlParams = new URL(document.location).searchParams;
    var enabledLayers = this.enabledLayers().map(function ($control) {
      return _this3.getDatasetName($control);
    });
    urlParams.delete('layer');
    enabledLayers.forEach(function (name) {
      return urlParams.append('layer', name);
    });
    console.log(urlParams.toString());
    var newURL = window.location.pathname + '?' + urlParams.toString() + window.location.hash; // add entry to history, does not fire event so need to call setControls

    window.history.pushState({}, '', newURL);
    this.setControls();
  };

  LayerControls.prototype.getCheckbox = function ($control) {
    return $control.querySelector('input[type="checkbox"]');
  };

  LayerControls.prototype.enabledLayers = function () {
    var _this4 = this;

    return this.$controls.filter(function ($control) {
      return _this4.getCheckbox($control).checked;
    });
  };

  LayerControls.prototype.disabledLayers = function () {
    var _this5 = this;

    return this.$controls.filter(function ($control) {
      return !_this5.getCheckbox($control).checked;
    });
  };

  LayerControls.prototype.getDatasetName = function ($control) {
    return $control.dataset.layerControl;
  };

  LayerControls.prototype.getDatasetType = function ($control) {
    return $control.dataset.layerDataType;
  };

  LayerControls.prototype.getZoomRestriction = function ($control) {
    return $control.dataset.layerControlZoom;
  };
  /**
   * Extracts and splits style options from style data attribute string
   * @param  {Element} $control a control item
   */


  LayerControls.prototype.getStyle = function ($control) {
    var defaultColour = '#003078';
    var defaultOpacity = 0.5;
    var defaultWeight = 2;
    var s = $control.dataset.styleOptions;
    var parts = s.split(',');
    return {
      colour: parts[0] || defaultColour,
      opacity: parseFloat(parts[1]) || defaultOpacity,
      weight: parseInt(parts[2]) || defaultWeight
    };
  };

  LayerControls.prototype._toggleLayer = function (layerId, visibility) {
    this.map.setLayoutProperty(layerId, 'visibility', visibility);
  };

  LayerControls.prototype.toggleLayerVisibility = function (map, datasetName, toEnable) {
    var _this6 = this;

    console.log('toggle layer', datasetName);
    var visibility = toEnable ? 'visible' : 'none';
    var layers = this.availableLayers[datasetName];
    layers.forEach(function (layerId) {
      return _this6._toggleLayer(layerId, visibility);
    });
  };

  LayerControls.prototype.setupOptions = function (params) {
    params = params || {};
    this.layerControlSelector = params.layerControlSelector || '[data-layer-control]';
    this.layerControlDeactivatedClass = params.layerControlDeactivatedClass || 'deactivated-control';
    this.onEachFeature = params.onEachFeature || this.defaultOnEachFeature;
    this.baseUrl = params.baseUrl || 'http://digital-land.github.io';
    this.controlsContainerClass = params.controlsContainerClass || 'dl-map__side-panel';
  };

  function ZoomControls($module, leafletMap, initialZoom) {
    this.$module = $module;
    this.map = leafletMap;
    this.initialZoom = initialZoom;
  }

  ZoomControls.prototype.init = function (params) {
    this.setupOptions(params);

    if (!this.$module) {
      return undefined;
    }

    this.$module.classList.remove('js-hidden');
    var $buttons = this.$module.querySelectorAll('.' + this.buttonClass);
    this.$buttons = Array.prototype.slice.call($buttons);
    this.$counter = this.$module.querySelector(this.counterSelector);
    this.$counter.textContent = this.initialZoom;
    var boundClickHandler = this.clickHandler.bind(this);
    this.$buttons.forEach(function ($button) {
      $button.addEventListener('click', boundClickHandler);
    });
    var boundZoomHandler = this.zoomHandler.bind(this); // use on() not addEventListener()

    this.map.on('zoomend', boundZoomHandler);
    return this;
  };

  ZoomControls.prototype.clickHandler = function (e) {
    e.preventDefault();
    var $clickedEl = e.target;
    var $clickedControl = $clickedEl; // check if button was pressed
    // if contained span then find button

    if (!$clickedEl.classList.contains(this.buttonClass)) {
      $clickedControl = $clickedEl.closest('.' + this.buttonClass);
    }

    this.zoom($clickedControl.dataset.zoomControl);
  };

  ZoomControls.prototype.zoom = function (direction) {
    direction === 'in' ? this.map.zoomIn(1) : this.map.zoomOut(1);
  };

  ZoomControls.prototype.zoomHandler = function (e) {
    var zoomLevel = this.map.getZoom();
    var zl = parseFloat(zoomLevel);

    if (zl % 1 !== 0) {
      zl = parseFloat(zoomLevel).toFixed(2);
    }

    this.$counter.textContent = zl;
  };

  ZoomControls.prototype.setupOptions = function (params) {
    params = params || {};
    this.buttonClass = params.buttonClass || 'zoom-controls__btn';
    this.counterSelector = params.counterSelector || '.zoom-controls__count';
  };

  var circleMarkerStyle = function circleMarkerStyle(hex) {
    return {
      color: hex,
      fillColor: hex,
      fillOpacity: 0.5
    };
  };

  function setCircleSize(hectares, defaultRadius) {
    if (hectares === null || isNaN(hectares)) {
      return defaultRadius || 100; // give it a default size
    }

    return Math.sqrt(hectares * 10000 / Math.PI);
  }

  var mapUtils = {
    circleMarkerStyle: circleMarkerStyle,
    setCircleSize: setCircleSize
  };
  var Permalink = {
    // gets the map center, zoom-level and rotation from the URL if present, else uses default values
    getMapLocation: function getMapLocation(zoom, center) {
      zoom = zoom || zoom === 0 ? zoom : 18;
      center = center || [52.26869, -113.81034];

      if (window.location.hash !== '') {
        var hash = window.location.hash.replace('#', '');
        var parts = hash.split(',');

        if (parts.length === 3) {
          center = {
            lat: parseFloat(parts[0]),
            lng: parseFloat(parts[1])
          };
          zoom = parseInt(parts[2].slice(0, -1), 10);
        }
      }

      return {
        zoom: zoom,
        center: center
      };
    },
    setup: function setup(map) {
      var shouldUpdate = true;

      var updatePermalink = function updatePermalink() {
        if (!shouldUpdate) {
          // do not update the URL when the view was changed in the 'popstate' handler (browser history navigation)
          shouldUpdate = true;
          return;
        }

        var center = map.getCenter();
        var hash = '#' + Math.round(center.lat * 100000) / 100000 + ',' + Math.round(center.lng * 100000) / 100000 + ',' + map.getZoom() + 'z';
        var state = {
          zoom: map.getZoom(),
          center: center
        };
        window.history.pushState(state, 'map', hash);
      };

      map.on('moveend', updatePermalink); // restore the view state when navigating through the history, see
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate

      window.addEventListener('popstate', function (event) {
        if (event.state === null) {
          return;
        }

        if (typeof map.flyTo === 'function') {
          // maplibre and mapbox
          map.flyTo({
            center: event.state.center,
            zoom: event.state.zoom
          });
        } else {
          // leaflet
          map.setView(event.state.center, event.state.zoom);
        }

        shouldUpdate = false;
      });
    }
  };
  var utils$1 = mapUtils;
  exports.Map = Map;
  exports.brownfieldSites = brownfieldSites;
  exports.basicPopup = basicPopup;
  exports.LayerControls = LayerControls;
  exports.Permalink = Permalink;
  exports.ZoomControls = ZoomControls;
  exports.utils = utils$1;
});
