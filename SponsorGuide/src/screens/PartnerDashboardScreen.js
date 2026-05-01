import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader, Card, OrangeLabel } from '../components/SectionCard';
import { api, ApiError } from '../api/client';
import { COLORS } from '../data/content';

const LABELS = {
  resentment: 'Resentment Inventory',
  fear: 'Fear Inventory',
  sex_conduct: 'Sex Conduct Inventory',
};

const ORNAMENTS = {
  resentment: '📜',
  fear: '🛡',
  sex_conduct: '💭',
};

export default function PartnerDashboardScreen({ route, navigation }) {
  const { pairId, partner } = route.params || {};
  const [inventories, setInventories] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const rows = await api.getPartnerInventories(pairId);
      setInventories(rows);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) setError('offline');
      else setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, [pairId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <SectionHeader title={partner.display_name} subtitle="Inventories shared with you" />

        {inventories === null ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator color={COLORS.orange} />
          </View>
        ) : inventories.length === 0 ? (
          <Card>
            <Text style={styles.empty}>
              {partner.display_name} hasn't shared any inventories yet. Pull to refresh.
            </Text>
          </Card>
        ) : (
          inventories.map((inv) => (
            <Card key={inv.id}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('PartnerInventory', {
                    pairId,
                    partner,
                    type: inv.type,
                  })
                }
              >
                <View style={styles.row}>
                  <Text style={styles.ornament}>{ORNAMENTS[inv.type]}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.title}>{LABELS[inv.type]}</Text>
                    <Text style={styles.meta}>
                      Shared {relativeTime(inv.shared_at)}
                      {inv.shared_at !== inv.updated_at
                        ? ` · updated ${relativeTime(inv.updated_at)}`
                        : ''}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={() => {
                  Alert.alert(
                    'Remove this inventory?',
                    `This unshares ${partner.display_name}'s ${LABELS[inv.type]}. Their inventory stays intact on their phone — they can re-share any time.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Remove',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await api.unshareInventoryAsPartner(inv.type, pairId);
                            setInventories((prev) =>
                              prev.filter((i) => i.id !== inv.id),
                            );
                          } catch (err) {
                            Alert.alert('Could not remove', err.message);
                          }
                        },
                      },
                    ],
                  );
                }}
              >
                <Text style={styles.dismissText}>Remove from my view</Text>
              </TouchableOpacity>
            </Card>
          ))
        )}

        {error ? (
          <Card>
            <OrangeLabel text="ERROR" />
            <Text style={styles.error}>{error}</Text>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function relativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString();
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  row: { flexDirection: 'row', alignItems: 'center' },
  ornament: { fontSize: 24, width: 30 },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: COLORS.inkDark,
  },
  meta: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  chevron: {
    fontSize: 28,
    color: COLORS.orange,
    marginLeft: 8,
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
  dismissBtn: {
    marginTop: 10,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  dismissText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: '#8A5A5A',
    textDecorationLine: 'underline',
  },
});
