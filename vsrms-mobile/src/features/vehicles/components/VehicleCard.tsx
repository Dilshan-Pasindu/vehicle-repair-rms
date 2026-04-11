import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Vehicle } from '../types/vehicles.types';

const TYPE_ICON: Record<string, string> = {
  car:        'car-outline',
  motorcycle: 'bicycle-outline',
  tuk:        'car-outline',
  van:        'bus-outline',
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/tabs/vehicles/${vehicle._id ?? vehicle.id}` as any)}
    >
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name={(TYPE_ICON[vehicle.vehicleType] ?? 'car-outline') as any} size={24} color={theme.colors.text} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.details}>{vehicle.year} · {vehicle.registrationNo}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{vehicle.vehicleType.toUpperCase()}</Text>
        </View>
      </View>

      {vehicle.mileage ? (
        <>
          <View style={styles.divider} />
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Mileage:</Text>
            <Text style={styles.footerValue}>{vehicle.mileage.toLocaleString()} km</Text>
          </View>
        </>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  details: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },

  badge: { backgroundColor: theme.colors.brandSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', color: theme.colors.brand },

  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 12, color: theme.colors.muted, fontWeight: '600' },
  footerValue: { fontSize: 13, fontWeight: '800', color: theme.colors.text },
}));
