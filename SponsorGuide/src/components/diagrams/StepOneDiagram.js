import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, G, Rect, Line, Defs, Marker, Path } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepOneDiagram({ width = 360 }) {
  // Geometry: circle center (180,210), r=140
  // Equilateral triangle inscribed:
  //   apex = (180, 70)
  //   bl   = (59, 280)
  //   br   = (301, 280)
  const svgHeight = 480;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step One" width={width * 0.75} height={58} id="step1-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 360 480">
        <Defs>
          <Marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <Path d="M0,0 L10,3.5 L0,7 Z" fill="#4A72B8" />
          </Marker>
        </Defs>

        {/* Outer circle */}
        <Circle cx="180" cy="210" r="140" stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Yellow equilateral triangle inscribed in circle */}
        <Polygon
          points="180,70 59,280 301,280"
          fill="#E8C94A"
          stroke="#1A1A1A"
          strokeWidth="1.5"
        />

        {/* ═══ BODY box (top-left, on circle edge) ═══ */}
        <Rect x="75" y="76" width="72" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="111" y="96" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1A1A1A">
          BODY
        </SvgText>

        {/* ═══ WILL box (top-right, on circle edge) ═══ */}
        <Rect x="213" y="76" width="72" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="249" y="96" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1A1A1A">
          WILL
        </SvgText>

        {/* ═══ Left dashed arrow: BODY → ABSTINENCE ═══ */}
        <Line x1="85" y1="110" x2="30" y2="330" stroke="#4A72B8" strokeWidth="2.5" strokeDasharray="8,5" markerEnd="url(#arrowBlue)" />

        {/* Left arrow labels — HORIZONTAL, to the left of the arrow */}
        <SvgText x="2" y="145" fontSize="9" fontWeight="600" fill="#1A1A1A">Physical Defect</SvgText>
        <SvgText x="2" y="157" fontSize="9" fontWeight="600" fill="#1A1A1A">= ALLERGY</SvgText>
        <SvgText x="2" y="210" fontSize="9" fontWeight="600" fill="#1A1A1A">Phenomenon</SvgText>
        <SvgText x="2" y="222" fontSize="9" fontWeight="600" fill="#1A1A1A">of Craving</SvgText>
        <SvgText x="2" y="280" fontSize="9" fontWeight="600" fill="#1A1A1A">Compulsion</SvgText>

        {/* ═══ ABSTINENCE box (bottom-left) ═══ */}
        <Rect x="0" y="338" width="100" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="50" y="357" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A1A1A">
          ABSTINENCE
        </SvgText>

        {/* ═══ Right dashed arrow: WILL → Right ACTION ═══ */}
        <Line x1="275" y1="110" x2="330" y2="330" stroke="#4A72B8" strokeWidth="2.5" strokeDasharray="8,5" markerEnd="url(#arrowBlue)" />

        {/* Right arrow labels — HORIZONTAL, to the right of the arrow */}
        <SvgText x="298" y="140" fontSize="8" fontWeight="600" fill="#1A1A1A">Spiritual Defect =</SvgText>
        <SvgText x="298" y="152" fontSize="8" fontWeight="600" fill="#1A1A1A">UNMANAGEABILITY</SvgText>
        <SvgText x="305" y="185" fontSize="8" fontWeight="600" fill="#1A1A1A">Selfishness</SvgText>
        <SvgText x="305" y="210" fontSize="8" fontWeight="600" fill="#1A1A1A">Self-centeredness</SvgText>
        <SvgText x="310" y="240" fontSize="8" fontWeight="600" fill="#1A1A1A">Spiritual Malady</SvgText>
        <SvgText x="315" y="268" fontSize="8" fontWeight="600" fill="#1A1A1A">Transformation</SvgText>
        <SvgText x="320" y="296" fontSize="8" fontWeight="600" fill="#1A1A1A">OTHER/other</SvgText>
        <SvgText x="320" y="308" fontSize="8" fontWeight="600" fill="#1A1A1A">Centeredness</SvgText>

        {/* ═══ Right ACTION box (bottom-right) ═══ */}
        <Rect x="298" y="338" width="60" height="38" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="328" y="354" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          Right
        </SvgText>
        <SvgText x="328" y="369" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          ACTION
        </SvgText>

        {/* ═══ MIND box (bottom-left) ═══ */}
        <Rect x="30" y="400" width="68" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="64" y="419" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1A1A1A">
          MIND
        </SvgText>

        {/* ═══ Horizontal dashed arrow: MIND → Right THINKING ═══ */}
        <Line x1="102" y1="414" x2="294" y2="414" stroke="#4A72B8" strokeWidth="2.5" strokeDasharray="8,5" markerEnd="url(#arrowBlue)" />

        {/* Labels above / below horizontal arrow */}
        <SvgText x="115" y="408" fontSize="9" fontWeight="600" fill="#1A1A1A">Mental Defect =</SvgText>
        <SvgText x="115" y="432" fontSize="9" fontWeight="600" fill="#1A1A1A">OBSESSION</SvgText>
        <SvgText x="210" y="408" fontSize="9" fontWeight="600" fill="#1A1A1A">Delusion</SvgText>
        <SvgText x="255" y="408" fontSize="9" fontWeight="600" fill="#1A1A1A">Spiritual</SvgText>
        <SvgText x="255" y="432" fontSize="9" fontWeight="600" fill="#1A1A1A">Awakening</SvgText>

        {/* ═══ Right THINKING box (bottom-right) ═══ */}
        <Rect x="298" y="396" width="60" height="38" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="328" y="413" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          Right
        </SvgText>
        <SvgText x="328" y="428" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1A1A1A">
          THINKING
        </SvgText>
      </Svg>
    </View>
  );
}
