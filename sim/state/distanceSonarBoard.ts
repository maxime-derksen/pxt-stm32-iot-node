/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>

namespace pxsim {

    export class SonarState {
        
        public sensorUsed: boolean = false;

        public setUsed() {
            if (!this.sensorUsed) {
                this.sensorUsed = true;
                runtime.queueDisplayUpdate();
            }
        }
    }

    export interface SonarBoard extends CommonBoard {
        distanceSonarState: AnalogSensorState;
        distanceUnitSonarState: DistanceUnitSonar;
    }

    export function distanceSonarState(): AnalogSensorState {
        return (board() as SonarBoard).distanceSonarState;
    }

    export function setDistanceUnitSonar(unit: DistanceUnitSonar) {
        (board() as SonarBoard).distanceUnitSonarState = unit;
    }
}
