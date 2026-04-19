import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Text as SvgText } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function ProblemDiagram({ width = 340 }) {
  // Geometry — tall equilateral-ish triangle centered in viewBox
  // apex (170,30)  bottom-left (24,360)  bottom-right (316,360)
  // Left edge angle ≈ arctan((360-30)/(170-24)) = arctan(330/146) ≈ 66°
  const svgHeight = 440;
  const cx = 170;
  const ax = cx, ay = 30;      // apex
  const blx = 24, bly = 360;   // bottom-left
  const brx = 316, bry = 360;  // bottom-right

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Problem" width={width * 0.8} height={58} id="problem-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 340 440">

        {/* Triangle — dark navy stroke like reference */}
        <Polygon
          points={`${ax},${ay} ${blx},${bly} ${brx},${bry}`}
          stroke="#2C3E6B"
          strokeWidth="2.5"
          fill="none"
        />

        {/* ── BODY — large, outside left edge ── */}
        <SvgText
          x="46"
          y="260"
          textAnchor="middle"
          fontSize="38"
          fontWeight="900"
          fill="#1A1A1A"
          transform="rotate(-66 46 260)"
        >
          BODY
        </SvgText>

        {/* Allergy / Craving — inside, along left edge */}
        <SvgText
          x="128"
          y="230"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(-66 128 230)"
        >
          Allergy / Craving
        </SvgText>

        {/* ── WILL — large, outside right edge ── */}
        <SvgText
          x="294"
          y="260"
          textAnchor="middle"
          fontSize="38"
          fontWeight="900"
          fill="#1A1A1A"
          transform="rotate(66 294 260)"
        >
          WILL
        </SvgText>

        {/* Unmanageability / Malady — inside, along right edge */}
        <SvgText
          x="212"
          y="230"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(66 212 230)"
        >
          Unmanageability / Malady
        </SvgText>

        {/* Obsession / Delusion — centered along bottom edge */}
        <SvgText
          x={cx}
          y="348"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#1A1A1A"
        >
          Obsession / Delusion
        </SvgText>

        {/* ── MIND — very large, below triangle ── */}
        <SvgText
          x={cx}
          y="420"
          textAnchor="middle"
          fontSize="48"
          fontWeight="900"
          fill="#1A1A1A"
        >
          MIND
        </SvgText>
      </Svg>
    </View>
  );
}
