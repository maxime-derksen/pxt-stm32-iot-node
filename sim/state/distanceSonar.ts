namespace pxsim {
    export enum HigherOrLower {
        //% block=">"
        Higher = 2,  // SENSOR_THRESHOLD_HIGH
        //% block="near"
        Lower = 1,  // SENSOR_THRESHOLD_LOW
    }
    
    export const enum DistanceUnitSonar {
        //% block="mm"
        Millimeter = 0,
        //% block="cm"
        Centimeter = 1,
        //% block="dm"
        Decimeter = 2,
        //% block="m"
        Meter = 3,
    }

}

namespace pxsim.input {

    const MAX_SONAR_TRAVEL_TIME = 300 * DistanceUnitSonar.Centimeter;
    const SONAR_MEASUREMENTS = 3;

    interface SonarRoundTrip {
        travel: number;     //travel
        rtn: number;        //return
    }
    
    interface Sonar {
        //trig: DigitalPin;
        roundTrips: SonarRoundTrip[];
        medianRoundTrip: number;
    }
    
    let sonar: Sonar;
    

    /**
     * Configures the sonar
     * @param trig tigger pin, eg: DigitalPin.P5
     * @param echo echo pin, eg: DigitalPin.P8
     * @param unit desired conversion unit
     */
    

    export function connectSonar(trig: 0, echo: 1, unit: DistanceUnitSonar): void {
       /* if (sonar) {
            return;
        }
        
        sonar = {
            trig: trig,
            roundTrips: [{ travel: 0, rtn: MAX_SONAR_TRAVEL_TIME }],
            medianRoundTrip: MAX_SONAR_TRAVEL_TIME
        };
      
        pins.onPulsed(echo, PulseValue.High, () => {
            if (pins.pulseDuration() < MAX_SONAR_TRAVEL_TIME && sonar.roundTrips.length <= SONAR_MEASUREMENTS) {
                sonar.roundTrips.push({ travel: input.runningTime(), rtn: pins.pulseDuration() });
            }
        });
        */
    }

    
    /**
    * Returns the distance to an object in a range from 1 to 300 centimeters.
    * The maximum value is returned to indicate when no object was detected.
    * -1 is returned when the device is not connected.
    * @param unit unit of distance (mm, cm, dm, m).
    */

    
    export function getSonarDistance(unit: DistanceUnitSonar): number {
        return 0;
        /*
        if (!sonar) {
            return -1;
        }
    
        switch (unit) {
            case DistanceUnitSonar.Centimeter:
                return Math.idiv(sonar.medianRoundTrip, unit);
            case DistanceUnitSonar.Millimeter:
                return Math.idiv(sonar.medianRoundTrip, unit) * 10.;
            case DistanceUnitSonar.Decimeter:
                return Math.idiv(sonar.medianRoundTrip, unit) / 100.;
            case DistanceUnitSonar.Meter:
                return Math.idiv(sonar.medianRoundTrip, unit) / 1000.;
            default:
                return 0;
        }
        */
    }

    /**
    * Returns `true` if an object is within the specified distance. `false` otherwise.
    *
    * @param distance distance to object, eg: 10
    * @param unit unit of distance, eg: DistanceUnitSonar.Centimeter
    */
    
    export function isSonarDistanceLessThan(distance: number, unit: DistanceUnitSonar): boolean {
        return true;
        /*
        if (!sonar) {
            return false;
        } else {
            return Math.idiv(sonar.medianRoundTrip, unit) < distance;
        }
        */
    }


    /**
    * Reset and trigger a pulse.
    */
    
    export function triggerPulse() {
        /*
        // Reset trigger pin
        pins.setPull(sonar.trig, PinPullMode.PullNone);
        pins.DigitalInOutPin(sonar.trig, 0);
        control.waitMicros(2);
    
        // Trigger pulse
        pins.digitalWritePin(sonar.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(sonar.trig, 0);
        */
    }

    export function onSonarDistanceChanged(condition: number, distance: number, unit: DistanceUnitSonar, body: RefAction): void {
        console.log("coucou");
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
            b.setHighThreshold(d);
        }
        else {
            b.setLowThreshold(d);
        }
        pxtcore.registerWithDal(b.id, condition, body);
    }
}
