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
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, CustomBorders, Shadows } from '../../constants/theme';
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from 'lucide-react-native';


export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [persona, setPersona] = useState<'owner' | 'garage' | 'admin' | 'staff'>('owner');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 1;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await signIn(email, password, persona);
      
      // Navigate on success
      if (persona === 'owner') {
        router.replace('/tabs' as any);
      } else if (persona === 'admin') {
        router.replace('/admin' as any);
      } else if (persona === 'staff') {
        router.replace('/staff' as any);
      } else {
        router.replace('/garage' as any);
      }
    } catch (error: any) {
      alert('Authentication failed: ' + (error.message || 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => [
    styles.input,
    focusField === field && styles.inputFocused,
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── CARD ── */}
          <View style={styles.card}>

            {/* Logo / Brand */}
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <ShieldCheck color={Colors.light.surface} size={28} />
              </View>
              <View>
                <Text style={styles.appName}>VSRMS</Text>
                <Text style={styles.appTagline}>Vehicle Service & Repair</Text>
              </View>
            </View>

            <View style={styles.dividerLine} />

            {/* Title */}
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Sign in to your account to continue
            </Text>

            {/* Persona Selector */}
            <View style={styles.field}>
              <Text style={styles.label}>Login as</Text>
              <View style={styles.personaRow}>
                <TouchableOpacity 
                  style={[styles.personaChip, persona === 'owner' && styles.personaChipActive]}
                  onPress={() => setPersona('owner')}
                >
                  <Text style={[styles.personaText, persona === 'owner' && styles.personaTextActive]}>Vehicle Owner</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.personaChip, persona === 'garage' && styles.personaChipActive]}
                  onPress={() => setPersona('garage')}
                >
                  <Text style={[styles.personaText, persona === 'garage' && styles.personaTextActive]}>Service Center</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.personaChip, persona === 'admin' && styles.personaChipActive]}
                  onPress={() => setPersona('admin')}
                >
                  <Text style={[styles.personaText, persona === 'admin' && styles.personaTextActive]}>Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.personaChip, persona === 'staff' && styles.personaChipActive]}
                  onPress={() => setPersona('staff')}
                >
                  <Text style={[styles.personaText, persona === 'staff' && styles.personaTextActive]}>Technician</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email / Username</Text>
              <View style={[styles.inputRow, focusField === 'email' && styles.inputFocused]}>
                <Mail size={18} color={focusField === 'email' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputFlat}
                  placeholder="Enter your email or username"
                  placeholderTextColor={Colors.light.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, focusField === 'password' && styles.inputFocused]}>
                <Lock size={18} color={focusField === 'password' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputFlat}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.light.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPwd(v => !v)} style={styles.eyeBtn}>
                  {showPwd ? <EyeOff size={20} color={Colors.light.primary} /> : <Eye size={20} color={Colors.light.primary} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot */}
            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <TouchableOpacity
              style={[styles.btnPrimary, !canSubmit && styles.btnMuted]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={!canSubmit || loading}
            >
              {loading
                ? <ActivityIndicator color={Colors.light.surface} size="small" />
                : <Text style={styles.btnText}>Sign In</Text>}
            </TouchableOpacity>

            {/* SSO Divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* SSO buttons */}
            <TouchableOpacity style={styles.ssoBtn} activeOpacity={0.8}>
              <View style={styles.ssoIconBox}>
                <Text style={styles.ssoIconText}>G</Text>
              </View>
              <Text style={styles.ssoBtnText}>Continue with Google</Text>
            </TouchableOpacity>

          </View>

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?  </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register' as any)} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Create an account</Text>
            </TouchableOpacity>
          </View>

          {/* Powered by */}
          <View style={styles.poweredRow}>
            <ShieldCheck size={14} color={Colors.light.textMuted} style={{marginRight: 4}} />
            <Text style={styles.poweredText}>Secured by </Text>
            <Text style={styles.poweredBrand}>Asgardeo</Text>
            <Text style={styles.poweredText}> · WSO2</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.light.background },
  flex:  { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },

  /* Card */
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: CustomBorders.radius.lg,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    ...Shadows.lg,
  },

  /* Brand */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: CustomBorders.radius.md,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName:    { fontSize: 20, fontWeight: '800', color: Colors.light.text, letterSpacing: 0.5 },
  appTagline: { fontSize: 12, color: Colors.light.textMuted, fontWeight: '500', marginTop: 2 },

  dividerLine: { height: 1, backgroundColor: Colors.light.border, marginBottom: Spacing.three },

  title:    { fontSize: 24, fontWeight: '800', color: Colors.light.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.light.textMuted, fontWeight: '400', marginBottom: Spacing.four, lineHeight: 20 },

  /* Form */
  field:  { marginBottom: Spacing.three },
  label:  { fontSize: 13, fontWeight: '600', color: Colors.light.text, marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: CustomBorders.radius.md,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
  },
  inputFocused: { borderColor: Colors.light.primary },
  inputRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: CustomBorders.radius.md,
    paddingHorizontal: Spacing.two,
    backgroundColor: Colors.light.surface,
  },
  inputIcon: { marginLeft: 6, marginRight: 8 },
  inputFlat: { flex: 1, fontSize: 15, color: Colors.light.text, height: '100%' },
  eyeBtn:  { paddingHorizontal: 8 },

  forgotRow: { alignSelf: 'flex-end', marginBottom: Spacing.four, marginTop: -6 },
  forgotText: { fontSize: 13, color: Colors.light.primary, fontWeight: '600' },

  /* Primary button */
  btnPrimary: {
    height: 54,
    backgroundColor: Colors.light.primary,
    borderRadius: CustomBorders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
    ...Shadows.md,
    shadowColor: Colors.light.primary,
  },
  btnMuted: { opacity: 0.6 },
  btnText:  { color: Colors.light.surface, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  /* OR divider */
  orRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.light.border },
  orText: { fontSize: 12, color: Colors.light.textMuted, fontWeight: '600' },

  /* SSO */
  ssoBtn: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: CustomBorders.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.three,
  },
  ssoIconBox: {
    width: 26,
    height: 26,
    borderRadius: 5,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  ssoIconText: { fontSize: 14, fontWeight: '900', color: Colors.light.text },
  ssoBtnText:  { fontSize: 15, fontWeight: '600', color: Colors.light.text },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  footerText: { fontSize: 14, color: Colors.light.textMuted },
  footerLink: { fontSize: 14, color: Colors.light.primary, fontWeight: '700' },

  poweredRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  poweredText:  { fontSize: 12, color: Colors.light.textMuted },
  poweredBrand: { fontSize: 12, color: Colors.light.primary, fontWeight: '700' },

  personaRow: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  personaChip: { flex: 1, minWidth: '45%', paddingVertical: 12, borderRadius: CustomBorders.radius.sm, borderWidth: 1.5, borderColor: Colors.light.border, alignItems: 'center' },
  personaChipActive: { borderColor: Colors.light.primary, backgroundColor: Colors.light.primaryMuted },
  personaText: { fontSize: 13, fontWeight: '700', color: Colors.light.textMuted },
  personaTextActive: { color: Colors.light.primary },
});
