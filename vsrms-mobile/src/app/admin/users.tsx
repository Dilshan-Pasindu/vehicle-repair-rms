import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUsers } from '@/features/auth/queries/queries';
import { useDeactivateUser } from '@/features/auth/queries/mutations';
import { User } from '@/features/auth/types/auth.types';

const ROLE_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  admin:           { label: 'Admin',      bg: '#FFF7ED', text: '#F56E0F' },
  workshop_owner:  { label: 'Garage Owner', bg: '#FFFBEB', text: '#D97706' },
  workshop_staff:  { label: 'Technician', bg: '#EFF6FF', text: '#2563EB' },
  customer:        { label: 'Customer',   bg: '#F0FDF4', text: '#059669' },
};

function UserCard({ user, onDeactivate }: { user: User; onDeactivate: (id: string) => void }) {
  const { theme } = useUnistyles();
  const roleCfg = ROLE_CONFIG[user.role] ?? { label: user.role, bg: '#F9FAFB', text: '#6B7280' };
  const initials = (user.fullName ?? user.email).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {/* AVATAR */}
        <View style={[styles.avatar, !user.active && styles.avatarInactive]}>
          <Text style={[styles.avatarText, !user.active && { color: '#9CA3AF' }]}>{initials}</Text>
        </View>

        {/* INFO */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{user.fullName ?? 'Unknown'}</Text>
            <View style={[styles.roleBadge, { backgroundColor: roleCfg.bg }]}>
              <Text style={[styles.roleText, { color: roleCfg.text }]}>{roleCfg.label}</Text>
            </View>
          </View>
          <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
          <View style={[styles.statusPill, user.active ? styles.statusActive : styles.statusInactive]}>
            <View style={[styles.statusDot, { backgroundColor: user.active ? '#10B981' : '#9CA3AF' }]} />
            <Text style={[styles.statusText, { color: user.active ? '#059669' : '#9CA3AF' }]}>
              {user.active ? 'Active' : 'Deactivated'}
            </Text>
          </View>
        </View>

        {/* ACTION */}
        {user.active && (
          <TouchableOpacity
            style={styles.deactivateBtn}
            onPress={() => onDeactivate(user.id ?? '')}
            hitSlop={8}
          >
            <Ionicons name="person-remove-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function UserManagementScreen() {
  const { theme } = useUnistyles();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useUsers();
  const { mutate: deactivate, isPending: deactivating } = useDeactivateUser();

  const handleDeactivate = (id: string) => {
    Alert.alert(
      'Deactivate User',
      'This user will be blocked from logging in. This cannot be undone from the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive', onPress: () => deactivate(id) },
      ],
    );
  };

  const users = (data?.data ?? []).filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (u.fullName ?? '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSub}>{data?.total ?? 0} registered</Text>
        </View>
        {deactivating && <ActivityIndicator color={theme.colors.brand} />}
      </View>

      {/* SEARCH */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={theme.colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor={theme.colors.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={theme.colors.brand} />
        : (
          <FlashList<User>
            data={users}
            keyExtractor={u => u.id ?? u.email}
            renderItem={({ item }) => <UserCard user={item} onDeactivate={handleDeactivate} />}
            estimatedItemSize={100}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No users found." />}
          />
        )
      }
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: theme.spacing.md, marginBottom: 16,
    paddingHorizontal: 14, height: 48,
    backgroundColor: theme.colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: theme.colors.border, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.text },

  list: { paddingHorizontal: theme.spacing.md, paddingBottom: 120 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
  },
  avatarInactive: { backgroundColor: theme.colors.background },
  avatarText: { fontSize: 18, fontWeight: '800', color: theme.colors.brand },

  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flexShrink: 1 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  email: { fontSize: 12, color: theme.colors.muted },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusInactive: { backgroundColor: '#F3F4F6' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },

  deactivateBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center',
  },
}));
