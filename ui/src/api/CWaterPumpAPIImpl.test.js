import { CWaterPumpAPIImpl } from './CWaterPumpAPIImpl.js';

describe('CWaterPumpAPIImpl', () => {
  const DUMMY_STATUS = {
    pump: {
      "running": true,
      "time left": 1000,
      "water threshold": 100,
    },
    time: 1000,
  };
  // common test cases
  async function shouldThrowErrorFromResponse(apiCall) {
    const mockClient = { get: jest.fn() };
    const errorMessage = 'Error ' + Math.random();
    mockClient.get.mockResolvedValue({ data: { error: errorMessage } });

    const api = new CWaterPumpAPIImpl({ client: mockClient });
    await expect(apiCall(api)).rejects.toThrow(errorMessage);
  }

  async function shouldBeCalledWith(apiCall, url, params) {
    const mockClient = { get: jest.fn() };
    mockClient.get.mockResolvedValue({ data: DUMMY_STATUS });

    const api = new CWaterPumpAPIImpl({ client: mockClient });
    await apiCall(api);

    expect(mockClient.get).toHaveBeenCalledWith(url, { params });
  }

  async function shouldRethrowError(apiCall) {
    const mockClient = { get: jest.fn() };
    mockClient.get.mockRejectedValue(new Error('Network Error'));

    const api = new CWaterPumpAPIImpl({ client: mockClient });
    await expect(apiCall(api)).rejects.toThrow('Network Error');
  }

  async function shouldPreprocessResponse(apiCall) {
    const mockClient = { get: jest.fn() };
    mockClient.get.mockResolvedValue({ data: DUMMY_STATUS });

    const api = new CWaterPumpAPIImpl({ client: mockClient });
    const response = await apiCall(api);

    expect(response.waterThreshold).toBe(DUMMY_STATUS["water threshold"]);
    expect(response.pump.timeLeft).toBe(DUMMY_STATUS.pump["time left"]);
    expect(response).toHaveProperty('updated');
  }
  // end of common test cases
  // tests per method
  describe('start', () => {
    it('common test cases', async () => {
      const T = Math.random() * 1000;
      const callback = async (api) => await api.start(T);
      await shouldThrowErrorFromResponse(callback);
      await shouldRethrowError(callback);
      await shouldPreprocessResponse(callback);
      await shouldBeCalledWith(callback, '/pour_tea', { milliseconds: T });
    });
  });

  describe('stop', () => {
    it('common test cases', async () => {
      const callback = async (api) => await api.stop();
      await shouldThrowErrorFromResponse(callback);
      await shouldRethrowError(callback);
      await shouldPreprocessResponse(callback);
      await shouldBeCalledWith(callback, '/stop', {});
    });
  });

  describe('status', () => {
    it('common test cases', async () => {
      const callback = async (api) => await api.status();
      await shouldThrowErrorFromResponse(callback);
      await shouldRethrowError(callback);
      await shouldPreprocessResponse(callback);
      await shouldBeCalledWith(callback, '/status', {});
    });
  });
  // tests for helper function preprocessResponse
  describe('preprocessResponse', () => {
    it('should return null if response is null', () => {
      const api = new CWaterPumpAPIImpl({ client: {} });
      expect(api.preprocessResponse({ response: null, requestTime: 0 })).toBeNull();
    });

    it('should throw error if response has error', () => {
      const api = new CWaterPumpAPIImpl({ client: {} });
      const errorMessage = 'Error ' + Math.random();
      expect(() => api.preprocessResponse({
        response: { error: errorMessage },
        requestTime: 0,
      })).toThrow(errorMessage);
    });

    it('should preprocess response', () => {
      const api = new CWaterPumpAPIImpl({ client: {} });
      const response = api.preprocessResponse({ response: DUMMY_STATUS, requestTime: 0 });
      expect(response.waterThreshold).toBe(DUMMY_STATUS["water threshold"]);
      expect(response.pump.timeLeft).toBe(DUMMY_STATUS.pump["time left"]);
    });

    it('should add field "updated" with current time', () => {
      const T = Math.random() * 1000;
      const api = new CWaterPumpAPIImpl({ client: {}, currentTime: () => T });
      const response = api.preprocessResponse({ response: DUMMY_STATUS, requestTime: 0 });
      expect(response.updated).toBe(T);
    });

    ///////////
    // Scenario:
    //    00:00.000 - client sends request
    //    00:00.100 - server receives request and set 'time' to 00:00.100, timeLeft = 1234ms
    //    00:00.200 - server sends response
    //    00:00.300 - client receives response, but 'time' is 00:00.100 and timeLeft = 1234ms
    // total time: 300ms
    // on average, time to one-way trip is 150ms
    // so, we adjust time by 150ms i.e. time = 00:00.250, timeLeft = 1084ms
    // estimatedEndTime = 00:00.300 + 1084ms = 00:01.384
    it('should adjust time', () => {
      const responseObj = JSON.parse(JSON.stringify(DUMMY_STATUS));
      responseObj.time = 100;
      responseObj.pump["time left"] = 1234;

      const api = new CWaterPumpAPIImpl({ client: {}, currentTime: () => 300 });
      const response = api.preprocessResponse({ response: responseObj, requestTime: 300 });
      expect(response.time).toBe(250);
      expect(response.pump.timeLeft).toBe(1084);
      expect(response.pump.estimatedEndTime).toBe(1384);
    });
  });
});