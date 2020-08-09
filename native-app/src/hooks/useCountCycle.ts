import { useState } from "react";
import useInterval from "./useInterval";

type TickFunction = (ticks: number) => number;

type Options = {
  tickFunction?: TickFunction;
  interval?: number;
};

export let incr: TickFunction = (ticks) => ticks + 1;
export let decr: TickFunction = (ticks) => ticks - 1;

function defaultOptions(): Options {
  return {
    tickFunction: incr,
    interval: 1e3,
  };
}

/*
    useCountCycle(3)
    0...(1sec)
    1...(1sec)
    2...(1sec)
    0...(1sec)
    1...
*/
function useCountCycle(size: number, options: Options = {}): [number] {
  let opts = { ...defaultOptions(), ...options };
  let [ticks, setTicks] = useState(0);
  useInterval(() => setTicks(opts.tickFunction), opts.interval);
  return [ticks % size];
}

export default useCountCycle;
