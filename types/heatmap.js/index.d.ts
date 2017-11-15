// Type definitions for heatmap.js 2.0
// Project: https://github.com/pa7/heatmap.js/
// Definitions by: Yang Guan <https://github.com/lookuptable>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

export as namespace h337;

/*
 * Create a heatmap instance. A Heatmap can be customized with the configObject.
 */
export function create<X extends string, Y extends string, V extends string>(
    configObject: HeatmapConfiguration<X, Y, V>
): Heatmap<X, Y, V>;

export function register(pluginKey: string, plugin: any): void;

/*
 * Heatmap instances are returned by h337.create. A heatmap instance has its own
 * internal datastore and renderer where you can manipulate data. As a result
 * the heatmap gets updated (either partially or completely, depending on
 * whether it's necessary).
 */
export class Heatmap<X extends string, Y extends string, V extends string> {
    /*
     * Use this functionality only for adding datapoints on the fly, not for data
     * initialization! heatmapInstance.addData adds a single or multiple
     * datapoints to the heatmap's datastore.
     */
    addData(dataPoint: DataPoint<X, Y, V> | ReadonlyArray<DataPoint<X, Y, V>>): void;

    /*
     * Initialize a heatmap instance with the given dataset. Removes all
     * previously existing points from the heatmap instance and re-initializes
     * the datastore.
     */
    setData(data: HeatmapData<X, Y, V>): Heatmap<X, Y, V>;

    /*
     * Changes the upper bound of your dataset and triggers a complete
     * rerendering.
     */
    setDataMax(number: number): Heatmap<X, Y, V>;

    /*
     * Changes the lower bound of your dataset and triggers a complete
     * rerendering.
     */
    setDataMin(number: number): Heatmap<X, Y, V>;

    /*
     * Reconfigures a heatmap instance after it has been initialized. Triggers a
     * complete rerendering.
     */
    configure(configObject: HeatmapConfiguration<X, Y, V>): Heatmap<X, Y, V>;

    /*
     * Returns value at datapoint position.
     *
     * The returned value is an interpolated value based on the gradient blending
     * if point is not in store.
     */
    getValueAt(point: Point<X, Y>): number;

    /*
     * Returns a persistable and reimportable (with setData) JSON object.
     */
    getData(): HeatmapData<X, Y, V>;

    /*
     * Returns dataURL string.
     *
     * The returned value is the base64 encoded dataURL of the heatmap instance.
     */
    getDataURL(): string;

    /*
     * Repaints the whole heatmap canvas.
     */
    repaint(): Heatmap<X, Y, V>;
}

export interface BaseHeatmapConfiguration<V extends string = 'value'> {
    /*
     * A background color string in form of hexcode, color name, or rgb(a)
     */
    backgroundColor?: string;

    /*
     * The blur factor that will be applied to all datapoints. The higher the
     * blur factor is, the smoother the gradients will be
     * Default value: 0.85
     */
    blur?: number;

    /*
     * An object that represents the gradient.
     * Syntax: {[key: number in range [0,1]]: color}
     */
    gradient?: { [key: string]: string };

    /*
     * The maximal opacity the highest value in the heatmap will have. (will be
     * overridden if opacity set)
     * Default value: 0.6
     */
    maxOpacity?: number;

    /*
     * The minimum opacity the lowest value in the heatmap will have (will be
     * overridden if opacity set)
     */
    minOpacity?: number;

    /*
     * A global opacity for the whole heatmap. This overrides maxOpacity and
     * minOpacity if set
     * Default value: 0.6
     */
    opacity?: number;

    /*
     * The radius each datapoint will have (if not specified on the datapoint
     * itself)
     */
    radius?: number;

    /**
     * Scales the radius based on map zoom.
     */
    scaleRadius?: boolean;

    /*
     * The property name of the value/weight in a datapoint
     * Default value: 'value'
     */
    valueField?: V;

    /**
     * Pass a callback to receive extrema change updates. Useful for DOM
     * legends.
     */
    onExtremaChange?: () => void;

    /*
     * Indicate whether the heatmap should use a global extrema or a local
     * extrema (the maximum and minimum of the currently displayed viewport)
     */
    useLocalExtrema?: boolean;
}

/*
 * Configuration object of a heatmap
 */
export interface HeatmapConfiguration<
    V extends string = 'value',
    X extends string = 'x',
    Y extends string = 'y',
> extends BaseHeatmapConfiguration<V> {
    /*
     * A DOM node where the heatmap canvas should be appended (heatmap will adapt to
     * the node's size)
     */
    container: HTMLElement;

    /*
     * The property name of your x coordinate in a datapoint
     * Default value: 'x'
     */
    xField?: X;

    /*
     * The property name of your y coordinate in a datapoint
     * Default value: 'y'
     */
    yField?: Y;
}

export interface HeatmapOverlayConfiguration<
    V extends string = 'value',
    TLat extends string = 'lat',
    TLong extends string = 'lng',
> extends BaseHeatmapConfiguration<V> {
    /*
     * The property name of your latitude coordinate in a datapoint
     * Default value: 'x'
     */
    latField?: TLat;

    /*
     * The property name of your longitude coordinate in a datapoint
     * Default value: 'y'
     */
    lngField?: TLong;
}

/*
 * A single data point on a heatmap. The interface of the data point can be
 * overridden by providing alternative values for `xKey` and `yKey` in the
 * config object.
 */
export type DataPoint<X extends string, Y extends string, V extends string> =
    Record<V, number> & Point<X, Y>;

/*
 * A position in the heatmap.
 */
export type Point<X extends string, Y extends string> =
    Record<X | Y, number>;

/*
 * An object representing the set of data points on a heatmap
 */
export interface HeatmapData<X extends string, Y extends string, V extends string> {
    /*
     * An array of data points
     */
    data: ReadonlyArray<DataPoint<X, Y, V>>;

    /*
     * Max value of the valueField
     */
    max?: number;

    /*
     * Min value of the valueField
     */
    min?: number;
}

import { Layer } from "leaflet";

declare global {
    /*
     * The overlay layer to be added onto leaflet map
     */
    class HeatmapOverlay<
        V extends string,
        TLat extends string,
        TLng extends string
    > extends Layer {
        /*
         * Initialization function
         */
        constructor(configuration: HeatmapOverlayConfiguration<V, TLat, TLng>);

        /*
         * Initialize a heatmap instance with the given dataset
         */
        setData(data: HeatmapData<V, TLat, TLng>): void;

        /*
         * Experimential... not ready.
         */
        addData(data: DataPoint<V, TLat, TLng> | ReadonlyArray<DataPoint<V, TLat, TLng>>): void;
    }
}
