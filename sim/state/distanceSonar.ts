/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../node_modules/pxt-core/localtypings/pxtarget.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>




namespace pxsim {
    export enum DistanceUnitWithTime {
        //% block="mm"
        Millimeter = 0,
        //% block="cm"
        Centimeter = 1,
        //% block="dm"
        Decimeter = 2,
        //% block="m"
        Meter = 3,
        //% block="ps"
        PicoSecond = 4,
        //% block="ns"
        NanoSecond = 5,
        //% block="µs"
        MicroSecond = 6,
        //% block="ms"
        MilliSecond = 7,
        //% block="s"
        Second = 8,
    }

}

namespace pxsim.DistanceSonar {

    let connected = false;
    /*
    let TRIG: Pin;
    let ECHO: Pin;
    */


    export function connectSonar(TRIG_: Pin, ECHO_: Pin) {
        console.log("connectSonar()");
        let b = distanceSonarState();
        b.setUsed();
        connected = true;
    }

    /**
    * Get the distance.
    */
    //% block
    //% blockId=distance_sonar_with_time block="distance (capteur Ultrason) en %unit"
    //% parts="DistanceSonar"
    //% weight=26
    export function distanceSonarWithTime(unit: DistanceUnitWithTime): number {
        console.log("getSonarDistance()");
        let b = distanceSonarState();
        b.setUsed();

        if (connected === true) {
            switch (unit) {
                case DistanceUnitWithTime.PicoSecond:
                case DistanceUnitWithTime.NanoSecond:
                case DistanceUnitWithTime.MicroSecond:
                case DistanceUnitWithTime.MilliSecond:
                case DistanceUnitWithTime.MilliSecond:
                    return timeSonar(unit);
                case DistanceUnitWithTime.Millimeter:
                case DistanceUnitWithTime.Centimeter:
                case DistanceUnitWithTime.Decimeter:
                case DistanceUnitWithTime.Meter:
                    return distanceSonar(unit);
            }
            return -100;
        }
        return 0;
    }


    
    function timeSonar(unit: DistanceUnitWithTime): number {
        
        let b = distanceSonarState();
        b.setUsed();
        const timeSonar = b.distanceSonarState.getLevel();
        
        switch (unit) {
            case DistanceUnitWithTime.PicoSecond:
                return timeSonar * 1E6;
            case DistanceUnitWithTime.NanoSecond:
                return timeSonar * 1E3;;
            case DistanceUnitWithTime.MicroSecond:
                return timeSonar;
            case DistanceUnitWithTime.MilliSecond:
                return timeSonar * 1E-3;
            case DistanceUnitWithTime.MilliSecond:
                return timeSonar * 1E-6;
        }
        return -1;
    }

    function distanceSonar(unit: DistanceUnitWithTime): number {

        let b = distanceSonarState();
        b.setUsed();
        const timeSonar = b.distanceSonarState.getLevel();

        switch (unit) {
            case DistanceUnitWithTime.Millimeter:
                return timeSonar * 0.5 * 34029E-5;
            case DistanceUnitWithTime.Centimeter:
                return timeSonar * 0.5 * 34029E-6;
            case DistanceUnitWithTime.Decimeter:
                return timeSonar * 0.5 * 34029E-7;
            case DistanceUnitWithTime.Meter:
                return timeSonar * 0.5 * 34029E-8;
        }
        return -10;
    }




    


    













    /*
    export function getSonarDistance(unit: DistanceUnitWithTime): number {
        console.log("getSonarDistance()");
        let b = distanceSonarState();
        b.setUsed();

        let distance = b.distanceSonarState.getLevel();
        let d = distance;
    }
    

    /*
    
    export function isSonarDistanceLessThan(distance: number, unit: DistanceUnitSonar): boolean {
        return true;
        
        if (!sonar) {
            return false;
        } else {
            return Math.idiv(sonar.medianRoundTrip, unit) < distance;
        }
        
    }
    


    /**
    * Reset and trigger a pulse.
    
    
    export function triggerPulse() {
        
        // Reset trigger pin
        pins.setPull(sonar.trig, PinPullMode.PullNone);
        pins.DigitalInOutPin(sonar.trig, 0);
        control.waitMicros(2);
    
        // Trigger pulse
        pins.digitalWritePin(sonar.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(sonar.trig, 0);
        
    }

    
    export function onSonarDistanceChanged(condition: number, distance: number, unit: DistanceU, body: RefAction): void {
        console.log("onSonarDistanceChanged()");
        let b = distanceSonarState();
        b.setUsed();

        let d = distance;

        switch (unit)
        {
            case DistanceUnitSonar.Millimeter:
                d = distance;
                break;
            case DistanceUnitSonar.Centimeter:
                d = distance * 10;
                break;
            case DistanceUnitSonar.Decimeter:
                d = distance * 100;
                break;
            case DistanceUnitSonar.Meter:
                d = distance * 1000;
                break;
            default:
                d = 0;
                break;
        }
        
        if (condition === DAL.ANALOG_THRESHOLD_HIGH) {
            b.distanceSonarState.setHighThreshold(d);
        }
        else {
            b.distanceSonarState.setLowThreshold(d);
        }
        pxtcore.registerWithDal(b.distanceSonarState.id, condition, body);
    }
    */
}
