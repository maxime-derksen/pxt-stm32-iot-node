/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>

namespace pxsim {

    export class DistanceSonarState {
        constructor(public distanceSonarState: AnalogSensorState, public distanceUnitSonarState: DistanceUnitSonar) { }
        
        public sensorUsed: boolean = false;

        public setUsed() {
            if (!this.sensorUsed) {
                this.sensorUsed = true;
                runtime.queueDisplayUpdate();
            }
        }
    }
    

    export interface DistanceSonarBoard extends CommonBoard {
        distanceSonarState: AnalogSensorState;
        distanceUnitSonarState: DistanceUnitSonar;
    }

    export function distanceSonarState(): AnalogSensorState {
        return (board() as DistanceSonarBoard).distanceSonarState;
    }

    export function setDistanceUnitSonar(unit: DistanceUnitSonar) {
        (board() as DistanceSonarBoard).distanceUnitSonarState = unit;
    }
}
