import { SystemStatusSlice } from "./SystemStatus";

const slices = [ SystemStatusSlice ];
// export all slices as an object { [sliceName]: slice }
export const ALL_APP_SLICES = slices.reduce((acc, slice) => {
  acc[slice.name] = slice;
  return acc;
}, {});