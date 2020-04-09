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




namespace input {

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
     * Configures the sonar and measures continuously in the background.
     * @param trig tigger pin, eg: DigitalPin.P5
     * @param echo echo pin, eg: DigitalPin.P8
     * @param unit desired conversion unit
     */
    //% subcategory="Sonar"
    //% blockId="sonar_connect"
    //% block="connect sonar | with Trig at %trig | and Echo at %echo"
    //% trig.fieldEditor="gridpicker"
    //% trig.fieldOptions.columns=4
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker"
    //% echo.fieldOptions.columns=4
    //% echo.fieldOptions.tooltips="false"
    //% weight=80

    function connectSonar(trig: DigitalPin, echo: DigitalPin, unit: DistanceUnitSonar): void {
        if (sonar) {
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

    }

    /**
    * Returns the distance to an object in a range from 1 to 300 centimeters.
    * The maximum value is returned to indicate when no object was detected.
    * -1 is returned when the device is not connected.
    * @param unit unit of distance (mm, cm, dm, m).
    */
    //% subcategory="Sonar"
    //% blockId="sonar_distance"
    //% block="sonar distance in %unit"
    //% weight=60
    
    function getSonarDistance(unit: DistanceUnitSonar): number {

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
    * @param unit unit of distance, eg: DistanceUnit.Centimeter
    */
    //% subcategory="Sonar"
    //% blockId="sonar_less_than"
    //% block="sonar less than |%distance|%unit"
    //% weight=50
    
    function isSonarLessThan(distance: number, unit: DistanceUnitSonar): boolean {
        if (!sonar) {
            return false;
        } else {
            return Math.idiv(sonar.medianRoundTrip, unit) < distance;
        }
    }


    /**
    * Reset and trigger a pulse.
    */
    
    function triggerPulse() {
        // Reset trigger pin
        pins.setPull(sonar.trig, PinPullMode.PullNone);
        pins.digitalWritePin(sonar.trig, 0);
        control.waitMicros(2);
    
        // Trigger pulse
        pins.digitalWritePin(sonar.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(sonar.trig, 0);
    }


    // Returns median value of non-empty input
    function median(values: number[]) {
        values.sort( (a, b) => {return a - b;} );
            return values[(values.length - 1) >> 1];
        }

    function measureInBackground() {
        const trips = sonar.roundTrips;
        const TIME_BETWEEN_PULSE_MS = 145;
    
        while (true) {
            const time = input.runningTime();
        
            if (trips[trips.length - 1].travel < time - TIME_BETWEEN_PULSE_MS - 10) {
                sonar.roundTrips.push({travel : time, rtn : MAX_SONAR_TRAVEL_TIME});
            }
        
            while (trips.length > SONAR_MEASUREMENTS) {
                trips.shift();
            }
        
            sonar.medianRoundTrip = getMedianRTT(sonar.roundTrips);
            triggerPulse();

    /**
    * Get the median of the round trip times.
    * 
    */
    function getMedianRTT(roundTrips : SonarRoundTrip[]) {
        const roundTripTimes = roundTrips.map(urt => urt.rtn);
        return median(roundTripTimes);
        }
            

    /**
    * Run some code when the distance is more or less than the previous one.
    * @param distance the distance at which this event happens, eg: 15
    * @param unit the unit of the distance
    */
    //% blockId=input_on_distance_condition_changed block="on distance %condition|at %distance|%unit"
    //% parts="distance"
    //% help=input/on-distance-condition-changed blockExternalInputs=0
    //% group="More" weight=76
    function onSonarDistanceChanged(distance: number, unit: DistanceUnitSonar, handler: () => void): void {
        
        triggerPulse();

        if (isSonarLessThan(distance, unit)) {
           //update
        }      
    }
}

