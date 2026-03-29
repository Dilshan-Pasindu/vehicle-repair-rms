import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F5F5F5';
const CARD    = '#FFFFFF';
const TEXT    = '#1A1A2E';
const MUTED   = '#6B7280';
const BORDER  = '#D1D5DB';
const FOCUS   = '#FF7300';
const DIVIDER = '#E5E7EB';
const SUCCESS = '#16A34A';
const ERROR   = '#DC2626';

type Role = 'Vehicle Owner' | 'Garage Owner' | 'Technician' | 'Platform Admin';

const ROLES: { key: Role; label: string; icon: string }[] = [
  { key: 'Vehicle Owner', label: 'Vehicle Owner', icon: '⬡' },
  { key: 'Garage Owner',  label: 'Garage Owner',  icon: '⬡' },
  { key: 'Technician',    label: 'Technician',    icon: '⬡' },
  { key: 'Platform Admin', label: 'Platform Admin', icon: '⬡' },
];

export default function RegisterScreen() {
  const router = useRouter();

  const [step, setStep]               = useState<1 | 2>(1);
  const [role, setRole]               = useState<Role>('Vehicle Owner');
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [focusField, setFocusField]   = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const pwdMatch  = confirm.length > 0 && password === confirm;
  const pwdNoMatch = confirm.length > 0 && password !== confirm;

  const step1Valid = firstName.trim() && lastName.trim() && email.trim() && phone.trim();
  const step2Valid = password.length >= 8 && pwdMatch && agreed;

  const inputStyle = (field: string): any[] => [
    styles.input,
    focusField === field && styles.inputFocused,
  ];

  const handleNext = () => {
    if (step1Valid) setStep(2);
  };

  const handleSubmit = () => {
    if (!step2Valid) return;
    setLoading(true);
    // Simulation: redirect based on role
    setTimeout(() => {
      setLoading(false);
      if (role === 'Vehicle Owner') {
        router.replace('/tabs' as any);
      } else if (role === 'Platform Admin') {
        router.replace('/admin' as any);
      } else if (role === 'Technician') {
        router.replace('/staff' as any);
      } else {
        router.replace('/garage' as any);
      }
    }, 1500);
  };

  const PasswordStrength = () => {
    const len = password.length;
    const level = len === 0 ? 0 : len < 6 ? 1 : len < 10 ? 2 : 3;
    const colors = ['#E5E7EB', ERROR, '#F59E0B', SUCCESS];
    const labels = ['', 'Weak', 'Fair', 'Strong'];
    return (
      <View style={pStyles.row}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[pStyles.bar, { backgroundColor: level >= i ? colors[level] : '#E5E7EB' }]} />
        ))}
        {len > 0 && <Text style={[pStyles.label, { color: colors[level] }]}>{labels[level]}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── CARD ── */}
          <View style={styles.card}>

            {/* Brand */}
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <View style={styles.logoInner}>
                  <View style={styles.logoSquare} />
                  <View style={[styles.logoSquare, styles.logoSquareOrange]} />
                </View>
              </View>
              <View>
                <Text style={styles.appName}>VSRMS</Text>
                <Text style={styles.appTagline}>Vehicle Service & Repair</Text>
              </View>
            </View>

            <View style={styles.dividerLine} />

            {/* Title + Step indicator */}
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Step {step} of 2</Text>
              </View>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
                <View style={styles.stepConnector} />
                <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
              </View>
            </View>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <View>
                {/* Role */}
                <View style={styles.field}>
                  <Text style={styles.label}>I am registering as</Text>
                  <View style={styles.roleRow}>
                    {ROLES.map(r => (
                      <TouchableOpacity
                        key={r.key}
                        style={[styles.roleChip, role === r.key && styles.roleChipActive]}
                        onPress={() => setRole(r.key)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.roleText, role === r.key && styles.roleTextActive]}>
                          {r.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Name row */}
                <View style={styles.row2}>
                  <View style={[styles.field, { flex: 1 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={inputStyle('first')}
                      placeholder="John"
                      placeholderTextColor={MUTED}
                      value={firstName}
                      onChangeText={setFirstName}
                      onFocus={() => setFocusField('first')}
                      onBlur={() => setFocusField(null)}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={[styles.field, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={inputStyle('last')}
                      placeholder="Perera"
                      placeholderTextColor={MUTED}
                      value={lastName}
                      onChangeText={setLastName}
                      onFocus={() => setFocusField('last')}
                      onBlur={() => setFocusField(null)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.field}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={inputStyle('email')}
                    placeholder="you@example.com"
                    placeholderTextColor={MUTED}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusField('email')}
                    onBlur={() => setFocusField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Phone */}
                <View style={styles.field}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput
                    style={inputStyle('phone')}
                    placeholder="+94 77 123 4567"
                    placeholderTextColor={MUTED}
                    value={phone}
                    onChangeText={setPhone}
                    onFocus={() => setFocusField('phone')}
                    onBlur={() => setFocusField(null)}
                    keyboardType="phone-pad"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.btnPrimary, !step1Valid && styles.btnMuted]}
                  activeOpacity={0.85}
                  onPress={handleNext}
                  disabled={!step1Valid}
                >
                  <Text style={styles.btnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <View>
                {/* Password */}
                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[styles.inputRow, focusField === 'pwd' && styles.inputFocused]}>
                    <TextInput
                      style={styles.inputFlat}
                      placeholder="Min. 8 characters"
                      placeholderTextColor={MUTED}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusField('pwd')}
                      onBlur={() => setFocusField(null)}
                      secureTextEntry={!showPwd}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPwd(v => !v)} style={styles.eyeBtn}>
                      <Text style={styles.eyeText}>{showPwd ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                  </View>
                  {password.length > 0 && <PasswordStrength />}
                </View>

                {/* Confirm */}
                <View style={styles.field}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={[
                    styles.inputRow,
                    focusField === 'confirm' && styles.inputFocused,
                    pwdMatch   && styles.inputSuccess,
                    pwdNoMatch && styles.inputError,
                  ]}>
                    <TextInput
                      style={styles.inputFlat}
                      placeholder="Re-enter password"
                      placeholderTextColor={MUTED}
                      value={confirm}
                      onChangeText={setConfirm}
                      onFocus={() => setFocusField('confirm')}
                      onBlur={() => setFocusField(null)}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                      <Text style={styles.eyeText}>{showConfirm ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                  </View>
                  {pwdNoMatch && <Text style={styles.errMsg}>Passwords do not match</Text>}
                  {pwdMatch   && <Text style={styles.okMsg}>Passwords match</Text>}
                </View>

                {/* Terms */}
                <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(v => !v)} activeOpacity={0.8}>
                  <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                    {agreed && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                {/* Buttons */}
                <View style={styles.row2}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(1)} activeOpacity={0.8}>
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnPrimary, { flex: 1 }, !step2Valid && styles.btnMuted]}
                    activeOpacity={0.85}
                    onPress={handleSubmit}
                    disabled={!step2Valid || loading}
                  >
                    {loading
                      ? <ActivityIndicator color={WHITE} size="small" />
                      : <Text style={styles.btnText}>Create Account</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?  </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Powered by */}
          <View style={styles.poweredRow}>
            <Text style={styles.poweredText}>Secured by </Text>
            <Text style={styles.poweredBrand}>Asgardeo</Text>
            <Text style={styles.poweredText}> · WSO2</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const pStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  bar:   { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 11, fontWeight: '700', width: 48, textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: BG },
  flex:  { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
  },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  logoBox: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center',
  },
  logoInner: { flexDirection: 'row', flexWrap: 'wrap', width: 24, height: 24, gap: 3 },
  logoSquare: { width: 10, height: 10, borderRadius: 2, backgroundColor: WHITE },
  logoSquareOrange: { backgroundColor: BRAND },
  appName:    { fontSize: 18, fontWeight: '800', color: TEXT, letterSpacing: 0.5 },
  appTagline: { fontSize: 11, color: MUTED, fontWeight: '500', marginTop: 1 },

  dividerLine: { height: 1, backgroundColor: DIVIDER, marginBottom: 22 },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title:    { fontSize: 22, fontWeight: '800', color: TEXT },
  subtitle: { fontSize: 12, color: MUTED, marginTop: 2 },

  stepIndicator: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: DIVIDER },
  stepDotActive: { backgroundColor: BRAND },
  stepConnector: { width: 24, height: 2, backgroundColor: DIVIDER, marginHorizontal: 4 },

  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 7 },

  roleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  roleChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 6,
    borderWidth: 1.5, borderColor: BORDER, backgroundColor: WHITE,
  },
  roleChipActive: { borderColor: BRAND, backgroundColor: '#FFF4EC' },
  roleText: { fontSize: 13, fontWeight: '600', color: MUTED },
  roleTextActive: { color: BRAND },

  row2: { flexDirection: 'row', gap: 12, marginBottom: 16 },

  input: {
    height: 48, borderWidth: 1.5, borderColor: BORDER,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14, color: TEXT, backgroundColor: WHITE,
  },
  inputFocused: { borderColor: FOCUS },
  inputSuccess: { borderColor: SUCCESS },
  inputError:   { borderColor: ERROR },

  inputRow: {
    height: 48, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: BORDER, borderRadius: 8,
    paddingHorizontal: 14, backgroundColor: WHITE,
  },
  inputFlat: { flex: 1, fontSize: 14, color: TEXT, height: '100%' },
  eyeBtn: { paddingLeft: 8 },
  eyeText: { fontSize: 12, color: BRAND, fontWeight: '700' },

  errMsg: { fontSize: 11.5, color: ERROR, marginTop: 5, fontWeight: '500' },
  okMsg:  { fontSize: 11.5, color: SUCCESS, marginTop: 5, fontWeight: '500' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 24, marginTop: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    borderColor: BORDER, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  checkboxOn: { backgroundColor: BRAND, borderColor: BRAND },
  checkMark: { fontSize: 11, color: WHITE, fontWeight: '900' },
  termsText: { flex: 1, fontSize: 12.5, color: MUTED, lineHeight: 20 },
  termsLink: { color: BRAND, fontWeight: '700' },

  btnPrimary: {
    height: 48, backgroundColor: BRAND, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  btnMuted: { opacity: 0.45 },
  btnText:  { color: WHITE, fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  btnSecondary: {
    height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 20,
  },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: TEXT },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 13.5, color: MUTED },
  footerLink: { fontSize: 13.5, color: BRAND, fontWeight: '700' },

  poweredRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  poweredText:  { fontSize: 11, color: '#9CA3AF' },
  poweredBrand: { fontSize: 11, color: BRAND, fontWeight: '700' },
});
