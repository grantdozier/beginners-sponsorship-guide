import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { fearInventory, COLORS } from '../data/content';

const tabs = [
  { key: 'instructions', label: 'Instructions' },
  { key: 'fears', label: 'Fears List' },
];

export default function FearInventoryScreen() {
  const [activeTab, setActiveTab] = useState('instructions');
  const fi = fearInventory;

  return (
    <ScreenWrapper>
      <SectionHeader title={fi.title} subtitle={fi.prayer} />

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'instructions' && (
        <>
          {fi.instructions.split('\n\n').filter(p => p.trim()).map((para, i) => {
            const isMainHeader = para === 'FEAR INVENTORY INSTRUCTIONS';
            if (isMainHeader) return null;

            const isNumbered = /^\d\)/.test(para);
            const isSubHeader = /^[A-Z\s]+:/.test(para) && para.length < 50;

            return (
              <Card key={i}>
                <Text style={[
                  styles.paragraph,
                  isSubHeader && styles.subHeader,
                ]}>
                  {para}
                </Text>
              </Card>
            );
          })}

          <Card>
            <OrangeLabel text="EXAMPLE FEAR CHAIN" />
            <Text style={styles.chainText}>
              not good enough → unwanted → alone → emotional pain → drinking → dying → unknown → no God → self-reliance fails
            </Text>
            <Divider />
            <Text style={styles.paragraph}>
              Each list should get smaller: 80 becomes 40, 40 becomes 15, 15 becomes 6, 6 becomes 1.
            </Text>
            <Text style={[styles.paragraph, { marginTop: 10 }]}>
              Note: If your lists aren't getting smaller each time it's a good indicator you don't understand.
            </Text>
          </Card>
        </>
      )}

      {activeTab === 'fears' && (
        <Card>
          <OrangeLabel text="TYPES OF FEARS — THE FEAR OF..." />
          <Text style={styles.fearsNote}>
            Use this list to help identify your fears during the Fear Inventory.
          </Text>
          <Divider />
          <View style={styles.fearsGrid}>
            {fi.fearsList.map((fear, i) => (
              <View key={i} style={styles.fearChip}>
                <Text style={styles.fearChipText}>{fear}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  tabActive: {
    backgroundColor: COLORS.orange,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 23,
  },
  subHeader: {
    fontWeight: '700',
    color: COLORS.orange,
  },
  chainText: {
    fontSize: 14,
    color: COLORS.orange,
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '600',
  },
  fearsNote: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  fearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fearChip: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  fearChipText: {
    fontSize: 13,
    color: COLORS.black,
  },
});
