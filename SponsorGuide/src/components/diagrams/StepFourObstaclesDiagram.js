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
  const headLen = 12;
  const perpX = -uy;
  const perpY = ux;
  const baseX = x2 - ux * headLen;
  const baseY = y2 - uy * headLen;
  const leftX = baseX + perpX * 6;
  const leftY = baseY + perpY * 6;
  const rightX = baseX - perpX * 6;
  const rightY = baseY - perpY * 6;
  return (
    <G>
      <Line x1={x1} y1={y1} x2={baseX} y2={baseY} stroke="#6A9FD8" strokeWidth="4" />
      <Polygon points={`${x2},${y2} ${leftX},${leftY} ${rightX},${rightY}`} fill="#6A9FD8" />
    </G>
  );
}

export default function StepFourObstaclesDiagram({ width = 360 }) {
  const svgHeight = 420;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step Four" width={width * 0.75} height={58} id="step4-obst-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 360 420">

        {/* Title */}
        <SvgText x="180" y="32" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A">
          Name OBSTACLES / IMPEDIMENTS
        </SvgText>

        {/* ═══ Target boxes (arrow destinations) ═══ */}

        {/* RESENTMENTS — far left */}
        <Rect x="12" y="180" width="130" height="34" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="77" y="202" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1A1A1A">
          RESENTMENTS
        </SvgText>

        {/* FEARS — center-left */}
        <Rect x="100" y="110" width="80" height="34" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="140" y="132" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1A1A1A">
          FEARS
        </SvgText>

        {/* SEX — center */}
        <Rect x="175" y="75" width="58" height="32" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="204" y="96" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1A1A1A">
          SEX
        </SvgText>

        {/* DISHONESTY / SECRETS / GUILT* / SHAME* cluster — right */}
        <Rect x="228" y="60" width="120" height="105" rx="4" fill="white" stroke="#6A9FD8" strokeWidth="1.5" />
        <SvgText x="245" y="86" fontSize="14" fontWeight="600" fill="#1A1A1A">•  DISHONESTY</SvgText>
        <SvgText x="245" y="108" fontSize="14" fontWeight="600" fill="#1A1A1A">•  SECRETS</SvgText>
        <SvgText x="245" y="130" fontSize="14" fontWeight="600" fill="#1A1A1A">•  GUILT *</SvgText>
        <SvgText x="245" y="152" fontSize="14" fontWeight="600" fill="#1A1A1A">•  SHAME *</SvgText>

        {/* ═══ Arrows fanning upward from SELFishness bar ═══ */}
        <Arrow x1="80" y1="290" x2="77" y2="220" />
        <Arrow x1="140" y1="290" x2="140" y2="150" />
        <Arrow x1="195" y1="290" x2="204" y2="112" />
        <Arrow x1="280" y1="290" x2="288" y2="170" />

        {/* ═══ SELFishness - SELFcenteredness double-bordered bar ═══ */}
        <Rect
          x="18"
          y="295"
          width="324"
          height="50"
          rx="3"
          fill="white"
          stroke="#1A1A1A"
          strokeWidth="2.5"
        />
        <Rect
          x="10"
          y="287"
          width="340"
          height="66"
          rx="5"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1.5"
        />
        <SvgText x="180" y="328" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1A1A1A">
          SELFishness - SELFcenteredness
        </SvgText>

        {/* Footnote */}
        <SvgText x="18" y="390" fontSize="13" fontStyle="italic" fill="#555">
          * Not in "BigBook"
        </SvgText>
      </Svg>
    </View>
  );
}
