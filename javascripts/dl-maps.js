(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('DLMaps', ['exports'], factory) :
	(factory((global.DLMaps = {})));
}(this, (function (exports) { 'use strict';

/* global L, fetch */

// govuk consistent colours
var colours = {
  lightBlue: '#1d70b8',
  darkBlue: '#003078',
  brown: '#594d00',
  yellow_brown: '#a0964e'
};

const organisationBoundaryStyle = {
  fillOpacity: 0.2,
  weight: 2,
  color: colours.darkBlue,
  fillColor: colours.lightBlue
};

function Map ($module) {
  this.$module = $module;
  this.$wrapper = $module.closest('.dl-map__wrapper');
}

Map.prototype.init = function (params) {
  this.setupOptions(params);
  this.tiles = this.setTiles();
  this.map = this.createMap();
  this.featureGroups = {};
  this.styles = {
    defaultBoundaryStyle: organisationBoundaryStyle
  };
  this.$loader = this.$wrapper.querySelector('.dl-map__loader');

  this.geojsonUrls = params.geojsonURLs || [];
  this.geojsonUrls = this.extractURLS();
  // if pointers to geojson provided add to the default featureGroup (a featureGroup has getBounds() func)
  if (this.geojsonUrls.length) {
    this.createFeatureGroup('initBoundaries').addTo(this.map);
    this.plotBoundaries(this.geojsonUrls);
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

Map.prototype.createMap = function () {
  var latLng = L.latLng(this.default_pos[0], this.default_pos[1]);
  return L.map(this.mapId, {
    center: latLng,
    zoom: this.default_zoom,
    layers: [this.tiles]
  })
};

Map.prototype.createFeatureGroup = function (name, options) {
  const _options = options || {};
  const fG = L.featureGroup([], _options);
  this.featureGroups[name] = fG;
  return fG
};

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

Map.prototype.plotBoundaries = function (urls) {
  const map = this.map;
  const defaultFG = this.featureGroups.initBoundaries;
  const defaultStyle = this.styles.defaultBoundaryStyle;
  var count = 0;
  urls.forEach(function (url) {
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let boundary = L.geoJSON(data, {
          style: defaultStyle
        }).addTo(defaultFG);
        count++;
        // only pan map once all boundaries have loaded
        if (count === urls.length) {
          map.fitBounds(defaultFG.getBounds());
        }
      });
  });
};

Map.prototype.setupOptions = function (params) {
  params = params || {};
  this.default_pos = params.default_pos || [52.561928, -1.464854];
  this.default_zoom = params.default_zoom || 5;
  this.mapId = params.mapId || 'aMap';
};

exports.Map = Map;

})));
