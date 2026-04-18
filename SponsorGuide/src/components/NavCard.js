import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Polygon, Path, Line, Rect, G } from 'react-native-svg';
import { COLORS } from '../data/content';

/**
 * Small decorative SVG glyph shown on the left of each home card.
 * Replaces emojis with hand-drawn vector marks in the theme's orange.
 */
function Ornament({ type }) {
  const size = 28;
  const stroke = COLORS.orangeDark;

  const shapes = {
    book: (
      <G>
        <Path d="M4 6 Q14 3 24 6 L24 22 Q14 19 4 22 Z" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Line x1="14" y1="5" x2="14" y2="21" stroke={stroke} strokeWidth="1" />
      </G>
    ),
    quote: (
      <G>
        <Path d="M7 8 Q7 14 11 16" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Path d="M9 8 L9 12 L13 12" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Path d="M15 8 Q15 14 19 16" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Path d="M17 8 L17 12 L21 12" stroke={stroke} strokeWidth="1.4" fill="none" />
      </G>
    ),
    triangleCircle: (
      <G>
        <Circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Polygon points="14,7 7,20 21,20" stroke={stroke} strokeWidth="1.2" fill="none" />
      </G>
    ),
    steps123: (
      <G>
        <Rect x="4" y="16" width="6" height="6" stroke={stroke} strokeWidth="1.3" fill="none" />
        <Rect x="11" y="11" width="6" height="11" stroke={stroke} strokeWidth="1.3" fill="none" />
        <Rect x="18" y="6" width="6" height="16" stroke={stroke} strokeWidth="1.3" fill="none" />
      </G>
    ),
    inventory: (
      <G>
        <Rect x="5" y="4" width="18" height="20" rx="1" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Line x1="8" y1="9" x2="20" y2="9" stroke={stroke} strokeWidth="1.1" />
        <Line x1="8" y1="13" x2="20" y2="13" stroke={stroke} strokeWidth="1.1" />
        <Line x1="8" y1="17" x2="16" y2="17" stroke={stroke} strokeWidth="1.1" />
      </G>
    ),
    scroll: (
      <G>
        <Path d="M6 5 Q6 3 8 3 L20 3 Q22 3 22 5 L22 22 Q22 24 20 24 L8 24 Q6 24 6 22 Z" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Line x1="9" y1="9" x2="19" y2="9" stroke={stroke} strokeWidth="1.1" />
        <Line x1="9" y1="13" x2="19" y2="13" stroke={stroke} strokeWidth="1.1" />
        <Line x1="9" y1="17" x2="15" y2="17" stroke={stroke} strokeWidth="1.1" />
      </G>
    ),
    shield: (
      <G>
        <Path d="M14 3 L23 7 L23 14 Q23 21 14 25 Q5 21 5 14 L5 7 Z" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Path d="M10 13 L13 16 L18 10" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ),
    hearts: (
      <G>
        <Path d="M10 22 C4 18 4 11 9 11 C11 11 12 13 13 14 C14 13 15 11 17 11 C22 11 22 18 16 22 Z" stroke={stroke} strokeWidth="1.3" fill="none" />
      </G>
    ),
    archway: (
      <G>
        <Path d="M5 23 L5 12 Q5 5 14 5 Q23 5 23 12 L23 23" stroke={stroke} strokeWidth="1.5" fill="none" />
        <Path d="M9 23 L9 13 Q9 9 14 9 Q19 9 19 13 L19 23" stroke={stroke} strokeWidth="1.1" fill="none" />
      </G>
    ),
    list: (
      <G>
        <Circle cx="7" cy="8" r="1.5" fill={stroke} />
        <Circle cx="7" cy="14" r="1.5" fill={stroke} />
        <Circle cx="7" cy="20" r="1.5" fill={stroke} />
        <Line x1="12" y1="8" x2="22" y2="8" stroke={stroke} strokeWidth="1.2" />
        <Line x1="12" y1="14" x2="22" y2="14" stroke={stroke} strokeWidth="1.2" />
        <Line x1="12" y1="20" x2="20" y2="20" stroke={stroke} strokeWidth="1.2" />
      </G>
    ),
    handshake: (
      <G>
        <Path d="M4 14 L9 9 L13 13 L18 9 L24 14 L20 20 L4 20 Z" stroke={stroke} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
        <Line x1="13" y1="13" x2="16" y2="16" stroke={stroke} strokeWidth="1.3" />
      </G>
    ),
    cycle: (
      <G>
        <Path d="M6 14 A8 8 0 1 1 14 22" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Polygon points="10,20 16,22 14,16" fill={stroke} />
      </G>
    ),
    sun: (
      <G>
        <Circle cx="14" cy="14" r="5" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Line x1="14" y1="3" x2="14" y2="6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="14" y1="22" x2="14" y2="25" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="3" y1="14" x2="6" y2="14" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="22" y1="14" x2="25" y2="14" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="6" y1="6" x2="8" y2="8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="20" y1="20" x2="22" y2="22" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="6" y1="22" x2="8" y2="20" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="20" y1="8" x2="22" y2="6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      </G>
    ),
    heart: (
      <G>
        <Path d="M14 23 C7 18 4 13 4 10 C4 7 6 5 9 5 C11 5 13 6 14 8 C15 6 17 5 19 5 C22 5 24 7 24 10 C24 13 21 18 14 23 Z" stroke={stroke} strokeWidth="1.4" fill="none" />
      </G>
    ),
    index: (
      <G>
        <Rect x="4" y="5" width="20" height="18" rx="1" stroke={stroke} strokeWidth="1.4" fill="none" />
        <Line x1="4" y1="10" x2="24" y2="10" stroke={stroke} strokeWidth="1.1" />
        <Line x1="8" y1="14" x2="20" y2="14" stroke={stroke} strokeWidth="1.1" />
        <Line x1="8" y1="18" x2="16" y2="18" stroke={stroke} strokeWidth="1.1" />
      </G>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      {shapes[type] || shapes.book}
    </Svg>
  );
}

export default function NavCard({ number, title, subtitle, ornament, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftAccent} />
      <View style={styles.ornamentWrap}>
        <Ornament type={ornament} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          {number !== undefined && <Text style={styles.number}>{number}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 10,
    paddingVertical: 14,
    paddingLeft: 22,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#7A4A20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.orange,
  },
  ornamentWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  number: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.orangeDark,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 17,
    color: COLORS.inkDark,
    flex: 1,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#6B5842',
    marginTop: 2,
  },
  chevron: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 28,
    color: COLORS.orange,
    marginLeft: 8,
    marginTop: -2,
  },
});
