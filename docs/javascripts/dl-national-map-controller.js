/* global L, fetch, DLMaps, AbortController */

function NationalMapController (mapId, $layerControls, $zoomControls) {
  this.mapId = mapId
  this.$layerControls = $layerControls
  this.$zoomControls = $zoomControls
}

NationalMapController.prototype.init = function (params) {
  // use options provided
  this.setupOptions(params)

  // init controller - used to cancel in flight fetch chains
  this.controller = undefined

  // create the map
  this.map = this.createMap(this.mapId)

  // initialise the layer and zoom controls
  this.initControls()

  // kick it all off
  this.fetchAll()
}

NationalMapController.prototype.createMap = function (mapId) {
  // default location and zoom level if not set by URL params
  const mappos = L.Permalink.getMapLocation(this.defaultZoomLevel, [53.865, -5.101])

  const theMap = L.map(mapId, {
    center: mappos.center,
    zoom: mappos.zoom
  })
  L.Permalink.setup(theMap)
  this.addTileLayer(theMap)

  // listen for moveend events
  const boundMoveEndHandler = this.moveEndHandler.bind(this)
  theMap.on('moveend', boundMoveEndHandler)

  return theMap
}

NationalMapController.prototype.addTileLayer = function (map) {
  // add the OpenStreetMap tiles
  L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map)
}

NationalMapController.prototype.initControls = function () {
  console.log(this.$layerControls, this.$zoomControls)
  if (!this.$layerControls || !this.$zoomControls) {
    console.log('No control elements defined')
    return undefined
  }

  this.zoomComponent = new DLMaps.ZoomControls(this.$zoomControls, this.map, this.map.getZoom()).init({})
  const boundToggleDataLayer = this.toggleDataLayer.bind(this)
  this.layerControlsComponent = new DLMaps.LayerControls(this.$layerControls, this.map).init({
    toggleControlCallback: boundToggleDataLayer
  })
}

NationalMapController.prototype.moveEndHandler = function (e) {
  var bounds = e.target.getBounds()
  this.fetchAll(bounds)
  this.map._fetchSinceControlAction = true
}

NationalMapController.prototype.toggleDataLayer = function (map, datasetName, adding) {
  const layer = this.layerControlsComponent.layerMap[datasetName]
  if (adding) {
    console.log('Debug: ', layer, datasetName)
    map.addLayer(layer)

    /* Not sure this is efficient
        What to limit the number of fetch requests. If layer toggled off then on
        with no move of the map there is no need to fetch all the features again */

    if (map._fetchSinceControlAction) {
      // if something has changed since layer last shown then trigger fetch all
      // can further improve by fetching only reenable layer
      this.fetchAll()
      map._fetchSinceControlAction = false
    }
    if (layer.getLayers().length === 0) {
      // if contains no layers then maybe no fetch has been done before
      this.fetchAll()
    }
  } else {
    map.removeLayer(layer)
  }
}

NationalMapController.prototype.fetchAll = function (bounds = this.map.getBounds()) {
  if (this.controller) {
    console.log('controller.abort()')
    this.controller && this.controller.abort()
  }
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(this.layerControlsComponent.layerMap)) {
    value.clearLayers()
  }

  this.controller = new AbortController()
  this.layerControlsComponent.enabledLayers().forEach(layer => {
    const type_ = layer.dataset.layerControl
    const zoom = this.map.getZoom()
    const zoomConstraint = this.layerControlsComponent.getZoomRestriction(layer)

    // check for zoom constraint and only fetch if map is zoomed that far
    if (typeof zoomConstraint !== 'undefined') {
      console.log(type_, 'ZoomConstraint', this.layerControlsComponent.getZoomRestriction(layer))
      if (zoom < zoomConstraint) { return }
    }

    console.log('fetching', type_)
    this.fetchFeatures(
      this.fetchProgressCallback,
      this.buildDataUrl(bounds, zoom, type_),
      this.layerControlsComponent.layerMap[type_],
      this.controller.signal,
      type_
    ).then(function (geoJsonLayer) {
      console.log('fetch complete', type_)
    }).catch((e) => {
      console.log('caught error from fetch', type_, e)
    })
  })
}

// function to perform the fetch
NationalMapController.prototype.fetchFeatures = function (progress, url, geoJsonLayer, signal, type_) {
  const that = this
  return new Promise((resolve, reject) => fetch(url, { signal })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }

      response.json().then(data => {
        geoJsonLayer.addData(data)

        if (data.length >= that.pageSize) {
          // why progress then call the func?
          progress && progress(geoJsonLayer, type_)
          const lastItem = data[data.length - 1]
          // used to paginate the results
          const nextUrl = url
          nextUrl.searchParams.set('after', lastItem.id)
          // self call if more results still to get
          that.fetchFeatures(progress, nextUrl, geoJsonLayer, signal, type_).then(resolve).catch(reject)
        } else {
          resolve(geoJsonLayer)
        }
      }).catch(reject)
    }).catch(reject))
}

NationalMapController.prototype.buildDataUrl = function (bounds, zoomLevel, type = false, afterRowid = 0) {
  var query = 'bounded_geography_simplified_paged'
  // controls whether to get simplified boundaries or full res
  if (zoomLevel > 11) { query = 'bounded_geography_full_paged' }
  if (type) { query = `${query}_by_type` }
  if (type === 'brownfield-land') { query = 'bounded_geography_brownfield_land' }

  const url = new URL(`${this.baseUrl}/${query}.json?_json=geojson&_shape=arrayfirst&bbox_minx=${bounds._southWest.lng}&bbox_maxx=${bounds._northEast.lng}&bbox_miny=${bounds._southWest.lat}&bbox_maxy=${bounds._northEast.lat}&after=${afterRowid}`)

  if (type) url.searchParams.set('type', type)

  return url
}

NationalMapController.prototype.fetchProgressCallback = function (geoJsonLayer, datasetName) {
  console.debug(`${geoJsonLayer.getLayers().length} features fetched for ${datasetName}`)
}

NationalMapController.prototype.setupOptions = function (params) {
  params = params || {}
  this.defaultZoomLevel = params.defaultZoomLevel || 6
  this.baseUrl = params.baseUrl || 'https://datasette-demo.digital-land.info/view_model'
  this.pageSize = params.pageSize || 100
}
