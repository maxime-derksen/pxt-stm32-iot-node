/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../../built/common-sim.d.ts"/>
/// <reference path="../../libs/core/dal.d.ts"/>

namespace pxsim.visuals {    
   // For the intructions
   export function mkSonarPart(xy: Coord = [0, 0]): SVGElAndSize {
       let [x, y] = xy;
       let l = x;
       let t = y;
       let w = SONAR_PART_WIDTH;
       let h = SONAR_PART_HEIGHT;
       let img = <SVGGElement>svg.elt("image");
       svg.hydrate(img, {
           class: "sim-sonar", x: l, y: t, width: w, height: h,
           href: svg.toDataUri(SONAR_PART)
       });
       return { el: img, x: l, y: t, w: w, h: h };
   }

   export class DistanceSonarView implements IBoardPart<DistanceSonarState> {
      style= BUTTON_PAIR_STYLE;
      element: SVGElement;
      svgEl: SVGSVGElement;
      defs: SVGElement[];
      image: SVGSVGElement;
      
      private distanceSonarGradient: SVGLinearGradientElement;
      private distanceSonar: SVGRectElement;
      private distanceSonarText: SVGTextElement;
       
      
      private btn: SVGGElement;  
      private part: SVGElAndSize;
      private bus: EventBus;

      private state: DistanceSonarState;

      
      private static dsmin = 0;
      private static dsmax = 2000;
      
   
      constructor() {
      }

      public init(bus: EventBus, state: DistanceSonarState, svgEl: SVGSVGElement, otherParams: Map<string>): void {
         this.state = state;
         this.bus = bus;
         this.initDom();
         this.updateState();
        
      }

      initDom() {
         this.element = svg.elt("g");
         this.image = new DOMParser().parseFromString(SONAR_PART, "image/svg+xml").querySelector("svg") as SVGSVGElement;
         svg.hydrate(this.image, {
            class: "sim-sonar", width: SONAR_PART_WIDTH, height: SONAR_PART_HEIGHT,
         });
         this.element.appendChild(this.image);
      }
      

      setChar(column: number, line: number, value: string): void {
         let _case = this.image.getElementById("case" + line + "" + column + "_text") as SVGTextElement;
         _case.innerHTML = value.charAt(0);
      }

      public moveToCoord(xy: Coord) {
         translateEl(this.element, [xy[0], xy[1]]);
      }

      
      public updateTheme() {
         let On = "#77ffff";
         let Off = "#fff";
         svg.setGradientColors(this.distanceSonarGradient, Off, On);
      }




      
      public updateDistanceSonar() {
         let state = this.state;
            if (!state || !state.distanceSonarState || !state.distanceSonarState.sensorUsed)
                return;
            
            let t = Math.max(DistanceSonarView.dsmin, Math.min(DistanceSonarView.dsmax, state.distanceSonarState.getLevel()))
            let per = Math.floor((state.distanceSonarState.getLevel() - DistanceSonarView.dsmin) / (DistanceSonarView.dsmax - DistanceSonarView.dsmin) * 100)
            svg.setGradientValue(this.distanceSonarGradient, 100 - per + "%");

            let unit = " mm";
            if (state.distanceUnitSonarState == pxsim.DistanceUnitSonar.Meter) {
                unit = " m";
            }
            this.distanceSonarText.textContent = t + unit;
            this.distanceSonar.setAttribute("aria-valuenow", t.toString());
            this.distanceSonar.setAttribute("aria-valuetext", t + unit);
            accessibility.setLiveContent(t + unit);
      
      }
      


