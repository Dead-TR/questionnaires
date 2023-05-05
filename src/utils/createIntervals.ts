export const createIntervals = () => {
  const timeouts: NodeJS.Timeout[] = [];

  const pushInterval = (f: () => void, time: number = 0) => {
    const timeout = setInterval(() => {
      f();
    }, time);

    timeouts.push(timeout);

    return timeout;
  };

  const clearIntervals = () => {
    timeouts.forEach((t) => {
      clearInterval(t);
    });
    timeouts.length = 0;
  };

  return {
    pushInterval,
    clearIntervals,
  };
};
