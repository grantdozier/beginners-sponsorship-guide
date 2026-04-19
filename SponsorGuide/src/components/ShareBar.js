import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { api } from '../api/client';
import { usePairs } from '../api/usePairs';
import { COLORS } from '../data/content';

/**
 * Bar shown at the top of each inventory's "My Inventory" tab.
 * - If no pairs: prompts to link with a partner
 * - If paired: shows "Share with [sponsor-name]" button and status
 *
 * Props:
 *   type: 'resentment' | 'fear' | 'sex_conduct'
 *   shared: boolean
 *   sharedAt: ISO timestamp or null
 *   onShared: callback after successful share
 */
export default function ShareBar({ type, shared, sharedAt, onShared }) {
  const { pairs, loading } = usePairs();
  const navigation = useNavigation();
  const [busy, setBusy] = useState(false);

  // We share WITH a sponsor — so only pairs where MY role is 'sponsee' are relevant.
  const sponsors = pairs.filter((p) => p.role === 'sponsee');

  const doShare = async () => {
    setBusy(true);
    try {
      const result = await api.shareInventory(type);
      onShared?.(result);
      Alert.alert(
        'Shared',
        `Your ${labelFor(type)} is now visible to ${sponsors.map((s) => s.partner.display_name).join(', ')}.`,
      );
    } catch (err) {
      Alert.alert('Could not share', err.message);
    } finally {
      setBusy(false);
    }
  };

  const doUnshare = () => {
    Alert.alert(
      'Unshare this inventory?',
      `Your sponsor will immediately lose access. Your own copy stays on your phone untouched. You can re-share any time.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unshare',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              const result = await api.unshareInventory(type);
              onShared?.(result);
            } catch (err) {
              Alert.alert('Could not unshare', err.message);
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator size="small" color={COLORS.orange} />
      </View>
    );
  }

  if (sponsors.length === 0) {
    return (
      <View style={styles.wrap}>
        <View style={{ flex: 1 }}>
          <Text style={styles.prompt}>Your work is only on this phone</Text>
          <Text style={styles.promptSub}>
            Link with a sponsor to share this with them.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.linkBtnText}>Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, shared && styles.wrapShared]}>
      <LockIcon open={shared} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        {shared ? (
          <>
            <Text style={styles.sharedTitle}>Shared with your sponsor</Text>
            {sharedAt ? (
              <Text style={styles.sharedSub}>
                Last shared {relativeTime(sharedAt)}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.prompt}>Private to you</Text>
            <Text style={styles.promptSub}>
              When you're ready, share this with {sponsors[0].partner.display_name}.
            </Text>
          </>
        )}
      </View>
      {shared ? (
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.reshareBtn}
            onPress={doShare}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={COLORS.orangeDark} />
            ) : (
              <Text style={styles.reshareBtnText}>Re-share</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.unshareBtn}
            onPress={doUnshare}
            disabled={busy}
          >
            <Text style={styles.unshareBtnText}>Unshare</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={doShare}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.shareBtnText}>Share</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

function LockIcon({ open }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Path
        d={open
          ? 'M6 10 L6 7 Q6 3 11 3 Q14 3 15 5'
          : 'M6 10 L6 7 Q6 3 11 3 Q16 3 16 7 L16 10'}
        stroke={open ? '#4C8A3F' : COLORS.orangeDark}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M4 10 L18 10 L18 19 L4 19 Z"
        stroke={open ? '#4C8A3F' : COLORS.orangeDark}
        strokeWidth="1.6"
        fill="#FFFBF3"
      />
    </Svg>
  );
}

function labelFor(type) {
  switch (type) {
    case 'resentment': return 'Resentment Inventory';
    case 'fear': return 'Fear Inventory';
    case 'sex_conduct': return 'Sex Conduct Inventory';
    default: return type;
  }
}

function relativeTime(iso) {
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
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFFBF3',
    borderWidth: 1,
    borderColor: '#EAD9BF',
  },
  wrapShared: {
    backgroundColor: '#F1F7EC',
    borderColor: '#C7DDB4',
  },
  prompt: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.orangeDark,
  },
  promptSub: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  sharedTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: '#3D6B2E',
  },
  sharedSub: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: '#5A7E4C',
    marginTop: 2,
  },
  linkBtn: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkBtnText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.white,
    fontSize: 13,
  },
  shareBtn: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareBtnText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.white,
    fontSize: 14,
  },
  reshareBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#5A7E4C',
  },
  reshareBtnText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#3D6B2E',
    fontSize: 13,
  },
  btnGroup: {
    alignItems: 'flex-end',
  },
  unshareBtn: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  unshareBtnText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: '#8A5A5A',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
