(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('DLMaps', ['exports'], factory) :
	(factory((global.DLMaps = {})));
}(this, (function (exports) { 'use strict';

var utils = {};

function camelCaseReplacer (match, s) {
  return s.toUpperCase()
}

utils.curie_to_url_part = function (curie) {
  return curie.replace(':', '/')
};

utils.toCamelCase = function (s) {
  // check to see string isn't already camelCased
  var nonWordChars = /\W/g;
  if (s && s.match(nonWordChars)) {
    return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, camelCaseReplacer)
  }
  return s
};

utils.truncate = function (s, len) {
  return s.slice(0, len) + '...'
};

/**
 * Create an organisation mapper. Maps organisation ids to names
 * @param  {Array} orgsObj Array of organisation objs. Must contain .id and .name propterties
 */
utils.createOrgMapper = function (orgsObj) {
  const mapper = {};
  orgsObj.forEach(function (o) {
    mapper[o.id] = o.name;
  });
  return mapper
};

utils.isFunction = function (x) {
  return Object.prototype.toString.call(x) === '[object Function]'
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

const boundaryStyle = {
  fillOpacity: 0.2,
  weight: 2,
  color: colours.darkBlue,
  fillColor: colours.lightBlue
};

const boundaryHoverStyle = {
  fillOpacity: 0.25,
  weight: 2,
  color: colours.black,
  fillColor: colours.darkBlue
};

function Map ($module) {
  this.$module = $module;
  this.$wrapper = $module.closest('.dl-map__wrapper');
}

Map.prototype.init = function (params) {
  const _params = params || {};
  // get element id from module
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
  }

  // add fullscreen control
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
  const geojsonOptions = _params.geojsonOptions || {};
  this.geojsonUrls = this.extractURLS();
  // if pointers to geojson provided add to the default featureGroup (a featureGroup has getBounds() func)
  if (this.geojsonUrls.length) {
    // FIXME: geojson urls might not be boundaries so fix name
    this.createFeatureGroup('initBoundaries').addTo(this.map);
    this.plotBoundaries(this.geojsonUrls, geojsonOptions);
  }

  return this
};

Map.prototype.setTiles = function () {
  return L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
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
  const hasCheck = (options.check && utils.isFunction(options.check));
  const defaultStyle = options.defaultStyle || this.styles.defaultBoundaryStyle;
  const hoverStyle = options.hoverStyle || this.styles.defaultBoundaryHoverStyle;
  layer.on('mouseover', function () {
    if ((hasCheck) ? options.check(layer) : true) {
      layer.setStyle(hoverStyle);
      if (options.cb && utils.isFunction(options.cb)) { options.cb(layer, true); }
    }
  });
  layer.on('mouseout', function () {
    if ((hasCheck) ? options.check(layer) : true) {
      layer.setStyle(defaultStyle);
      if (options.cb && utils.isFunction(options.cb)) { options.cb(layer, false); }
    }
  });
};

Map.prototype.createMap = function () {
  const opts = this.options;
  var latLng = L.latLng(opts.defaultPos[0], opts.defaultPos[1]);
  return L.map(this.mapId, {
    center: latLng,
    zoom: opts.default_zoom,
    minZoom: opts.minZoom,
    maxZoom: opts.maxZoom,
    layers: [this.tiles]
  })
};

Map.prototype.createFeatureGroup = function (name, options) {
  const _options = options || {};
  if (Object.prototype.hasOwnProperty.call(this.featureGroups, name)) {
    return this.featureGroups[name]
  }
  const fG = L.featureGroup([], _options);
  this.featureGroups[name] = fG;
  return fG
};

function greaterThanViewport (h) {
  return h > window.innerHeight
}

/**
 * Sets the height of the map
 * @param  {Integer} height Height in pixels
 */
Map.prototype.setMapHeight = function (height) {
  const $map = this.$module;
  const h = height || (2 / 3);
  const offsetMin = 75;
  const minHeight = 300;
  const width = $map.offsetWidth;
  let v = (h < 1) ? width * h : h;

  // limit height to less than viewport to help scrolling
  if (greaterThanViewport(v)) {
    const portion = window.innerHeight * 0.1;
    v = window.innerHeight - ((portion < offsetMin) ? offsetMin : portion);
  }

  // but should never be less than minHeight
  $map.style.height = ((v < minHeight) ? minHeight : v) + 'px';
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

  function isListed (value, arr) {
    return arr.indexOf(value) > -1
  }

  if (typeof urlsStr !== 'undefined') {
    urlsStr.split(';').forEach(function (url) {
      if (!isListed(url, urlList)) {
        urlList.push(url);
      }
    });
  }
  return urlList
};

Map.prototype.hideLoader = function () {
  if (this.$loader) {
    this.$loader.classList.add('js-hidden');
  }
};

Map.prototype.geojsonLayer = function (data, type, options) {
  const style = options.style || this.styles.defaultBoundaryStyle;
  const onEachFeature = options.onEachFeature || function () {};
  if (type === 'point') {
    return L.geoJSON(data, {
      pointToLayer: options.pointToLayer,
      onEachFeature: onEachFeature
    })
  }
  return L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature
  })
};

