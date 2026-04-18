import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import FormField from '../components/FormField';
import { resentmentInventory, COLORS } from '../data/content';
import {
  loadInventory,
  saveInventory,
  emptyResentmentInventory,
  emptyResentmentEntry,
} from '../storage/inventoryStore';

// Area prompts copied verbatim from Bobby's worksheet (PDF 2.9, page 23).
const AREAS = [
  {
    key: 'self_esteem',
    label: 'Self Esteem',
    prompt: 'How I see or feel about myself. "The role I\'ve assigned myself."',
    starters: 'Start sentences with — "I am…"',
    example: 'Example: "I am the best husband she could have."',
  },
  {
    key: 'pride',
    label: 'Pride',
    prompt: 'How I think others see me or feel about me. "The role I\'ve assigned others."',
    starters: 'Start sentences with — "Others should…" or "No one should…" or "Others can…"',
  },
  {
    key: 'ambition',
    label: 'Ambition',
    prompt: 'What I want to happen here.',
    starters: 'Start sentences with — "I want…"',
  },
  {
    key: 'security',
    label: 'Security',
    prompt: 'What I need here, to be okay.',
    starters: 'Start sentences with — "I need…to be okay."',
  },
  {
    key: 'personal_relations',
    label: 'Personal Relations',
    prompt: 'My deep-seated beliefs of how this relationship is supposed to look.',
    starters: '"Wives trust their husbands." "Mothers respect their sons\' choices." "Real friends always agree with me."',
  },
  {
    key: 'sex_relations',
    label: 'Sex Relations',
    prompt: 'My deep-seated beliefs of how real men and/or women are supposed to be.',
    starters: 'Start sentences with — "A real man…" and/or "A real woman…"',
  },
  {
    key: 'pocket_book',
    label: 'Pocket Book',
    prompt: 'Affects my finances.',
    starters: 'Start sentences with — "No one (can, should, shouldn\'t)…" or "Others (can, should, shouldn\'t)…"',
  },
];

const tabs = [
  { key: 'my', label: 'My Inventory' },
  { key: 'how', label: 'How-To' },
  { key: 'example', label: 'Example' },
];

export default function ResentmentInventoryScreen() {
  const [activeTab, setActiveTab] = useState('my');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const saveTimer = useRef(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const stored = await loadInventory('resentment');
      setData(stored || emptyResentmentInventory());
      setLoading(false);
    })();
  }, []);

  // Debounced auto-save: 600ms after the last change
  useEffect(() => {
    if (loading || !data) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveInventory('resentment', data).catch((e) => console.warn('save failed', e));
    }, 600);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [data, loading]);

  const updateEntry = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      resentments: prev.resentments.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const updateCol3 = useCallback((id, area, rowIdx, field, value) => {
    setData((prev) => ({
      ...prev,
      resentments: prev.resentments.map((r) => {
        if (r.id !== id) return r;
        const rows = Array.isArray(r.col3[area])
          ? r.col3[area]
          : [{ text: '', fear: '' }, { text: '', fear: '' }, { text: '', fear: '' }];
        return {
          ...r,
          col3: {
            ...r.col3,
            [area]: rows.map((row, i) => (i === rowIdx ? { ...row, [field]: value } : row)),
          },
        };
      }),
    }));
  }, []);

  const updateCol4 = useCallback((id, field, value) => {
    setData((prev) => ({
      ...prev,
      resentments: prev.resentments.map((r) =>
        r.id !== id ? r : { ...r, col4: { ...r.col4, [field]: value } },
      ),
    }));
  }, []);

  const addEntry = useCallback(() => {
    setData((prev) => {
      const entry = emptyResentmentEntry();
      setExpandedId(entry.id);
      return { ...prev, resentments: [...prev.resentments, entry] };
    });
  }, []);

  const deleteEntry = useCallback((id) => {
    Alert.alert('Delete this resentment?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setData((prev) => ({
            ...prev,
            resentments: prev.resentments.filter((r) => r.id !== id),
          }));
          if (expandedId === id) setExpandedId(null);
        },
      },
    ]);
  }, [expandedId]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={COLORS.orange} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Resentment Inventory"
        subtitle='"God please help me see the truth about my resentments"'
      />

      {/* Tabs */}
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

      {activeTab === 'my' && (
        <MyInventoryTab
          entries={data.resentments}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          updateEntry={updateEntry}
          updateCol3={updateCol3}
          updateCol4={updateCol4}
          addEntry={addEntry}
          deleteEntry={deleteEntry}
        />
      )}

      {activeTab === 'how' && <HowToTab />}
      {activeTab === 'example' && <ExampleTab />}
    </ScreenWrapper>
  );
}

