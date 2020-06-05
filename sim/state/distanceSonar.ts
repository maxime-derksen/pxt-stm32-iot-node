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

    

    /*
    export function getSonarDistance(unit: DistanceUnitSonar): number {
        console.log("getSonarDistance()");
        let b = distanceSonarState();
        b.setUsed();

        let distance = b.distanceSonarState.getLevel();
        let d = distance;
    */
    


  
    export function distanceWithTime(unit: DistanceUnitWithTime): number {
        console.log("getSonarDistance()");
        let b = distanceSonarState();
        b.setUsed();

        switch (unit) {
            case DistanceUnitWithTime.Millimeter:
                return input.distance(DistanceUnit.Millimeter);
            case DistanceUnitWithTime.Centimeter:
                return input.distance(DistanceUnit.Centimeter);
            case DistanceUnitWithTime.Decimeter:
                return input.distance(DistanceUnit.Decimeter);
            case DistanceUnitWithTime.Meter:
                return input.distance(DistanceUnit.Meter);
            case DistanceUnitWithTime.PicoSecond:
                return input.distance(DistanceUnit.Millimeter) * 3.335 * 2;
            case DistanceUnitWithTime.NanoSecond:
                return input.distance(DistanceUnit.Millimeter) * 3.335E-3 * 2;
            case DistanceUnitWithTime.MicroSecond:
                return input.distance(DistanceUnit.Millimeter) * 3.335E-6 * 2;
            case DistanceUnitWithTime.MilliSecond:
                return input.distance(DistanceUnit.Millimeter) * 3.335E-9 * 2;
            case DistanceUnitWithTime.Second:
                return input.distance(DistanceUnit.Millimeter) * 3.335E-12 * 2;
        }
        return 0;
    }


    /*
    let TRIG: PwmPin = pins.D2;
    let ECHO: PwmPin = pins.D3;

    export function connectSonar(TRIG_: PwmPin, ECHO_: PwmPin) {
        console.log("connectSonar()");
        let b = distanceSonarState();
        b.setUsed();
        TRIG = TRIG_;
        ECHO = ECHO_;
    }
    */


    


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
