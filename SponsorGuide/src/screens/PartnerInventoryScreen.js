import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { api, ApiError } from '../api/client';
import { COLORS } from '../data/content';

const LABELS = {
  resentment: 'Resentment Inventory',
  fear: 'Fear Inventory',
  sex_conduct: 'Sex Conduct Inventory',
};

const AREAS = [
  { key: 'self_esteem', label: 'Self Esteem' },
  { key: 'pride', label: 'Pride' },
  { key: 'ambition', label: 'Ambition' },
  { key: 'security', label: 'Security' },
  { key: 'personal_relations', label: 'Personal Relations' },
  { key: 'sex_relations', label: 'Sex Relations' },
  { key: 'pocket_book', label: 'Pocket Book' },
];

const QUESTIONS = [
  { key: 'selfish', label: '1. Where had I been selfish?' },
  { key: 'dishonest', label: '2. Where had I been dishonest?' },
  { key: 'inconsiderate', label: '3. Where had I been inconsiderate?' },
  { key: 'hurt', label: '4. Whom did I hurt?' },
  { key: 'jealousy', label: '5. Did I arouse jealousy?' },
  { key: 'suspicion', label: '6. Did I arouse suspicion?' },
  { key: 'bitterness', label: '7. Did I arouse bitterness?' },
  { key: 'fault', label: '8. Where was I at fault?' },
  { key: 'should_have', label: '9. What should I have done instead?' },
];

