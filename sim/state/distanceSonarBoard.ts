/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>

namespace pxsim {
    export class SonarState {
        lines = 0;
        columns = 0;
        cursor: [number, number];
        text: string[] = ["                ", "                "];
        backLightColor: string = "#6e7d6e";
        
        public sensorUsed: boolean = false;

        constructor(lines = 2, columns = 16) {
            this.lines = lines;
            this.columns = columns;
            this.cursor = [0, 0];
        }

        public setUsed() {
            if (!this.sensorUsed) {
                this.sensorUsed = true;
                runtime.queueDisplayUpdate();
            }
        }
    }

    export interface SonarBoard extends CommonBoard {
        sonarState: SonarState;
    }

    export function sonarState(): SonarState {
        return (board() as SonarBoard).sonarState;
    }
}