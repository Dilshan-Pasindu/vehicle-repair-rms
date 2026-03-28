# VSRMS Database Schema

The VSRMS system utilizes MongoDB. Below are the schema designs for the 6 collections used as part of the architecture. The `workshops` collection utilizes a 2dsphere index for location-based queries.

## 1. users
| Field | Type | Required | Notes |
|---|---|---|---|
| asgardeoSub | String | Yes | Unique subject ID from Asgardeo JWT. Primary identity link. |
| fullName | String | Yes | Synced from Asgardeo ID token on first login. |
| email | String | Yes | Unique. Synced from Asgardeo. |
| phone | String | No | User-entered after first login. |
| role | Enum | Yes | 'owner' \| 'staff' \| 'admin'. Default: 'owner'. |

## 2. vehicles
| Field | Type | Required | Notes |
|---|---|---|---|
| ownerId | ObjectId -> User | Yes | Foreign key to `users`. Ownership enforced in controller. |
| registrationNo | String | Yes | Unique. e.g., WP-CAB-1234. |
| make | String | Yes | e.g., Toyota, Honda. |
| model | String | Yes | e.g., Premio, CB150R. |
| year | Number | Yes | Manufacture year (>= 1990). |
| vehicleType | Enum | Yes | 'car' \| 'motorcycle' \| 'tuk' \| 'van'. |
| imageUrl | String (URL) | No | Cloudflare R2 public URL. |
| mileage | Number | No | Current odometer reading. |
| deletedAt | Date | Auto | Soft delete (null = active). |

## 3. workshops
*Note: Uses 2dsphere geospatial index on location.*
| Field | Type | Required | Notes |
|---|---|---|---|
| name | String | Yes | Workshop display name. |
| location.type | String | Yes | Always 'Point' (GeoJSON). |
| location.coordinates | [Number] | Yes | [longitude, latitude]. 2dsphere index. |
| address | String | Yes | Human-readable address. |
| district | String | Yes | e.g., Colombo. |
| servicesOffered | [String] | Yes | Array of services. |
| contactNumber | String | Yes | Primary phone number. |
| imageUrl | String (URL) | No | Workshop photo from R2. |
| averageRating | Number | Auto | Recalculated on review submission. Default: 0. |
| totalReviews | Number | Auto | Count of submitted reviews. |

## 4. appointments
| Field | Type | Required | Notes |
|---|---|---|---|
| userId | ObjectId -> User | Yes | Who made the booking. |
| vehicleId | ObjectId -> Vehicle | Yes | Which vehicle is being serviced. |
| workshopId | ObjectId -> Workshop | Yes | Target workshop. |
| serviceType | String | Yes | From workshop's servicesOffered. |
| scheduledDate | Date | Yes | Must not be in the past. |
| status | Enum | Yes | 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'. |
| notes | String | No | Customer's description. |

## 5. servicerecords
| Field | Type | Required | Notes |
|---|---|---|---|
| appointmentId | ObjectId -> Appt | Yes | Original appointment. |
| vehicleId | ObjectId -> Vehicle | Yes | Denormalized for fast queries. |
| serviceDate | Date | Yes | When work was actually completed. |
| workDone | String | Yes | Description of repairs. |
| partsReplaced | [String] | No | Array of part names replaced. |
| totalCost | Number | Yes | Amount in LKR. |
| mileageAtService | Number | No | Odometer reading at service time. |
| technicianName | String | No | Staff member who handled the job. |

## 6. reviews
| Field | Type | Required | Notes |
|---|---|---|---|
| workshopId | ObjectId -> Workshop | Yes | Which workshop is being reviewed. |
| userId | ObjectId -> User | Yes | Who submitted the review. |
| rating | Number | Yes | Integer 1–5. |
| reviewText | String | No | Written feedback. |
| appointmentId | ObjectId -> Appt | No | Optional link to appointment. |
