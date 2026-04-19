import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, Line } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepTwoDiagram({ width = 340 }) {
  // Geometry: circle centre (170,235), r=145
  // Inscribed triangle: apex (170,90), bl (42,350), br (298,350)
  const svgHeight = 440;
  const cxc = 170, cyc = 235, r = 145;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step Two" width={width * 0.8} height={58} id="step2-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 340 440">

        {/* "CHOICE ABOUT" header — red italic + black bold */}
        <SvgText x="28" y="38" fontSize="20" fontStyle="italic" fill="#C0392B" fontWeight="700">
          CHOICE
        </SvgText>
        <SvgText x="118" y="38" fontSize="20" fontWeight="900" fill="#1A1A1A">
          ABOUT
        </SvgText>

        {/* POWER — centred above circle */}
        <SvgText x={cxc} y="74" textAnchor="middle" fontSize="24" fontWeight="900" fill="#1A1A1A">
          POWER
        </SvgText>

        {/* Circle */}
        <Circle cx={cxc} cy={cyc} r={r} stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Inscribed triangle */}
        <Polygon
          points="170,90 42,350 298,350"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* *WILLINGNESS — inside triangle, above base */}
        <SvgText x={cxc} y="300" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A1A1A">
          *WILLINGNESS
        </SvgText>

        {/* Horizontal line along base for visual weight */}
        <Line x1="42" y1="350" x2="298" y2="350" stroke="#1A1A1A" strokeWidth="2" />

        {/* FAITH = My CHOICE! — below base line */}
        <SvgText x={cxc} y="375" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1A1A1A">
          FAITH = My CHOICE!
        </SvgText>

        {/* *Cornerstone footnote */}
        <SvgText x="28" y="420" fontSize="13" fontStyle="italic" fill="#555">
          *Cornerstone
        </SvgText>
      </Svg>
    </View>
  );
}
