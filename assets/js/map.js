	// Initialize the map and assign it to a variable for later use
	// there's a few ways to declare a VARIABLE in javascript.
	// you might also see people declaring variables using `const` and `let`
	var map = L.map('map', {
	    // Set latitude and longitude of the map center (required)
	    center: [63.924, 20.63],
	    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
	    zoom: 12
	});
	 

	// Creating tile layers and adding one to the map it to the map
	var osm = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	  minZoom: 5}).addTo(map);

	var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		minZoom: 5,
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});

	var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    minZoom: 5,
    subdomains:['mt0','mt1','mt2','mt3']
    });

    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});


	//Creating styles for the geojson files

	var miresStyle = {
	    weight:2,
	    fillColor:"blue",
	    color: "blue",
	    fillOpacity:0.05
	}


	//Adding the geojson files
	var mires = L.geoJSON(mires, {
		style : miresStyle,
		onEachFeature:function(feature, layer){

        area = turf.area(feature)/10000
        center = turf.center(feature)

        center_long = center.geometry.coordinates[0]
        center_lat = center.geometry.coordinates[1]

        var label = `Mire ID: ${feature.properties.TARGET_FID}<br>` + 
        `pH: ${feature.properties.pH}<br>`+
        `Area: ${area.toFixed(2)} ha <br>`+
        `Center: Long ${center_long.toFixed(2)}, Lat ${center_lat.toFixed(2)}`

        var landscape_image = `<img class='photos' src = '/assets/images/${feature.properties.TARGET_FID}/landscape.JPG'/>`

        var date_text = `Image taken on the ${feature.properties.Photo_date}`

        //console.log(date_text)
        layer.bindPopup(label+"<br/>"+landscape_image+"<br/>"+date_text,
       //layer.bindPopup(label+"<br/>"+"<img class='photos' src = 'assets/images/115/Landscape.JPG'/>",
        	{maxWidth: "auto"}
        	)
    }
	}).addTo(map)

 	L.control.scale().addTo(map);
/*	var searchControl = new L.control.search({
	    layer: mires,
	    initial: true,
	    propertyName: 'TARGET_FID' // Specify which property is searched into.
  	}).addTo(map);*/

/*	map.on('popupopen', function (e) {
	    map.setView(e.target._popup._latlng, e.target._zoom);
	});
*/
/*	map.on('popupopen', function(e) {
	    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
	    px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
	    map.panTo(map.unproject(px),{animate: true}); // pan to new center
	});*/

map.on('popupopen', function(e) {
    // find the pixel location on the map where the popup anchor is
    var px = map.project(e.popup._latlng);
   // find the height of the popup container, divide by 2 to centre, subtract from the Y axis of marker location
    px.y -= e.popup._container.clientHeight/2;
    // pan to new center
    map.panTo(map.unproject(px),{animate: true});
});

	//programming the actions of the checkboxes
	var osmRadio = document.getElementById("osmRadio")
	var openTopoMapRadio = document.getElementById("openTopoMapRadio")
	var googleTerrainRadio = document.getElementById("googleTerrainRadio")

	var catchmentsCheck = document.getElementById("miresCheck")


	var baseLayers = {
		"osm": osm,
		"Open Topo Map": openTopoMap,
		"Google terrain": googleTerrain,
		"Google satellite": googleSat
	}

//defining the function radioClick which is used for onclick event in the html file
	function radioClick(myRadio) {
		var selectedRadio = myRadio.id;
		if(selectedRadio=="osmRadio") baseLayers["osm"].addTo(map)
			else map.removeLayer(baseLayers["osm"])
		if(selectedRadio=="openTopoMapRadio") baseLayers["Open Topo Map"].addTo(map)
			else map.removeLayer(baseLayers["Open Topo Map"])
		if(selectedRadio=="googleTerrainRadio") baseLayers["Google terrain"].addTo(map)
			else map.removeLayer(baseLayers["Google terrain"])
		if(selectedRadio=="googleSatRadio") baseLayers["Google satellite"].addTo(map)
			else map.removeLayer(baseLayers["Google satellite"])
	}



	miresCheck.onclick = function(){
		if($(this).is(':checked'))	mires.addTo(map)
		else map.removeLayer(mires)
	}


//add print control to the map
L.control.browserPrint({position: 'topleft'}).addTo(map);

//Mouse move coordinates

map.on('mousemove', function(e){
    //console.log(e)
    $("#coordinates").html(`Lat:${e.latlng.lat.toFixed(3)}, Long:${e.latlng.lng.toFixed(3)}`)
})

