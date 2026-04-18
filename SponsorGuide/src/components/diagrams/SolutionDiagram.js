import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, G } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function SolutionDiagram({ width = 340 }) {
  const svgHeight = 420;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Solution" width={width * 0.8} height={58} id="solution-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 340 420">
        {/* Outer circle */}
        <Circle cx="170" cy="210" r="160" stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Inscribed equilateral triangle — vertices on the circle (AA symbol) */}
        <Polygon
          points="170,50 31,290 309,290"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* POWER — top, between circle top and triangle apex */}
        <SvgText
          x="170"
          y="40"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#1A1A1A"
        >
          POWER
        </SvgText>

        {/* 12 Traditions on left edge of triangle */}
        <SvgText
          x="90"
          y="185"
          fontSize="13"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(-60 90 185)"
        >
          12 Traditions (1950)
        </SvgText>

        {/* Unity — outside left, between circle and triangle */}
        <SvgText
          x="48"
          y="165"
          fontSize="12"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(-60 48 165)"
        >
          Unity
        </SvgText>

        {/* 12 Concepts on right edge of triangle */}
        <SvgText
          x="250"
          y="185"
          fontSize="13"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(60 250 185)"
        >
          12 Concepts (1955)
        </SvgText>

        {/* Service — outside right, between circle and triangle */}
        <SvgText
          x="292"
          y="165"
          fontSize="12"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(60 292 165)"
        >
          Service
        </SvgText>

        {/* 12 STEPS — along bottom edge of triangle */}
        <SvgText
          x="170"
          y="282"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#1A1A1A"
        >
          12 STEPS (1939)
        </SvgText>

        {/* RECOVERY — between bottom of triangle and circle */}
        <SvgText
          x="170"
          y="345"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#1A1A1A"
        >
          RECOVERY
        </SvgText>
      </Svg>
    </View>
  );
}
