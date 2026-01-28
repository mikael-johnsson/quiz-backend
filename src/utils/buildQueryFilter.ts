import { stringToBoolean } from "./stringToBoolean";

export const buildFilter = (
  isApproved: string | undefined = undefined,
  themes: string | string[] | undefined = undefined,
  difficulties: string | string[] | undefined = undefined,
) => {
  let filter: any = {};

  let isApprovedBool: boolean | undefined = undefined;
  if (isApproved) {
    isApprovedBool = stringToBoolean(isApproved);
  }

  if (themes !== null && themes !== undefined) {
    if (Array.isArray(themes)) {
      filter.themes = { $in: themes };
    } else {
      filter.themes = themes;
    }
  }

  if (difficulties !== null && difficulties !== undefined) {
    if (Array.isArray(difficulties)) {
      filter.difficulty = { $in: difficulties };
    } else {
      filter.difficulty = difficulties;
    }
  }

  if (isApprovedBool !== null && isApprovedBool !== undefined) {
    filter.isApproved = isApprovedBool;
  }
  console.log("this is filter: ", filter);
  return filter;
};
