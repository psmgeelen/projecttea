import axios from 'axios';

// helper function to preprocess the API host
function preprocessApiHost(apiHost) {
  let url = apiHost;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  if (!url.endsWith('/')) url += '/';
  return url;
}

function preprocessResponse(response) {
  if(null == response) return null;
  if('error' in response) {
    // TODO: handle errors in slice/SystemStatus.js
    throw new Error(response.error);
  }
  // normal response
  // convert "water threshold" to "waterThreshold"
  response.waterThreshold = response["water threshold"];
  delete response["water threshold"];

  // convert "time left" to "timeLeft"
  response.pump.timeLeft = response.pump["time left"];
  delete response.pump["time left"];

  // add field "updated"
  response.updated = Date.now();
  // difference between current time on client and time on device
  response.timeDelta = response.updated - response.time;
  // TODO: add field response.pump.estimatedEndTime
  return response;
}

// TODO: probably we need to know "ping" time to sync time more accurately
// Example:
//    00:00.000 - client sends request
//    00:00.100 - server receives request and set 'time' to 00:00.100, timeLeft = 1000ms
//    00:00.200 - server sends response
//    00:00.300 - client receives response, but 'time' is 00:00.100 and timeLeft = 1000ms
// total time: 300ms
// on average, time to one-way trip is 150ms
// so, we adjust time by 150ms i.e. time = 00:00.250, timeLeft = 850ms
// in this case, error is 50ms (150ms - actual 00:00.100), instead of 200ms (300ms - actual 00:00.100)
//////////////////////////////////////////////////////////////////////
class CWaterPumpAPI {
  constructor({ client=null, URL }) {
    this._client = client || axios.create({ baseURL: preprocessApiHost(URL) });
  }

  async start(runTimeMs) {
    const response = await this._client.get('/pour_tea', {
      milliseconds: runTimeMs,
    });
    return preprocessResponse(response.data);
  }

  async stop() {
    const response = await this._client.get('/stop');
    return preprocessResponse(response.data);
  }

  async status() {
    const response = await this._client.get('/status');
    return preprocessResponse(response.data);
  }
}

export default CWaterPumpAPI;
export { CWaterPumpAPI };