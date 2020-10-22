import { normalButtonClick } from ".";

export const getOnClickHandle = (compTag: string) => {
  switch (compTag) {
    case 'NormalButton':
      return normalButtonClick;
    default:
      return () => {};
  }
};
