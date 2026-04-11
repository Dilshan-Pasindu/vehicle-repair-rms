import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshop } from '@/features/workshops/queries/queries';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';

function getCustomerLabel(a: Appointment): string {
  if (typeof a.userId === 'object') return a.userId.fullName ?? a.userId.email;
  return 'Customer';
}

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} (${a.vehicleId.registrationNo})`;
  }
  return 'Vehicle';
}

export default function GarageDashboardScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { user } = useAuth();
  const workshopId = user?.workshopId;

  const { data: workshop, isLoading: wLoading } = useWorkshop(workshopId ?? '');
  const { data: pending,    isLoading: pLoading } = useWorkshopAppointments(workshopId, 'pending');
  const { data: inProgress, isLoading: iLoading } = useWorkshopAppointments(workshopId, 'in_progress');
  const { data: confirmed,  isLoading: cLoading } = useWorkshopAppointments(workshopId, 'confirmed');

  const anyLoading = wLoading || pLoading || iLoading || cLoading;

  const stats = [
    { label: 'Pending',     value: pending?.length ?? 0,    icon: 'time-outline' as const,                      color: '#F59E0B' },
    { label: 'Active Jobs', value: inProgress?.length ?? 0, icon: 'hammer-outline' as const,                    color: theme.colors.brand },
    { label: 'Confirmed',   value: confirmed?.length ?? 0,  icon: 'checkmark-circle-outline' as const,          color: '#10B981' },
  ];

  const recentActivity = [...(pending ?? []), ...(confirmed ?? [])].slice(0, 5);

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSub}>Service Center</Text>
          {wLoading
            ? <ActivityIndicator size="small" color={theme.colors.brand} />
            : <Text style={styles.headerTitle} numberOfLines={1}>{workshop?.name ?? 'Dashboard'}</Text>
          }
        </View>
        <View style={styles.headerRight}>
          <View style={styles.ratingChip}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.ratingText}>{(workshop?.averageRating ?? 0).toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: s.color + '15' }]}>
                <Ionicons name={s.icon} size={22} color={s.color} />
              </View>
              {anyLoading
                ? <ActivityIndicator size="small" color={s.color} style={{ marginVertical: 6 }} />
                : <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              }
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsBox}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/garage/create-record' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="document-text" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>New Record</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/garage/bookings' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="calendar" size={24} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/garage/jobs' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="hammer" size={24} color={theme.colors.brand} />
              </View>
              <Text style={styles.actionText}>Active Jobs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => router.push('/garage/bookings' as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {pLoading || cLoading
            ? <ActivityIndicator color={theme.colors.brand} style={{ marginTop: 12 }} />
            : recentActivity.length === 0
              ? (
                <View style={styles.emptyActivity}>
                  <Ionicons name="calendar-outline" size={32} color={theme.colors.muted} />
                  <Text style={styles.emptyText}>No recent bookings</Text>
                </View>
              )
              : recentActivity.map((a) => (
                <View key={a._id} style={styles.activityItem}>
                  <View style={[
                    styles.activityDot,
                    { backgroundColor: a.status === 'pending' ? '#F59E0B' : '#10B981' },
                  ]} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{getCustomerLabel(a)} · {getVehicleLabel(a)}</Text>
                    <Text style={styles.activitySub}>
                      {a.serviceType} ·{' '}
                      {new Date(a.scheduledDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusPill,
                    { backgroundColor: a.status === 'pending' ? '#FFFBEB' : '#ECFDF5' },
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: a.status === 'pending' ? '#D97706' : '#059669' },
                    ]}>{a.status}</Text>
                  </View>
                </View>
              ))
          }
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
  headerLeft: { flex: 1 },
  headerSub: { fontSize: 12, color: theme.colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginTop: 2 },
  headerRight: { marginLeft: 12 },
  ratingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#92400E' },

  scroll: { padding: theme.spacing.md, paddingBottom: 100 },

  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: 14, borderWidth: 1, borderColor: theme.colors.border,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 26, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 10, color: theme.colors.muted, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text },
  seeAll: { fontSize: 13, fontWeight: '700', color: theme.colors.brand },

  actionsBox: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIcon: {
    width: 60, height: 60, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  actionText: { fontSize: 11, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },

  activityItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  activitySub: { fontSize: 12, color: theme.colors.muted, marginTop: 1 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  emptyActivity: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: theme.colors.muted, fontWeight: '500' },
}));