      public updateState() {
         
         
         let state = this.state;
         if (!state || !state.distanceSonarState || !state.distanceSonarState.sensorUsed) {
            if (this.distanceSonar) {
               this.svgEl.removeChild(this.element);
               this.distanceSonar = null;
            }
         } else if (state && state.distanceSonarState && state.distanceSonarState.sensorUsed) {
            this.mkDistanceSonar();
            this.svgEl.appendChild(this.element);
            this.updateDistanceSonar();   
         }
         
      }

      
      private mkDistanceSonar() {
         let svgEl = this.svgEl;
         let defs = <SVGDefsElement>svg.child(svgEl, "defs", {});
         let g = <SVGGElement>svg.elt("g");

         if (!this.distanceSonar) {
            let gid = "gradient-distance-sonar";
            this.distanceSonarGradient = svg.linearGradient(defs, gid);
            let xBase = 25;
            let yBase = 450;
            let heightBase = 64;
            svg.child(g, "rect", {
               fill: "transparent",
               x: xBase - 5,
               y: yBase - 20,
               width: 20,
               height: heightBase + 40,
            });
            this.distanceSonar = <SVGRectElement>svg.child(g, "rect", {
               class: "sim-distanceSonar no-drag",
               x: xBase,
               y: yBase,
               width: 10,
               height: heightBase,
               rx: 4, ry: 4,
               fill: `url(#${gid})`
            });
            this.distanceSonarText = svg.child(g, "text", { class: 'sim-text', x: xBase + 20, y: yBase + 20 }) as SVGTextElement;
            this.updateTheme();

            let pt = svgEl.createSVGPoint();
            svg.buttonEvents(this.distanceSonar,
               // move
               (ev) => {
                  let cur = svg.cursorPoint(pt, svgEl, ev);
                  let t = Math.max(0, Math.min(1, ((heightBase + yBase) - cur.y) / (heightBase)));
                  console.log(64 + yBase - cur.y);
                  this.state.distanceSonarState.setLevel(Math.floor(DistanceSonarView.dsmin + t * (DistanceSonarView.dsmax - DistanceSonarView.dsmin)));
                  this.updateDistanceSonar();
               },
               // start
               ev => { },
               // stop
               ev => { },
               // keydown
               (ev) => {
                  let charCode = (typeof ev.which == "number") ? ev.which : ev.keyCode
                  if (charCode === 40 || charCode === 37) { // Down/Left arrow
                     if (this.state.distanceSonarState.getLevel() === DistanceSonarView.dsmin) {
                        this.state.distanceSonarState.setLevel(DistanceSonarView.dsmax);
                     } else {
                        this.state.distanceSonarState.setLevel(this.state.distanceSonarState.getLevel() - 1);
                     }
                     this.updateDistanceSonar();
                  } else if (charCode === 38 || charCode === 39) { // Up/Right arrow
                     if (this.state.distanceSonarState.getLevel() === DistanceSonarView.dsmax) {
                        this.state.distanceSonarState.setLevel(DistanceSonarView.dsmin);
                     } else {
                        this.state.distanceSonarState.setLevel(this.state.distanceSonarState.getLevel() + 1);
                     }
                     this.updateDistanceSonar();
                  }
               });
         }
      }
   }

   const SONAR_PART_WIDTH = 400;
   const SONAR_PART_HEIGHT = 110;

