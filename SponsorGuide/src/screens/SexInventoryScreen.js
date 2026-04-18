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
import { sexConductInventory, COLORS } from '../data/content';
import {
  loadInventory,
  saveInventory,
  emptySexConductInventory,
  emptySexConductRelationship,
} from '../storage/inventoryStore';

const QUESTIONS = [
  { key: 'selfish', label: '1. Where had I been selfish?' },
  { key: 'dishonest', label: '2. Where had I been dishonest?' },
  { key: 'inconsiderate', label: '3. Where had I been inconsiderate?' },
  { key: 'hurt', label: '4. Whom did I hurt?', hint: 'Look around the relationship — parents, kids, siblings.' },
  { key: 'jealousy', label: '5. Did I arouse jealousy?' },
  { key: 'suspicion', label: '6. Did I arouse suspicion?' },
  { key: 'bitterness', label: '7. Did I arouse bitterness?' },
  { key: 'fault', label: '8. Where was I at fault?' },
  { key: 'should_have', label: '9. What should I have done instead?', hint: 'Not "I shouldn\'t have gotten involved." Refer to how I should have behaved.' },
];

const tabs = [
  { key: 'my', label: 'My Inventory' },
  { key: 'ideal', label: 'Future Ideal' },
  { key: 'how', label: 'How-To' },
];

