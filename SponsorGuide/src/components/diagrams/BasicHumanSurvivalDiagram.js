import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText, Polygon, Path, G, Line } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

function ArrowBox({ x, y, width, height, fill, label, fontSize = 13 }) {
  const pointWidth = 14;
  return (
    <G>
      <Polygon
        points={`${x},${y} ${x + width - pointWidth},${y} ${x + width},${y + height / 2} ${x + width - pointWidth},${y + height} ${x},${y + height} ${x + pointWidth},${y + height / 2}`}
        fill={fill}
        stroke="#000"
        strokeWidth="0.5"
      />
      <SvgText
        x={x + width / 2}
        y={y + height / 2 + 5}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill="white"
      >
        {label}
      </SvgText>
    </G>
  );
}

function DownArrow({ x, y, length }) {
  return (
    <G>
      <Line x1={x} y1={y} x2={x} y2={y + length - 6} stroke="#B5A56F" strokeWidth="2" />
      <Polygon
        points={`${x - 4},${y + length - 6} ${x + 4},${y + length - 6} ${x},${y + length}`}
        fill="#B5A56F"
      />
    </G>
  );
}

export default function BasicHumanSurvivalDiagram({ width = 360 }) {
  const svgHeight = 440;
  const col1X = 20;
  const col2X = 135;
  const col3X = 250;
  const boxW = 95;
  const boxH = 32;

  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Basic Human Survival" width={width * 0.9} height={58} id="survival-banner" />
      <Svg width={width} height={svgHeight} viewBox="0 0 360 440">
        {/* Row labels */}
        <SvgText x="0" y="90" fontSize="11" fontStyle="italic" fill="#1A1A1A">
          Instincts
        </SvgText>
        <SvgText x="0" y="185" fontSize="11" fontStyle="italic" fill="#1A1A1A">
          Reactions
        </SvgText>
        <SvgText x="0" y="280" fontSize="11" fontStyle="italic" fill="#1A1A1A">
          Emotions
        </SvgText>

        {/* Row 1: Instincts (brown) */}
        <ArrowBox x={col1X} y={75} width={boxW} height={boxH} fill="#8B5A2B" label="Fight" />
        <ArrowBox x={col2X} y={75} width={boxW} height={boxH} fill="#8B5A2B" label="Flight" />
        <ArrowBox x={col3X} y={75} width={boxW} height={boxH} fill="#8B5A2B" label="Freeze" />

        {/* Arrows down */}
        <DownArrow x={col1X + boxW / 2} y={115} length={50} />
        <DownArrow x={col2X + boxW / 2} y={115} length={50} />
        <DownArrow x={col3X + boxW / 2} y={115} length={50} />

        {/* Row 2: Reactions (dark red) */}
        <ArrowBox x={col1X} y={170} width={boxW} height={boxH} fill="#8B2131" label="Anger" />
        <ArrowBox x={col2X} y={170} width={boxW} height={boxH} fill="#8B2131" label="Fear" />
        <ArrowBox x={col3X} y={170} width={boxW} height={boxH} fill="#8B2131" label="Dishonesty" />

        {/* Arrows down */}
        <DownArrow x={col1X + boxW / 2} y={210} length={50} />
        <DownArrow x={col2X + boxW / 2} y={210} length={50} />
        <DownArrow x={col3X + boxW / 2} y={210} length={50} />

        {/* Row 3: Emotions (orange) */}
        <ArrowBox
          x={col1X}
          y={265}
          width={boxW}
          height={boxH}
          fill="#E87030"
          label="Resentment"
          fontSize={12}
        />
        <ArrowBox
          x={col2X}
          y={265}
          width={boxW}
          height={boxH}
          fill="#E87030"
          label="Fear/Anxiety"
          fontSize={11}
        />
        <ArrowBox
          x={col3X}
          y={265}
          width={boxW}
          height={boxH}
          fill="#E87030"
          label="Sex/Shame"
          fontSize={12}
        />

        {/* Converging arrows to SELF-Centered */}
        <Path d={`M ${col1X + boxW / 2} 305 L ${col1X + boxW / 2} 340 L 180 340 L 180 360`} stroke="#B5A56F" strokeWidth="2" fill="none" />
        <Path d={`M ${col2X + boxW / 2} 305 L ${col2X + boxW / 2} 360`} stroke="#B5A56F" strokeWidth="2" fill="none" />
        <Path d={`M ${col3X + boxW / 2} 305 L ${col3X + boxW / 2} 340 L 180 340`} stroke="#B5A56F" strokeWidth="2" fill="none" />
        <Polygon points="176,360 184,360 180,368" fill="#B5A56F" />

        {/* SELF-Centered box */}
        <Rect x="120" y="370" width="120" height="45" rx="3" fill="#8B5A2B" />
        <SvgText x="180" y="390" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
          SELF-
        </SvgText>
        <SvgText x="180" y="407" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
          Centered
        </SvgText>
      </Svg>

      {/* Footer */}
      <View style={{ marginTop: 8 }}>
        <Svg width={width} height={28}>
          <SvgText x={width / 2} y={20} textAnchor="middle" fontSize="16" fontWeight="700" fill="#1A1A1A">
            Step FOUR = EXACT NATURE
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}
