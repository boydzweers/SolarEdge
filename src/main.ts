import axios from 'axios';

export type TimeUnit = 'DAY' | 'QUARTER_OF_AN_HOUR' | 'HOUR' | 'WEEK' | 'MONTH' | 'YEAR';
export type Meters = 'PRODUCTION' | 'CONSUMPTION' | 'SELFCONSUMPTION' | 'FEEDIN' | 'PURCHASED';
export type SystemUnits = 'Metrics' | 'Imperial';

export interface Options {
  startTime?: string;
  endTime?: string;
  timeUnit?: TimeUnit;
  meters?: Meters;
  serials?: string;
  systemUnits?: SystemUnits;
}

export default class SolarEdge {
  private API_KEY = '';

  private SITE_ID = 0;

  public HOST = 'https://monitoringapi.solaredge.com/';

  public BASE_PATH = 'site';

  public logging = false;

  constructor(API_KEY: string, SITE_ID: number) {
    this.API_KEY = API_KEY;
    this.SITE_ID = SITE_ID;
  }

  /**
   * Enable logging for development
   * @param  {boolean} bool
   * @returns void
   */
  public logger(bool: boolean): void {
    this.logging = bool;
  }

  /**
   * Serialize the given options to a query string
   * @param  {Options} options
   */
  public serializeOptions = (options: Options): string => {
    if (Object.keys(options).length === 0) return '';

    const queryString = Object.keys(options)
      .map((key) => `${key}=${encodeURIComponent(options[key])}`)
      .join('&');

    return `&${queryString}`;
  };

  /**
   * Format the request URL
   * @param  {string} pathIn
   * @param  {Options} options
   */
  public generateURL = (pathIn: string, options: Options): string => {
    let path: string = pathIn;
    if (pathIn.charAt(0) === '/') path = pathIn.substring(1);
    if (pathIn.slice(-1) === '/') path = pathIn.slice(0, -1);
    const opts = this.serializeOptions(options);
    const url = `${this.HOST}${this.BASE_PATH}/${this.SITE_ID}/${path}?api_key=${this.API_KEY}&format=json${opts}`;
    return url;
  };

  /**
   * Fetch the SolarEdge Monitoring API
   * @param  {String} path
   * @param  {Object} options
   */
  public solarEdgeGetRequest = async (path: string, options: Options = {}) => {
    try {
      const url = this.generateURL(path, options);
      if (this.logging) {
        // eslint-disable-next-line no-console
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
   * getSolarEdgeOverview
   * Site current power, energy production (today, this month, lifetime) and lifetime revenue
   */
  public getSolarEdgeOverview = async () => this.solarEdgeGetRequest('overview');

  /**
   * Detailed site energy measurements including meters such as consumption, export (feed-in),
   * import (purchase), etc.
   * @param  {String} startTime yyyy-MM-DD hh:mm:ss
   * @param  {String} endTime yyyy-MM-DD hh:mm:ss
   */
  public getSolarEdgeEnergyDetails = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return {};
    return this.solarEdgeGetRequest('energyDetails', { startTime, endTime });
  };

  /**
   * Description: Retrieves the current power flow between all elements of the site
   * including PV array, storage (battery), loads
   * (consumption) and grid.
   *
   * Note: Applies when export , import and consumption can be measured.
   * @param  {string} startTime
   * @param  {string} endTime
   */
  public getSolarEdgeCurrentPowerFlow = () => this.solarEdgeGetRequest('currentPowerFlow');

  /**
   * Get detailed storage information from batteries: the state of energy,
   * power and lifetime energy.
   *
   * Note: Applicable to systems with batteries
   * @param  {string} startTime
   * @param  {string} endTime
   * @param  {string} serials
   */
  public getSolarEdgeStorageData = (startTime: string, endTime: string, serials: string) => {
    if (!startTime || !endTime) return {};
    return this.solarEdgeGetRequest('currentPowerFlow', { startTime, endTime, serials });
  };

  /**
   * Returns all environmental benefits based on site energy production: CO2 emissions saved,
   * equivalent trees planted,
   * and light bulbs powered for a day.
   * @param  {SystemUnits} systemUnits
   */
  public getSolarEdgeEnvironmentalBenefits = (systemUnits: SystemUnits) => {
    this.solarEdgeGetRequest('envBenefits', { systemUnits });
  };

  /**
   * Return the inventory of SolarEdge equipment in the site, including inverters/SMIs,
   * batteries, meters, gateways and
   * sensors.
   */
  public getSolarEdgeInventory = () => this.solarEdgeGetRequest('inventory');
}
