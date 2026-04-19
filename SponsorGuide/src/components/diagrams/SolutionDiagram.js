import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, Line } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function SolutionDiagram({ width = 340 }) {
  // Geometry: circle at (170,200), r=150
  // Equilateral triangle inscribed in circle:
  //   apex = (170, 200-150) = (170, 50)
  //   bottom-left  = (170 - 150*sin60, 200 + 150*cos60) = (170-130, 200+75) = (40, 275)
  //   bottom-right = (170 + 130, 275) = (300, 275)
  // Edge angle = 60°
  const svgHeight = 400;
  const cxc = 170, cyc = 200, r = 150;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Solution" width={width * 0.8} height={58} id="solution-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 340 400">

        {/* Outer circle */}
        <Circle cx={cxc} cy={cyc} r={r} stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Inscribed equilateral triangle */}
        <Polygon
          points="170,50 40,275 300,275"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* ── Left edge: Unity (outside, near circle) then 12 Traditions (inside) ── */}
        {/* Unity — between circle and left edge, upper portion */}
        <SvgText
          x="68"
          y="185"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(-60 68 185)"
        >
          Unity
        </SvgText>

        {/* 12 Traditions (1950) — inside triangle along left edge, mid-to-lower */}
        <SvgText
          x="112"
          y="200"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(-60 112 200)"
        >
          12 Traditions (1950)
        </SvgText>

        {/* ── Right edge: Service (outside, near circle) then 12 Concepts (inside) ── */}
        {/* Service — between circle and right edge, upper portion */}
        <SvgText
          x="272"
          y="185"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(60 272 185)"
        >
          Service
        </SvgText>

        {/* 12 Concepts (1955) — inside triangle along right edge, mid-to-lower */}
        <SvgText
          x="228"
          y="200"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(60 228 200)"
        >
          12 Concepts (1955)
        </SvgText>

        {/* ── Bottom edge ── */}
        {/* 12 STEPS (1939) — just above bottom edge of triangle */}
        <SvgText
          x={cxc}
          y="265"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#1A1A1A"
        >
          12 STEPS (1939)
        </SvgText>

        {/* ── RECOVERY — between triangle base and circle bottom ── */}
        <SvgText
          x={cxc}
          y="330"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill="#1A1A1A"
        >
          RECOVERY
        </SvgText>
      </Svg>
    </View>
  );
}
