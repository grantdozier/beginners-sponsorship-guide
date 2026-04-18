import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText, G, Rect, Line, Defs, Marker, Path } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepOneDiagram({ width = 360 }) {
  const svgHeight = 520;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Step One" width={width * 0.75} height={58} id="step1-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 360 520">
        <Defs>
          <Marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <Path d="M0,0 L8,3 L0,6 Z" fill="#4A72B8" />
          </Marker>
        </Defs>

        {/* Outer circle */}
        <Circle cx="180" cy="240" r="175" stroke="#1A1A1A" strokeWidth="2" fill="none" />

        {/* Yellow filled triangle — inscribed in circle */}
        <Polygon
          points="180,80 28,400 332,400"
          fill="#F5C93F"
          stroke="#1A1A1A"
          strokeWidth="1"
        />

        {/* BODY label (top-left, on circle edge) */}
        <Rect x="68" y="82" width="72" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="104" y="102" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1A1A1A">
          BODY
        </SvgText>

        {/* WILL label (top-right, on circle edge) */}
        <Rect x="220" y="82" width="72" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="256" y="102" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1A1A1A">
          WILL
        </SvgText>

        {/* Dashed arrow BODY → ABSTINENCE (down-left) */}
        <Line x1="90" y1="120" x2="30" y2="420" stroke="#4A72B8" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arrowBlue)" />

        {/* Text labels along BODY → ABSTINENCE */}
        <SvgText x="100" y="160" fontSize="10" fill="#1A1A1A" transform="rotate(-75 100 160)">
          Physical Defect = ALLERGY
        </SvgText>
        <SvgText x="80" y="250" fontSize="10" fill="#1A1A1A" transform="rotate(-75 80 250)">
          Phenomenon of Craving
        </SvgText>
        <SvgText x="62" y="340" fontSize="10" fill="#1A1A1A" transform="rotate(-75 62 340)">
          Compulsion
        </SvgText>

        {/* ABSTINENCE box (bottom-left, outside circle) */}
        <Rect x="0" y="425" width="100" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="50" y="444" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A1A1A">
          ABSTINENCE
        </SvgText>

        {/* Dashed arrow WILL → Right ACTION (down-right) */}
        <Line x1="270" y1="120" x2="330" y2="390" stroke="#4A72B8" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arrowBlue)" />

        {/* Text labels along WILL → Right ACTION */}
        <SvgText x="258" y="150" fontSize="10" fill="#1A1A1A" transform="rotate(75 258 150)">
          Spiritual Defect =
        </SvgText>
        <SvgText x="264" y="170" fontSize="10" fill="#1A1A1A" transform="rotate(75 264 170)">
          UNMANAGEABILITY
        </SvgText>
        <SvgText x="278" y="210" fontSize="10" fill="#1A1A1A" transform="rotate(75 278 210)">
          Selfishness
        </SvgText>
        <SvgText x="284" y="235" fontSize="10" fill="#1A1A1A" transform="rotate(75 284 235)">
          Self-centeredness
        </SvgText>
        <SvgText x="296" y="275" fontSize="10" fill="#1A1A1A" transform="rotate(75 296 275)">
          Spiritual Malady
        </SvgText>
        <SvgText x="305" y="310" fontSize="10" fill="#1A1A1A" transform="rotate(75 305 310)">
          Transformation
        </SvgText>
        <SvgText x="314" y="345" fontSize="10" fill="#1A1A1A" transform="rotate(75 314 345)">
          OTHER/other
        </SvgText>
        <SvgText x="320" y="368" fontSize="10" fill="#1A1A1A" transform="rotate(75 320 368)">
          Centeredness
        </SvgText>

        {/* Right ACTION box (right side) */}
        <Rect x="310" y="392" width="48" height="40" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="334" y="407" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          Right
        </SvgText>
        <SvgText x="334" y="422" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          ACTION
        </SvgText>

        {/* MIND box (bottom-left of circle) */}
        <Rect x="60" y="435" width="62" height="28" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="91" y="454" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1A1A1A">
          MIND
        </SvgText>

        {/* Horizontal dashed arrow MIND → Right THINKING */}
        <Line x1="125" y1="449" x2="305" y2="449" stroke="#4A72B8" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arrowBlue)" />

        {/* Text labels along MIND → Right THINKING */}
        <SvgText x="140" y="443" fontSize="9" fill="#1A1A1A">
          Mental Defect=
        </SvgText>
        <SvgText x="140" y="468" fontSize="9" fill="#1A1A1A">
          OBSESSION
        </SvgText>
        <SvgText x="210" y="443" fontSize="9" fill="#1A1A1A">
          Delusion
        </SvgText>
        <SvgText x="253" y="443" fontSize="9" fill="#1A1A1A">
          Spiritual
        </SvgText>
        <SvgText x="253" y="468" fontSize="9" fill="#1A1A1A">
          Awakening
        </SvgText>

        {/* Right THINKING box (bottom-right) */}
        <Rect x="310" y="435" width="48" height="40" rx="3" fill="white" stroke="#1A1A1A" strokeWidth="1" />
        <SvgText x="334" y="451" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">
          Right
        </SvgText>
        <SvgText x="334" y="466" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1A1A1A">
          THINKING
        </SvgText>
      </Svg>
    </View>
  );
}