   const SONAR_PART = `<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   id="LCD"
   height="208.97415"
   width="490.47632"
   version="1.1"
   y="0"
   x="0"
   viewBox="0 0 490.47632 208.97415">
  <defs
     id="defs2284">
    <style
       id="style2282">
        .cls-textCase {
            fill: #000000;
            fill-opacity:0.8;
            font-family: 'LCD Dot Matrix HD44780U';
            font-weight: 100;
            font-size: 24px;
        }
	    .cls-case {
		    fill:#FFFFFF;
		    fill-opacity:0.1
	    } 

	    .cls-backlight_on {
           	fill:#A0F7F7;
	    }
	    .cls-backlight_off {
           	fill:#6e7d6e;
        }
        </style>
  </defs>
  <g
     transform="matrix(1.2557984,0,0,1,-4.4466531,-3.7033349)"
     gorn="0.3"
     id="Layer_2">
    <g
       id="g13">
      <path
         style="fill:#274a88"
         id="path9"
         d="m 45.059,14.5 c -0.159,3.524 1.444,6.642 3.749,9.192 5.076,5.077 13.308,5.077 18.384,0 2.071,-1.982 3.085,-4.525 3.618,-7.273 0.493,-0.805 0.166,-0.209 0.694,-1.919 h 160.555 c -0.159,3.524 1.444,6.642 3.749,9.192 5.076,5.077 13.308,5.077 18.384,0 1.987,-1.922 3.056,-4.374 3.573,-7.039 0.876,-1.357 0.482,-0.641 1.172,-2.153 H 385.5 v 32.584 c -3.627,-0.143 -6.54,1.441 -9.192,3.724 -5.077,5.076 -5.077,13.308 0,18.384 2.482,2.459 5.72,3.748 9.192,3.748 V 202.5 h -31.56 c 0.234,-3.719 -1.301,-6.986 -3.748,-9.692 -2.274,-2.056 -4.847,-3.444 -7.946,-3.749 -4.497,0 -7.031,0.584 -10.438,3.749 -2.662,2.63 -3.749,6.034 -3.749,9.692 H 166.44 c 0.065,-3.33 -1.58,-6.294 -3.748,-8.692 -2.273,-2.056 -4.847,-3.444 -7.946,-3.749 -4.497,0 -7.031,0.584 -10.438,3.749 -2.247,2.336 -3.749,5.409 -3.749,8.692 H 10.5 v -33.06 c 3.719,0.234 6.986,-1.302 9.692,-3.748 5.077,-5.076 5.077,-13.308 0,-18.384 -2.273,-2.056 -4.847,-3.444 -7.946,-3.749 -1.649,0.033 -1.07,-0.029 -1.746,0.048 V 14.5 Z" />
      <path
         style="fill-opacity:0;stroke:#2394de;stroke-width:3"
         id="path11"
         d="m 45.059,14.5 c -0.159,3.524 1.444,6.642 3.749,9.192 5.076,5.077 13.308,5.077 18.384,0 2.071,-1.982 3.085,-4.525 3.618,-7.273 0.493,-0.805 0.166,-0.209 0.694,-1.919 h 160.555 c -0.159,3.524 1.444,6.642 3.749,9.192 5.076,5.077 13.308,5.077 18.384,0 1.987,-1.922 3.056,-4.374 3.573,-7.039 0.876,-1.357 0.482,-0.641 1.172,-2.153 H 385.5 v 32.584 c -3.627,-0.143 -6.54,1.441 -9.192,3.724 -5.077,5.076 -5.077,13.308 0,18.384 2.482,2.459 5.72,3.748 9.192,3.748 V 202.5 h -31.56 c 0.234,-3.719 -1.301,-6.986 -3.748,-9.692 -2.274,-2.056 -4.847,-3.444 -7.946,-3.749 -4.497,0 -7.031,0.584 -10.438,3.749 -2.662,2.63 -3.749,6.034 -3.749,9.692 H 166.44 c 0.065,-3.33 -1.58,-6.294 -3.748,-8.692 -2.273,-2.056 -4.847,-3.444 -7.946,-3.749 -4.497,0 -7.031,0.584 -10.438,3.749 -2.247,2.336 -3.749,5.409 -3.749,8.692 H 10.5 v -33.06 c 3.719,0.234 6.986,-1.302 9.692,-3.748 5.077,-5.076 5.077,-13.308 0,-18.384 -2.273,-2.056 -4.847,-3.444 -7.946,-3.749 -1.649,0.033 -1.07,-0.029 -1.746,0.048 V 14.5 Z" />
    </g>
  </g>
  <g
     transform="matrix(1.2557984,0,0,1,-4.4466531,-3.7033349)"
     gorn="0.4"
     id="Layer_3">
    <g
       id="g20"
       transform="matrix(0.78056905,0,0,0.99859041,31.092771,0.20826846)">
      <path
         style="fill:#f5f6f7"
         id="path16"
         d="m 152,23.5 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
      <path
         style="fill-opacity:0;stroke:#274a88;stroke-width:3"
         id="path18"
         d="m 152,23.5 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
    </g>
    <g
       id="g26"
       transform="matrix(0.78056905,0,0,0.99859041,72.016643,0.20826846)">
      <path
         style="fill:#f5f6f7"
         id="path22"
         d="m 338.5,23.5 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
      <path
         style="fill-opacity:0;stroke:#274a88;stroke-width:3"
         id="path24"
         d="m 338.5,23.5 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
    </g>
    <g
       id="g32"
       transform="matrix(0.77941142,0,0,0.99685761,85.07358,0.66724484)">
      <path
         style="fill:#f5f6f7"
         id="path28"
         d="m 385.5,163 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
      <path
         style="fill-opacity:0;stroke:#274a88;stroke-width:3"
         id="path30"
         d="m 385.5,163 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
    </g>
    <g
       id="g38"
       transform="matrix(0.77794999,0,0,1.0000943,52.670676,2.6576792)">
      <path
         style="fill:#f5f6f7"
         id="path34"
         d="m 247.5,210 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
      <path
         style="fill-opacity:0;stroke:#274a88;stroke-width:3"
         id="path36"
         d="m 247.5,208.36652 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
    </g>
    <g
       id="g44"
       transform="matrix(0.77824301,0,0,0.99997126,10.799895,-1.3844364)">
      <path
         style="fill:#f5f6f7"
         id="path40"
         d="m 59,212.5 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
      <path
         style="fill-opacity:0;stroke:#274a88;stroke-width:3"
         id="path42"
         d="m 59,212.5 c -5.247,0 -9.5,-4.141 -9.5,-9.25 0,-5.109 4.253,-9.25 9.5,-9.25 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
    </g>
    <g
       id="g50"
       transform="matrix(0.77908882,0,0,0.99945156,3.1513528,0.10657977)">
      <path
         style="fill:#f5f6f7"
         id="path46"
         d="M 11.5,70.5 C 6.253,70.5 2,66.359 2,61.25 2,56.141 6.253,52 11.5,52 c 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
      <path
         style="fill-opacity:0;stroke:#274a88;stroke-width:3"
         id="path48"
         d="M 11.5,70.5 C 6.253,70.5 2,66.359 2,61.25 2,56.141 6.253,52 11.5,52 c 5.247,0 9.5,4.141 9.5,9.25 0,5.109 -4.253,9.25 -9.5,9.25 z" />
    </g>
  </g>
  <g
     transform="matrix(1.4010326,0,0,1.2886686,-6.6905295,-14.671738)"
     gorn="0.7"
     id="Layer_6">
    <g
       id="g266">
      <path
         style="fill:#303030"
         id="path132"
         d="m 332.69,109.33 c -1.081,0 -1.97,-0.889 -1.97,-1.969 V 69.289 c 0,-1.082 0.889,-1.972 1.97,-1.972 h 0.086 V 37.756 36.727 h -1.031 l -3.021,-3.021 V 32.654 H 327.673 30.504 29.452 v 1.052 l -3.018,3.019 h -1.032 v 1.029 29.563 h 0.086 c 1.082,0 1.971,0.89 1.971,1.972 v 38.072 c 0,1.08 -0.889,1.969 -1.971,1.969 h -0.086 v 29.561 1.031 h 1.032 l 3.021,3.021 v 1.053 h 1.052 297.167 1.051 v -1.053 l 3.021,-3.021 h 1.031 v -1.031 -29.561 z" />
      <g
         id="g140">
        <path
           class="cls-backlight"
           id="backlight"
           d="m 319.568,118.341 c 0,3.252 -2.663,5.915 -5.917,5.915 H 44.524 c -3.253,0 -5.915,-2.661 -5.915,-5.915 V 58.306 c 0,-3.252 2.662,-5.916 5.915,-5.916 h 269.127 c 3.254,0 5.917,2.664 5.917,5.916 z" />
        <g
           style="opacity:0.2"
           id="g138">
          <path
             style="fill:#22420d"
             id="path136"
             d="m 319.556,58.28 v 60.087 c 0,-0.009 0.004,-0.018 0.004,-0.029 V 58.306 c 0,-0.008 -0.004,-0.017 -0.004,-0.026 z M 44.524,52.394 c -3.251,0 -5.915,2.664 -5.915,5.915 v 60.036 c 0,3.25 2.664,5.915 5.915,5.915 h 3.428 c -3.253,0 -5.914,-2.665 -5.914,-5.915 V 60.279 c 0,-3.252 2.661,-5.914 5.914,-5.914 h 270.063 c -1.082,-1.198 -2.633,-1.975 -4.37,-1.975 H 44.524 Z" />
        </g>
      </g>
      <g
         id="g146">
        <path
           style="fill:#1a1a1a"
           id="path142"
           d="m 322.067,40.545 c 0,-1.083 -0.891,-1.969 -1.97,-1.969 H 38.081 c -1.08,0 -1.97,0.887 -1.97,1.969 v 1.086 c 0,1.082 0.89,1.969 1.97,1.969 h 282.015 c 1.077,0 1.969,-0.889 1.969,-1.969 v -1.086 z" />
        <path
           style="fill:#424242"
           id="path144"
           d="m 321.082,42.304 c 0,-0.712 -0.641,-1.297 -1.411,-1.297 H 38.623 c -0.775,0 -1.411,0.584 -1.411,1.297 0,0.714 0.636,1.298 1.411,1.298 h 281.048 c 0.774,-0.002 1.411,-0.585 1.411,-1.298 z" />
      </g>
      <g
         id="g152">
        <path
           style="fill:#1a1a1a"
           id="path148"
           d="m 322.067,134.082 c 0,-1.083 -0.891,-1.97 -1.97,-1.97 L 38.081,132.11 c -1.08,0 -1.97,0.889 -1.97,1.97 v 1.084 c 0,1.079 0.89,1.97 1.97,1.97 h 282.015 c 1.077,0 1.969,-0.891 1.969,-1.97 v -1.082 z" />
        <path
           style="fill:#424242"
           id="path150"
           d="m 321.082,135.841 c 0,-0.711 -0.641,-1.299 -1.411,-1.299 l -281.048,0.001 c -0.775,0 -1.411,0.584 -1.411,1.298 0,0.71 0.636,1.296 1.411,1.296 h 281.048 c 0.774,0 1.411,-0.584 1.411,-1.296 z" />
      </g>
      <g
         id="g158">
        <path
           style="fill-opacity:0;stroke:#f2f2f2;stroke-width:0.236;stroke-linecap:round;stroke-opacity:0.2"
           id="path154"
           d="m 27.063,37.439 3.115,-3.115" />
        <path
           style="fill-opacity:0;stroke:#f2f2f2;stroke-width:0.236;stroke-linecap:round;stroke-opacity:0.2"
           id="path156"
           d="m 30.209,143.31 -3.116,-3.118" />
      </g>
      <g
         id="g164">
        <path
           style="fill-opacity:0;stroke:#f2f2f2;stroke-width:0.236;stroke-linecap:round;stroke-opacity:0.2"
           id="path160"
           d="m 332.099,37.439 -3.117,-3.115" />
        <path
           style="fill-opacity:0;stroke:#f2f2f2;stroke-width:0.236;stroke-linecap:round;stroke-opacity:0.2"
           id="path162"
           d="m 328.953,143.31 3.115,-3.118" />
      </g>
      <path
         style="fill-opacity:0;stroke:#1a1a1a;stroke-width:1.41499996;stroke-opacity:0.4"
         id="path166"
         d="m 320.06,118.841 c 0,3.251 -2.662,5.915 -5.914,5.915 H 45.024 c -3.251,0 -5.915,-2.664 -5.915,-5.915 V 58.806 c 0,-3.251 2.664,-5.916 5.915,-5.916 h 269.121 c 3.251,0 5.912,2.665 5.912,5.916 z" />
      <g
         id="ecran"
         transform="matrix(1.0716702,0,0,1.1897414,-10.545562,-16.257935)">
        <path
           class="cls-case"
           id="case10"
           d="m 52.884,88.834 h 14.783 v 24.359 H 52.884 Z" />
        <path
           class="cls-case"
           id="case11"
           d="m 68.727,88.834 h 14.782 v 24.359 H 68.727 Z" />
        <path
           class="cls-case"
           id="case12"
           d="M 84.566,88.834 H 99.35 v 24.359 H 84.566 Z" />
        <path
           class="cls-case"
           id="case13"
           d="m 100.408,88.834 h 14.781 v 24.359 h -14.781 z" />
        <path
           class="cls-case"
           id="case14"
           d="m 116.253,88.834 h 14.78 v 24.359 h -14.78 z" />
        <path
           class="cls-case"
           id="case15"
           d="m 132.093,88.834 h 14.781 v 24.359 h -14.781 z" />
        <path
           class="cls-case"
           id="case16"
           d="m 147.934,88.834 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case17"
           d="m 163.775,88.834 h 14.783 v 24.359 h -14.783 z" />
        <path
           class="cls-case"
           id="case18"
           d="m 179.618,88.834 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case19"
           d="m 195.459,88.834 h 14.784 v 24.359 h -14.784 z" />
	<path
           class="cls-case"
           id="case110"
           d="m 211.301,88.834 h 14.779 v 24.359 h -14.779 z" />
        <path
           class="cls-case"
           id="case111"
           d="m 227.143,88.834 h 14.78 v 24.359 h -14.78 z" />
        <path
           class="cls-case"
           id="case112"
           d="m 242.985,88.834 h 14.779 v 24.359 h -14.779 z" />
        <path
           class="cls-case"
           id="case113"
           d="m 258.824,88.834 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case114"
           d="m 274.666,88.834 h 14.782 v 24.359 h -14.782 z" />
        <path
           class="cls-case"
           id="case115"
           d="m 290.508,88.834 h 14.783 v 24.359 h -14.783 z" />

	    <text
           id="case10_text"
           class="cls-textCase"
           x="52.857533"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case11_text"
           class="cls-textCase"
           x="68.726997"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>        
	    <text
           id="case12_text"
           class="cls-textCase"
           x="84.566002"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case13_text"
           class="cls-textCase"
           x="100.408"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case14_text"
           class="cls-textCase"
           x="116.253"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case15_text"
           class="cls-textCase"
           x="132.093"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case16_text"
           class="cls-textCase"
           x="147.93401"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case17_text"
           class="cls-textCase"
           x="163.77499"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case18_text"
           class="cls-textCase"
           x="179.618"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
	    <text
           id="case19_text"
           class="cls-textCase"
           x="195.459"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
	    <text
           id="case110_text"
           class="cls-textCase"
           x="211.30099"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
	    <text
           id="case111_text"
           class="cls-textCase"
           x="227.14301"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case112_text"
           class="cls-textCase"
           x="242.985"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case113_text"
           class="cls-textCase"
           x="258.82401"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case114_text"
           class="cls-textCase"
           x="274.66599"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case115_text"
           class="cls-textCase"
           x="290.508"
           y="112.93147"
           width="14.783"
           height="24.358999"> </text>


        <path
           class="cls-case"
           id="case00"
           d="M 52.884,63.452 H 67.667 V 87.811 H 52.884 Z" />
        <path
           class="cls-case"
           id="case01"
           d="M 68.727,63.452 H 83.509 V 87.811 H 68.727 Z" />
        <path
           class="cls-case"
           id="case02"
           d="M 84.566,63.452 H 99.35 V 87.811 H 84.566 Z" />
        <path
           class="cls-case"
           id="case03"
           d="m 100.408,63.452 h 14.781 v 24.359 h -14.781 z" />
        <path
           class="cls-case"
           id="case04"
           d="m 116.253,63.452 h 14.78 v 24.359 h -14.78 z" />
        <path
           class="cls-case"
           id="case05"
           d="m 132.093,63.452 h 14.781 v 24.359 h -14.781 z" />
        <path
           class="cls-case"
           id="case06"
           d="m 147.934,63.452 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case07"
           d="m 163.775,63.452 h 14.783 v 24.359 h -14.783 z" />
        <path
           class="cls-case"
           id="case08"
           d="m 179.618,63.452 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case09"
           d="m 195.459,63.452 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case010"
           d="M 211.301,63.452 H 226.08 V 87.811 H 211.301 Z" />
        <path
           class="cls-case"
           id="case011"
           d="m 227.143,63.452 h 14.78 v 24.359 h -14.78 z" />
        <path
           class="cls-case"
           id="case012"
           d="m 242.985,63.452 h 14.779 v 24.359 h -14.779 z" />
        <path
           class="cls-case"
           id="case013"
           d="m 258.824,63.452 h 14.784 v 24.359 h -14.784 z" />
        <path
           class="cls-case"
           id="case014"
           d="m 274.666,63.452 h 14.782 v 24.359 h -14.782 z" />
        <path
           class="cls-case"
           id="case015"
           d="m 290.508,63.452 h 14.783 v 24.359 h -14.783 z" />

	    <text
           id="case00_text"
           class="cls-textCase"
           x="52.857533"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case01_text"
           class="cls-textCase"
           x="68.726997"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>        
	    <text
           id="case02_text"
           class="cls-textCase"
           x="84.566002"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case03_text"
           class="cls-textCase"
           x="100.408"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case04_text"
           class="cls-textCase"
           x="116.253"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case05_text"
           class="cls-textCase"
           x="132.093"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case06_text"
           class="cls-textCase"
           x="147.93401"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case07_text"
           class="cls-textCase"
           x="163.77499"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case08_text"
           class="cls-textCase"
           x="179.618"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
	    <text
           id="case09_text"
           class="cls-textCase"
           x="195.459"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
	    <text
           id="case010_text"
           class="cls-textCase"
           x="211.30099"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
	    <text
           id="case011_text"
           class="cls-textCase"
           x="227.14301"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case012_text"
           class="cls-textCase"
           x="242.985"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case013_text"
           class="cls-textCase"
           x="258.82401"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case014_text"
           class="cls-textCase"
           x="274.66599"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>
        <text
           id="case015_text"
           class="cls-textCase"
           x="290.508"
           y="87.549469"
           width="14.783"
           height="24.358999"> </text>


      </g>
      <g
         id="g238">
        <path
           style="fill:#606060"
           id="path234"
           d="m 25.849,109.261 v 30.664 h 0.399 v -30.747 c -0.125,0.054 -0.266,0.055 -0.399,0.083 z" />
        <path
           style="fill:#606060"
           id="path236"
           d="M 26.246,67.471 V 36.722 h -0.397 v 30.671 c 0.133,0.024 0.274,0.027 0.397,0.078 z" />
      </g>
      <path
         style="fill:#606060"
         id="path240"
         d="m 29.455,33.105 h 299.264 v 0.396 H 29.455 Z" />
      <path
         style="fill:#212121"
         id="path242"
         d="m 29.455,32.659 h 299.264 v 0.449 H 29.455 Z" />
      <g
         id="g248">
        <path
           style="fill:#212121"
           id="path244"
           d="m 25.486,67.317 c 0.128,0 0.242,0.051 0.364,0.076 V 36.724 h -0.446 v 30.594 h 0.082 z" />
        <path
           style="fill:#212121"
           id="path246"
           d="m 25.486,109.33 h -0.082 v 30.595 h 0.448 v -30.664 c -0.124,0.021 -0.238,0.069 -0.366,0.069 z" />
      </g>
      <path
         style="fill:#212121"
         id="path250"
         d="M 29.455,143.55 H 328.719 V 144 H 29.455 Z" />
      <path
         style="fill:#606060"
         id="path252"
         d="m 29.455,143.161 h 299.264 v 0.395 H 29.455 Z" />
      <g
         id="g258">
        <path
           style="fill:#212121"
           id="path254"
           d="m 332.69,109.33 c -0.131,0 -0.245,-0.048 -0.368,-0.075 v 30.67 h 0.451 V 109.33 Z" />
        <path
           style="fill:#212121"
           id="path256"
           d="m 332.69,67.317 h 0.083 V 36.722 h -0.451 v 30.671 c 0.123,-0.025 0.238,-0.076 0.368,-0.076 z" />
      </g>
      <g
         id="g264">
        <path
           style="fill:#606060"
           id="path260"
           d="m 331.932,109.178 v 30.747 h 0.397 v -30.664 c -0.134,-0.028 -0.276,-0.029 -0.397,-0.083 z" />
        <path
           style="fill:#606060"
           id="path262"
           d="M 332.324,67.393 V 36.725 h -0.396 v 30.746 c 0.125,-0.051 0.267,-0.054 0.396,-0.078 z" />
      </g>
    </g>
  </g>
</svg>`;


}