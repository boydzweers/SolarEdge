import axios, { AxiosRequestConfig } from 'axios';

export type Period = 'DAY' | 'QUARTER_OF_AN_HOUR' | 'MONTH' | 'HOUR' | 'WEEK' | 'MONTH' | 'YEAR';
export interface Options {
	startTime?: string;
	endTime?: string;
}

export default class SolarEdge {
	public HOST = 'https://monitoringapi.solaredge.com/';
	public BASE_PATH = 'site/';

	public logging = false;
	constructor(private API_KEY: string, private SITE_ID: number) {}

	/**
	 * @param  {boolean} bool
	 * @returns void
	 */
	public logger(bool: boolean): void {
		this.logging = bool;
	}

	public serializeOptions = (options: Options) => {
		if (Object.keys(options).length === 0) return '';
		var str = [];
		for (var p in options)
			if (options.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + '=' + encodeURIComponent(options[p]));
			}
		return `&${str.join('&')}`;
	};

	public generateURL = (path: string, options: Options) => {
		if (path.charAt(0) === '/') path = path.substring(1);
		if (path.slice(-1) === '/') path = path.slice(0, -1);
		const opts = this.serializeOptions(options);
		const url = `${this.HOST}${this.BASE_PATH}/${this.SITE_ID}/${path}?api_key=${this.API_KEY}&format=json${opts}`;
		return url;
	};

	/**
	 * @param  {String} path
	 * @param  {Object} options
	 */
	public _solarEdgeGetRequest = async (path: string, options: Options) => {
		try {
			const url = this.generateURL(path, options);
			if (this.logging) {
				console.table({ path, options, url });
			}

			const resp = await axios.get(url);
			if (resp.status !== 200) {
				throw new Error(
					`Error on getting data from SolarEdgeAPI. URL: ${url} - STATUS: ${resp.status} - STATUS_TEXT: ${resp.statusText}`,
				);
			}
			return resp.data;
		} catch (error) {
			throw new Error(`Error on getting data from SolarEdgeAPI. ERROR: ${error}`);
		}
	};

	/**
	 * Site current power, energy production (today, this month, lifetime) and lifetime revenue
	 */
	public getSolarEdgeOverview = async () => {
		return this._solarEdgeGetRequest('overview', {});
	};

	/**
	 * Detailed site energy measurements including meters such as consumption, export (feed-in),
	 * import (purchase), etc.
	 * @param  {String} startTime yyyy-MM-DD hh:mm:ss
	 * @param  {String} endTime yyyy-MM-DD hh:mm:ss
	 */
	public getSolarEdgeEnergyDetails = (startTime: string, endTime: string) => {
		if (!startTime || !endTime) return;
		return this._solarEdgeGetRequest(`energyDetails`, { startTime, endTime });
	};
}

// ('use strict');

// import axios from 'axios';

// const serializeOptions = (options: object) => {
// 	var str = [];
// 	for (var p in options)
// 		if (options.hasOwnProperty(p)) {
// 			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(options[p]));
// 		}
// 	return `&${str.join('&')}`;
// };

// /**
//  * Site current power, energy production (today, this month, lifetime) and lifetime revenue
//  */
// const getOverview = async () => {
// 	return _solerGetRequest('overview', {});
// };

// /**
//  * Detailed site energy measurements including meters such as consumption, export (feed-in),
//  * import (purchase), etc.
//  * @param  {String} startTime yyyy-MM-DD hh:mm:ss
//  * @param  {String} endTime yyyy-MM-DD hh:mm:ss
//  */
// const getEnergyDetails = (startTime: string, endTime: string) => {
// 	if (!startTime || !endTime) return;
// 	return _solerGetRequest(`energyDetails`, { startTime, endTime });
// };

// const run = async function () {
// 	const details = await getEnergyDetails('2021-05-01 00:00:00', '2021-05-05 23:59:59');
// 	console.log(details);
// 	return details;
// };

// run();
