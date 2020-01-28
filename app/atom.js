var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
  el: document.getElementById('myholder'),
  model: graph,
  width: 1900,
  height: 1100,
  gridSize: 1
});
const SIZE_MODIFIER = 1.5;
const ELECTRON = {
  r: 4,
};
const HYDROGEN = {
  sign: 'H',
  z: 1,
  r: 53/3 * SIZE_MODIFIER,
  orbital: 53 * SIZE_MODIFIER,
};
const HELIUM = {
  sign: 'He',
  z: 2,
  r: 38/3 * SIZE_MODIFIER,
  orbital: 38 * SIZE_MODIFIER,
};
const LITHIUM = {
  sign: 'Li',
  z: 3,
  r: 152/3 * SIZE_MODIFIER,
  orbital: 152 * SIZE_MODIFIER,
};
const BERYLLIUM = {
  sign: 'Be',
  z: 4,
  r: 112/3 * SIZE_MODIFIER,
  orbital: 112 * SIZE_MODIFIER,
};
const BORON  = {
  sign: 'B',
  z: 5,
  r: 85/3 * SIZE_MODIFIER,
  orbital: 85 * SIZE_MODIFIER,
};
const CARBON  = {
  sign: 'C',
  z: 6,
  r: 70/3 * SIZE_MODIFIER,
  orbital: 70 * SIZE_MODIFIER,
};
const NITROGEN  = {
  sign: 'N',
  z: 7,
  r: 65/3 * SIZE_MODIFIER,
  orbital: 65 * SIZE_MODIFIER,
};
const OXYGEN  = {
  sign: 'O',
  z: 8,
  r: 60/3 * SIZE_MODIFIER,
  orbital: 60 * SIZE_MODIFIER,
};
const FLUORINE  = {
  sign: 'F',
  z: 9,
  r: 50/3 * SIZE_MODIFIER,
  orbital: 50 * SIZE_MODIFIER,
};
const NEON  = {
  sign: 'Ne',
  z: 10,
  r: 38/3 * SIZE_MODIFIER,
  orbital: 38 * SIZE_MODIFIER,
};
const SODIUM = {
  sign: 'Na',
  z: 11,
  r: 180/3 * SIZE_MODIFIER,
  orbital: 180 * SIZE_MODIFIER,
};
const MAGNESIUM = {
  sign: 'Mg',
  z: 12,
  r: 150/3 * SIZE_MODIFIER,
  orbital: 150 * SIZE_MODIFIER,
};
const ALUMINIUM = {
  sign: 'Al',
  z: 13,
  r: 125/3 * SIZE_MODIFIER,
  orbital: 125 * SIZE_MODIFIER,
};
const SILICON = {
  sign: 'Si',
  z: 14,
  r: 110/3 * SIZE_MODIFIER,
  orbital: 110 * SIZE_MODIFIER,
};
const PHOSPHORUS = {
  sign: 'P',
  z: 15,
  r: 100/3 * SIZE_MODIFIER,
  orbital: 100 * SIZE_MODIFIER,
};
const SULFUR = {
  sign: 'S',
  z: 16,
  r: 100/3 * SIZE_MODIFIER,
  orbital: 110 * SIZE_MODIFIER,
};
const CHLORINE = {
  sign: 'Cl',
  z: 17,
  r: 100/3 * SIZE_MODIFIER,
  orbital: 110 * SIZE_MODIFIER,
};
const ARGON = {
  sign: 'Ar',
  z: 18,
  r: 71/3 * SIZE_MODIFIER,
  orbital: 71 * SIZE_MODIFIER,
};
const POTASSIUM = {
  sign: 'K',
  z: 19,
  r: 220/3 * SIZE_MODIFIER,
  orbital: 220 * SIZE_MODIFIER,
};
const CALCIUM = {
  sign: 'Ca',
  z: 20,
  r: 180/3 * SIZE_MODIFIER,
  orbital: 180 * SIZE_MODIFIER,
};
function randPos() {
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
const Atom = class {
  constructor({z, r, orbital, sign}) {
    this.z = z;
    this.r = r;
    this.orbital = orbital;
    this.sign = sign;
    this.atomModel = new joint.shapes.standard.Circle();
  }
  addAtom() {
    this.atomModel.resize(this.r, this.r);
    this.atomModel.position(randPosX(this.r), randPos(this.r));
    this.atomModel.attr({
      body: {
        fill: 'none'
      },
      label: {
        text: this.sign,
        fontSize: 8 * SIZE_MODIFIER,
        fontWeight: 'bold',
      }
    });
    this.atomModel.addTo(graph);
    let electrons = [];
    for (let i = this.z; i > 0; i--) {
      electrons.push({
        electron: new joint.shapes.standard.Link()
          .source(this.atomModel)
          .attr({
            line: {
              stroke: 'none',
              targetMarker: {
                'type': 'circle',
                'r': ELECTRON.r * SIZE_MODIFIER,
                'cx': ELECTRON.r * SIZE_MODIFIER,
                'stroke': 'black',
              }
            }
          })
          .set({
            labels: [{
              position: -ELECTRON.r * SIZE_MODIFIER,
              attrs: {
                text: {
                  text: 'e-',
                  fill: 'black',
                  fontSize: 7 * SIZE_MODIFIER,
                  fontWeight: 'bold',
                },
              }
            }]
          })
          .addTo(graph),
          orbital: orbitalNumber(i, this.z),
          electronShell: electronShell(this.z)
        }
      )
    }
    electrons.forEach(electron => {
      electronMove(electron, this.atomModel, this.orbital, this.r);
      electron.electron.on('transition:end', () => {
        electronMove(electron, this.atomModel, this.orbital, this.r);
      });
    });
  }
};
new Atom(HYDROGEN).addAtom();
new Atom(HELIUM).addAtom();
new Atom(LITHIUM).addAtom();
new Atom(BERYLLIUM).addAtom();
new Atom(BORON).addAtom();
new Atom(CARBON).addAtom();
new Atom(NITROGEN).addAtom();
new Atom(OXYGEN).addAtom();
new Atom(FLUORINE).addAtom();
new Atom(NEON).addAtom();
new Atom(SODIUM).addAtom();
