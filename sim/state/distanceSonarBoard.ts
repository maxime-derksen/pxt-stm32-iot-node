/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>

namespace pxsim {

    export class DistanceSonarState {
        constructor(public distanceSonarState: AnalogSensorState, public distanceUnitSonarState: DistanceUnitSonar) { }
        

        public setUsed(){
            this.distanceSonarState.setUsed();
            runtime.queueDisplayUpdate();
        }
    }
    

    export interface DistanceSonarBoard extends CommonBoard {
        distanceSonarState: DistanceSonarState;
        distanceUnitSonarState: DistanceUnitSonar;
    }

    export function distanceSonarState(): DistanceSonarState {
        return (board() as DistanceSonarBoard).distanceSonarState;
    }

    export function setDistanceUnitSonar(unit: DistanceUnitSonar) {
        (board() as DistanceSonarBoard).distanceUnitSonarState = unit;
    }
}
