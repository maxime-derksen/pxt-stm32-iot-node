/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>

namespace pxsim {

    export class DistanceSonarState {
        constructor(public distanceSonarState: AnalogSensorState, public distanceUnitSonarState: DistanceUnitWithTime) { }
        

        public setUsed(){
            this.distanceSonarState.setUsed();
            runtime.queueDisplayUpdate();
        }
    }
    

    export interface DistanceSonarBoard extends CommonBoard {
        distanceSonarState: DistanceSonarState;
        distanceUnitSonarState: DistanceUnitWithTime;
    }

    export function distanceSonarState(): DistanceSonarState {
        return (board() as DistanceSonarBoard).distanceSonarState;
    }

    export function setDistanceUnitSonar(unit: DistanceUnitWithTime) {
        (board() as DistanceSonarBoard).distanceUnitSonarState = unit;
    }
}