Map.prototype.plotBoundaries = function (urls, options) {
  const that = this;
  const map = this.map;
  const defaultFG = this.featureGroups.initBoundaries;
  const _type = options.type || 'polygon';
  var count = 0;
  urls.forEach(function (url) {
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const layer = (utils.isFunction(options.geojsonDataToLayer)) ? options.geojsonDataToLayer(data, options) : that.geojsonLayer(data, _type, options);
        layer.addTo(defaultFG);
        count++;
        // only pan map once all boundaries have loaded
        if (count === urls.length) {
          map.fitBounds(defaultFG.getBounds());
          map.addControl(new L.Control.Recentre({
            layer: defaultFG
          }));
        }
      });
  });
};

Map.prototype.setupOptions = function (params) {
  params = params || {};
  this.options = {
    defaultPos: params.defaultPos || [52.561928, -1.464854],
    default_zoom: params.minZoom || 6,
    minZoom: params.minZoom || 6,
    maxZoom: params.maxZoom || 18,
    fullscreenControl: params.fullscreenControl || true // add fullscreen control by default
  };
};

// assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
// probably just needed by IE browsers
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign (target, varArgs) { // .length of function is 2
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object')
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
      return to
    },
    writable: true,
    configurable: true
  });
}

/* global L, fetch */

// set up config variables

let organisationMapper = {};

const popupTemplate =
  '<div class="bfs">' +
    '{hasEndDate}' +
    '<div class="bfs__header">' +
      '<span class="govuk-caption-s">{site}</span>' +
      '<h3 class="govuk-heading-s bfs__addr">{site-address}</h3>' +
      '{ifCoords}' +
    '</div>' +
    '<div class="govuk-grid-row bfs__key-data">' +
      '<dl class="govuk-grid-column-one-half">' +
        '<dt>Hectare</dt>' +
        '<dd>{hectares}</dd>' +
      '</dl>' +
      '<dl class="govuk-grid-column-one-half">' +
        '<dt>Dwellings</dt>' +
        '<dd>{isRange}</dd>' +
      '</dl>' +
    '</div>' +
    '<div class="bfs__meta">' +
      '{orgLink}' +
      '{optionalFields}' +
      '{datesSection}' +
    '</div>' +
    '<div class="bfs__footer">' +
      '<a href="{slug}" class="govuk-link">View complete record</a>' +
    '</div>' +
  '</div>';

const popupOptions = {
  minWidth: '270',
  maxWidth: '270',
  className: 'bfs-popup'
};

const brownfieldSiteStyle = {
  color: '#745729',
  fillColor: '#745729',
  fillOpacity: 0.5
};

const historicalBrownfieldSiteStyle = {
  color: '#d53880 ',
  fillColor: '#f3f2f1',
  fillOpacity: 0.5
};

const potentiallyNullFields = ['deliverable', 'hazardous-substances', 'ownership', 'planning-permission-status', 'planning-permission-type'];

// private functions

function ifCoords (data) {
  if (data.latitude && data.longitude) {
    return `<span class="bfs__coords">${data.latitude},${data.longitude}</span>`
  }
  return ''
}

function datesSection (data) {
  return definitionList('Date added', data['start-date'])
}

function definitionList (field, value) {
  return ['<dl>',
    `<dt>${field}</dt>`,
    `<dd>${value}</dd>`,
    '</dl>'].join('\n')
}

function hasEndDate (data) {
  if (data['end-date']) {
    return '<span class="bfs__end-banner">End date: ' + data['end-date'] + '</span>'
  }
  return ''
}

function isRange (data) {
  var str = data['minimum-net-dwellings'];
  if (data['minimum-net-dwellings'] != null) {
    if (parseInt(data['minimum-net-dwellings']) !== parseInt(data['maximum-net-dwellings']) || parseInt(data['maximum-net-dwellings']) === 0) {
      str = data['minimum-net-dwellings'] + '-' + data['maximum-net-dwellings'];
    }
    return str
  }
  return ''
}

function linkToOrg (data) {
  let orgName = data.organisation;
  if (Object.prototype.hasOwnProperty.call(organisationMapper, data.organisation)) {
    orgName = organisationMapper[data.organisation];
  }
  return '<dl>' +
  '<dt>Organisation</dt>' +
  `<dd><a class="govuk-link" href="https://digital-land.github.io/organisation/${utils.curie_to_url_part(data.organisation)}">${orgName}</a></dd>` +
  '</dl>'
}

