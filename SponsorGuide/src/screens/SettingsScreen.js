import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { useAuth } from '../api/AuthContext';
import { usePairs } from '../api/usePairs';
import { api, ApiError } from '../api/client';
import { deleteInventory as deleteLocalInventory } from '../storage/inventoryStore';
import { COLORS } from '../data/content';

export default function SettingsScreen({ navigation }) {
  const { user, updateName, refresh: refreshAuth } = useAuth();
  const { pairs, refresh } = usePairs();

  return (
    <ScreenWrapper>
      <SectionHeader title="Settings" subtitle="Your profile and sponsor/sponsee pairs" />

      <ProfileSection user={user} updateName={updateName} />
      <PairsSection pairs={pairs} refresh={refresh} navigation={navigation} />
      <LinkActions refresh={refresh} />
      <DataSection navigation={navigation} refreshAuth={refreshAuth} />
    </ScreenWrapper>
  );
}

// =============================================================
// Profile
// =============================================================

function ProfileSection({ user, updateName }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user?.display_name || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await updateName(trimmed);
      setEditing(false);
    } catch (err) {
      Alert.alert('Could not update name', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <OrangeLabel text="YOUR NAME" />
      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            autoFocus
            maxLength={60}
          />
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost, { flex: 1, marginRight: 8 }]}
              onPress={() => {
                setDraft(user?.display_name || '');
                setEditing(false);
              }}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
              disabled={saving || !draft.trim()}
              onPress={save}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.btnPrimaryText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity onPress={() => setEditing(true)} activeOpacity={0.7}>
          <Text style={styles.nameText}>{user?.display_name}</Text>
          <Text style={styles.hint}>Tap to edit</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

// =============================================================
// Pairs list
// =============================================================

function PairsSection({ pairs, refresh, navigation }) {
  const handleUnpair = (pair) => {
    Alert.alert(
      'Unpair?',
      `Remove your connection with ${pair.partner.display_name}?\n\nThey will lose access to inventories you shared with them.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpair',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.unpair(pair.id);
              await refresh();
            } catch (err) {
              Alert.alert('Could not unpair', err.message);
            }
          },
        },
      ],
    );
  };

  return (
    <Card>
      <OrangeLabel text="YOUR PAIRS" />
      {pairs.length === 0 ? (
        <Text style={styles.hint}>
          No connections yet. Use the buttons below to link with a sponsor or sponsee.
        </Text>
      ) : (
        pairs.map((pair, i) => (
          <View key={pair.id} style={[styles.pairRow, i > 0 && styles.pairRowBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pairName}>{pair.partner.display_name}</Text>
              <Text style={styles.pairRole}>
                {pair.role === 'sponsor' ? 'Your sponsee' : 'Your sponsor'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleUnpair(pair)} style={styles.unpairBtn}>
              <Text style={styles.unpairText}>Unpair</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </Card>
  );
}

// =============================================================
// Link actions — generate or enter a pair code
// =============================================================

function LinkActions({ refresh }) {
  const [mode, setMode] = useState(null);
  // mode: null | { kind: 'generate', role: 'sponsor'|'sponsee' } | { kind: 'redeem' }

  if (mode?.kind === 'generate') {
    return (
      <GenerateCodeCard
        initialRole={mode.role}
        onDone={() => { setMode(null); refresh(); }}
        onCancel={() => setMode(null)}
      />
    );
  }
  if (mode?.kind === 'redeem') {
    return (
      <RedeemCodeCard
        onDone={() => { setMode(null); refresh(); }}
        onCancel={() => setMode(null)}
      />
    );
  }

  return (
    <Card>
      <OrangeLabel text="CONNECT" />
      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary, { marginBottom: 10 }]}
        onPress={() => setMode({ kind: 'generate', role: 'sponsor' })}
      >
        <Text style={styles.btnPrimaryText}>Invite a sponsee</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.btnOutline, { marginBottom: 10 }]}
        onPress={() => setMode({ kind: 'generate', role: 'sponsee' })}
      >
        <Text style={styles.btnOutlineText}>Invite my sponsor to view my work</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.btnGhost]}
        onPress={() => setMode({ kind: 'redeem' })}
      >
        <Text style={styles.btnGhostText}>I have a code from someone</Text>
      </TouchableOpacity>
    </Card>
  );
}

function GenerateCodeCard({ initialRole = 'sponsor', onDone, onCancel }) {
  const [code, setCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState(null);

  const generate = useCallback(async (r) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.createPairCode(r);
      setCode(result.code);
      setExpiresAt(result.expires_at);
      setRole(r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const shareCode = async () => {
    try {
      await Share.share({
        message:
          `Your pair code for the Beginners Sponsorship Guide app:\n\n` +
          `${code}\n\n` +
          `This code expires in 15 minutes. Enter it in the app under Settings → "I have a code from someone."\n\n` +
          `Don't have the app yet? Download it free:\n` +
          `https://apps.apple.com/app/id6762534776`,
      });
    } catch (e) {}
  };

  return (
    <Card>
      <OrangeLabel text={role === 'sponsor' ? 'INVITE YOUR SPONSEE' : 'INVITE YOUR SPONSOR'} />
      {!code ? (
        <>
          <Text style={styles.hint}>
            Pick your role — then we'll generate a 6-character code. Read it to your{' '}
            {role === 'sponsor' ? 'sponsee' : 'sponsor'} (or share the link) and have them enter it
            in their app.
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'sponsor' && styles.roleBtnActive]}
              onPress={() => setRole('sponsor')}
            >
              <Text style={[styles.roleText, role === 'sponsor' && styles.roleTextActive]}>
                I'm the sponsor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'sponsee' && styles.roleBtnActive]}
              onPress={() => setRole('sponsee')}
            >
              <Text style={[styles.roleText, role === 'sponsee' && styles.roleTextActive]}>
                I'm the sponsee
              </Text>
            </TouchableOpacity>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost, { flex: 1, marginRight: 8 }]}
              onPress={onCancel}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
              onPress={() => generate(role)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.btnPrimaryText}>Generate code</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.codeDisplay}>{code}</Text>
          <Text style={styles.hint}>
            Expires {new Date(expiresAt).toLocaleTimeString()}. One-time use.
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost, { flex: 1, marginRight: 8 }]}
              onPress={onDone}
            >
              <Text style={styles.btnGhostText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
              onPress={shareCode}
            >
              <Text style={styles.btnPrimaryText}>Share</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Card>
  );
}

