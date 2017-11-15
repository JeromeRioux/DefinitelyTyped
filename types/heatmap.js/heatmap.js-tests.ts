// tslint:disable-next-line no-object-literal-type-assertion
const container = {} as HTMLElement;

// HeatmapConfiguration
{
    const config: h337.HeatmapConfiguration = { container };
    config; // $ExpectType HeatmapConfiguration<"value", "x", "y">
}

{
    // $ExpectError
    const config: h337.HeatmapConfiguration = {};
}

{
    const config: h337.HeatmapConfiguration = {
        container,
        xField: 'x',
        yField: 'y',
        valueField: 'value',
    };
}

{
    const config: h337.HeatmapConfiguration = {
        container,
        labelField: 'foo', // $ExpectError
    };
}

// h337.create
{
    // $ExpectType Heatmap<"value", "x", "y">
    h337.create({ container });

    // $ExpectType Heatmap<"count", "xPos", "yPos">
    h337.create<"count", "xPos", "yPos">({ container });
}

{
    const baseLayer = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // tslint:disable-next-line max-line-length
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18
        }
    );

    const testData: h337.HeatmapData<'count', 'lat', 'lng'> = {
        max: 8,
        data: [
            {
                lat: 24.6408,
                lng: 46.7728,
                count: 3
            }, {
                lat: 50.75,
                lng: -1.55,
                count: 1
            }
        ]
    };

    const config: h337.HeatmapOverlayConfiguration<'count'> = {
        radius: 2,
        maxOpacity: .8,
        scaleRadius: true,
        useLocalExtrema: true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
    };

    const heatmapLayer = new HeatmapOverlay(config);

    const map = new L.Map('map-canvas', {
        center: new L.LatLng(25.6586, -80.3568),
        zoom: 4,
        layers: [baseLayer, heatmapLayer]
    });

    heatmapLayer.setData(testData);
}
