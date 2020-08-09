import { useState } from "react";
import useInterval from "./useInterval";

type TickFunction = (ticks: number) => number;

type Options = {
  tickFunction?: TickFunction;
};

export let incr: TickFunction = (ticks) => ticks + 1;
export let decr: TickFunction = (ticks) => ticks - 1;

function defaultOptions(): Options {
  return {
    tickFunction: incr,
  };
}

function useCountCycle(
  size: number,
  interval: number,
  options: Options = {}
): [number] {
  let opts = { ...defaultOptions(), ...options };
  let [ticks, setTicks] = useState(0);
  useInterval(() => setTicks(opts.tickFunction), interval);
  return [ticks % size];
}

export default useCountCycle;
