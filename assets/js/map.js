
var home = {
	lat: 63.924,
	lng: 20.63,
	zoom: 11
}; 

var map = L.map('map', {
    // Set latitude and longitude of the map center (required)
    center: [63.924, 20.63],
    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
    zoom: 11
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

var miresWStyle = {
	weight:2,
    fillColor: "brown", //"#CCAA66",
    color: "black", //"#CCAA66",
    fillOpacity:0.05
}

var miresStyle = {
	weight:2,
	fillColor:"transparent",
	color: "transparent"
}

var miresPStyle = {		
	shape: "circle",
	radius: 6,
	fillColor: "brown",
	fillOpacity: 0.8,
	color: "white",
	weight: 1
}


var miresP15Style = {		
	shape: "triangle-down",
	radius: 6,
	fillColor: "black",
	fillOpacity: 0.8,
	color: "white",
	weight: 1
}




//Adding the layer of whole mires first, and then we can add on top the split ones with transparent style

var mires_15 = L.geoJSON(mires_15, {
	style : miresWStyle, 
	onEachFeature: function (feature, layer){
		layer.bindTooltip(feature.properties.Id_1, {
			permanent: true,
			opacity: 1,
			direction: "left"
		});
	}
}).addTo(map)


var miresW = L.geoJSON(miresW, {
	style : miresWStyle, 
	onEachFeature: function (feature, layer){
		layer.bindTooltip(feature.properties.Id_1.toString(), {
			permanent: true,
			opacity: 1,
			direction: "right"
		});
	}
}).addTo(map)



//Adding the geojson files
var mires = L.geoJSON(mires, {
	style : miresStyle,
	onEachFeature: function(feature, layer){

var label = `<p class='popup_tag'>Mire ID: ${feature.properties.NEW_Id}<p/>` + 
`<p class='popup_tag'>Mirea Area: ${(feature.properties.Mire_area / 10000).toFixed(2)} ha<p/>`+
`<p class='popup_tag'>Mire Elevation: ${feature.properties.Mire_eleva.toFixed(1)} m.a.s.l.<p/>`+
`<p class='popup_tag'>Distance to coast: ${(feature.properties.Distance_t / 1000).toFixed(1)} km<p/>`

var landscape_image = `<img class='photos' src = 'assets/images/Mires/${feature.properties.Split_ID}.JPG'/>`

var large_view = `<div class='popup_tag anch'><a href= 'https://slughg.github.io/MiresChrono/assets/images/Mires/${feature.properties.Split_ID}.JPG' target='_blank'>Large view in a separate window</a></div>`

var date_text = `<p class='popup_tag'>Image taken on the ${feature.properties.Photo_date}<p/>`

layer.bindPopup(label+landscape_image+large_view+date_text,
{maxWidth: "auto"}
)
}
}).addTo(map)


var miresP = L.geoJSON(miresP, {
	pointToLayer: function(feature, latlng){
		return L.shapeMarker(latlng, miresPStyle)
	},
	onEachFeature:function(feature, layer){

		var label = `<p class='popup_tag'>Peat depth: ${feature.properties.Peat_depth} cm<p/>` + 
		`<p class='popup_tag'>Conductivity: ${feature.properties.Conductivi} µS/cm<p/>`+
		`<p class='popup_tag'>pH: ${feature.properties.pH}<p/>`+
		`<p class='popup_tag'>LOI: ${feature.properties.LOI____.toFixed(0)} % <p/>`+
		`<p class='popup_tag'>Elevation: ${feature.properties.Elevation.toFixed(1)} m.a.s.l.<p/>`

		var point_image = `<img class='photos' src = 'assets/images/Mire_points/${feature.properties.Name}.JPG'/>`

		var large_view = `<div class='popup_tag anch'><a href= 'https://slughg.github.io/MiresChrono/assets/images/Mire_points/${feature.properties.Name}.JPG' target='_blank'>Large view in a separate window</a></div>`

		var date_text = `<p class='popup_tag'>Image taken on the ${feature.properties.Date}<p/>`

		layer.bindPopup(label+point_image+large_view+date_text,
			{maxWidth: "auto"}
			)
	}
}).addTo(map)


var mires_15_P = L.geoJSON(mires_15_P, {
	pointToLayer: function(feature, latlng){
		return L.shapeMarker(latlng, miresP15Style)
	},

	onEachFeature: function(feature, layer){
		var label = `<p class='popup_tag'>Mire ID: ${feature.properties.IDs}</p>` +
		`<p class='popup_tag'>Peat age: ${feature.properties.Age.toFixed(0)} years</p>` +
		`<p class='popup_tag'>Peat depth: ${feature.properties.Depth.toFixed(0)} cm</p>` 

		var point_image = `<img class='photos' src = 'assets/images/Mire_points/${feature.properties.IDs}.jpg'/>`
		
		var large_view = `<div class='popup_tag anch'><a href= 'https://slughg.github.io/MiresChrono/assets/images/Mire_points/${feature.properties.IDs}.jpg' target='_blank'>Large view in a separate window</a></div>`
		var date_text = `<p class='popup_tag'>Image taken on the ${feature.properties.Date}<p/>`

		layer.bindPopup(label+point_image+"<br/>"+"<br/>"+large_view+date_text, {maxWidth: "auto"})

	}
}).addTo(map)


L.control.scale().addTo(map);

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

var miresCheck = document.getElementById("miresCheck")


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
	if($(this).is(':checked')){
		miresW.addTo(map)
		mires_15.addTo(map)
		mires.addTo(map)
		miresP.bringToFront()
		mires_15_P.bringToFront()
	}
	else{
		map.removeLayer(mires)
		map.removeLayer(mires_15)
		map.removeLayer(miresW)
	}
}


miresPCheck.onclick = function(){
	if($(this).is(':checked')) {
		miresP.addTo(map)
		mires_15_P.addTo(map)
	}
	else {
		map.removeLayer(miresP)
		map.removeLayer(mires_15_P)
	}
}


L.easyButton('<i class="fa fa-home fa-lg" title="Zoom to home"></i>',function(btn,map){
	map.setView([home.lat, home.lng], home.zoom);
  	//Responsive map...
  	$(window).on("resize", function () { $("#map").height($(window).height()-50); map.invalidateSize(); }).trigger("resize");
  },'Zoom To Home').addTo(map);

//Mouse move coordinates

map.on('mousemove', function(e){
    $("#coordinates").html(`Lat:${e.latlng.lat.toFixed(3)}, Long:${e.latlng.lng.toFixed(3)}`)
})

//adding a seach function

var controlSearch = new L.Control.Search({
	layer:  L.featureGroup([miresW, mires_15]),
	propertyName: 'Id_1',
	position:'topleft',
	autoCollapse: true,
	textPlaceholder: 'Search Mire ID',
	hideMarkerOnCollapse: true,

	moveToLocation: function(latlng, catalogNumber, map) {map.setView(latlng, 14);console.log(latlng)}
});


controlSearch.on("search:locationfound", function (e) {
	if (e.layer._popup) e.layer.openPopup();
});

map.addControl(controlSearch);