function RedeemCodeCard({ onDone, onCancel }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 6) {
      setError('Code should be 6 characters');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const pair = await api.redeemPairCode(trimmed);
      Alert.alert(
        'Linked!',
        `You are now connected with ${pair.partner.display_name} as their ${
          pair.role === 'sponsor' ? 'sponsor' : 'sponsee'
        }.`,
        [{ text: 'OK', onPress: onDone }],
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.payload?.message || err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <OrangeLabel text="ENTER A CODE" />
      <Text style={styles.hint}>
        Enter the 6-character code your sponsor or sponsee gave you.
      </Text>
      <TextInput
        style={[styles.input, styles.codeInput]}
        value={code}
        onChangeText={(v) => setCode(v.toUpperCase())}
        autoCapitalize="characters"
        autoCorrect={false}
        autoFocus
        maxLength={6}
        placeholder="A3F9K2"
        placeholderTextColor={COLORS.mediumGray}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost, { flex: 1, marginRight: 8 }]}
          onPress={onCancel}
        >
          <Text style={styles.btnGhostText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
          onPress={redeem}
          disabled={loading || code.length < 6}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.btnPrimaryText}>Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// =============================================================
// Data & Privacy — delete inventories, delete account
// =============================================================

const INVENTORY_TYPES = [
  { key: 'resentment', label: 'Resentment Inventory' },
  { key: 'fear', label: 'Fear Inventory' },
  { key: 'sex_conduct', label: 'Sex Conduct Inventory' },
];

