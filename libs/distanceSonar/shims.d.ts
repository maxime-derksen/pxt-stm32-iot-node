declare namespace DistanceSonar {

    /**
    * Get the distance.
    */
   //% help=input/distance
   //% blockId=device_sonar_distance block="distanceSonar in %unit"
   //% parts="distanceSonar"
   //% weight=26 color=#ff1493
    export function getSonarDistance(unit: DistanceUnitWithTime): number;

    
}