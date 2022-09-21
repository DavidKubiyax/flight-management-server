export interface Airplane {
    /** Unique identifier of the plane */
    id: string;
    status: 'hangar' | 'flight' | 'malfunction';
    takeoffTime: string;
    landingTime: string;
    takeoffAirport: string;
    landingAirport: string;
}