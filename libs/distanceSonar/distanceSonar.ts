/**
* Different units available for the distance (mm, cm (ref), dm, m)
*/
enum DistanceUnitSonar {   
    //% block="mm"
    Millimeter,
    //% block="cm"
    Centimeter = 58, // Duration of echo round-trip in Microseconds (uS) for two centimeters
    //% block="dm"
    Decimeter,
    //% block="m"
    Meter
}

enum HigherOrLower {
    //% block=">"
    Higher,
    //% block="<"
    Lower
}



namespace input {   //bloc entrée

    const MAX_SONAR_TRAVEL_TIME = 300 * DistanceUnitSonar.Centimeter;
    const SONAR_MEASUREMENTS = 3;

    interface SonarRoundTrip {
        travel: number;     //travel
        rtn: number;        //return
    }
    
    interface Sonar {
        trig: DigitalPin;
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
    

    export function connectSonar(trig: DigitalPin, echo: DigitalPin, unit: DistanceUnitSonar): void {
        if (sonar) {
            return;
        }
        
        sonar = {
            trig: trig,
            roundTrips: [{ travel: 0, rtn: MAX_SONAR_TRAVEL_TIME }],
            medianRoundTrip: MAX_SONAR_TRAVEL_TIME
        };
      /*
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
    }

    /**
    * Returns `true` if an object is within the specified distance. `false` otherwise.
    *
    * @param distance distance to object, eg: 10
    * @param unit unit of distance, eg: DistanceUnitSonar.Centimeter
    */
    
    export function isSonarDistanceLessThan(distance: number, unit: DistanceUnitSonar): boolean {
        if (!sonar) {
            return false;
        } else {
            return Math.idiv(sonar.medianRoundTrip, unit) < distance;
        }
    }


    /**
    * Reset and trigger a pulse.
    */
    
    export function triggerPulse() {
        /*
        // Reset trigger pin
        pins.setPull(sonar.trig, PinPullMode.PullNone);
        pins.digitalWritePin(sonar.trig, 0);
        control.waitMicros(2);
    
        // Trigger pulse
        pins.digitalWritePin(sonar.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(sonar.trig, 0);
        */
    }


    

     /**
    * Run some code when the distance is more or less than the previous one.
    * @param chevron higher or lower
    * @param distance the distance at which this event happens, eg: 15
    * @param unit the unit of the distance
    */
    //% blockId=input_on_sonar_distance_changed block="lorsque la distance du sonar est %chevron à %distance|%unit"
    //% parts="distance sonar"
    //% help=input/on-sonar-distance-condition-changed blockExternalInputs=0
    //% group="More" weight=76 color=#ff1493
    export function onSonarDistanceChanged(chevron: HigherOrLower, distance: number, unit: DistanceUnitSonar, handler: () => void): void {
        console.log("coucou");
        /*
        if (chevron === HigherOrLower.Lower) {
            isSonarDistanceLessThan(distance, unit) = true;
        } 

        if (chevron === HigherOrLower.Higher) {
            isSonarDistanceLessThan(distance, unit) = false;
        }
        */
    }
}


    

