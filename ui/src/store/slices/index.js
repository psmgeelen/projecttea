import { SystemStatusSlice } from "./SystemStatus";
import { UISlice } from "./UI";
import { NotificationsSlice } from "./Notifications";

const slices = [ SystemStatusSlice, UISlice, NotificationsSlice ];
// export all slices as an object { [sliceName]: slice }
export const ALL_APP_SLICES = slices.reduce((acc, slice) => {
  acc[slice.name] = slice;
  return acc;
}, {});