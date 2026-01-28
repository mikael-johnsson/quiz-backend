export const stringToBoolean = (isApproved: string) => {
  return isApproved.toLowerCase() === "true" ? true : false;
};
