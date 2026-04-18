import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { sexConductInventory, COLORS } from '../data/content';

const tabs = [
  { key: 'instructions', label: 'Instructions' },
  { key: 'ideal', label: 'Future Ideal' },
];

export default function SexInventoryScreen() {
  const [activeTab, setActiveTab] = useState('instructions');
  const si = sexConductInventory;

  return (
    <ScreenWrapper>
      <SectionHeader title={si.title} subtitle={si.prayer} />

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
          {si.instructions.split('\n\n').filter(p => p.trim()).map((para, i) => {
            const isTitle = para === 'SEX INVENTORY WORKSHEET INSTRUCTIONS';
            if (isTitle) return null;

            return (
              <Card key={i}>
                <Text style={styles.paragraph}>{para}</Text>
              </Card>
            );
          })}

          <Card>
            <OrangeLabel text="THE 9 QUESTIONS (for each relationship)" />
            {[
              'Where had I been selfish?',
              'Where had I been dishonest?',
              'Where had I been inconsiderate?',
              'Whom did I hurt? (Look around the relationship — ie: parents, kids, brothers, sisters)',
              'Did I arouse jealousy?',
              'Did I arouse suspicion?',
              'Did I arouse bitterness?',
              'Where was I at fault?',
              'What should I have done instead?',
            ].map((q, i) => (
              <View key={i} style={styles.questionRow}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.questionText}>{q}</Text>
              </View>
            ))}
            <Divider />
            <Text style={styles.noteText}>
              NOTE: The answer to question 9 is never "I shouldn't have gotten involved in the first
              place." Refer to what you should have done, or how you should have behaved in the
              relationship.
            </Text>
          </Card>
        </>
      )}

      {activeTab === 'ideal' && (
        <>
          <Card>
            <Text style={styles.idealTitle}>{si.futureSexIdeal.title}</Text>
            <Divider />
            {si.futureSexIdeal.instructions.split('\n\n').filter(p => p.trim()).map((para, i) => (
              <Text key={i} style={[styles.paragraph, i > 0 && styles.paragraphSpaced]}>
                {para}
              </Text>
            ))}
          </Card>

          <Card>
            <OrangeLabel text="EXAMPLE — God, in the future I would like to be..." />
            {[
              'Considerate of my mate by treating them as a human being and not as objects of pleasure.',
              'Willing to encourage my mate to express their needs & hang ups.',
              'Willing to learn their sexual needs.',
              'Encouraging my mate to voice uncomfortable feelings.',
              'Truthful about my uncomfortable feelings.',
              'Clear on what we both want.',
              'Physically & mentally intimate with my mate.',
              'Clear on how we will disagree.',
              'Willing to set boundaries around what I will allow in my space and what they will allow in their space.',
              'Not seeking validation through performance.',
            ].map((item, i) => (
              <View key={i} style={styles.idealRow}>
                <View style={styles.idealNumber}>
                  <Text style={styles.idealNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.idealText}>{item}</Text>
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  tabActive: { backgroundColor: COLORS.orange },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  tabTextActive: { color: COLORS.white },
  paragraph: { fontSize: 15, color: COLORS.black, lineHeight: 23 },
  paragraphSpaced: { marginTop: 14 },
  idealTitle: { fontSize: 18, fontWeight: '700', color: COLORS.black, marginBottom: 8 },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  questionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  questionNumberText: { fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.orangeDark, fontSize: 13 },
  questionText: { flex: 1, fontSize: 15, color: COLORS.black, lineHeight: 22 },
  noteText: { fontSize: 13, color: COLORS.darkGray, fontStyle: 'italic', lineHeight: 20 },
  idealRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  idealNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  idealNumberText: { fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.orangeDark, fontSize: 13 },
  idealText: { flex: 1, fontSize: 15, color: COLORS.black, lineHeight: 22 },
});
