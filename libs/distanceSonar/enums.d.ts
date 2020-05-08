declare const enum DistanceUnitSonar {   
    //% block="mm"
    Millimeter,
    //% block="cm"
    Centimeter = 58, // Duration of echo round-trip in Microseconds (uS) for two centimeters
    //% block="dm"
    Decimeter,
    //% block="m"
    Meter
}

declare const enum HigherOrLower {
    //% block=">"
    Higher,
    //% block="<"
    Lower
}