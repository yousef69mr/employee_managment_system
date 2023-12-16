import { useState } from "react";

export const useForceUpdate = () => {
  const [_, setValue] = useState(0); // Using an unused state variable

  const forceUpdate = () => setValue((value) => ++value);

  return forceUpdate;
};
