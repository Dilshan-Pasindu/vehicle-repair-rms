import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} (${a.vehicleId.registrationNo})`;
  }
  return 'Vehicle';
}

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { user } = useAuth();

  const workshopId = user?.workshopId;
  const { data: pending,    isLoading: pLoad } = useWorkshopAppointments(workshopId, 'pending');
  const { data: inProgress, isLoading: iLoad } = useWorkshopAppointments(workshopId, 'in_progress');
  const { data: confirmed,  isLoading: cLoad } = useWorkshopAppointments(workshopId, 'confirmed');
  const anyLoading = pLoad || iLoad || cLoad;

  const initials = (user?.fullName ?? user?.email ?? 'TN')
    .split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const myJobs = [...(inProgress ?? []), ...(confirmed ?? [])].slice(0, 5);

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Technician Dashboard</Text>
          <Text style={styles.headerTitle}>Hello, {user?.fullName?.split(' ')[0] ?? 'Technician'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "In Progress", value: inProgress?.length ?? 0, loading: iLoad, color: theme.colors.brand },
            { label: "Pending",     value: pending?.length ?? 0,    loading: pLoad, color: '#F59E0B' },
            { label: "Confirmed",   value: confirmed?.length ?? 0,  loading: cLoad, color: '#10B981' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              {s.loading
                ? <ActivityIndicator size="small" color={s.color} style={{ marginVertical: 4 }} />
                : <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              }
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* My Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active & Upcoming Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/staff/tracker' as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {anyLoading
            ? <ActivityIndicator color={theme.colors.brand} style={{ marginTop: 12 }} />
            : myJobs.length === 0
              ? (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-done-circle-outline" size={36} color={theme.colors.muted} />
                  <Text style={styles.emptyText}>No jobs assigned right now</Text>
                </View>
              )
              : myJobs.map(a => (
                <TouchableOpacity
                  key={a._id}
                  style={styles.taskCard}
                  activeOpacity={0.7}
                  onPress={() => router.push('/staff/tracker' as any)}
                >
                  <View style={styles.taskHeader}>
                    <View style={[
                      styles.statusBadge,
                      a.status === 'in_progress' ? styles.statusActive : styles.statusConfirmed,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        a.status === 'in_progress' ? styles.textActive : styles.textConfirmed,
                      ]}>{a.status === 'in_progress' ? 'In Progress' : 'Confirmed'}</Text>
                    </View>
                    <Text style={styles.taskDate}>
                      {new Date(a.scheduledDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <Text style={styles.taskTitle}>{a.serviceType}</Text>
                  <View style={styles.vehicleRow}>
                    <Ionicons name="car-outline" size={14} color={theme.colors.muted} />
                    <Text style={styles.vehicleText}>{getVehicleLabel(a)}</Text>
                  </View>
                </TouchableOpacity>
              ))
          }
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsBox}>
            {[
              { icon: 'calendar-outline' as const,  label: 'Appointments', href: '/staff/appointments' },
              { icon: 'hammer-outline' as const,     label: 'Job Tracker',  href: '/staff/tracker'      },
              { icon: 'document-text-outline' as const, label: 'New Record', href: '/staff/record'      },
            ].map(a => (
              <TouchableOpacity
                key={a.label}
                style={styles.actionBtn}
                activeOpacity={0.7}
                onPress={() => router.push(a.href as any)}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={a.icon} size={22} color={theme.colors.brand} />
                </View>
                <Text style={styles.actionText}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerSub: { fontSize: 12, color: theme.colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(245,110,15,0.2)',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: theme.colors.brand },

  scroll: { padding: theme.spacing.md, paddingBottom: 120 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: 14, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 10, color: theme.colors.muted, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text, marginBottom: 14 },
  seeAll: { fontSize: 13, fontWeight: '700', color: theme.colors.brand, marginBottom: 14 },

  taskCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border, elevation: 1,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusActive: { backgroundColor: theme.colors.brandSoft },
  statusConfirmed: { backgroundColor: '#ECFDF5' },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  textActive: { color: theme.colors.brand },
  textConfirmed: { color: '#059669' },
  taskDate: { fontSize: 12, color: theme.colors.muted, fontWeight: '600' },
  taskTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  vehicleText: { fontSize: 12, color: theme.colors.muted, fontWeight: '500' },

  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: theme.colors.muted },

  actionsBox: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, borderWidth: 1, borderColor: 'rgba(245,110,15,0.15)',
  },
  actionText: { fontSize: 11, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
}));
