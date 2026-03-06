// In-memory Mock Database
export type GasStation = {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
    litro12_5kg: boolean;
    litro5kg: boolean;
    laugfs12_5kg: boolean;
    laugfs5kg: boolean;
    updatedAt: string;
};

// Global object to persist data across hot-reloads in development
const globalForDb = globalThis as unknown as {
    mockStations: GasStation[];
};

export const stations: GasStation[] = globalForDb.mockStations || [
    {
        id: "station_1",
        name: "Colombo 07 Litro Dealer",
        location: "Colombo 07, LK",
        lat: 6.9118,
        lng: 79.8661,
        litro12_5kg: true,
        litro5kg: true,
        laugfs12_5kg: false,
        laugfs5kg: false,
        updatedAt: new Date().toISOString()
    },
    {
        id: "station_2",
        name: "Nugegoda Laugfs Mega",
        location: "High Level Road, Nugegoda",
        lat: 6.8700,
        lng: 79.8950,
        litro12_5kg: false,
        litro5kg: false,
        laugfs12_5kg: true,
        laugfs5kg: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: "station_3",
        name: "Dehiwala Junction Gas Point",
        location: "Galle Road, Dehiwala",
        lat: 6.8407,
        lng: 79.8665,
        litro12_5kg: true,
        litro5kg: false,
        laugfs12_5kg: true,
        laugfs5kg: false,
        updatedAt: new Date().toISOString()
    }
];

if (process.env.NODE_ENV !== "production") globalForDb.mockStations = stations;
