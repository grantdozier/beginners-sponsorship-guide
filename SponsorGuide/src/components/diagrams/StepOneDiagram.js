import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, G, Rect, Line, Defs, Marker, Path } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepOneDiagram({ width = 380 }) {
  const svgHeight = 560;
  // Geometry: circle center (190,250), r=180
  // Triangle inscribed: apex(190,85), bl(40,415), br(340,415)
  // Left arrow angle ≈ 77°, right arrow angle ≈ 77°
  const cxc = 190, cyc = 250, rad = 180;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step One" width={width * 0.75} height={58} id="step1-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 380 560">
        <Defs>
          <Marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <Path d="M0,0 L10,3.5 L0,7 Z" fill="#4A72B8" />
          </Marker>
        </Defs>

        {/* Outer circle */}
        <Circle cx={cxc} cy={cyc} r={rad} stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Yellow filled triangle — inscribed in circle */}
        <Polygon
          points="190,85 40,415 340,415"
          fill="#E8C94A"
          stroke="#1A1A1A"
          strokeWidth="1.5"
        />

        {/* ═══ BODY box (top-left, straddling circle edge) ═══ */}
        <Rect x="72" y="78" width="80" height="34" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="112" y="102" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A">
          BODY
        </SvgText>

        {/* ═══ WILL box (top-right, straddling circle edge) ═══ */}
        <Rect x="228" y="78" width="80" height="34" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="268" y="102" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A">
          WILL
        </SvgText>

        {/* ═══ Left dashed arrow: BODY → ABSTINENCE ═══ */}
        <Line x1="95" y1="122" x2="32" y2="440" stroke="#4A72B8" strokeWidth="2.5" strokeDasharray="8,6" markerEnd="url(#arrowBlue)" />

        {/* Labels along left arrow */}
        <SvgText x="85" y="180" fontSize="11" fill="#1A1A1A" transform="rotate(-78 85 180)">
          Physical Defect = ALLERGY
        </SvgText>
        <SvgText x="68" y="280" fontSize="11" fill="#1A1A1A" transform="rotate(-78 68 280)">
          Phenomenon of Craving
        </SvgText>
        <SvgText x="52" y="375" fontSize="11" fill="#1A1A1A" transform="rotate(-78 52 375)">
          Compulsion
        </SvgText>

        {/* ═══ ABSTINENCE box (bottom-left, outside circle) ═══ */}
        <Rect x="0" y="446" width="110" height="32" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="55" y="468" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1A1A1A">
          ABSTINENCE
        </SvgText>

        {/* ═══ Right dashed arrow: WILL → Right ACTION ═══ */}
        <Line x1="285" y1="122" x2="348" y2="410" stroke="#4A72B8" strokeWidth="2.5" strokeDasharray="8,6" markerEnd="url(#arrowBlue)" />

        {/* Labels along right arrow — spaced evenly */}
        <SvgText x="290" y="168" fontSize="10" fill="#1A1A1A" transform="rotate(78 290 168)">
          Spiritual Defect =
        </SvgText>
        <SvgText x="296" y="192" fontSize="10" fill="#1A1A1A" transform="rotate(78 296 192)">
          UNMANAGEABILITY
        </SvgText>
        <SvgText x="308" y="240" fontSize="10" fill="#1A1A1A" transform="rotate(78 308 240)">
          Selfishness
        </SvgText>
        <SvgText x="314" y="268" fontSize="10" fill="#1A1A1A" transform="rotate(78 314 268)">
          Self-centeredness
        </SvgText>
        <SvgText x="324" y="310" fontSize="10" fill="#1A1A1A" transform="rotate(78 324 310)">
          Spiritual Malady
        </SvgText>
        <SvgText x="332" y="348" fontSize="10" fill="#1A1A1A" transform="rotate(78 332 348)">
          Transformation
        </SvgText>
        <SvgText x="340" y="378" fontSize="10" fill="#1A1A1A" transform="rotate(78 340 378)">
          OTHER/other
        </SvgText>
        <SvgText x="344" y="398" fontSize="10" fill="#1A1A1A" transform="rotate(78 344 398)">
          Centeredness
        </SvgText>

        {/* ═══ Right ACTION box (bottom-right) ═══ */}
        <Rect x="316" y="414" width="62" height="44" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="347" y="433" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
          Right
        </SvgText>
        <SvgText x="347" y="450" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
          ACTION
        </SvgText>

        {/* ═══ MIND box (bottom-left) ═══ */}
        <Rect x="55" y="486" width="72" height="32" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="91" y="508" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1A1A1A">
          MIND
        </SvgText>

        {/* ═══ Horizontal dashed arrow: MIND → Right THINKING ═══ */}
        <Line x1="130" y1="502" x2="312" y2="502" stroke="#4A72B8" strokeWidth="2.5" strokeDasharray="8,6" markerEnd="url(#arrowBlue)" />

        {/* Labels above / below horizontal arrow */}
        <SvgText x="145" y="495" fontSize="10" fill="#1A1A1A">
          Mental Defect =
        </SvgText>
        <SvgText x="145" y="520" fontSize="10" fill="#1A1A1A">
          OBSESSION
        </SvgText>
        <SvgText x="222" y="495" fontSize="10" fill="#1A1A1A">
          Delusion
        </SvgText>
        <SvgText x="268" y="495" fontSize="10" fill="#1A1A1A">
          Spiritual
        </SvgText>
        <SvgText x="268" y="520" fontSize="10" fill="#1A1A1A">
          Awakening
        </SvgText>

        {/* ═══ Right THINKING box (bottom-right) ═══ */}
        <Rect x="316" y="484" width="62" height="44" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
        <SvgText x="347" y="504" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
          Right
        </SvgText>
        <SvgText x="347" y="521" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          THINKING
        </SvgText>
      </Svg>
    </View>
  );
}
