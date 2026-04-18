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
import { fearInventory, COLORS } from '../data/content';
import {
  loadInventory,
  saveInventory,
  emptyFearInventory,
  emptyFearChain,
} from '../storage/inventoryStore';

const tabs = [
  { key: 'my', label: 'My Inventory' },
  { key: 'how', label: 'How-To' },
  { key: 'fears', label: 'Fears List' },
];

export default function FearInventoryScreen() {
  const [activeTab, setActiveTab] = useState('my');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const stored = await loadInventory('fear');
      setData(stored || emptyFearInventory());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading || !data) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveInventory('fear', data).catch(() => {});
    }, 600);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [data, loading]);

  const updateChainItem = useCallback((chainId, idx, value) => {
    setData((prev) => ({
      ...prev,
      chains: prev.chains.map((c) =>
        c.id !== chainId ? c : { ...c, chain: c.chain.map((v, i) => (i === idx ? value : v)) },
      ),
    }));
  }, []);

  const addChainStep = useCallback((chainId) => {
    setData((prev) => ({
      ...prev,
      chains: prev.chains.map((c) => (c.id !== chainId ? c : { ...c, chain: [...c.chain, ''] })),
    }));
  }, []);

  const removeChainStep = useCallback((chainId, idx) => {
    setData((prev) => ({
      ...prev,
      chains: prev.chains.map((c) =>
        c.id !== chainId ? c : { ...c, chain: c.chain.filter((_, i) => i !== idx) },
      ),
    }));
  }, []);

  const addChain = useCallback(() => {
    setData((prev) => ({ ...prev, chains: [...prev.chains, emptyFearChain()] }));
  }, []);

  const deleteChain = useCallback((id) => {
    Alert.alert('Delete this fear chain?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setData((prev) => ({ ...prev, chains: prev.chains.filter((c) => c.id !== id) }));
        },
      },
    ]);
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
        title="Fear Inventory"
        subtitle='"God please help me see the truth about my fears"'
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
            <OrangeLabel text="YOUR FEAR CHAINS" />
            <Text style={styles.hint}>
              List each fear you wrote down from your resentments. For each fear, keep asking
              "why do I have this fear?" Each answer is the next step in the chain. Each chain
              should get shorter as you drill down until you reach a single root fear.
            </Text>
            <Text style={styles.hint}>
              Example chain:{'  '}
              <Text style={styles.exampleChain}>
                not good enough → unwanted → alone → emotional pain → drinking → dying → unknown → no God
              </Text>
            </Text>
          </Card>

          {data.chains.length === 0 && (
            <Card>
              <Text style={styles.emptyState}>
                No fear chains yet. Tap below to start your first one.
              </Text>
            </Card>
          )}

          {data.chains.map((chain, i) => (
            <FearChainCard
              key={chain.id}
              chain={chain}
              index={i}
              onUpdate={(idx, v) => updateChainItem(chain.id, idx, v)}
              onAddStep={() => addChainStep(chain.id)}
              onRemoveStep={(idx) => removeChainStep(chain.id, idx)}
              onDelete={() => deleteChain(chain.id)}
            />
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addChain} activeOpacity={0.8}>
            <Text style={styles.addBtnPlus}>＋</Text>
            <Text style={styles.addBtnText}>Add another fear chain</Text>
          </TouchableOpacity>

          <Card>
            <OrangeLabel text="HARMS" />
            <FormField
              label="How my fears caused harm and to whom"
              hint="Look at your fears and write out the harms they caused."
              value={data.harms}
              onChangeText={(v) => setData((prev) => ({ ...prev, harms: v }))}
              placeholder="Describe the harms…"
              minHeight={120}
            />
          </Card>
        </>
      )}

      {activeTab === 'how' && <HowToTab />}
      {activeTab === 'fears' && <FearsListTab />}
    </ScreenWrapper>
  );
}

