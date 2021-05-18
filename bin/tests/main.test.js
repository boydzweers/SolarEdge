"use strict";
exports.__esModule = true;
var main_1 = require("../src/main");
var solarEdge = new main_1["default"]('KEY', 123456);
describe('test generateURL function', function () {
    it('should format the correct url', function () {
        expect(solarEdge.generateURL('/overview', {})).toBe('https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json');
        expect(solarEdge.generateURL('overview', {})).toBe('https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json');
        expect(solarEdge.generateURL('overview/', {})).toBe('https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json');
    });
});
describe('test serializeOptions function', function () {
    it('should serialize the given options to a query string', function () {
        expect(solarEdge.serializeOptions({
            startTime: '2021-05-01 00:00:00',
            endTime: '2021-05-10 23:59:59'
        })).toBe('&startTime=2021-05-01%2000%3A00%3A00&endTime=2021-05-10%2023%3A59%3A59');
        expect(solarEdge.serializeOptions({ startTime: '2021-05-01 00:00:00' })).toBe('&startTime=2021-05-01%2000%3A00%3A00');
        expect(solarEdge.serializeOptions({})).toBe('');
    });
});
