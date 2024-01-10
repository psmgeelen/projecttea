import axios from 'axios';
import { CWaterPumpAPIImpl } from './CWaterPumpAPIImpl.js';

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
  constructor({ URL }) {
    this._impl = new CWaterPumpAPIImpl({
      client: axios.create({ baseURL: preprocessApiHost(URL) }),
    });
  }

  async start(runTimeMs) { return await this._impl.start(runTimeMs); }
  async stop() { return await this._impl.stop(); }
  async status() { return await this._impl.status(); }
}

export default CWaterPumpAPI;
export { CWaterPumpAPI };