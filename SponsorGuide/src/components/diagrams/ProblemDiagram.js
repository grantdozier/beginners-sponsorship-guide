import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Text as SvgText, G, Rect, TSpan } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function ProblemDiagram({ width = 340 }) {
  const svgHeight = 420;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Problem" width={width * 0.8} height={58} id="problem-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 340 420">
        {/* Triangle outline */}
        <Polygon
          points="170,50 40,340 300,340"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* BODY label — outside left of triangle */}
        <SvgText
          x="58"
          y="250"
          textAnchor="middle"
          fontSize="28"
          fontWeight="900"
          fill="#1A1A1A"
          transform="rotate(-69 58 250)"
        >
          BODY
        </SvgText>

        {/* Allergy/Craving along left edge, inside triangle */}
        <SvgText
          x="120"
          y="220"
          fontSize="12"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(-66 120 220)"
        >
          Allergy / Craving
        </SvgText>

        {/* WILL label — outside right of triangle */}
        <SvgText
          x="282"
          y="250"
          textAnchor="middle"
          fontSize="28"
          fontWeight="900"
          fill="#1A1A1A"
          transform="rotate(69 282 250)"
        >
          WILL
        </SvgText>

        {/* Unmanageability/Malady along right edge, inside triangle */}
        <SvgText
          x="210"
          y="220"
          fontSize="11"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(66 210 220)"
        >
          Unmanageability / Malady
        </SvgText>

        {/* Obsession/Delusion along bottom edge */}
        <SvgText
          x="170"
          y="328"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#1A1A1A"
        >
          Obsession/ Delusion
        </SvgText>

        {/* MIND label — below triangle */}
        <SvgText
          x="170"
          y="385"
          textAnchor="middle"
          fontSize="32"
          fontWeight="900"
          fill="#1A1A1A"
        >
          MIND
        </SvgText>
      </Svg>
    </View>
  );
}
