import {useRef} from 'react';
// import { doSomethingAtSecondX } from '@core/utils'

interface DoSomethingAtSecondX {
  callback: () => void;
  seconds: number;
}

export const doSomethingAtSecondX = (params: DoSomethingAtSecondX) => {
  const {callback, seconds} = params;
  setTimeout(callback, seconds * 1000);
};

interface MoveScrollTo {
  x: number;
  y: number;
}

export const useMoveScroll = () => {
  const scrollRef = useRef() as any;

  const moveScrollTo = ({x, y}: MoveScrollTo) =>
    scrollRef.current.scrollTo({x, y, animated: true});

  const moveScrollToDown = (pxToDown: number) => {
    if (scrollRef.current) {
      doSomethingAtSecondX({
        callback: () => moveScrollTo({x: 0, y: pxToDown}),
        seconds: 0.35,
      });
    }
  };

  return {
    scrollRef,
    moveScrollToDown,
  };
};