export default function PartnerInventoryScreen({ route }) {
  const { pairId, partner, type } = route.params;
  const [inv, setInv] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [i, p] = await Promise.all([
        api.getPartnerInventory(pairId, type),
        api.listProgress(pairId),
      ]);
      setInv(i);
      setProgress(p);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setError('not_shared');
      else setError(err.message);
    }
  }, [pairId, type]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const isReviewed = useCallback(
    (scopeKey) => progress.some((m) => m.scope_key === scopeKey && m.state === 'reviewed'),
    [progress],
  );

  const toggleReviewed = useCallback(
    async (scope, scopeKey) => {
      const already = isReviewed(scopeKey);
      try {
        if (already) {
          await api.clearProgress(pairId, scopeKey);
          setProgress((p) => p.filter((m) => m.scope_key !== scopeKey));
        } else {
          const marker = await api.upsertProgress(pairId, {
            scope,
            scope_key: scopeKey,
            state: 'reviewed',
          });
          setProgress((p) => [...p.filter((m) => m.scope_key !== scopeKey), marker]);
        }
      } catch (err) {
        Alert.alert('Could not update', err.message);
      }
    },
    [isReviewed, pairId],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <SectionHeader
          title={LABELS[type]}
          subtitle={`Shared by ${partner.display_name}`}
        />

        {error === 'not_shared' ? (
          <Card>
            <Text style={styles.empty}>
              {partner.display_name} hasn't shared this inventory with you.
            </Text>
          </Card>
        ) : error ? (
          <Card>
            <Text style={styles.error}>{error}</Text>
          </Card>
        ) : !inv ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator color={COLORS.orange} />
          </View>
        ) : type === 'resentment' ? (
          <ResentmentView data={inv.data} isReviewed={isReviewed} toggleReviewed={toggleReviewed} />
        ) : type === 'fear' ? (
          <FearView data={inv.data} />
        ) : (
          <SexView data={inv.data} isReviewed={isReviewed} toggleReviewed={toggleReviewed} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================
// Views per inventory type
// =============================================================

function Checkbox({ checked, onToggle, label }) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.checkRow} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path
              d="M3 7 L6 10 L11 4"
              stroke={COLORS.white}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : null}
      </View>
      <Text style={[styles.checkLabel, checked && styles.checkLabelDone]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ResentmentView({ data, isReviewed, toggleReviewed }) {
  const entries = data?.resentments || [];
  const doneCount = entries.filter((e) => isReviewed(`entry_resentment:${e.id}`)).length;

  return (
    <>
      <Card>
        <OrangeLabel text="PROGRESS" />
        <Text style={styles.progressText}>
          {doneCount} of {entries.length} reviewed together
        </Text>
        {entries.length > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(doneCount / entries.length) * 100}%` },
              ]}
            />
          </View>
        )}
      </Card>

      {entries.length === 0 && (
        <Card>
          <Text style={styles.empty}>No resentments in this inventory yet.</Text>
        </Card>
      )}

      {entries.map((entry, i) => {
        const scopeKey = `entry_resentment:${entry.id}`;
        const reviewed = isReviewed(scopeKey);
        return (
          <Card key={entry.id} style={reviewed ? { opacity: 0.85 } : null}>
            <View style={styles.entryHeader}>
              <View style={styles.entryNum}>
                <Text style={styles.entryNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.entryTitle}>
                {entry.col1_person || `Resentment #${i + 1}`}
              </Text>
            </View>
            <Divider />

            <OrangeLabel text="COLUMN 1 — I AM RESENTFUL AT" />
            <Text style={styles.body}>{entry.col1_person || '—'}</Text>

            <OrangeLabel text="COLUMN 2 — THE CAUSE" />
            <Text style={styles.body}>{entry.col2_cause || '—'}</Text>

            <OrangeLabel text="COLUMN 3 — AFFECTS MY" />
            {AREAS.map((area) => {
              const rows = normalizeCol3(entry.col3?.[area.key]);
              const nonEmpty = rows.filter((r) => r.text || r.fear);
              if (nonEmpty.length === 0) return null;
              return (
                <View key={area.key} style={styles.areaBlock}>
                  <Text style={styles.areaLabel}>{area.label}</Text>
                  {nonEmpty.map((r, idx) => (
                    <View key={idx} style={styles.rowLine}>
                      <Text style={styles.rowText}>
                        {idx + 1}. {r.text || '—'}
                      </Text>
                      {r.fear ? (
                        <Text style={styles.rowFear}>(fear of {r.fear})</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              );
            })}

            <OrangeLabel text="COLUMN 4 — MY PART" />
            {[
              { label: 'The Realization', val: entry.col4?.realization },
              { label: 'Self-Seeking', val: entry.col4?.self_seeking },
              { label: 'Selfish', val: entry.col4?.selfish },
              { label: 'Dishonest', val: entry.col4?.dishonest },
              { label: 'Afraid', val: entry.col4?.afraid },
              { label: 'Harm', val: entry.col4?.harm },
            ].map((f, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <Text style={styles.body}>{f.val || '—'}</Text>
              </View>
            ))}

            <Divider />
            <Checkbox
              checked={reviewed}
              onToggle={() => toggleReviewed('entry', scopeKey)}
              label="Reviewed together"
            />
          </Card>
        );
      })}
    </>
  );
}

function FearView({ data }) {
  const chains = data?.chains || [];
  return (
    <>
      {chains.length === 0 && (
        <Card>
          <Text style={styles.empty}>No fear chains yet.</Text>
        </Card>
      )}
      {chains.map((c, i) => (
        <Card key={c.id || i}>
          <Text style={styles.entryTitle}>Chain {i + 1}</Text>
          <Divider />
          {c.chain.map((val, idx) => (
            <View key={idx} style={styles.chainRow}>
              <Text style={styles.chainLabel}>
                {idx === 0 ? 'Fear of being…' : 'Why?'}
              </Text>
              <Text style={styles.chainValue}>{val || '—'}</Text>
            </View>
          ))}
        </Card>
      ))}
      {data?.harms ? (
        <Card>
          <OrangeLabel text="HARMS" />
          <Text style={styles.body}>{data.harms}</Text>
        </Card>
      ) : null}
    </>
  );
}

function SexView({ data, isReviewed, toggleReviewed }) {
  const rels = data?.relationships || [];
  const ideals = data?.future_ideal?.items || [];
  const doneCount = rels.filter((r) => isReviewed(`entry_sex:${r.id}`)).length;

  return (
    <>
      {rels.length > 0 && (
        <Card>
          <OrangeLabel text="PROGRESS" />
          <Text style={styles.progressText}>
            {doneCount} of {rels.length} relationships reviewed
          </Text>
        </Card>
      )}

      {rels.map((r, i) => {
        const scopeKey = `entry_sex:${r.id}`;
        const reviewed = isReviewed(scopeKey);
        return (
          <Card key={r.id} style={reviewed ? { opacity: 0.85 } : null}>
            <View style={styles.entryHeader}>
              <View style={styles.entryNum}>
                <Text style={styles.entryNumText}>{i + 1}</Text>
              </View>
              <View>
                <Text style={styles.entryTitle}>{r.name || `Relationship #${i + 1}`}</Text>
                {r.relationship ? (
                  <Text style={styles.entrySub}>{r.relationship}</Text>
                ) : null}
              </View>
            </View>
            <Divider />

            <OrangeLabel text="HISTORY" />
            {[
              { label: 'Motives for getting involved', val: r.history?.motives },
              { label: 'Specific conduct', val: r.history?.conduct },
              { label: 'Major points', val: r.history?.major_points },
              { label: 'How it ended / is now', val: r.history?.ended },
            ].map((f, idx) => (
              <View key={idx} style={{ marginBottom: 10 }}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <Text style={styles.body}>{f.val || '—'}</Text>
              </View>
            ))}

            <OrangeLabel text="THE NINE QUESTIONS" />
            {QUESTIONS.map((q) => (
              <View key={q.key} style={{ marginBottom: 10 }}>
                <Text style={styles.fieldLabel}>{q.label}</Text>
                <Text style={styles.body}>{r.nine_questions?.[q.key] || '—'}</Text>
              </View>
            ))}

            {r.harm ? (
              <>
                <OrangeLabel text="HARM" />
                <Text style={styles.body}>{r.harm}</Text>
              </>
            ) : null}

            <Divider />
            <Checkbox
              checked={reviewed}
              onToggle={() => toggleReviewed('entry', scopeKey)}
              label="Reviewed together"
            />
          </Card>
        );
      })}

      {ideals.length > 0 && (
        <Card>
          <OrangeLabel text="FUTURE IDEAL — GOD, IN THE FUTURE I WOULD LIKE TO BE…" />
          {ideals.map((v, i) => (
            <Text key={i} style={styles.idealItem}>
              {i + 1}. {v}
            </Text>
          ))}
        </Card>
      )}

      {rels.length === 0 && ideals.length === 0 && (
        <Card>
          <Text style={styles.empty}>This inventory is empty.</Text>
        </Card>
      )}
    </>
  );
}

// =============================================================
// Helpers
// =============================================================

function normalizeCol3(area) {
  if (Array.isArray(area)) return area;
  if (area && (area.text || area.fear)) return [area, { text: '', fear: '' }, { text: '', fear: '' }];
  return [{ text: '', fear: '' }, { text: '', fear: '' }, { text: '', fear: '' }];
}

// =============================================================
// Styles
// =============================================================

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  body: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: COLORS.inkDark,
    lineHeight: 22,
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 13,
    color: COLORS.orangeDark,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  entryHeader: { flexDirection: 'row', alignItems: 'center' },
  entryNum: {
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
  entryNumText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 14,
  },
  entryTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: COLORS.inkDark,
  },
  entrySub: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  areaBlock: { marginBottom: 14 },
  areaLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    color: COLORS.orangeDark,
    marginBottom: 6,
  },
  rowLine: { marginBottom: 6, paddingLeft: 10 },
  rowText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    color: COLORS.inkDark,
    lineHeight: 21,
  },
  rowFear: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.orangeDark,
    marginTop: 2,
  },
  chainRow: { marginBottom: 10 },
  chainLabel: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
  },
  chainValue: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: COLORS.inkDark,
    marginTop: 2,
  },
  idealItem: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    color: COLORS.inkDark,
    lineHeight: 22,
    marginBottom: 8,
  },
  empty: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  error: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#B44848',
  },
  progressText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.inkDark,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EAD9BF',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#4C8A3F',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FFFBF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#4C8A3F',
    borderColor: '#3D6B2E',
  },
  checkLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.inkDark,
  },
  checkLabelDone: {
    color: '#3D6B2E',
  },
});