function FearChainCard({ chain, index, onUpdate, onAddStep, onRemoveStep, onDelete }) {
  const headline = chain.chain[0] || `Chain #${index + 1}`;
  return (
    <Card>
      <View style={styles.chainHeader}>
        <View style={styles.entryIndex}>
          <Text style={styles.entryIndexText}>{index + 1}</Text>
        </View>
        <Text style={styles.chainHeadline} numberOfLines={1}>I fear {headline}</Text>
      </View>

      {chain.chain.map((val, idx) => (
        <View key={idx} style={styles.chainRow}>
          <Text style={styles.chainStepLabel}>
            {idx === 0 ? 'Fear of being…' : 'Why do I have this fear?'}
          </Text>
          <View style={styles.chainInputWrap}>
            <TextInput
              style={styles.chainInput}
              value={val}
              onChangeText={(v) => onUpdate(idx, v)}
              placeholder={idx === 0 ? 'e.g. not good enough' : 'the deeper fear'}
              placeholderTextColor={COLORS.mediumGray}
            />
            {chain.chain.length > 1 && (
              <TouchableOpacity onPress={() => onRemoveStep(idx)} style={styles.removeStepBtn}>
                <Text style={styles.removeStepBtnText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          {idx < chain.chain.length - 1 && <Text style={styles.chainArrow}>↓</Text>}
        </View>
      ))}

      <TouchableOpacity style={styles.addStepBtn} onPress={onAddStep}>
        <Text style={styles.addStepBtnText}>＋ Go deeper</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteBtnText}>Delete this chain</Text>
      </TouchableOpacity>
    </Card>
  );
}

function HowToTab() {
  const fi = fearInventory;
  return (
    <>
      {fi.instructions.split('\n\n').filter((p) => p.trim()).map((para, i) => {
        if (para === 'FEAR INVENTORY INSTRUCTIONS') return null;
        return (
          <Card key={i}>
            <Text style={styles.paragraph}>{para}</Text>
          </Card>
        );
      })}
      <Card>
        <OrangeLabel text="EXAMPLE CHAIN" />
        <Text style={styles.exampleChain}>
          not good enough → unwanted → alone → emotional pain → drinking → dying → the unknown → no God → self-reliance fails me
        </Text>
        <Divider />
        <Text style={styles.paragraph}>
          Each list should get smaller: 80 becomes 40, 40 becomes 15, 15 becomes 6, 6 becomes 1.
        </Text>
        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          Note: if your lists aren't getting smaller, it's a sign you don't understand yet.
        </Text>
      </Card>
    </>
  );
}

function FearsListTab() {
  const fi = fearInventory;
  return (
    <Card>
      <OrangeLabel text="TYPES OF FEARS — THE FEAR OF…" />
      <Text style={styles.hint}>
        Use this list to help identify fears you want to chain through.
      </Text>
      <View style={styles.fearsGrid}>
        {fi.fearsList.map((fear, i) => (
          <View key={i} style={styles.fearChip}>
            <Text style={styles.fearChipText}>{fear}</Text>
          </View>
        ))}
      </View>
    </Card>
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
  exampleChain: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.orangeDark,
    lineHeight: 22,
  },
  emptyState: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: COLORS.mediumGray,
  },
  paragraph: { fontSize: 15, color: COLORS.inkDark, lineHeight: 23 },

  chainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
  chainHeadline: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    color: COLORS.inkDark,
  },

  chainRow: { marginBottom: 4 },
  chainStepLabel: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  chainInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainInput: {
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
  },
  removeStepBtn: {
    marginLeft: 8,
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
  chainArrow: {
    textAlign: 'center',
    color: COLORS.orange,
    fontSize: 18,
    marginVertical: 2,
  },

  addStepBtn: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.orange,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addStepBtnText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 13,
    color: COLORS.orangeDark,
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

  deleteBtn: { marginTop: 14, alignItems: 'center', paddingVertical: 8 },
  deleteBtnText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#B44848',
  },

  fearsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fearChip: {
    backgroundColor: '#FFFBF3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EAD9BF',
  },
  fearChipText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 13,
    color: COLORS.inkDark,
  },
});
