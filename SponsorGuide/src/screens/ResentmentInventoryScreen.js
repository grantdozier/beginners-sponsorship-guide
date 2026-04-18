import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { resentmentInventory, COLORS } from '../data/content';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'col123', label: 'Col 1-2-3' },
  { key: 'col3detail', label: 'Col 3 Detail' },
  { key: 'col4', label: 'Col 4' },
  { key: 'example', label: 'Example' },
];

export default function ResentmentInventoryScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const ri = resentmentInventory;

  return (
    <ScreenWrapper>
      <SectionHeader title={ri.title} subtitle={ri.prayer} />

      {/* Tab bar */}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <Card>
            <OrangeLabel text="PURPOSE" />
            <Text style={styles.paragraph}>
              The Resentment Inventory is the foundation of Step 4. We list people, institutions, and
              principles with whom we are angry, why we are angry, what areas of self were affected,
              and our part in the situation.
            </Text>
          </Card>
          <Card>
            <OrangeLabel text="THE FOUR COLUMNS" />
            {[
              { col: 'Column 1', desc: 'I am resentful at: List the person, institution, or principle.' },
              { col: 'Column 2', desc: 'The cause: Why I am resentful — keep it brief.' },
              { col: 'Column 3', desc: 'Affects my: Which of the 7 areas of self were hurt or threatened.' },
              { col: 'Column 4', desc: 'My part: Where was I to blame before, during, and after?' },
            ].map((item, i) => (
              <View key={i} style={styles.columnRow}>
                <View style={styles.columnBadge}>
                  <Text style={styles.columnBadgeText}>{item.col}</Text>
                </View>
                <Text style={styles.columnDesc}>{item.desc}</Text>
              </View>
            ))}
          </Card>
          <Card>
            <OrangeLabel text="FIRST TIME INSTRUCTIONS" />
            <Text style={styles.paragraph}>
              Write down your <Text style={styles.bold}>top 5 current resentments</Text> on separate sheets.
              The remaining resentments will be done after completing Step 12.
            </Text>
            <Text style={[styles.paragraph, { marginTop: 10 }]}>
              The first time through Column 3, simply put a checkmark next to the areas of self that
              were hurt, threatened, or interfered with — then move directly to Column 4.
            </Text>
          </Card>
        </>
      )}

      {/* Columns 1-2-3 Tab */}
      {activeTab === 'col123' && (
        <>
          {ri.columns123Instructions.items.map((item, i) => (
            <Card key={i}>
              <View style={styles.letterBadge}>
                <Text style={styles.letterBadgeText}>{item.label}</Text>
              </View>
              <Text style={styles.paragraph}>{item.text}</Text>
            </Card>
          ))}
          <Card>
            <OrangeLabel text="7 AREAS OF SELF (Column 3)" />
            {ri.column3Areas.map((area, i) => (
              <View key={i} style={[styles.areaBlock, i > 0 && styles.areaBorder]}>
                <Text style={styles.areaName}>{area.name}</Text>
                <Text style={styles.areaPrompt}>{area.prompt}</Text>
              </View>
            ))}
          </Card>
        </>
      )}

      {/* Column 3 Detail Tab */}
      {activeTab === 'col3detail' && (
        <>
          <Card>
            <Text style={styles.sectionTitle}>Understanding Column 3</Text>
            <Text style={styles.paragraph}>
              Column 3 reveals the beliefs and fears behind your resentment. For each area of self,
              look at the opposite meaning of what you wrote — that reveals your fear.
            </Text>
          </Card>
          {ri.column3Understanding.sections.map((section, i) => (
            <Card key={i}>
              <Text style={styles.areaName}>{section.name}</Text>
              <Divider />
              <Text style={styles.paragraph}>{section.text}</Text>
            </Card>
          ))}
        </>
      )}

      {/* Column 4 Tab */}
      {activeTab === 'col4' && (
        <Card>
          <Text style={styles.sectionTitle}>{ri.column4Instructions.title}</Text>
          <Text style={styles.prayerText}>{ri.column4Instructions.prayer}</Text>
          <Divider />
          {ri.column4Instructions.content.split('\n\n').filter(p => p.trim()).map((para, i) => {
            const isHeader = para.toUpperCase() === para && para.length < 80 ||
              /^[A-Z-]+:/.test(para);
            return (
              <Text
                key={i}
                style={[
                  styles.paragraph,
                  i > 0 && styles.paragraphSpaced,
                  isHeader && styles.col4Header,
                ]}
              >
                {para}
              </Text>
            );
          })}
        </Card>
      )}

      {/* Example Tab */}
      {activeTab === 'example' && (
        <>
          <Card>
            <Text style={styles.sectionTitle}>{ri.mrBrownExample.title}</Text>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>I am resentful at:</Text>
              <Text style={styles.exampleValue}>{ri.mrBrownExample.resentful}</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>The Cause:</Text>
              <Text style={styles.exampleValue}>{ri.mrBrownExample.cause}</Text>
            </View>
          </Card>
          <Card>
            <OrangeLabel text="COLUMN 3 — 7 AREAS" />
            {[
              { area: 'Self Esteem', value: ri.mrBrownExample.column3.selfEsteem, fear: ri.mrBrownExample.column3.selfEsteamFear },
              { area: 'Pride', value: ri.mrBrownExample.column3.pride, fear: ri.mrBrownExample.column3.prideFear },
              { area: 'Ambition', value: ri.mrBrownExample.column3.ambition, fear: ri.mrBrownExample.column3.ambitionFear },
              { area: 'Security', value: ri.mrBrownExample.column3.security, fear: ri.mrBrownExample.column3.securityFear },
              { area: 'Personal Relations', value: ri.mrBrownExample.column3.personalRelations, fear: ri.mrBrownExample.column3.personalFear },
              { area: 'Sex Relations', value: ri.mrBrownExample.column3.sexRelations, fear: ri.mrBrownExample.column3.sexFear },
              { area: 'Pocket Book', value: ri.mrBrownExample.column3.pocketBook, fear: ri.mrBrownExample.column3.pocketFear },
            ].map((item, i) => (
              <View key={i} style={[styles.col3ExRow, i > 0 && styles.areaBorder]}>
                <Text style={styles.areaName}>{item.area}</Text>
                <Text style={styles.exampleValue}>{item.value}</Text>
                {item.fear && (
                  <Text style={styles.fearText}>Fear of being: {item.fear}</Text>
                )}
              </View>
            ))}
          </Card>
          <Card>
            <OrangeLabel text="COLUMN 4 — MY PART" />
            {[
              { label: 'The Realization', value: ri.mrBrownExample.realization },
              { label: 'Self-Seeking', value: ri.mrBrownExample.selfSeeking },
              { label: 'Selfish', value: ri.mrBrownExample.selfish },
              { label: 'Dishonest', value: ri.mrBrownExample.dishonest },
              { label: 'Afraid', value: ri.mrBrownExample.afraid },
              { label: 'Harm', value: ri.mrBrownExample.harm },
            ].map((item, i) => (
              <View key={i} style={[styles.col4Row, i > 0 && styles.areaBorder]}>
                <Text style={styles.col4Label}>{item.label}</Text>
                <Text style={styles.exampleValue}>{item.value}</Text>
              </View>
            ))}
          </Card>
        </>
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
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },
  tabActive: {
    backgroundColor: COLORS.orange,
  },
  tabText: {
    fontSize: 11,
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
  paragraphSpaced: {
    marginTop: 12,
  },
  bold: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
  },
  prayerText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  col4Header: {
    fontWeight: '700',
    color: COLORS.orange,
    marginTop: 8,
  },
  columnRow: {
    marginBottom: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.orange,
  },
  columnBadge: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  columnBadgeText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 13,
    letterSpacing: 1,
  },
  columnDesc: {
    fontSize: 14,
    color: COLORS.inkDark,
    lineHeight: 21,
  },
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  letterBadgeText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 15,
  },
  areaBlock: {
    paddingVertical: 10,
  },
  areaBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  areaName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.orange,
    marginBottom: 4,
  },
  areaPrompt: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  exampleRow: {
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 3,
  },
  exampleValue: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  col3ExRow: {
    paddingVertical: 10,
  },
  fearText: {
    fontSize: 13,
    color: COLORS.orange,
    fontStyle: 'italic',
    marginTop: 4,
  },
  col4Row: {
    paddingVertical: 10,
  },
  col4Label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
});
