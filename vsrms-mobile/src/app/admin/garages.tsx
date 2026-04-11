import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert, TextInput,
  ActivityIndicator, Modal, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWorkshops } from '@/features/workshops/queries/queries';
import { useCreateWorkshop, useDeleteWorkshop } from '@/features/workshops/queries/mutations';
import { Workshop, CreateWorkshopPayload } from '@/features/workshops/types/workshops.types';

// ─── Create Modal ─────────────────────────────────────────────────────────────
function CreateModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useUnistyles();
  const { mutate: create, isPending } = useCreateWorkshop();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [contact, setContact] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName(''); setAddress(''); setDistrict('');
    setContact(''); setLat(''); setLng(''); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = () => {
    if (!name.trim() || !address.trim() || !district.trim() || !contact.trim()) {
      setError('Name, address, district and contact are required.'); return;
    }
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Enter valid latitude and longitude.'); return;
    }
    setError('');

    const payload: CreateWorkshopPayload = {
      name: name.trim(),
      address: address.trim(),
      district: district.trim(),
      contactNumber: contact.trim(),
      location: { type: 'Point', coordinates: [lngNum, latNum] },
    };
    create(payload, { onSuccess: handleClose });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={modal.container}>
          {/* Header */}
          <View style={modal.header}>
            <Text style={modal.title}>New Workshop</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={modal.body} keyboardShouldPersistTaps="handled">
            {error ? (
              <View style={modal.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                <Text style={modal.errorText}>{error}</Text>
              </View>
            ) : null}

            {[
              { label: 'Workshop Name *', value: name, set: setName, placeholder: 'e.g. AutoFix Colombo' },
              { label: 'Address *', value: address, set: setAddress, placeholder: 'e.g. 123 Main St, Colombo 03' },
              { label: 'District *', value: district, set: setDistrict, placeholder: 'e.g. Colombo' },
              { label: 'Contact Number *', value: contact, set: setContact, placeholder: '+94 77 123 4567', keyboardType: 'phone-pad' as any },
              { label: 'Latitude *', value: lat, set: setLat, placeholder: '6.9271', keyboardType: 'numeric' as any },
              { label: 'Longitude *', value: lng, set: setLng, placeholder: '79.8612', keyboardType: 'numeric' as any },
            ].map(f => (
              <View key={f.label} style={modal.field}>
                <Text style={modal.label}>{f.label}</Text>
                <TextInput
                  style={modal.input}
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.placeholder}
                  placeholderTextColor={theme.colors.muted}
                  keyboardType={f.keyboardType}
                  autoCapitalize="none"
                />
              </View>
            ))}

            <TouchableOpacity
              style={[modal.submitBtn, isPending && { opacity: 0.6 }]}
              onPress={handleCreate}
              disabled={isPending}
            >
              {isPending
                ? <ActivityIndicator color="#fff" />
                : <Text style={modal.submitText}>Create Workshop</Text>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Workshop Card ─────────────────────────────────────────────────────────────
function WorkshopCard({ item, onDelete }: { item: Workshop; onDelete: (id: string) => void }) {
  const { theme } = useUnistyles();
  const id = item._id ?? item.id ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {/* Icon */}
        <View style={styles.iconBox}>
          <Ionicons name="build-outline" size={22} color={theme.colors.brand} />
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color={theme.colors.muted} />
            <Text style={styles.metaText} numberOfLines={1}>{item.address}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="business-outline" size={12} color={theme.colors.muted} />
            <Text style={styles.metaText}>{item.district}</Text>
          </View>
        </View>

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(id)}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Rating + services row */}
      <View style={styles.footerRow}>
        <View style={styles.ratingChip}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {item.averageRating > 0 ? item.averageRating.toFixed(1) : 'New'} · {item.totalReviews} reviews
          </Text>
        </View>
        {item.servicesOffered && item.servicesOffered.length > 0 && (
          <Text style={styles.services} numberOfLines={1}>
            {item.servicesOffered.slice(0, 3).join(' · ')}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function GarageManagementScreen() {
  const { theme } = useUnistyles();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, refetch } = useWorkshops();
  const { mutate: remove, isPending: deleting } = useDeleteWorkshop();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Workshop',
      'This will permanently remove the workshop and all associated data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
      ],
    );
  };

  const workshops = (data ?? []).filter(w => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return w.name.toLowerCase().includes(q) || w.district.toLowerCase().includes(q) || w.address.toLowerCase().includes(q);
  });

  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <CreateModal visible={showCreate} onClose={() => setShowCreate(false)} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Workshops</Text>
          <Text style={styles.headerSub}>{data?.length ?? 0} registered</Text>
        </View>
        <View style={styles.headerRight}>
          {deleting && <ActivityIndicator color={theme.colors.brand} style={{ marginRight: 8 }} />}
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(true)}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={theme.colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, district, address..."
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
          <FlashList<Workshop>
            data={workshops}
            keyExtractor={w => w._id ?? w.id ?? w.name}
            renderItem={({ item }) => <WorkshopCard item={item} onDelete={handleDelete} />}
            estimatedItemSize={140}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No workshops found." />}
          />
        )
      }
    </ScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  addBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: theme.colors.brand, alignItems: 'center', justifyContent: 'center',
  },

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
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  iconBox: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1, gap: 3 },
  cardName: { fontSize: 15, fontWeight: '800', color: theme.colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: theme.colors.muted, flex: 1 },

  deleteBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center',
  },

  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  services: { flex: 1, fontSize: 11, color: theme.colors.muted, fontWeight: '500' },
}));

const modal = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.md,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  body: { padding: theme.spacing.md, gap: 16, paddingBottom: 60 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626', fontWeight: '600' },

  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  input: {
    height: 48, paddingHorizontal: 14, borderRadius: 10,
    borderWidth: 1, borderColor: theme.colors.border,
    backgroundColor: theme.colors.background, fontSize: 14, color: theme.colors.text,
  },

  submitBtn: {
    height: 52, borderRadius: 12, backgroundColor: theme.colors.brand,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
}));
