import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../api/AuthContext';
import { COLORS } from '../data/content';

export default function OnboardingScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    setSubmitting(true);
    try {
      await register(trimmed);
    } catch (err) {
      Alert.alert('Something went wrong', err.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <View style={styles.content}>
          <Text style={styles.script}>Welcome</Text>
          <Text style={styles.tagline}>
            How should we show your name to your sponsor or sponsee?
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="First name or initials"
            placeholderTextColor={COLORS.mediumGray}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            maxLength={60}
          />

          <Text style={styles.hint}>
            You can change this anytime. No email, no password — this is all we need.
          </Text>

          <TouchableOpacity
            style={[styles.button, (!name.trim() || submitting) && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={!name.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  inner: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  script: {
    fontFamily: 'GreatVibes_400Regular',
    fontSize: 72,
    color: COLORS.inkDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 16,
    color: COLORS.inkDark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
    paddingHorizontal: 16,
  },
  input: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    color: COLORS.inkDark,
    backgroundColor: '#FFFBF3',
    borderWidth: 1,
    borderColor: '#EAD9BF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  hint: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 28,
  },
  button: {
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#7A4A20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});
