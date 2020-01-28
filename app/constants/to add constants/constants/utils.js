function randPosY() {
  return Math.random() * 600 + 200;
}
function randPosX() {
  return Math.random() * 1500 + 200;
}
function centerX(r) {
  return 950 - r/2
}
function centerY(r) {
  return 500 - r/2
}
function electronShell(z) {
  if (z <= 2) {
    return 1;
  } else if (z <= 10) {
    return 2;
  } else if (z <= 18) {
    return 3;
  } else {
    return 4;
  }
}
function orbitalNumber(number, z) {
  if (number <= 2) {
    return {
      n: 1,
      max: z > 2 ? 2 : z,
      electron: number,
    };
  } else if (number > 2 && number <= 10) {
    return {
      n: 2,
      max: z > 10 ? 8 : z - 2,
      electron: number - 2,
    };
  } else if (number > 10 && number <= 18) {
    return {
      n: 3,
      max: z > 18 ? 8 : z - 10,
      electron: number - 10,
    };
  } else if (number > 18) {
    return {
      n: 4,
      max: 2,
      electron: number - 18,
    };
  }
}
function electronMove(electron, atom, orbital, r) {
  electron.electron.transition('target', 1, {
    duration: 3000,
    timingFunction: time => {
      return time + ((1/electron.orbital.max * electron.orbital.electron) + (1/electron.electronShell * electron.orbital.n))
    },
    valueFunction: () => (t) => {
      const orbitalDistance = orbital/(electron.electronShell + 1 - electron.orbital.n);
      const rotation = (t * 2 * Math.PI) * Math.pow(-1, electron.orbital.n);
      return {
        x: (atom.position().x + r/2) + (orbitalDistance * Math.cos(rotation)),
        y: (atom.position().y + r/2) + (orbitalDistance * Math.sin(rotation))
      }
    }
  });
}
export {
  randPosY,
  randPosX,
  centerY,
  centerX,
  electronShell,
  orbitalNumber,
  electronMove
};
