"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var SolarEdge = /** @class */ (function () {
    function SolarEdge(API_KEY, SITE_ID) {
        var _this = this;
        this.API_KEY = '';
        this.SITE_ID = 0;
        this.HOST = 'https://monitoringapi.solaredge.com/';
        this.BASE_PATH = 'site/';
        this.logging = false;
        /**
         * Serialize the given options to a query string
         * @param  {Options} options
         */
        this.serializeOptions = function (options) {
            if (Object.keys(options).length === 0)
                return '';
            var queryString = Object.keys(options)
                .map(function (key) { return key + "=" + encodeURIComponent(options[key]); })
                .join('&');
            return "&" + queryString;
        };
        /**
         * Format the request URL
         * @param  {string} pathIn
         * @param  {Options} options
         */
        this.generateURL = function (pathIn, options) {
            var path = '';
            if (pathIn.charAt(0) === '/')
                path = pathIn.substring(1);
            if (pathIn.slice(-1) === '/')
                path = pathIn.slice(0, -1);
            var opts = _this.serializeOptions(options);
            console.log(opts);
            var url = "" + _this.HOST + _this.BASE_PATH + "/" + _this.SITE_ID + "/" + path + "?api_key=" + _this.API_KEY + "&format=json" + opts;
            return url;
        };
        /**
         * Fetch the SolarEdge Monitoring API
         * @param  {String} path
         * @param  {Object} options
         */
        this.solarEdgeGetRequest = function (path, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var url, resp, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            url = this.generateURL(path, options);
                            if (this.logging) {
                                // eslint-disable-next-line no-console
                                console.table({ path: path, options: options, url: url });
                            }
                            return [4 /*yield*/, axios_1["default"].get(url)];
                        case 1:
                            resp = _a.sent();
                            if (resp.status !== 200) {
                                throw new Error("Error on getting data from SolarEdgeAPI. URL: " + url + " - STATUS: " + resp.status + " - STATUS_TEXT: " + resp.statusText);
                            }
                            return [2 /*return*/, resp.data];
                        case 2:
                            error_1 = _a.sent();
                            throw new Error("Error on getting data from SolarEdgeAPI. ERROR: " + error_1);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * getSolarEdgeOverview
         * Site current power, energy production (today, this month, lifetime) and lifetime revenue
         */
        this.getSolarEdgeOverview = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.solarEdgeGetRequest('overview')];
        }); }); };
        /**
         * Detailed site energy measurements including meters such as consumption, export (feed-in),
         * import (purchase), etc.
         * @param  {String} startTime yyyy-MM-DD hh:mm:ss
         * @param  {String} endTime yyyy-MM-DD hh:mm:ss
         */
        this.getSolarEdgeEnergyDetails = function (startTime, endTime) {
            if (!startTime || !endTime)
                return {};
            return _this.solarEdgeGetRequest('energyDetails', { startTime: startTime, endTime: endTime });
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
        this.getSolarEdgeCurrentPowerFlow = function () { return _this.solarEdgeGetRequest('currentPowerFlow'); };
        /**
         * Get detailed storage information from batteries: the state of energy,
         * power and lifetime energy.
         *
         * Note: Applicable to systems with batteries
         * @param  {string} startTime
         * @param  {string} endTime
         * @param  {string} serials
         */
        this.getSolarEdgeStorageData = function (startTime, endTime, serials) {
            if (!startTime || !endTime)
                return {};
            return _this.solarEdgeGetRequest('currentPowerFlow', { startTime: startTime, endTime: endTime, serials: serials });
        };
        /**
         * Returns all environmental benefits based on site energy production: CO2 emissions saved,
         * equivalent trees planted,
         * and light bulbs powered for a day.
         * @param  {SystemUnits} systemUnits
         */
        this.getSolarEdgeEnvironmentalBenefits = function (systemUnits) {
            _this.solarEdgeGetRequest('envBenefits', { systemUnits: systemUnits });
        };
        /**
         * Return the inventory of SolarEdge equipment in the site, including inverters/SMIs,
         * batteries, meters, gateways and
         * sensors.
         */
        this.getSolarEdgeInventory = function () { return _this.solarEdgeGetRequest('inventory'); };
        this.API_KEY = API_KEY;
        this.SITE_ID = SITE_ID;
    }
    /**
     * Enable logging for development
     * @param  {boolean} bool
     * @returns void
     */
    SolarEdge.prototype.logger = function (bool) {
        this.logging = bool;
    };
    return SolarEdge;
}());
exports["default"] = SolarEdge;
