$(function () {
    /* Map stuff            
    *************************************************************************/
    var basemapLayer;
    var layerLabels;
    var basemapControls = $('#base-map-list li a');
    var popup = new L.Popup();

    // Setup the leaflet map
    var map = L.map('map');
    L.control.scale().addTo(map);

    // Register event to display the clicked lat/lng in a popup when the user clicks on the map
    map.on('click', function (e) {
        //map click event object (e) has latlng property which is a location at which the click occured.
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
    });

    // Load some plugins
    map.on("load", function () {
        // Get the plugins
        $.getJSON("Home/GetPluginDescriptions", function (data) {
            // Load each plugin
            $.each(data.plugins, function (i) {
                var plugin = data.plugins[i];
                // Css
                var cssLink = $("<link rel='stylesheet' type='text/css' href='" + (plugin.basePath + plugin.css) + "'>");
                $("head").append(cssLink);

                // Apply template
                $.get(plugin.basePath + plugin.template, function (html) {
                    $('#panel').append(html);
                });

                // Load script
                $.getScript(plugin.basePath + plugin.script);
            });
        });
    });

    // Set the map view
    map.setView([53.8266, -3.42461], 5);

    // Setup base map picker and load an initial base map
    //
    // A function to set the base map of the map object
    var setBasemap = function (basemap) {
        // Remove any current basemap layer and setup the new layer, then add to map
        if (basemapLayer) { map.removeLayer(basemapLayer); }
        basemapLayer = L.esri.basemapLayer(basemap);
        map.addLayer(basemapLayer);

        // Remove any current basemap layer labels and setup the new layer, then add to map
        if (layerLabels) { map.removeLayer(layerLabels); }
        if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
            layerLabels = L.esri.basemapLayer(basemap + 'Labels');
            map.addLayer(layerLabels);
        }
    }

    // Click handler for the base map controls
    basemapControls.on('click', function () {
        // Set the basemap
        setBasemap($(this).data('base-map'));

        // Add a highlight to the selected control
        basemapControls.each(function () { $(this).removeClass('highlighted'); });
        $(this).addClass('highlighted').blur();
    });

    // Setup the initial base map
    setBasemap($(basemapControls[0]).data('base-map'));
    $(basemapControls[0]).addClass('highlighted');

    /* Custom Leaflet control for mouse cursor position
    *************************************************************************/
    L.Control.CursorPosition = L.Control.extend({
        latValueEl: null,
        lngValueEl: null,

        options: {
            position: 'topright',
            decimalPoints: 5
        },

        updatePosition: function (latlng) {
            var decimalPowValue = Math.pow(10, this.options.decimalPoints);

            var latFloat = parseFloat((latlng.lat * decimalPowValue) / decimalPowValue);
            var lngFloat = parseFloat((latlng.lng * decimalPowValue) / decimalPowValue);

            this.latValueEl.innerHTML = latFloat.toFixed(this.options.decimalPoints).toString();
            this.lngValueEl.innerHTML = lngFloat.toFixed(this.options.decimalPoints).toString();
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'leaflet-control-cursor-position');

            // Create lat html
            var lat = L.DomUtil.create('div', 'leaflet-control-cursor-position-lat', container);
            L.DomUtil.create('span', 'leaflet-control-cursor-position-label', lat).innerHTML = "Latitude: ";
            this.latValueEl = L.DomUtil.create('span', 'leaflet-control-cursor-position-value leaflet-control-cursor-position-lat-value', lat);
            // Create lon html
            var lng = L.DomUtil.create('div', 'leaflet-control-cursor-position-lng', container);
            L.DomUtil.create('span', 'leaflet-control-cursor-position-label', lng).innerHTML = "Longitude: ";
            this.lngValueEl = L.DomUtil.create('span', 'leaflet-control-cursor-position-value leaflet-control-cursor-position-lng-value', lng);

            // Add listener to the map to update the lat lon
            var control = this;
            map.on('mousemove', function (e) {
                control.updatePosition(e.latlng);
            });

            // Set a default value for the control
            this.updatePosition(map.getCenter());

            return container;
        }
    });

    L.control.cursorPosition = function (options) {
        return new L.Control.CursorPosition(options);
    };

    L.control.cursorPosition().addTo(map);

    /* Panel animation methods
    *************************************************************************/
    // Note - the panel should be made into a pure javascript widget that builds its own dom so the dom can 
    // be protected from changes, that may stop this widget from working properly
    var $panel = $('#panel');
    var panelWidth = 250;
    var isPanelOpen = $panel.css('width') == panelWidth + 'px';
    var openPanel = function () {
        $panel.parent().animate({ paddingLeft: panelWidth }, function () {
            map.invalidateSize(true);
        });

        isPanelOpen = true;
    }
    var closePanel = function () {
        $panel.parent().animate({ paddingLeft: 0 }, function () {
            map.invalidateSize(true);
        });

        isPanelOpen = false;
    }
    var togglePanel = function () {
        if (isPanelOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }
    var updatePanelToggleButton = function ($button) {
        $button.blur()
            .find('span.glyphicon')
            .toggleClass('glyphicon-chevron-left')
            .toggleClass('glyphicon-chevron-right');
    }

    // Open/Close panel click handler
    $('#panel-toggle-btn').on('click', function (e) {
        togglePanel();
        updatePanelToggleButton($(this));
    });

    /* Panel content animation methods
    *************************************************************************/
    // A function the fade out the old panel content and fade in the new
    var switchContent = function ($currentPanel, contentIdToShow) {
        $currentPanel.fadeOut(function () {
            $('#' + contentIdToShow).fadeIn();
        });
    }

    // Change panel content click handler
    $('#panel-toolbar').find('.btn').on('click', function (e) {
        var $currentPanel = $('.panel-content:visible');
        switchContent($currentPanel, $(this).data('content-id'));
    });
});