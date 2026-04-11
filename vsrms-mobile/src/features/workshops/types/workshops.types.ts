export interface Workshop {
  _id: string;
  id?: string;
  name: string;
  address: string;
  district: string;
  description?: string;
  location: { type: 'Point'; coordinates: [number, number] };
  averageRating: number;
  totalReviews: number;
  imageUrl?: string;
  contactNumber?: string;
  servicesOffered?: string[];
  distance?: number; // appended by $geoNear on backend
}

export interface CreateWorkshopPayload {
  name: string;
  address: string;
  district: string;
  description?: string;
  contactNumber: string;
  servicesOffered?: string[];
  location: { type: 'Point'; coordinates: [number, number] };
}