// =============================================================
// "My Inventory" tab — the actual writable form
// =============================================================

function MyInventoryTab({
  entries,
  expandedId,
  setExpandedId,
  updateEntry,
  updateCol3,
  updateCol4,
  addEntry,
  deleteEntry,
}) {
  return (
    <>
      <Card>
        <OrangeLabel text="YOUR RESENTMENT LIST" />
        <Text style={styles.hint}>
          List the top 5 current resentments. One person, institution, or principle per card.
          Tap a card to expand and fill in columns 2, 3, and 4.
        </Text>
        {entries.length === 0 && (
          <Text style={styles.emptyState}>
            No resentments yet. Tap below to add your first one.
          </Text>
        )}
      </Card>

      {entries.map((entry, i) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          index={i}
          expanded={expandedId === entry.id}
          onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          updateEntry={updateEntry}
          updateCol3={updateCol3}
          updateCol4={updateCol4}
          onDelete={() => deleteEntry(entry.id)}
        />
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addEntry} activeOpacity={0.8}>
        <Text style={styles.addBtnPlus}>＋</Text>
        <Text style={styles.addBtnText}>Add another resentment</Text>
      </TouchableOpacity>
    </>
  );
}

function Col3Row({ index, row, onTextChange, onFearChange }) {
  return (
    <View style={styles.col3Row}>
      <Text style={styles.col3RowNum}>{index + 1}.</Text>
      <TextInput
        style={styles.col3Input}
        value={row.text}
        onChangeText={onTextChange}
        placeholder="Write your sentence here…"
        placeholderTextColor={COLORS.mediumGray}
        multiline
        textAlignVertical="top"
      />
      <View style={styles.col3FearWrap}>
        <Text style={styles.col3Paren}>(</Text>
        <TextInput
          style={styles.col3FearInput}
          value={row.fear}
          onChangeText={onFearChange}
          placeholder="fear of…"
          placeholderTextColor={COLORS.mediumGray}
        />
        <Text style={styles.col3Paren}>)</Text>
      </View>
    </View>
  );
}

function EntryCard({ entry, index, expanded, onToggle, updateEntry, updateCol3, updateCol4, onDelete }) {
  const displayName = entry.col1_person || `Resentment #${index + 1}`;
  return (
    <Card>
      <TouchableOpacity style={styles.entryHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.entryIndex}>
          <Text style={styles.entryIndexText}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.entryTitle}>{displayName}</Text>
          {entry.col2_cause ? (
            <Text style={styles.entrySubtitle} numberOfLines={1}>
              {entry.col2_cause}
            </Text>
          ) : null}
        </View>
        <Text style={styles.entryChevron}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.entryBody}>
          <Divider />
          <OrangeLabel text="COLUMN 1 — I AM RESENTFUL AT" />
          <FormField
            label="Person, institution, or principle"
            placeholder="e.g. Mr. Brown, The government, My mother"
            value={entry.col1_person}
            onChangeText={(v) => updateEntry(entry.id, { col1_person: v })}
            minHeight={44}
          />

          <OrangeLabel text="COLUMN 2 — THE CAUSE" />
          <FormField
            label="Why I'm resentful"
            hint="Keep it brief. e.g. 'They lied to me.' 'They stole from me.'"
            placeholder="The short reason…"
            value={entry.col2_cause}
            onChangeText={(v) => updateEntry(entry.id, { col2_cause: v })}
            minHeight={70}
          />

          <OrangeLabel text="COLUMN 3 — AFFECTS MY" />
          <Text style={styles.hint}>
            Keep Columns 1 & 2 in mind. Look at the 3rd Column and consider the opposite meaning
            of each sentence to let the inventory reveal your fears behind each of the seven areas
            of self (p.67 ¶3 "Notice the word 'fear' is bracketed alongside the difficulties").
          </Text>
          {AREAS.map((area) => {
            const rows = Array.isArray(entry.col3[area.key])
              ? entry.col3[area.key]
              : [
                  { text: entry.col3[area.key]?.text || '', fear: entry.col3[area.key]?.fear || '' },
                  { text: '', fear: '' },
                  { text: '', fear: '' },
                ];
            return (
              <View key={area.key} style={styles.areaBlock}>
                <Text style={styles.areaLabel}>{area.label}:</Text>
                <Text style={styles.areaPrompt}>{area.prompt}</Text>
                <Text style={styles.areaStarters}>{area.starters}</Text>
                {area.example ? <Text style={styles.areaExample}>{area.example}</Text> : null}

                {rows.map((row, idx) => (
                  <Col3Row
                    key={idx}
                    index={idx}
                    row={row}
                    onTextChange={(v) => updateCol3(entry.id, area.key, idx, 'text', v)}
                    onFearChange={(v) => updateCol3(entry.id, area.key, idx, 'fear', v)}
                  />
                ))}
              </View>
            );
          })}

          <OrangeLabel text="COLUMN 4 — MY PART" />
          <FormField
            label="The Realization"
            hint={`"How have I done the things I've resented in column 2 to this person and/or others?" Skip if col 1 is not a person.`}
            value={entry.col4.realization}
            onChangeText={(v) => updateCol4(entry.id, 'realization', v)}
            placeholder="What I've realized about myself in this situation…"
          />
          <FormField
            label="Self-Seeking"
            hint="What were my selfish actions or activities before, during, or after?"
            value={entry.col4.self_seeking}
            onChangeText={(v) => updateCol4(entry.id, 'self_seeking', v)}
            placeholder="My selfish actions or activities were…"
          />
          <FormField
            label="Selfish"
            hint="What was my selfish thinking while I was doing the above?"
            value={entry.col4.selfish}
            onChangeText={(v) => updateCol4(entry.id, 'selfish', v)}
            placeholder="My selfish attitudes were…"
          />
          <FormField
            label="Dishonest"
            hint="What lies was I telling myself that produced that selfish thinking?"
            value={entry.col4.dishonest}
            onChangeText={(v) => updateCol4(entry.id, 'dishonest', v)}
            placeholder="I was in the delusion that…"
          />
          <FormField
            label="Afraid"
            hint="What fears drove those delusions?"
            value={entry.col4.afraid}
            onChangeText={(v) => updateCol4(entry.id, 'afraid', v)}
            placeholder="I was afraid…"
          />
          <FormField
            label="Harm"
            hint="Any harm I caused? Look around the situation — parents, friends, employers."
            value={entry.col4.harm}
            onChangeText={(v) => updateCol4(entry.id, 'harm', v)}
            placeholder="The harm I caused…"
          />

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteBtnText}>Delete this resentment</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

