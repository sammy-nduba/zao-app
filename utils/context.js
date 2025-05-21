import { createContext  } from "react";


export const onBoardingContext = createContext({
    isZaoAppOnboarded: false,
  setIsZaoAppOnboarded: () => {},
});