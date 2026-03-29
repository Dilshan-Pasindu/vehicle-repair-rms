import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const ORANGE = '#F56E0F';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F8F9FA';
const TEXT_MAIN = '#111111';
const TEXT_MUTED = '#666666';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO IMAGE ── */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://www.cisworld.lk/storage/categories/vehicle-management.jpg' }}
            style={styles.heroImage}
            contentFit="cover"
            transition={500}
          />
        </View>

        <View style={styles.contentContainer}>
          {/* ── BADGE ── */}
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Sri Lanka's #1 Vehicle App</Text>
          </View>

          {/* ── HEADLINE ── */}
          <View style={styles.headlineBlock}>
            <Text style={styles.h1}>Your Vehicle.</Text>
            <Text style={styles.h1Orange}>Fully Managed.</Text>
            <Text style={styles.sub}>
              Book garages, track repairs, and get smart maintenance reminders — all from your phone.
            </Text>
          </View>

          {/* ── STATS ── */}
          <View style={styles.statsRow}>
            {[
              { value: '500+', label: 'Garages' },
              { value: '12K+', label: 'Vehicles' },
              { value: '4.9', label: 'Rating', icon: 'star.fill' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.statCell}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    {s.icon && <Ionicons name="star" size={18} color={TEXT_MAIN} style={{ marginLeft: 2 }} />}
                  </View>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < 2 && <View style={styles.statSep} />}
              </React.Fragment>
            ))}
          </View>

          {/* ── BUTTONS ── */}
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={() => router.push('/auth/register' as any)}
            >
              <Text style={styles.btnPrimaryText}>Get Started Free</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.85}
              onPress={() => router.push('/auth/login' as any)}
            >
              <Text style={styles.btnSecondaryText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  /* Image */
  imageContainer: {
    width: '100%',
    height: 220,
    marginTop: 80,
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  /* Content */
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  /* Badge */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4EC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 24,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 110, 15, 0.15)',
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  badgeText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Headline */
  headlineBlock: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  h1: {
    fontSize: 42,
    fontWeight: '900',
    color: TEXT_MAIN,
    letterSpacing: -1,
    lineHeight: 48,
  },
  h1Orange: {
    fontSize: 42,
    fontWeight: '900',
    color: ORANGE,
    letterSpacing: -1,
    lineHeight: 48,
    marginBottom: 16,
  },
  sub: {
    fontSize: 15,
    color: TEXT_MUTED,
    lineHeight: 24,
    fontWeight: '500',
    paddingRight: 20,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 32,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.02)',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statSep: {
    width: 1,
    marginVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },

  /* Buttons */
  btnGroup: {
    gap: 16,
    paddingHorizontal: 24,
  },
  btnPrimary: {
    backgroundColor: ORANGE,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnPrimaryText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    backgroundColor: WHITE,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  btnSecondaryText: {
    color: TEXT_MAIN,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
