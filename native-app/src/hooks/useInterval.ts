import { useEffect } from "react";

function useInterval(callback: Function, delay: number) {
  useEffect(() => {
    let interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
}

export default useInterval;
