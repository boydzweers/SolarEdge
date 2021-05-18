import Solaredge from '../src/main';

const solarEdge = new Solaredge('KEY', 123456);

describe('test generateURL function', () => {
  it('should format the correct url', () => {
    expect(solarEdge.generateURL('overview', {})).toBe(
      'https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json',
    );

    expect(solarEdge.generateURL('overview', {})).toBe(
      'https://monitoringapi.solaredge.com/site/123456/overview?api_key=KEY&format=json',
    );

    expect(solarEdge.generateURL('overview/', {})).toBe(
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
