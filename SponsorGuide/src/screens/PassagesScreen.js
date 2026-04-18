import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card } from '../components/SectionCard';
import { passages as passagesStructure, COLORS } from '../data/content';
import { passages as passageTexts } from '../data/passages';

function PassageItem({ item, expanded, onToggle }) {
  const text = passageTexts[item];
  const hasText = !!text;

  return (
    <View>
      <TouchableOpacity
        style={styles.itemRow}
        onPress={hasText ? onToggle : undefined}
        activeOpacity={hasText ? 0.65 : 1}
      >
        <Text style={styles.bullet}>{hasText ? (expanded ? '▾' : '▸') : '•'}</Text>
        <Text style={[styles.item, !hasText && styles.itemMuted]}>{item}</Text>
      </TouchableOpacity>
      {hasText && expanded && (
        <View style={styles.passageBox}>
          {text.split('\n\n').map((para, i) => (
            <Text key={i} style={[styles.passageText, i > 0 && styles.passageTextSpaced]}>
              {para}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

export default function PassagesScreen() {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScreenWrapper>
      <SectionHeader title={passagesStructure.title} subtitle={passagesStructure.subtitle} />

      <Card>
        <Text style={styles.note}>{passagesStructure.note}</Text>
        <Text style={styles.hint}>
          Tap any ▸ reference to read the Big Book passage inline.
        </Text>
      </Card>

      {passagesStructure.sections.map((section, si) => (
        <Card key={si}>
          <Text style={styles.sectionHeading}>{section.heading}</Text>

          {section.items &&
            section.items.map((item, ii) => (
              <PassageItem
                key={ii}
                item={item}
                expanded={!!expanded[`${si}-${ii}`]}
                onToggle={() => toggle(`${si}-${ii}`)}
              />
            ))}

          {section.subSections &&
            section.subSections.map((sub, ssi) => (
              <View key={ssi} style={styles.subSection}>
                <Text style={styles.subHeading}>{sub.heading}</Text>
                {sub.items.map((item, ii) => (
                  <PassageItem
                    key={ii}
                    item={item}
                    expanded={!!expanded[`${si}-${ssi}-${ii}`]}
                    onToggle={() => toggle(`${si}-${ssi}-${ii}`)}
                  />
                ))}
              </View>
            ))}
        </Card>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  note: {
    fontSize: 13,
    color: COLORS.darkGray,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: COLORS.orange,
    marginTop: 8,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.orange,
    marginBottom: 10,
  },
  subSection: {
    marginTop: 12,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  bullet: {
    fontSize: 14,
    color: COLORS.orange,
    marginRight: 8,
    marginTop: 2,
    width: 14,
    fontWeight: '700',
  },
  item: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 21,
  },
  itemMuted: {
    color: COLORS.darkGray,
  },
  passageBox: {
    backgroundColor: COLORS.offWhite,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginLeft: 22,
    marginTop: 4,
    marginBottom: 8,
  },
  passageText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  passageTextSpaced: {
    marginTop: 10,
  },
});
