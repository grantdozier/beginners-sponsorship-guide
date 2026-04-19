import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepTwoDiagram({ width = 340 }) {
  // ── Coordinate system ──
  // viewBox: 340 × 400    center-x = 170
  //
  // Circle:  center (170, 220),  r = 120
  //   top    = (170, 100)
  //   bottom = (170, 340)
  //
  // Equilateral triangle inscribed in circle:
  //   apex = (170, 220 − 120)          = (170, 100)
  //   bl   = (170 − 120·sin60, 220 + 120·cos60) = (170−104, 220+60) = (66, 280)
  //   br   = (170 + 104, 280)          = (274, 280)
  //
  // Triangle centroid y = (100+280+280)/3 ≈ 220
  // Gap below base to circle bottom: 340 − 280 = 60px  → FAITH text at y ≈ 316

  const cx = 170;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step Two" width={width * 0.8} height={58} id="step2-banner" />
      <Svg width={width} height={420} viewBox="0 0 340 420">

        {/* ── Header: CHOICE  ABOUT ── */}
        <SvgText x="50" y="32" fontSize="18" fontStyle="italic" fill="#C0392B" fontWeight="700">
          CHOICE
        </SvgText>
        <SvgText x="142" y="32" fontSize="18" fontWeight="900" fill="#1A1A1A">
          ABOUT
        </SvgText>

        {/* ── POWER — centered below header, above circle ── */}
        <SvgText x={cx} y="68" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1A1A1A">
          POWER
        </SvgText>

        {/* ── Circle ── */}
        <Circle cx={cx} cy="220" r="120" stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* ── Equilateral triangle inscribed in circle ── */}
        <Polygon
          points="170,100 66,280 274,280"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* ── *WILLINGNESS — at triangle centroid ── */}
        <SvgText x={cx} y="228" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A">
          *WILLINGNESS
        </SvgText>

        {/* ── FAITH = My CHOICE! — below circle ── */}
        <SvgText x={cx} y="370" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1A1A1A">
          FAITH = My CHOICE!
        </SvgText>

        {/* ── *Cornerstone footnote ── */}
        <SvgText x="28" y="405" fontSize="12" fontStyle="italic" fill="#555">
          *Cornerstone
        </SvgText>
      </Svg>
    </View>
  );
}
