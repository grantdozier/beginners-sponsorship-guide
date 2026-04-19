import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, Line } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function SolutionDiagram({ width = 340 }) {
  // Geometry: circle centred at (170,210), r=155
  // Inscribed equilateral triangle with base at bottom
  // apex = (170, 210-155) = (170,55)
  // bottom vertices at ±r*sin60 from cx, cy+r*cos60
  // sin60≈0.866, cos60=0.5  →  half-base = 134,  y = 210+77.5 = 287
  // bottom-left (36, 287)   bottom-right (304, 287)
  // Left edge angle ≈ arctan((287-55)/(170-36)) = arctan(232/134) ≈ 60°
  const svgHeight = 420;
  const cxc = 170, cyc = 210, r = 155;
  const ax = 170, ay = 55;
  const blx = 36, bly = 287;
  const brx = 304, bry = 287;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Solution" width={width * 0.8} height={58} id="solution-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 340 420">

        {/* Outer circle */}
        <Circle cx={cxc} cy={cyc} r={r} stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Inscribed equilateral triangle */}
        <Polygon
          points={`${ax},${ay} ${blx},${bly} ${brx},${bry}`}
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* ── Left edge labels (inside triangle, following edge) ── */}
        {/* Unity — smaller, closer to outside/circle */}
        <SvgText
          x="72"
          y="165"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(-60 72 165)"
        >
          Unity
        </SvgText>

        {/* 12 Traditions (1950) — along left edge inside */}
        <SvgText
          x="105"
          y="185"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(-60 105 185)"
        >
          12 Traditions (1950)
        </SvgText>

        {/* ── Right edge labels (inside triangle, following edge) ── */}
        {/* Service — smaller, closer to outside/circle */}
        <SvgText
          x="268"
          y="165"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(60 268 165)"
        >
          Service
        </SvgText>

        {/* 12 Concepts (1955) — along right edge inside */}
        <SvgText
          x="235"
          y="185"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#1A1A1A"
          transform="rotate(60 235 185)"
        >
          12 Concepts (1955)
        </SvgText>

        {/* ── Bottom edge ── */}
        {/* 12 STEPS (1939) — just above bottom edge */}
        <SvgText
          x={cxc}
          y="278"
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
          y="340"
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
