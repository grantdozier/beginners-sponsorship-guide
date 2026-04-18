import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { characterDefects, COLORS } from '../data/content';

export default function CharacterDefectsScreen() {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? characterDefects.filter(d => d.toLowerCase().includes(search.toLowerCase()))
    : characterDefects;

  return (
    <ScreenWrapper>
      <SectionHeader title="Character Defects" subtitle="Reference list for Steps 5, 6 & 7" />

      <Card>
        <OrangeLabel text="PURPOSE" />
        <Text style={styles.intro}>
          Use this list to help identify the character defects that show up in your inventory. In
          Steps 6 & 7 you will review your inventory and make a list of what you want God to remove.
        </Text>
      </Card>

      <Card>
        <TextInput
          style={styles.searchInput}
          placeholder="Search character defects..."
          placeholderTextColor={COLORS.mediumGray}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.count}>{filtered.length} defects listed</Text>
        <Divider />
        <View style={styles.grid}>
          {filtered.map((defect, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{defect}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 23,
  },
  searchInput: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 10,
  },
  count: {
    fontSize: 13,
    color: COLORS.mediumGray,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.black,
  },
});
