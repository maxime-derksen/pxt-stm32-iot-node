//% weight=100 color=#0fbc11 icon=""
namespace DistanceSonar {
    /**
     * Get the distance.
     */
    //% block
    //% blockId=distance_with_time block="distance (capteur ToF) en %unit"
    //% parts="DistanceSonar"
    //% weight=26
    export function distanceWithTime(unit: DistanceUnitWithTime): number {
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

    let TRIG: PwmPin = pins.D2;
    let ECHO: PwmPin = pins.D3;

    //% block
    //% blockId=connect_sonar block="connecter le capteur Ultrason %TRIG_ %ECHO_"
    //% parts="DistanceSonar"
    //% weight=26
    export function connectSonar(TRIG_: PwmPin, ECHO_: PwmPin) {
        TRIG = TRIG_;
        ECHO = ECHO_;
    }

    function timeSonarInUs(TRIG: PwmPin, ECHO: PwmPin) {
        //TRIG.digitalWrite(true)
        control.waitMicros(10)
        //TRIG.digitalWrite(false)
        let timeInUs = 0 //ECHO.pulseIn(PulseValue.High)
        return timeInUs;
    }

    function timeSonar(unit: DistanceUnitWithTime): number {
        let timeInUs = timeSonarInUs(TRIG, ECHO);
        switch (unit) {
            case DistanceUnitWithTime.PicoSecond:
                return timeInUs * 1E6;
            case DistanceUnitWithTime.NanoSecond:
                return timeInUs * 1E3;;
            case DistanceUnitWithTime.MicroSecond:
                return timeInUs;
            case DistanceUnitWithTime.MilliSecond:
                return timeInUs * 1E-3;
            case DistanceUnitWithTime.MilliSecond:
                return timeInUs * 1E-6;
        }
        return -1;
    }

    function distanceSonar(unit: DistanceUnitWithTime): number {
        let timeInUs = timeSonarInUs(TRIG, ECHO);
        switch (unit) {
            case DistanceUnitWithTime.Millimeter:
                return timeInUs * 0.5 * 34029E-5;
            case DistanceUnitWithTime.Centimeter:
                return timeInUs * 0.5 * 34029E-6;
            case DistanceUnitWithTime.Decimeter:
                return timeInUs * 0.5 * 34029E-7;
            case DistanceUnitWithTime.Meter:
                return timeInUs * 0.5 * 34029E-8;
        }
        return -10;
    }



    /**
    * Get the distance.
    */
    //% block
    //% blockId=distance_sonar_with_time block="distance (capteur Ultrason) en %unit"
    //% parts="DistanceSonar"
    //% weight=26
    export function distanceSonarWithTime(unit: DistanceUnitWithTime): number {
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
}

    

