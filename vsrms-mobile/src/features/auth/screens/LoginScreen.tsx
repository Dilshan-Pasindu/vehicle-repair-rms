import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { useAuth } from '@/providers/AuthProvider';

export function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      // AuthProvider sets user → _layout.tsx redirects to correct dashboard
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* BRAND HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <View style={styles.dotRow}>
                <View style={styles.whiteDot} />
                <View style={styles.orangeDot} />
              </View>
            </View>
            <View style={styles.titleCol}>
              <Text style={styles.logoText}>VSRMS</Text>
              <Text style={styles.logoSubtext}>Vehicle Service & Repair</Text>
            </View>
          </View>

          {/* SIGN IN CARD */}
          <View style={styles.card}>
            <Text style={styles.signInTitle}>Sign In</Text>
            <Text style={styles.signInSubtitle}>Enter your credentials to continue</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#B91C1C" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* SIGN IN BUTTON */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.signInBtnText}>Sign In</Text>
              }
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
              <Text style={styles.createText}>Create account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securedRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#9CA3AF" />
            <Text style={styles.securedText}> Secured by </Text>
            <Text style={styles.asgardeoText}>Asgardeo · WSO2</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40, gap: 14 },
  logoBox: {
    width: 52,
    height: 52,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotRow: { flexDirection: 'row', gap: 5 },
  whiteDot: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#FFFFFF' },
  orangeDot: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#F56E0F' },
  titleCol: {},
  logoText: { fontSize: 22, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.5 },
  logoSubtext: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginTop: 1 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  signInTitle: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginBottom: 6 },
  signInSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: { color: '#B91C1C', fontSize: 13, fontWeight: '600', flex: 1 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

  signInBtn: {
    backgroundColor: '#F56E0F',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#F56E0F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signInBtnDisabled: { opacity: 0.65 },
  signInBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  noAccountText: { fontSize: 14, color: '#6B7280' },
  createText: { fontSize: 14, color: '#F56E0F', fontWeight: '800' },

  securedRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  securedText: { fontSize: 12, color: '#9CA3AF' },
  asgardeoText: { fontSize: 12, color: '#F56E0F', fontWeight: '700' },
}));
