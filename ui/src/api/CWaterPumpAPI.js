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

class CWaterPumpAPI {
  constructor({ client=null, URL }) {
    this._client = client || axios.create({ baseURL: preprocessApiHost(URL) });
  }

  async start(runTimeMs) {
    const response = await this._client.get('/pour_tea', {
      milliseconds: runTimeMs,
    });
    return response.data;
  }

  async stop() {
    const response = await this._client.get('/stop');
    return response.data;
  }

  async status() {
    const response = await this._client.get('/status');
    return response.data;
  }
}

export default CWaterPumpAPI;
export { CWaterPumpAPI };