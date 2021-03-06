import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Solaredge from '../src/main';

const mockedAxios = new MockAdapter(axios);

const solarEdge = new Solaredge('KEY', 123456);

describe('test generateURL function', () => {
  it('should format the correct url', () => {
    expect(solarEdge.generateURL('overview', {}, 'site')).toBe(
      'https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json',
    );

    expect(solarEdge.generateURL('overview', {}, 'site')).toBe(
      'https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json',
    );

    expect(solarEdge.generateURL('overview/', {}, 'site')).toBe(
      'https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json',
    );
  });
});

describe('test serializeOptions function', () => {
  it('should serialize the given options to a query string', () => {
    expect(
      solarEdge.serializeOptions({
        startTime: '2021-05-01 00:00:00',
        endTime: '2021-05-10 23:59:59',
      }),
    ).toBe('&startTime=2021-05-01%2000%3A00%3A00&endTime=2021-05-10%2023%3A59%3A59');

    expect(solarEdge.serializeOptions({ startTime: '2021-05-01 00:00:00' })).toBe(
      '&startTime=2021-05-01%2000%3A00%3A00',
    );

    expect(solarEdge.serializeOptions({})).toBe('');
  });
});

describe('test getOverview function', () => {
  it('should return return metrics of the installation', async () => {
    const mockedResponse = {
      overview: {
        lastUpdateTime: '2021-01-01 00:00:00',
        lifeTimeData: {
          energy: 1,
          revenue: 1,
        },
        lastYearData: {
          energy: 1,
        },
        lastMonthData: {
          energy: 1,
        },
        lastDayData: {
          energy: 1,
        },
        currentPower: {
          power: 1,
        },
        measuredBy: 'INVERTER',
      },
    };

    mockedAxios
      .onGet('https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json')
      .reply(200, mockedResponse);

    const resp = await solarEdge.getOverview();
    expect(resp).toStrictEqual(mockedResponse);
  });
});

describe('test getEnergyDetails function', () => {
  it('should return detailed site energy measurements', async () => {
    const mockedResponse = {
      energyDetails: {
        timeUnit: 'DAY',
        unit: 'Wh',
        meters: [],
      },
    };

    mockedAxios
      .onGet(
        'https://monitoringapi.solaredge.com/site/123456/energyDetails?api_key=KEY&format=json&startTime=2021-05-01%2000%3A00%3A00&endTime=2021-01-01%2023%3A59%3A59',
      )
      .reply(200, mockedResponse);

    const resp = await solarEdge.getEnergyDetails('2021-05-01 00:00:00', '2021-01-01 23:59:59');
    expect(resp).toStrictEqual(mockedResponse);
  });
});

describe('test getInverterShortSN function', () => {
  it('should return the serialnumber of the inverter', async () => {
    const mockedResponse = {
      reporters: {
        count: 1,
        list: [
          {
            name: 'Inverter',
            manufacturer: 'SolarEdge',
            model: 'Model',
            serialNumber: 'SN123',
            kWpDC: null,
          },
        ],
      },
    };

    mockedAxios
      .onGet('https://monitoringapi.solaredge.com/equipment/123456/list?api_key=KEY&format=json')
      .reply(200, mockedResponse);

    const resp = await solarEdge.getInverterShortSN();
    expect(resp).toStrictEqual('SN123');
  });
});

describe('test getInverterTechData function', () => {
  it('should return detailt information about the inverter', async () => {
    const mockedResponse = {
      reporters: {
        count: 1,
        list: [
          {
            name: 'Inverter',
            manufacturer: 'SolarEdge',
            model: 'Model',
            serialNumber: 'SN123',
            kWpDC: null,
          },
        ],
      },
    };

    mockedAxios
      .onGet('https://monitoringapi.solaredge.com/equipment/123456/list?api_key=KEY&format=json')
      .reply(200, mockedResponse);

    mockedAxios
      .onGet(
        'https://monitoringapi.solaredge.com/equipment/123456/SN123/data?api_key=KEY&format=json&startTime=2021-01-01%2000%3A00%3A00&endTime=2021-01-01%2023%3A59%3A59',
      )
      .reply(200, {});

    const resp = await solarEdge.getInverterTechData('2021-01-01 00:00:00', '2021-01-01 23:59:59');
    expect(resp).toMatchObject({});
  });
});

describe('test logger function', () => {
  it('should be called', () => {
    expect.assertions(1);
    solarEdge.logger(true);
    expect(true).toBeTruthy();
  });
});
