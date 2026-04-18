import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Text as SvgText, Rect, Line, G, Path } from 'react-native-svg';
import DiagramBanner from './DiagramBanner';

export default function StepTenDiagram({ width = 360 }) {
  const svgHeight = 480;
  return (
    <View style={{ alignItems: 'center' }}>
      <DiagramBanner title="Our Way of Life — Step Ten" width={width} />

      <Svg width={width} height={svgHeight} viewBox="0 0 360 480">
        {/* Triangle */}
        <Polygon
          points="180,30 50,340 310,340"
          stroke="#1A1A1A"
          strokeWidth="2"
          fill="none"
        />

        {/* BODY label on left edge */}
        <SvgText
          x="90"
          y="190"
          fontSize="18"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(-66 90 190)"
        >
          BODY
        </SvgText>

        {/* WILL label on right edge */}
        <SvgText
          x="270"
          y="190"
          fontSize="18"
          fontWeight="700"
          fill="#1A1A1A"
          transform="rotate(66 270 190)"
        >
          WILL
        </SvgText>

        {/* Not Cured red tag */}
        <G transform="rotate(-20 300 85)">
          <Rect x="245" y="70" width="90" height="28" fill="#D94E4E" stroke="#8A2222" strokeWidth="1" />
          <SvgText x="290" y="90" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
            Not Cured
          </SvgText>
        </G>
        <Line x1="285" y1="100" x2="255" y2="140" stroke="#555" strokeWidth="1" />
        <Polygon points="250,145 264,132 258,144" fill="#555" />

        {/* MIND label at bottom */}
        <SvgText x="180" y="370" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A1A1A">
          MIND
        </SvgText>

        {/* Arrow from BODY area to RECOVERED */}
        <Line x1="50" y1="340" x2="50" y2="395" stroke="#1A1A1A" strokeWidth="1.5" />
        <Line x1="50" y1="395" x2="80" y2="395" stroke="#1A1A1A" strokeWidth="1.5" />

        {/* RECOVERED box */}
        <Rect x="40" y="390" width="100" height="30" rx="3" fill="#4CAF50" stroke="#2E6B30" strokeWidth="1" />
        <SvgText x="90" y="410" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
          RECOVERED
        </SvgText>

        {/* Arrow RECOVERED → Physical sobriety */}
        <Line x1="90" y1="420" x2="90" y2="440" stroke="#1A1A1A" strokeWidth="1.5" />
        <Polygon points="85,437 95,437 90,448" fill="#1A1A1A" />

        {/* Physical Sobriety box */}
        <Rect x="40" y="445" width="110" height="30" rx="3" fill="#4CAF50" stroke="#2E6B30" strokeWidth="1" />
        <SvgText x="95" y="464" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
          Physical sobriety
        </SvgText>
      </Svg>

      {/* Side text description */}
      <View style={styles.description}>
        <Text style={styles.descText}>
          We have a daily reprieve from <Text style={styles.italic}>SELF-WILL RUN RIOT</Text>{' '}
          contingent on the maintenance of our spiritual condition. Daily practice of steps 10, 11, & 12.
          Our way of life.
        </Text>
        <Text style={styles.descText}>
          <Text style={styles.bold}>RUN RIOT =</Text> Uncontrollable, wild behavior that creates{' '}
          <Text style={styles.bold}>CHAOS.</Text>
        </Text>
        <Text style={[styles.descText, { marginTop: 10 }]}>
          Steps 1-9 → Physical Sobriety{'\n'}
          Step 10 → Emotional Sobriety{'\n'}
          Step 11 → Spiritual Sobriety{'\n'}
          Step 12 → Spiritual Sobriety
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    paddingHorizontal: 16,
    marginTop: 10,
    width: '100%',
  },
  descText: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 19,
    marginBottom: 6,
  },
  italic: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
  bold: {
    fontWeight: '700',
  },
});
