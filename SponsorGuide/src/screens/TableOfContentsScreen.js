import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card } from '../components/SectionCard';
import { tableOfContents, COLORS } from '../data/content';

export default function TableOfContentsScreen() {
  return (
    <ScreenWrapper>
      <SectionHeader title="Table of Contents" subtitle="Sponsorship Guide — 50 sections" />
      <Card>
        {tableOfContents.map((item, i) => (
          <View key={i} style={[styles.row, i > 0 && styles.rowBorder]}>
            <View style={styles.numberBox}>
              <Text style={styles.number}>{item.number}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        ))}
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  numberBox: {
    minWidth: 40,
    marginRight: 12,
  },
  number: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.orange,
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
});
