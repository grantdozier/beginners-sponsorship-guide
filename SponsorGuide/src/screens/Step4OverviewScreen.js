import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { StepFourObstaclesDiagram, BasicHumanSurvivalDiagram } from '../components/diagrams';
import WorkshopAudioPlayer from '../components/WorkshopAudioPlayer';
import { COLORS } from '../data/content';

export default function Step4OverviewScreen({ navigation }) {
  const { width } = Dimensions.get('window');
  const diagramWidth = Math.min(width - 40, 360);

  return (
    <ScreenWrapper>
      <SectionHeader title="Step Four" subtitle="Made a searching and fearless moral inventory" />

      <Card>
        <OrangeLabel text="STEP 4 OVERVIEW" />
        <Text style={styles.stepStatement}>
          "Made a searching and fearless moral inventory of ourselves."
        </Text>
        <Divider />
        <Text style={styles.paragraph}>
          The root of our problems is{' '}
          <Text style={styles.bold}>SELFISHNESS — SELF-CENTEREDNESS.</Text>
        </Text>
        <Text style={styles.paragraph}>
          Step Four = EXACT NATURE. We name the obstacles and impediments that block us from God.
        </Text>
      </Card>

      {/* Obstacles diagram */}
      <Card>
        <OrangeLabel text="OBSTACLES / IMPEDIMENTS" />
        <View style={styles.diagramContainer}>
          <StepFourObstaclesDiagram width={diagramWidth} />
        </View>
      </Card>

      {/* Human Survival diagram */}
      <Card>
        <OrangeLabel text="BASIC HUMAN SURVIVAL" />
        <View style={styles.diagramContainer}>
          <BasicHumanSurvivalDiagram width={diagramWidth} />
        </View>
      </Card>

      {/* Workshop audio recordings */}
      <Card>
        <OrangeLabel text="WORKSHOP RECORDINGS" />
        <Text style={styles.paragraph}>
          Before taking someone through Step 4, listen to these four workshop recordings.
          Study how each column works. Spend the most time on columns 3 and 4 — the 4th
          column is of absolute importance. By listening to these recordings, referring to
          the explanations in this guide, and taking sponsees through the process, your
          understanding and confidence will grow.
        </Text>
        <Divider />
        <WorkshopAudioPlayer />
      </Card>

      {/* Navigation to inventories */}
      <Card>
        <OrangeLabel text="STEP 4 INVENTORIES" />
        {[
          { title: 'Resentment Inventory', subtitle: 'Columns 1–4 with instructions & example', screen: 'ResentmentInventory' },
          { title: 'Fear Inventory', subtitle: 'Instructions, fears list & worksheets', screen: 'FearInventory' },
          { title: 'Sex Conduct Inventory', subtitle: 'Instructions & future sex ideal', screen: 'SexInventory' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.inventoryBtn, i > 0 && { marginTop: 10 }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.75}
          >
            <View style={styles.inventoryContent}>
              <Text style={styles.inventoryTitle}>{item.title}</Text>
              <Text style={styles.inventorySubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.inventoryArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  stepStatement: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.black,
    lineHeight: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 23,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
  },
  diagramContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  inventoryBtn: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  inventoryContent: {
    flex: 1,
  },
  inventoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  inventorySubtitle: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  inventoryArrow: {
    fontSize: 22,
    color: COLORS.mediumGray,
    marginLeft: 8,
  },
});
