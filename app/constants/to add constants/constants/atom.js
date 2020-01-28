import * as joint from 'jointjs';
import SIZE_MODIFIER from "./modifier";
import {ELECTRON} from "./elements";
import {centerX, centerY, electronMove, electronShell, orbitalNumber} from "./utils";

export class Atom {
  constructor({z, r, orbital, sign}, graph) {
    this.sign = sign;
    this.z = z;
    this.r = r;
    this.orbital = orbital;
    this.graph = graph;
    this.atomModel = new joint.shapes.standard.Circle();
  }
  addAtom() {
    this.atomModel.resize(this.r, this.r);
    this.atomModel.position(centerX(this.r), centerY(this.r));
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
    this.atomModel.addTo(this.graph);
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
                  'r': ELECTRON.r,
                  'cx': ELECTRON.r,
                  'stroke': 'black',
                }
              }
            })
            .set({
              labels: [{
                position: -ELECTRON.r,
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
            .addTo(this.graph),
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
}
