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
      public style = BUTTON_PAIR_STYLE;
      public element: SVGElement;
      public svgEl: SVGSVGElement;
      public defs: SVGElement[];
      public image: SVGSVGElement;
      
      private distanceSonarGradient: SVGLinearGradientElement;
      private distanceSonar: SVGRectElement;
      private distanceSonarText: SVGTextElement;
       
      private part: SVGElAndSize;
      private bus: EventBus;
      private state: DistanceSonarState;
      private btn: SVGGElement;

      private static dsmin = 0;
      private static dsmax = 2000;

   
      constructor() {
      }

      public init(bus: EventBus, state: DistanceSonarState, svgEl: SVGSVGElement, otherParams: Map<string>): void {
         this.state = state;
         this.bus = bus;
         this.initDom();
         this.updateState();
         this.attachEvents();
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

      getElement() {
         return this.element;
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

      private attachEvents() {
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
  id="distanceSonar"
  height="110"
  width="400"
  version="1.1"
  y="0"
  x="0"
  viewBox="0 0 400 110">

   <g

   <rect x="50" y="20" width="150" height="100"
   style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9" />

   </g>

   
</svg>`;

}