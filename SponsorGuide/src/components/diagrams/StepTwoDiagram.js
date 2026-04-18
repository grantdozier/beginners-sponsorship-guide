import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepTwoDiagram({ width = 320 }) {
  const svgHeight = 420;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step Two" width={width * 0.8} height={58} id="step2-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 320 420">
        {/* "CHOICE ABOUT" subtitle */}
        <SvgText x="30" y="40" fontSize="16" fontStyle="italic" fill="#C0392B" fontWeight="700">
          CHOICE
        </SvgText>
        <SvgText x="105" y="40" fontSize="16" fontWeight="700" fill="#1A1A1A">
          ABOUT
        </SvgText>

        {/* POWER label */}
        <SvgText x="160" y="80" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1A1A1A">
          POWER
        </SvgText>

        {/* Circle */}
        <Circle cx="160" cy="240" r="140" stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Inscribed triangle — apex at POWER, base at bottom */}
        <Polygon
          points="160,100 40,350 280,350"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* WILLINGNESS */}
        <SvgText x="160" y="295" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1A1A1A">
          *WILLINGNESS
        </SvgText>

        {/* FAITH = My CHOICE */}
        <SvgText x="160" y="340" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1A1A1A">
          FAITH = My CHOICE!
        </SvgText>

        {/* Cornerstone footnote */}
        <SvgText x="30" y="395" fontSize="11" fontStyle="italic" fill="#555">
          *Cornerstone
        </SvgText>
      </Svg>
    </View>
  );
}