export default function SexInventoryScreen() {
  const [activeTab, setActiveTab] = useState('my');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const stored = await loadInventory('sex_conduct');
      setData(stored || emptySexConductInventory());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading || !data) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveInventory('sex_conduct', data).catch(() => {});
    }, 600);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [data, loading]);

  const updateRel = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      relationships: prev.relationships.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const updateHistory = useCallback((id, field, value) => {
    setData((prev) => ({
      ...prev,
      relationships: prev.relationships.map((r) =>
        r.id !== id ? r : { ...r, history: { ...r.history, [field]: value } },
      ),
    }));
  }, []);

  const updateQ = useCallback((id, field, value) => {
    setData((prev) => ({
      ...prev,
      relationships: prev.relationships.map((r) =>
        r.id !== id ? r : { ...r, nine_questions: { ...r.nine_questions, [field]: value } },
      ),
    }));
  }, []);

  const addRelationship = useCallback(() => {
    setData((prev) => {
      const rel = emptySexConductRelationship();
      setExpandedId(rel.id);
      return { ...prev, relationships: [...prev.relationships, rel] };
    });
  }, []);

  const deleteRelationship = useCallback((id) => {
    Alert.alert('Delete this relationship entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setData((prev) => ({
            ...prev,
            relationships: prev.relationships.filter((r) => r.id !== id),
          }));
          if (expandedId === id) setExpandedId(null);
        },
      },
    ]);
  }, [expandedId]);

  // Future ideal list ops
  const updateIdealItem = useCallback((idx, value) => {
    setData((prev) => ({
      ...prev,
      future_ideal: {
        ...prev.future_ideal,
        items: prev.future_ideal.items.map((v, i) => (i === idx ? value : v)),
      },
    }));
  }, []);

  const addIdealItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      future_ideal: { ...prev.future_ideal, items: [...prev.future_ideal.items, ''] },
    }));
  }, []);

  const removeIdealItem = useCallback((idx) => {
    setData((prev) => ({
      ...prev,
      future_ideal: {
        ...prev.future_ideal,
        items: prev.future_ideal.items.filter((_, i) => i !== idx),
      },
    }));
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={{ paddingVertical: 60, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={COLORS.orange} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Sex Conduct Inventory"
        subtitle='"God please help me see the Truth about my conduct in relationships"'
      />

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
        <>
          <Card>
            <OrangeLabel text="YOUR RELATIONSHIPS" />
            <Text style={styles.hint}>
              Pray, make a list of relationships through your life. Work on the list till you know
              it's done. Then go one by one: write the history, answer the nine questions, list any harm.
            </Text>
            {data.relationships.length === 0 && (
              <Text style={styles.emptyState}>
                No relationships yet. Tap below to add your first one.
              </Text>
            )}
          </Card>

          {data.relationships.map((rel, i) => (
            <RelationshipCard
              key={rel.id}
              rel={rel}
              index={i}
              expanded={expandedId === rel.id}
              onToggle={() => setExpandedId(expandedId === rel.id ? null : rel.id)}
              onUpdateRel={(patch) => updateRel(rel.id, patch)}
              onUpdateHistory={(field, value) => updateHistory(rel.id, field, value)}
              onUpdateQ={(field, value) => updateQ(rel.id, field, value)}
              onDelete={() => deleteRelationship(rel.id)}
            />
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addRelationship} activeOpacity={0.8}>
            <Text style={styles.addBtnPlus}>＋</Text>
            <Text style={styles.addBtnText}>Add a relationship</Text>
          </TouchableOpacity>
        </>
      )}

      {activeTab === 'ideal' && (
        <FutureIdealTab
          items={data.future_ideal.items}
          onUpdate={updateIdealItem}
          onAdd={addIdealItem}
          onRemove={removeIdealItem}
        />
      )}

      {activeTab === 'how' && <HowToTab />}
    </ScreenWrapper>
  );
}

function RelationshipCard({ rel, index, expanded, onToggle, onUpdateRel, onUpdateHistory, onUpdateQ, onDelete }) {
  const displayName = rel.name || `Relationship #${index + 1}`;
  return (
    <Card>
      <TouchableOpacity style={styles.entryHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.entryIndex}>
          <Text style={styles.entryIndexText}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.entryTitle}>{displayName}</Text>
          {rel.relationship ? (
            <Text style={styles.entrySubtitle} numberOfLines={1}>
              {rel.relationship}
            </Text>
          ) : null}
        </View>
        <Text style={styles.entryChevron}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.entryBody}>
          <Divider />
          <FormField
            label="Name"
            value={rel.name}
            onChangeText={(v) => onUpdateRel({ name: v })}
            placeholder="First name or initials"
            minHeight={44}
          />
          <FormField
            label="Relationship"
            hint="e.g. wife, friend's husband, coworker"
            value={rel.relationship}
            onChangeText={(v) => onUpdateRel({ relationship: v })}
            placeholder="What was the relationship"
            minHeight={44}
          />

          <OrangeLabel text="BRIEF HISTORY" />
          <FormField
            label="My motives for getting involved…"
            value={rel.history.motives}
            onChangeText={(v) => onUpdateHistory('motives', v)}
          />
          <FormField
            label="My specific conduct was…"
            value={rel.history.conduct}
            onChangeText={(v) => onUpdateHistory('conduct', v)}
          />
          <FormField
            label="The major points that came up…"
            value={rel.history.major_points}
            onChangeText={(v) => onUpdateHistory('major_points', v)}
          />
          <FormField
            label="How it ended / how it is now…"
            value={rel.history.ended}
            onChangeText={(v) => onUpdateHistory('ended', v)}
          />

          <OrangeLabel text="NINE QUESTIONS" />
          {QUESTIONS.map((q) => (
            <FormField
              key={q.key}
              label={q.label}
              hint={q.hint}
              value={rel.nine_questions[q.key]}
              onChangeText={(v) => onUpdateQ(q.key, v)}
            />
          ))}

          <OrangeLabel text="HARM" />
          <FormField
            label="Specific harm that comes to mind"
            value={rel.harm}
            onChangeText={(v) => onUpdateRel({ harm: v })}
          />

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteBtnText}>Delete this relationship</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

function FutureIdealTab({ items, onUpdate, onAdd, onRemove }) {
  return (
    <>
      <Card>
        <OrangeLabel text="SANE & SOUND IDEAL" />
        <Text style={styles.hint}>
          "God, in the future I would like to be…" — write your ideal for your future sex life.
          This is a prayer and a standard you set for yourself. Base it on your answers to
          Question #9 from each relationship.
        </Text>
        {items.length === 0 && (
          <Text style={styles.emptyState}>No items yet. Tap below to add the first.</Text>
        )}
      </Card>

      {items.map((val, idx) => (
        <Card key={idx}>
          <View style={styles.idealRow}>
            <View style={styles.entryIndex}>
              <Text style={styles.entryIndexText}>{idx + 1}</Text>
            </View>
            <TextInput
              style={styles.idealInput}
              value={val}
              onChangeText={(v) => onUpdate(idx, v)}
              placeholder="e.g. Considerate of my mate by treating them as a human being…"
              placeholderTextColor={COLORS.mediumGray}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity onPress={() => onRemove(idx)} style={styles.removeStepBtn}>
              <Text style={styles.removeStepBtnText}>×</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
        <Text style={styles.addBtnPlus}>＋</Text>
        <Text style={styles.addBtnText}>Add an ideal</Text>
      </TouchableOpacity>
    </>
  );
}

function HowToTab() {
  const si = sexConductInventory;
  return (
    <>
      {si.instructions.split('\n\n').filter((p) => p.trim()).map((para, i) => {
        if (para === 'SEX INVENTORY WORKSHEET INSTRUCTIONS') return null;
        return (
          <Card key={i}>
            <Text style={styles.paragraph}>{para}</Text>
          </Card>
        );
      })}
      <Card>
        <OrangeLabel text="THE 9 QUESTIONS" />
        {QUESTIONS.map((q, i) => (
          <View key={i} style={styles.questionReference}>
            <Text style={styles.questionRefLabel}>{q.label}</Text>
            {q.hint && <Text style={styles.questionRefHint}>{q.hint}</Text>}
          </View>
        ))}
      </Card>
    </>
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
  paragraph: { fontSize: 15, color: COLORS.inkDark, lineHeight: 23 },

  entryHeader: { flexDirection: 'row', alignItems: 'center' },
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
  entryChevron: { fontSize: 20, color: COLORS.orange, marginLeft: 8 },
  entryBody: { marginTop: 4 },

  idealRow: { flexDirection: 'row', alignItems: 'flex-start' },
  idealInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: COLORS.inkDark,
    backgroundColor: '#FFFBF3',
    borderWidth: 1,
    borderColor: '#EAD9BF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 52,
    marginHorizontal: 8,
  },
  removeStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7E8D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeStepBtnText: {
    fontSize: 20,
    color: COLORS.orangeDark,
    fontWeight: '700',
    lineHeight: 22,
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

  deleteBtn: { marginTop: 18, alignItems: 'center', paddingVertical: 10 },
  deleteBtnText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#B44848',
  },

  questionReference: {
    marginBottom: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.orange,
  },
  questionRefLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.inkDark,
  },
  questionRefHint: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 3,
    lineHeight: 19,
  },
});
