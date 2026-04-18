import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../data/content';

/**
 * Label + hint + multi-line text input. Styled to match the cream/serif theme.
 * - label: serif label above the input
 * - hint: optional italic helper under the label
 * - value / onChangeText: controlled input
 * - placeholder: light placeholder text
 * - minHeight: default 54, grows with content up to maxHeight (default 500)
 */
export default function FormField({
  label,
  hint,
  value,
  onChangeText,
  placeholder,
  minHeight = 54,
  maxHeight = 500,
  multiline = true,
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <TextInput
        style={[styles.input, { minHeight }, { maxHeight }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mediumGray}
        multiline={multiline}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.orangeDark,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  hint: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 6,
    lineHeight: 17,
  },
  input: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: COLORS.inkDark,
    backgroundColor: '#FFFBF3',
    borderWidth: 1,
    borderColor: '#EAD9BF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    lineHeight: 22,
  },
});
