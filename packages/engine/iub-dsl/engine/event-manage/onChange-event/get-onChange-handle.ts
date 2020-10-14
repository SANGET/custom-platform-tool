import { normalInputChange } from ".";

export const getOnChangeHandle = (compTag: string) => {
  switch (compTag) {
    case 'NormalInput':
      return normalInputChange;
    default:
      return () => {};
  }
};