function optionalFields (data) {
  let extras = '';
  potentiallyNullFields.forEach(function (field) {
    if (data[field]) {
      extras += definitionList(field, data[field]);
    }
  });
  return extras
}

function processSiteData (row) {
  const templateFuncs = {
    ifCoords: ifCoords,
    isRange: isRange,
    hasEndDate: hasEndDate,
    datesSection: datesSection,
    orgLink: linkToOrg,
    resourceTrunc: utils.truncate(row.resource, 9),
    optionalFields: optionalFields
  };
  return Object.assign(row, templateFuncs)
}

function bindBrownfieldPopup (feature, layer) {
  var popupHTML = createPopup(feature.properties);
  layer
    .bindPopup(popupHTML, popupOptions)
    .on('popupopen', function (e) {
      console.log('Brownfield site selected', e.sourceTarget.feature);
    });
}

function plot (feature, latlng) {
  var style = (feature.properties['end-date']) ? historicalBrownfieldSiteStyle : brownfieldSiteStyle;
  var size = siteSize(feature.properties.hectares);
  style.radius = size.toFixed(2);
  return L.circle(latlng, style)
}

// public methods - available on object

function createPopup (row) {
  return L.Util.template(popupTemplate, processSiteData(row))
}

/**
 * Converts brownfield geojson data into points and popups on the map
 * @param  {Object} geojson Set of geojson features
 * @param  {Object} options Options overriding defaults
 *    {Func} .onEachFeature Function to execute on each feature layer created
 */
function brownfieldGeojsonToLayer (geojson, options) {
  return L.geoJSON(geojson, {
    pointToLayer: plot,
    onEachFeature: options.onEachFeature || bindBrownfieldPopup
  })
}

function loadBrownfieldSites (map, url, groupName, options) {
  const groupNameCC = utils.toCamelCase(groupName);
  // check to see if already loaded data
  if (!Object.prototype.hasOwnProperty.call(map.featureGroups, groupNameCC)) {
    console.log('fetch from url', url);
    fetch(url)
      .then(resp => resp.json())
      .then((data) => {
        var l = map.createFeatureGroup(groupNameCC);
        const geojsonLayer = brownfieldGeojsonToLayer(data, options);
        geojsonLayer.addTo(l);
        if (typeof options.layerGroup !== 'undefined') {
          l.addTo(options.layerGroup);
        }
        // run any callback
        if (options.cb && utils.isFunction(options.cb)) { options.cb(l, groupName); }
      })
      .catch(function (err) {
        console.log('error loading brownfield sites', err);
      });
  }
}

// this feels messy!
function registerMapper (mapper) {
  organisationMapper = mapper;
}

function siteSize (hectares) {
  if (isNaN(hectares)) {
    return 100 // give it a default size
  }
  return (Math.sqrt((hectares * 10000) / Math.PI))
}

const brownfieldSites = {
  calcSiteSize: siteSize,
  createPopup: createPopup,
  geojsonToLayer: brownfieldGeojsonToLayer,
  loadSites: loadBrownfieldSites,
  popupOptions: popupOptions,
  popupTemplate: popupTemplate,
  registerOrganisationMapper: registerMapper
};

/* global L */

const popupOptions$1 = {
  minWidth: '270',
  maxWidth: '270',
  className: 'bfs-popup'
};

const popupTemplate$1 =
  '<div class="bfs">' +
    '<div class="bfs__header">' +
      '<span class="govuk-caption-s">{dataType}</span>' +
      '<h3 class="govuk-heading-s bfs__addr">{identifier} - {name}</h3>' +
    '</div>' +
    '<div class="bfs__footer">' +
      '<a href="{slug}" class="govuk-link">View record</a>' +
    '</div>' +
  '</div>';

function processRecord (row, idField) {
  function getId (data) {
    return data[idField]
  }
  const templateFuncs = {
    dataType: () => idField,
    identifier: getId
  };
  return Object.assign(row, templateFuncs)
}

function createPopup$1 (row, idField) {
  return L.Util.template(popupTemplate$1, processRecord(row, idField))
}

/**
 * Creates an onEachFeature function with understanding of the identifier field
 * @param  {string} id the field name for the record identifier
 */
function initOnEachFeature (id) {
  const identifierField = id || 'slug';

  function onEachFeature (feature, layer) {
    var popupHTML = createPopup$1(feature.properties, identifierField);
    layer
      .bindPopup(popupHTML, popupOptions$1)
      .on('popupopen', function (e) {
        console.log('Polygon clicked', e.sourceTarget.feature);
      });
  }
  return onEachFeature
}

const basicPopup = {
  initOnEachFeature: initOnEachFeature
};

exports.Map = Map;
exports.brownfieldSites = brownfieldSites;
exports.basicPopup = basicPopup;

})));
