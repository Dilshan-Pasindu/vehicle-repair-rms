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
import { register } from '../api/auth.api';

const ROLES = [
  { label: 'Vehicle Owner', value: 'Vehicle Owner', icon: 'person-outline' },
  { label: 'Garage Owner', value: 'Garage Owner', icon: 'business-outline' },
  { label: 'Technician', value: 'Technician', icon: 'construct-outline' },
] as const;

export function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('Vehicle Owner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!firstName.trim()) { setError('First name is required.'); return false; }
    if (!lastName.trim()) { setError('Last name is required.'); return false; }
    if (!email.trim() || !email.includes('@')) { setError('Valid email is required.'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await register({ firstName, lastName, email: email.trim().toLowerCase(), phone, password, role });
      router.replace('/auth/login' as any);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* BACK + HEADER */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join VSRMS — Sri Lanka's vehicle management platform</Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#B91C1C" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ROLE SELECTOR */}
          <Text style={styles.sectionLabel}>I am a...</Text>
          <View style={styles.roleRow}>
            {ROLES.map(r => (
              <TouchableOpacity
                key={r.value}
                style={[styles.roleChip, role === r.value && styles.roleChipActive]}
                onPress={() => setRole(r.value)}
                activeOpacity={0.8}
              >
                <Ionicons name={r.icon as any} size={16} color={role === r.value ? '#F56E0F' : '#6B7280'} />
                <Text style={[styles.roleChipText, role === r.value && styles.roleChipTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FORM */}
          <View style={styles.card}>
            <View style={styles.nameRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Perera"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="john@example.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone <Text style={styles.optional}>(optional)</Text></Text>
              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="07X XXX XXXX"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.registerBtnText}>Create Account</Text>
              }
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/login' as any)}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },

  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },

  title: { fontSize: 28, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 20 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 20,
    gap: 8, borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { color: '#B91C1C', fontSize: 13, fontWeight: '600', flex: 1 },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 10 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  roleChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  roleChipActive: { borderColor: '#F56E0F', backgroundColor: '#FFF7ED' },
  roleChipText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  roleChipTextActive: { color: '#F56E0F' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
  },
  nameRow: { flexDirection: 'row', gap: 12 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  optional: { fontWeight: '500', color: '#9CA3AF' },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, height: 50, fontSize: 14, color: '#1A1A2E', backgroundColor: '#FAFAFA',
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, height: 50, backgroundColor: '#FAFAFA',
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 14, color: '#1A1A2E' },

  registerBtn: {
    backgroundColor: '#F56E0F', borderRadius: 14, height: 54,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  registerBtnDisabled: { opacity: 0.65 },
  registerBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: '#6B7280' },
  loginText: { fontSize: 14, color: '#F56E0F', fontWeight: '800' },
}));