// =============================================================
// Reference tabs (unchanged from before — moved inline for brevity)
// =============================================================

function HowToTab() {
  const ri = resentmentInventory;
  return (
    <>
      <Card>
        <OrangeLabel text="THE FOUR COLUMNS" />
        {[
          { col: 'Column 1', desc: 'I am resentful at: the person, institution, or principle.' },
          { col: 'Column 2', desc: 'The cause — why. Keep it brief.' },
          { col: 'Column 3', desc: 'Affects my: which of the 7 areas of self were hurt.' },
          { col: 'Column 4', desc: 'My part: where was I to blame before, during, after?' },
        ].map((item, i) => (
          <View key={i} style={styles.columnRow}>
            <View style={styles.columnBadge}>
              <Text style={styles.columnBadgeText}>{item.col}</Text>
            </View>
            <Text style={styles.columnDesc}>{item.desc}</Text>
          </View>
        ))}
      </Card>

      {ri.columns123Instructions.items.map((item, i) => (
        <Card key={i}>
          <View style={styles.letterBadge}>
            <Text style={styles.letterBadgeText}>{item.label}</Text>
          </View>
          <Text style={styles.paragraph}>{item.text}</Text>
        </Card>
      ))}

      <Card>
        <OrangeLabel text="COLUMN 4 INSTRUCTIONS" />
        <Text style={styles.prayerText}>{ri.column4Instructions.prayer}</Text>
        <Divider />
        {ri.column4Instructions.content.split('\n\n').filter((p) => p.trim()).map((para, i) => (
          <Text key={i} style={[styles.paragraph, i > 0 && { marginTop: 12 }]}>
            {para}
          </Text>
        ))}
      </Card>
    </>
  );
}

