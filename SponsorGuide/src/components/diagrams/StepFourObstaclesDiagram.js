import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Polygon, G } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

function Arrow({ x1, y1, x2, y2 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const headLen = 10;
  const perpX = -uy;
  const perpY = ux;
  const baseX = x2 - ux * headLen;
  const baseY = y2 - uy * headLen;
  const leftX = baseX + perpX * 5;
  const leftY = baseY + perpY * 5;
  const rightX = baseX - perpX * 5;
  const rightY = baseY - perpY * 5;
  return (
    <G>
      <Line x1={x1} y1={y1} x2={baseX} y2={baseY} stroke="#4A90E2" strokeWidth="3" />
      <Polygon points={`${x2},${y2} ${leftX},${leftY} ${rightX},${rightY}`} fill="#4A90E2" />
    </G>
  );
}

export default function StepFourObstaclesDiagram({ width = 360 }) {
  const svgHeight = 380;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step Four" width={width * 0.75} height={58} id="step4-obst-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 360 380">
        {/* Title */}
        <SvgText x="180" y="30" textAnchor="middle" fontSize="17" fontWeight="600" fill="#1A1A1A">
          Name OBSTACLES / IMPEDIMENTS
        </SvgText>

        {/* Top right cluster: DISHONESTY, SECRETS, GUILT*, SHAME* */}
        <Rect x="225" y="65" width="120" height="90" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="240" y="88" fontSize="13" fill="#1A1A1A">• DISHONESTY</SvgText>
        <SvgText x="240" y="108" fontSize="13" fill="#1A1A1A">• SECRETS</SvgText>
        <SvgText x="240" y="128" fontSize="13" fill="#1A1A1A">• GUILT*</SvgText>
        <SvgText x="240" y="148" fontSize="13" fill="#1A1A1A">• SHAME*</SvgText>

        {/* SEX box */}
        <Rect x="160" y="100" width="60" height="30" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="190" y="120" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1A1A1A">
          SEX
        </SvgText>

        {/* FEARS box */}
        <Rect x="95" y="130" width="70" height="30" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="130" y="150" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1A1A1A">
          FEARS
        </SvgText>

        {/* RESENTMENTS box */}
        <Rect x="10" y="175" width="115" height="30" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="67" y="195" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1A1A1A">
          RESENTMENTS
        </SvgText>

        {/* SELFishness - SELFcenteredness bar */}
        <Rect
          x="20"
          y="260"
          width="320"
          height="45"
          rx="2"
          fill="white"
          stroke="#1A1A1A"
          strokeWidth="2"
        />
        <Rect
          x="14"
          y="254"
          width="332"
          height="57"
          rx="2"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1"
        />
        <SvgText x="180" y="290" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A1A1A">
          SELFishness - SELFcenteredness
        </SvgText>

        {/* Arrows from bar upward */}
        <Arrow x1="70" y1="255" x2="70" y2="210" />
        <Arrow x1="140" y1="255" x2="140" y2="165" />
        <Arrow x1="200" y1="255" x2="200" y2="135" />
        <Arrow x1="285" y1="255" x2="285" y2="160" />

        {/* Footnote */}
        <SvgText x="20" y="345" fontSize="12" fontStyle="italic" fill="#555">
          * Not in "BigBook"
        </SvgText>
      </Svg>
    </View>
  );
}