function DataSection({ navigation, refreshAuth }) {
  const [busy, setBusy] = useState(null); // null | inventory type | 'account'

  const deleteOne = (type, label) => {
    Alert.alert(
      `Delete your ${label}?`,
      'This removes every entry in this inventory from your phone and from our servers. If you shared it with a sponsor, they lose access too. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setBusy(type);
            try {
              // Best-effort: server first, then local. If offline, still clear local.
              try {
                await api.deleteInventory(type);
              } catch (e) {
                // offline or 404 — still wipe local so it feels consistent
              }
              await deleteLocalInventory(type);
              Alert.alert('Deleted', `Your ${label} has been removed.`);
            } catch (err) {
              Alert.alert('Could not delete', err.message);
            } finally {
              setBusy(null);
            }
          },
        },
      ],
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      "This permanently removes:\n\n• Your display name\n• All three of your inventories (local and on our servers)\n• Your connections to any sponsor or sponsee\n• All progress you've marked together\n\nAnyone currently paired with you will lose access immediately. This cannot be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: () => {
            // Second confirmation — Apple guidance for destructive account actions.
            Alert.alert(
              'Are you absolutely sure?',
              'Last chance to back out.',
              [
                { text: 'Never mind', style: 'cancel' },
                {
                  text: 'Yes, delete my account',
                  style: 'destructive',
                  onPress: async () => {
                    setBusy('account');
                    try {
                      await api.deleteMe();
                    } catch (e) {
                      // If offline or already deleted, keep going with local wipe
                    }
                    // Scorched-earth local wipe
                    try {
                      await AsyncStorage.clear();
                    } catch (e) {}
                    // Bounce back through AuthContext → onboarding screen
                    await refreshAuth();
                    Alert.alert(
                      'Account deleted',
                      'All your data has been removed. You can start over any time.',
                    );
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <Card>
      <OrangeLabel text="YOUR DATA" />
      <Text style={styles.hint}>
        Delete any inventory or your entire account. Deletion is immediate
        and cannot be undone.
      </Text>

      {INVENTORY_TYPES.map((inv) => (
        <TouchableOpacity
          key={inv.key}
          style={styles.dangerRow}
          onPress={() => deleteOne(inv.key, inv.label)}
          disabled={busy === inv.key}
        >
          <Text style={styles.dangerRowText}>
            Delete my {inv.label}
          </Text>
          {busy === inv.key ? (
            <ActivityIndicator size="small" color="#B44848" />
          ) : (
            <Text style={styles.dangerRowArrow}>›</Text>
          )}
        </TouchableOpacity>
      ))}

      <Divider />

      <TouchableOpacity
        style={[styles.btn, styles.btnDanger]}
        onPress={deleteAccount}
        disabled={busy === 'account'}
      >
        {busy === 'account' ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnDangerText}>Delete my account</Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}

// =============================================================
// Styles
// =============================================================

const styles = StyleSheet.create({
  hint: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    lineHeight: 19,
    marginBottom: 12,
  },
  nameText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: COLORS.inkDark,
    marginBottom: 4,
  },
  input: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 17,
    color: COLORS.inkDark,
    backgroundColor: '#FFFBF3',
    borderWidth: 1,
    borderColor: '#EAD9BF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  codeInput: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 6,
  },
  codeDisplay: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 44,
    color: COLORS.orangeDark,
    textAlign: 'center',
    letterSpacing: 10,
    marginVertical: 18,
    backgroundColor: '#FFFBF3',
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 10,
    paddingVertical: 18,
  },
  row: { flexDirection: 'row', alignItems: 'center' },

  btn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.orange,
  },
  btnPrimaryText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.white,
    fontSize: 15,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FFFBF3',
  },
  btnOutlineText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 15,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnGhostText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.darkGray,
    fontSize: 14,
  },

  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#EAD9BF',
    backgroundColor: '#FFFBF3',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 14,
  },
  roleBtnActive: {
    borderColor: COLORS.orange,
    backgroundColor: '#FDF4E7',
  },
  roleText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    color: COLORS.darkGray,
  },
  roleTextActive: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
  },

  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pairRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#EEE2CD',
  },
  pairName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: COLORS.inkDark,
  },
  pairRole: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  unpairBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unpairText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#B44848',
  },

  error: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#B44848',
    marginBottom: 10,
    textAlign: 'center',
  },

  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE2CD',
  },
  dangerRowText: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    color: '#B44848',
  },
  dangerRowArrow: {
    fontSize: 22,
    color: '#B44848',
    marginLeft: 8,
  },
  btnDanger: {
    backgroundColor: '#B44848',
    marginTop: 4,
  },
  btnDangerText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