function ExampleTab() {
  const ri = resentmentInventory;
  const ex = ri.mrBrownExample;
  return (
    <>
      <Card>
        <Text style={styles.sectionTitle}>{ex.title}</Text>
        <View style={styles.exampleRow}>
          <Text style={styles.exampleLabel}>I am resentful at:</Text>
          <Text style={styles.exampleValue}>{ex.resentful}</Text>
        </View>
        <View style={styles.exampleRow}>
          <Text style={styles.exampleLabel}>The Cause:</Text>
          <Text style={styles.exampleValue}>{ex.cause}</Text>
        </View>
      </Card>
      <Card>
        <OrangeLabel text="COLUMN 3 — 7 AREAS" />
        {[
          { area: 'Self Esteem', value: ex.column3.selfEsteem, fear: ex.column3.selfEsteemFear },
          { area: 'Pride', value: ex.column3.pride, fear: ex.column3.prideFear },
          { area: 'Ambition', value: ex.column3.ambition, fear: ex.column3.ambitionFear },
          { area: 'Security', value: ex.column3.security, fear: ex.column3.securityFear },
          { area: 'Personal Relations', value: ex.column3.personalRelations, fear: ex.column3.personalFear },
          { area: 'Sex Relations', value: ex.column3.sexRelations, fear: ex.column3.sexFear },
          { area: 'Pocket Book', value: ex.column3.pocketBook, fear: ex.column3.pocketFear },
        ].map((item, i) => (
          <View key={i} style={[styles.col3ExRow, i > 0 && styles.areaBorder]}>
            <Text style={styles.areaName}>{item.area}</Text>
            <Text style={styles.exampleValue}>{item.value}</Text>
            {item.fear && <Text style={styles.fearText}>Fear of being: {item.fear}</Text>}
          </View>
        ))}
      </Card>
      <Card>
        <OrangeLabel text="COLUMN 4 — MY PART" />
        {[
          { label: 'The Realization', value: ex.realization },
          { label: 'Self-Seeking', value: ex.selfSeeking },
          { label: 'Selfish', value: ex.selfish },
          { label: 'Dishonest', value: ex.dishonest },
          { label: 'Afraid', value: ex.afraid },
          { label: 'Harm', value: ex.harm },
        ].map((item, i) => (
          <View key={i} style={[styles.col4Row, i > 0 && styles.areaBorder]}>
            <Text style={styles.col4Label}>{item.label}</Text>
            <Text style={styles.exampleValue}>{item.value}</Text>
          </View>
        ))}
      </Card>
    </>
  );
}

// =============================================================
// Styles
// =============================================================

const styles = StyleSheet.create({
  loading: { paddingVertical: 60, alignItems: 'center' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    padding: 4,
    shadowColor: '#7A4A20',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 7 },
  tabActive: { backgroundColor: COLORS.orange },
  tabText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 13, color: COLORS.darkGray },
  tabTextActive: { color: COLORS.white, fontFamily: 'PlayfairDisplay_700Bold' },

  hint: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    lineHeight: 19,
    marginBottom: 8,
  },
  emptyState: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: COLORS.mediumGray,
    marginTop: 8,
  },

  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryIndexText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 14,
  },
  entryTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: COLORS.inkDark,
  },
  entrySubtitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  entryChevron: {
    fontSize: 20,
    color: COLORS.orange,
    marginLeft: 8,
  },
  entryBody: {
    marginTop: 4,
  },

  areaBlock: {
    marginBottom: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE2CD',
  },
  areaLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: COLORS.orangeDark,
    marginBottom: 4,
  },
  areaPrompt: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 13,
    color: COLORS.inkDark,
    lineHeight: 19,
    marginBottom: 3,
  },
  areaStarters: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
    lineHeight: 18,
    marginBottom: 3,
  },
  areaExample: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  col3Row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  col3RowNum: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 13,
    color: COLORS.orangeDark,
    width: 18,
    paddingTop: 10,
  },
  col3Input: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    color: COLORS.inkDark,
    backgroundColor: '#FFFBF3',
    borderWidth: 1,
    borderColor: '#EAD9BF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
    marginRight: 6,
  },
  col3FearWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 110,
  },
  col3Paren: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    color: COLORS.orangeDark,
  },
  col3FearInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.inkDark,
    minWidth: 80,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#FFFBF3',
  },
  addBtnPlus: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: COLORS.orangeDark,
    marginRight: 8,
  },
  addBtnText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    color: COLORS.orangeDark,
  },

  deleteBtn: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteBtnText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#B44848',
  },

  // Reference tab styles (shared with how-to and example)
  paragraph: {
    fontSize: 15,
    color: COLORS.inkDark,
    lineHeight: 23,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 17,
    color: COLORS.inkDark,
    marginBottom: 10,
  },
  prayerText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  columnRow: {
    marginBottom: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.orange,
  },
  columnBadge: { alignSelf: 'flex-start', marginBottom: 4 },
  columnBadgeText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 13,
    letterSpacing: 1,
  },
  columnDesc: { fontSize: 14, color: COLORS.inkDark, lineHeight: 21 },
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
  exampleRow: { marginBottom: 12 },
  exampleLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 13,
    color: COLORS.orangeDark,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  exampleValue: { fontSize: 14, color: COLORS.inkDark, lineHeight: 21, fontStyle: 'italic' },
  col3ExRow: { paddingVertical: 10 },
  areaName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    color: COLORS.orangeDark,
    marginBottom: 4,
  },
  areaBorder: { borderTopWidth: 1, borderTopColor: COLORS.lightGray },
  fearText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.orange,
    marginTop: 4,
  },
  col4Row: { paddingVertical: 10 },
  col4Label: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.inkDark,
    marginBottom: 4,
  },
});
