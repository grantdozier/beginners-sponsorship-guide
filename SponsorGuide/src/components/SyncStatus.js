import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../data/content';

const LABELS = {
  loading: 'Loading…',
  idle: 'Saved',
  saving: 'Saving…',
  saved: 'Saved',
  offline: 'Offline — will sync later',
  error: 'Sync error',
};

const COLORS_BY_STATUS = {
  loading: COLORS.mediumGray,
  idle: COLORS.darkGray,
  saving: COLORS.orange,
  saved: '#4C8A3F',
  offline: '#B88236',
  error: '#B44848',
};

export default function SyncStatus({ status }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: COLORS_BY_STATUS[status] || COLORS.mediumGray }]} />
      <Text style={[styles.text, { color: COLORS_BY_STATUS[status] || COLORS.darkGray }]}>
        {LABELS[status] || status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
