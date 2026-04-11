import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useAuth } from '@/hooks';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useVehicles } from '@/features/vehicles/queries/queries';
import { useMyAppointments } from '@/features/appointments/queries/queries';
import { Vehicle } from '@/features/vehicles/types/vehicles.types';
import { Appointment } from '@/features/appointments/types/appointments.types';

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  pending:     { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' },
  confirmed:   { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
  in_progress: { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
  completed:   { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  cancelled:   { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning,';
  if (h < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

function getWorkshopLabel(a: Appointment): string {
  if (typeof a.workshopId === 'object') return a.workshopId.name;
  return 'Workshop';
}

function getWorkshopAddress(a: Appointment): string {
  if (typeof a.workshopId === 'object') return a.workshopId.address;
  return '';
}

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} (${a.vehicleId.registrationNo})`;
  }
  return '';
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useUnistyles();

  const { data: vehicles, isLoading: vLoad } = useVehicles();
  const { data: appointments, isLoading: aLoad } = useMyAppointments('pending,confirmed,in_progress');

  const displayName = user?.fullName ?? user?.email ?? 'Guest';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const upcomingAppt = appointments?.[0] ?? null;
  const statusCfg = upcomingAppt ? (STATUS_CONFIG[upcomingAppt.status] ?? STATUS_CONFIG.pending) : null;

  return (
    <ScreenWrapper bg={theme.colors.background}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="car-outline" size={20} color="#3B82F6" />
            </View>
            {vLoad
              ? <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 2 }} />
              : <Text style={styles.statValue}>{vehicles?.length ?? 0}</Text>
            }
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.brandSoft }]}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.brand} />
            </View>
            {aLoad
              ? <ActivityIndicator size="small" color={theme.colors.brand} style={{ marginVertical: 2 }} />
              : <Text style={styles.statValue}>{appointments?.length ?? 0}</Text>
            }
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>

        {/* My Vehicles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/vehicles' as Href<string>)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          {vLoad
            ? <ActivityIndicator color={theme.colors.brand} style={{ marginTop: 8 }} />
            : (vehicles ?? []).length === 0
              ? (
                <TouchableOpacity
                  style={styles.addVehicleCard}
                  onPress={() => router.push('/tabs/vehicles' as Href<string>)}
                >
                  <Ionicons name="add-circle-outline" size={24} color={theme.colors.brand} />
                  <Text style={styles.addVehicleText}>Add your first vehicle</Text>
                </TouchableOpacity>
              )
              : (vehicles ?? []).slice(0, 2).map((v: Vehicle) => (
                <TouchableOpacity
                  key={v._id}
                  style={styles.vehicleCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/tabs/vehicles/${v._id}` as Href<string>)}
                >
                  <View style={styles.vehicleIconBox}>
                    <Ionicons
                      name={v.vehicleType === 'motorcycle' ? 'bicycle-outline' : 'car-outline'}
                      size={22}
                      color={theme.colors.text}
                    />
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleTitle}>{v.make} {v.model} {v.year}</Text>
                    <Text style={styles.vehicleSub}>{v.registrationNo}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
                </TouchableOpacity>
              ))
          }
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/schedule' as Href<string>)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          {aLoad
            ? <ActivityIndicator color={theme.colors.brand} style={{ marginTop: 8 }} />
            : !upcomingAppt
              ? (
                <TouchableOpacity
                  style={styles.addVehicleCard}
                  onPress={() => router.push('/tabs/workshops' as Href<string>)}
                >
                  <Ionicons name="calendar-outline" size={24} color={theme.colors.brand} />
                  <Text style={styles.addVehicleText}>Book your first appointment</Text>
                </TouchableOpacity>
              )
              : (
                <View style={[styles.apptCard, { borderLeftColor: statusCfg?.dot }]}>
                  <View style={styles.apptHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg?.bg }]}>
                      <View style={[styles.statusDot, { backgroundColor: statusCfg?.dot }]} />
                      <Text style={[styles.statusText, { color: statusCfg?.text }]}>
                        {upcomingAppt.status.replace('_', ' ')}
                      </Text>
                    </View>
                    <Text style={styles.apptDate}>
                      {new Date(upcomingAppt.scheduledDate).toLocaleDateString(undefined, {
                        weekday: 'short', day: 'numeric', month: 'short',
                      })}
                    </Text>
                  </View>

                  <Text style={styles.apptTitle}>{upcomingAppt.serviceType}</Text>
                  {getVehicleLabel(upcomingAppt) ? (
                    <Text style={styles.apptSub}>For {getVehicleLabel(upcomingAppt)}</Text>
                  ) : null}

                  <View style={styles.workshopBox}>
                    <Ionicons name="business-outline" size={14} color={theme.colors.muted} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.workshopName}>{getWorkshopLabel(upcomingAppt)}</Text>
                      {getWorkshopAddress(upcomingAppt) ? (
                        <Text style={styles.workshopAddr}>{getWorkshopAddress(upcomingAppt)}</Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              )
          }
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickLinks}>
            {[
              { icon: 'search-outline' as const,   label: 'Find Workshop', href: '/tabs/workshops' },
              { icon: 'calendar-outline' as const,  label: 'My Schedule',   href: '/tabs/schedule'  },
              { icon: 'car-sport-outline' as const, label: 'My Vehicles',   href: '/tabs/vehicles'  },
            ].map(q => (
              <TouchableOpacity
                key={q.label}
                style={styles.quickLink}
                onPress={() => router.push(q.href as Href<string>)}
                activeOpacity={0.7}
              >
                <View style={styles.quickLinkIcon}>
                  <Ionicons name={q.icon} size={22} color={theme.colors.brand} />
                </View>
                <Text style={styles.quickLinkText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  headerText: { flex: 1 },
  greeting: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },
  userName: { fontSize: 24, color: theme.colors.text, fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },
  avatar: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: theme.colors.brand,
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: theme.colors.brand },

  scroll: { padding: theme.spacing.lg },

  statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 32 },
  statCard: {
    flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 32, fontWeight: '900', color: theme.colors.text, marginBottom: 2 },
  statLabel: { fontSize: 10, color: theme.colors.muted, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.text },
  linkText: { fontSize: 14, fontWeight: '800', color: theme.colors.brand },

  vehicleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface, padding: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: theme.colors.border, marginBottom: 8,
  },
  vehicleIconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  vehicleInfo: { flex: 1 },
  vehicleTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.text },
  vehicleSub: { fontSize: 12, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },

  addVehicleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.colors.brandSoft, padding: 18, borderRadius: 14,
    borderWidth: 1.5, borderColor: theme.colors.brand, borderStyle: 'dashed',
  },
  addVehicleText: { fontSize: 14, fontWeight: '700', color: theme.colors.brand },

  apptCard: {
    backgroundColor: theme.colors.surface, borderRadius: 16,
    borderLeftWidth: 5, borderLeftColor: theme.colors.brand,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
    padding: 18,
  },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '800' },
  apptDate: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  apptTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.text, marginBottom: 4 },
  apptSub: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginBottom: 14 },
  workshopBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: theme.colors.background, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  workshopName: { fontSize: 13, fontWeight: '800', color: theme.colors.text },
  workshopAddr: { fontSize: 12, color: theme.colors.muted, fontWeight: '500', marginTop: 1 },

  quickLinks: { flexDirection: 'row', gap: 12 },
  quickLink: { flex: 1, alignItems: 'center' },
  quickLinkIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, borderWidth: 1, borderColor: 'rgba(245,110,15,0.2)',
  },
  quickLinkText: { fontSize: 11, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
}));
