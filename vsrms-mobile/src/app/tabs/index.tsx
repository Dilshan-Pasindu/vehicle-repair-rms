import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Car, ChevronRight, Calendar, Settings } from 'lucide-react-native';
import { Colors, Spacing, CustomBorders, Shadows } from '../../constants/theme';

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth/login' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.surface} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>Seneja Thehansi</Text>
        </View>
        <TouchableOpacity style={styles.avatarBox} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.avatarText}>ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* STATS ROW */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
                <Car size={18} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Calendar size={18} color="#059669" />
            </View>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Active Appt.</Text>
          </View>
        </View>

        {/* RECENT VEHICLES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/vehicles' as any)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push('/tabs/vehicles/1' as any)}
          >
            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Car size={24} color={Colors.light.text} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Honda Civic 2020</Text>
                <Text style={styles.cardSubtitle}>CBA-1234 • Last Serviced: Oct 12, 2024</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ACTIVE APPOINTMENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/appointments' as any)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.apptCard}>
            <View style={styles.apptHeader}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
              <Text style={styles.apptDate}>Tomorrow, 10:00 AM</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.apptTitle}>Full Service & Oil Change</Text>
            <Text style={styles.apptSub}>For Honda Civic (CBA-1234)</Text>
            <View style={styles.garageBox}>
              <Settings size={16} color={Colors.light.textMuted} style={{ marginRight: 8, marginTop: 2 }} />
              <View>
                <Text style={styles.garageName}>AutoCare Garage Colombo</Text>
                <Text style={styles.garageAddress}>123 Main St, Colombo 03</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTextContainer: { flex: 1 },
  greeting: { fontSize: 13, color: Colors.light.textMuted, fontWeight: '600', marginBottom: 2 },
  userName: { fontSize: 20, color: Colors.light.text, fontWeight: '800', letterSpacing: -0.3 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: CustomBorders.radius.md,
    backgroundColor: Colors.light.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: Colors.light.primary },

  scroll: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: CustomBorders.radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.sm,
  },
  statIconBox: {
      width: 36,
      height: 36,
      borderRadius: CustomBorders.radius.sm,
      backgroundColor: Colors.light.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.three,
  },
  statValue: { fontSize: 32, fontWeight: '900', color: Colors.light.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.light.textMuted, fontWeight: '600', textTransform: 'uppercase' },

  section: { marginBottom: Spacing.five },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.three,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text },
  linkText: { fontSize: 14, fontWeight: '700', color: Colors.light.primary },

  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: CustomBorders.radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: CustomBorders.radius.sm,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: Colors.light.textMuted, fontWeight: '500' },

  /* Appt Card */
  apptCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: CustomBorders.radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
    ...Shadows.sm,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#047857' },
  apptDate: { fontSize: 13, fontWeight: '700', color: Colors.light.text },

  divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.three },

  apptTitle: { fontSize: 17, fontWeight: '800', color: Colors.light.text, marginBottom: 4 },
  apptSub: { fontSize: 14, color: Colors.light.textMuted, fontWeight: '500', marginBottom: Spacing.three },

  garageBox: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: CustomBorders.radius.md,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  garageName: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 2 },
  garageAddress: { fontSize: 13, color: Colors.light.textMuted },
});
