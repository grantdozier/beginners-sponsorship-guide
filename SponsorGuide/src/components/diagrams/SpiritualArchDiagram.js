import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Text as SvgText, G, Line, Polygon } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function SpiritualArchDiagram({ width = 360 }) {
  const svgHeight = 460;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="SPIRITUAL ARCH" width={width * 0.85} height={58} id="arch-banner" />

      <Svg width={width} height={svgHeight} viewBox="0 0 360 460">
        {/* "... to AWAKENING ..." */}
        <SvgText x="40" y="35" fontSize="22" fontWeight="700" fill="#E87030" fontStyle="italic">
          ... to AWAKENING ...
        </SvgText>

        {/* Arch outer path */}
        <Path
          d="M 70 380 L 70 220 Q 70 120 180 120 Q 290 120 290 220 L 290 380"
          stroke="#E87030"
          strokeWidth="3"
          fill="none"
        />
        {/* Arch inner path */}
        <Path
          d="M 110 380 L 110 230 Q 110 170 180 170 Q 250 170 250 230 L 250 380"
          stroke="#E87030"
          strokeWidth="2"
          fill="none"
        />

        {/* Stone separators — left pillar */}
        <Line x1="70" y1="260" x2="110" y2="260" stroke="#E87030" strokeWidth="1.5" />
        <Line x1="70" y1="300" x2="110" y2="300" stroke="#E87030" strokeWidth="1.5" />
        <Line x1="70" y1="340" x2="110" y2="340" stroke="#E87030" strokeWidth="1.5" />

        {/* Stone separators — right pillar */}
        <Line x1="250" y1="260" x2="290" y2="260" stroke="#E87030" strokeWidth="1.5" />
        <Line x1="250" y1="300" x2="290" y2="300" stroke="#E87030" strokeWidth="1.5" />
        <Line x1="250" y1="340" x2="290" y2="340" stroke="#E87030" strokeWidth="1.5" />

        {/* Arch crown separators */}
        <Line x1="110" y1="200" x2="145" y2="155" stroke="#E87030" strokeWidth="1.5" />
        <Line x1="250" y1="200" x2="215" y2="155" stroke="#E87030" strokeWidth="1.5" />

        {/* Keystone at top */}
        <Path
          d="M 145 120 L 180 90 L 215 120 L 215 155 L 145 155 Z"
          fill="#FCE8CF"
          stroke="#E87030"
          strokeWidth="2"
        />
        <SvgText x="180" y="128" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1A1A1A">
          Keystone
        </SvgText>
        <SvgText x="180" y="141" textAnchor="middle" fontSize="9" fill="#1A1A1A">
          Step 3 =
        </SvgText>
        <SvgText x="180" y="152" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1A1A1A">
          Decision to Turn
        </SvgText>

        {/* Left side labels (Resentment, Fear) */}
        <SvgText x="60" y="170" fontSize="12" fontWeight="700" fill="#1A1A1A" transform="rotate(-18 60 170)">
          Fear
        </SvgText>
        <SvgText x="80" y="245" fontSize="12" fontWeight="700" fill="#1A1A1A">
          Resentment
        </SvgText>

        {/* Right side labels (Sex, Dishonesty) */}
        <SvgText x="280" y="170" fontSize="12" fontWeight="700" fill="#1A1A1A" transform="rotate(18 280 170)">
          Sex
        </SvgText>
        <SvgText x="258" y="245" fontSize="12" fontWeight="700" fill="#1A1A1A">
          Dishonesty
        </SvgText>
        <SvgText x="260" y="258" fontSize="12" fontWeight="700" fill="#1A1A1A">
          Secrets
        </SvgText>

        {/* Step 2 = Willingness label (arrow on left pillar) */}
        <SvgText x="10" y="340" fontSize="11" fontWeight="700" fill="#1A1A1A">
          Step 2 =
        </SvgText>
        <SvgText x="10" y="354" fontSize="11" fontWeight="700" fill="#1A1A1A">
          Willingness
        </SvgText>
        <Polygon points="60,358 72,358 66,370" fill="#E87030" />

        {/* Cornerstone */}
        <SvgText x="20" y="395" fontSize="12" fontWeight="700" fill="#1A1A1A">
          Cornerstone
        </SvgText>

        {/* Step 5 label on right pillar */}
        <SvgText x="295" y="395" fontSize="12" fontWeight="700" fill="#1A1A1A">
          Step 5
        </SvgText>

        {/* Foundation bar */}
        <Rect x="50" y="380" width="260" height="28" fill="none" stroke="#E87030" strokeWidth="2" />
        <SvgText x="180" y="400" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
          Foundation  Step 1 = Defeat
        </SvgText>

        {/* ~ FREEDOM */}
        <SvgText x="215" y="445" fontSize="24" fontWeight="700" fill="#E87030" fontStyle="italic">
          ~ FREEDOM
        </SvgText>
      </Svg>
    </View>
  );
}
