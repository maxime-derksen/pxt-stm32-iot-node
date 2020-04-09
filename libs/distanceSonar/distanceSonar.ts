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

    const MAX_ULTRASONIC_TRAVEL_TIME = 300 * DistanceUnitSonar.Centimeter;
    const ULTRASONIC_MEASUREMENTS = 3;

    interface SonarRoundTrip {
        travel : number;     //travel
        rtn : number;        //return
    }
    
    interface SonarDevice {
        trig : DigitalPin;
        roundTrips: SonarRoundTrip[];
        medianRoundTrip: number;
    }
    
    let sonarDevice: SonarDevice;
    

    /**
     * Configures the ultrasonic distance sensor and measures continuously in the background.
     * @param trig pin connected to trig, eg: DigitalPin.P5
     * @param echo pin connected to echo, eg: DigitalPin.P8
     * @param unit desired conversion unit
     */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_connect"
    //% block="connect ultrasonic distance sensor | with Trig at %trig | and Echo at %echo"
    //% trig.fieldEditor="gridpicker"
    //% trig.fieldOptions.columns=4
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker"
    //% echo.fieldOptions.columns=4
    //% echo.fieldOptions.tooltips="false"
    //% weight=80

    function connectUltrasonicDistanceSensor(trig: DigitalPin, echo: DigitalPin, unit : DistanceUnitSonar): void {
        if (sonarDevice) {
        return;
        }

        int d
            
            switch (unit) {
                case DistanceUnitSonar.Millimeter:
                    d = distance;
                    break;
                case DistanceUnitSonar.Centimeter:
                    d = distance * 10;
                    break;
                case PingUnit.Decimeter:
                    d = distance * 100;
                    break;
                case PingUnit.Meter:
                    d = distance * 1000;
                    break;
                default:
                    d = 0;
                    break;
            }

    }

    /**
    * Returns the distance to an object in a range from 1 to 300 centimeters or up to 118 inch.
    * The maximum value is returned to indicate when no object was detected.
    * -1 is returned when the device is not connected.
    * @param unit unit of distance, eg: DistanceUnit.CM
    */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_distance"
    //% block="ultrasonic distance in %unit"
    //% weight=60
    
    function getSonarDistance(unit: DistanceUnitSonar): number {
    if (!sonarDevice) {
      return -1;
    }
    
    
    switch (unit) {
        case DistanceUnitSonar.Centimeter:
            return Math.idiv(sonarDevice.medianRoundTrip, unit);
        case DistanceUnitSonar.Millimeter:
            return Math.idiv(sonarDevice.medianRoundTrip, unit) * 10.;
        case DistanceUnitSonar.Decimeter:
            return Math.idiv(sonarDevice.medianRoundTrip, unit) / 100.;
        case DistanceUnitSonar.Meter:
            return Math.idiv(sonarDevice.medianRoundTrip, unit) / 1000.;
        default:
            return 0;
    }
    }

    /**
    * Returns `true` if an object is within the specified distance. `false` otherwise.
    *
    * @param distance distance to object, eg: 10
    * @param unit unit of distance, eg: DistanceUnit.CM
    */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_less_than"
    //% block="ultrasonic distance is less than |%distance|%unit"
    //% weight=50
    
    function isSonarInRange(distance: number,unit: DistanceUnit): boolean {
        if (!sonarDevice) {
            return false;
        } else {
            return Math.idiv(sonarDevice.medianRoundTrip, unit) < distance;
        }
    }
}

