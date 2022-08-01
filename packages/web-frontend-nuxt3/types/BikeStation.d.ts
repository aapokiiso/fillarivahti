export type BikeStation = {
  stationId: string,
  name: string,
  bikesAvailable: number,
  capacity: number
}

export type BikeStationAvailability = {
  stationId: string,
  timestamp: Date,
  capacity: number
}

export type BikeStationAvailabilityResponse = {
  stationId: string,
  timestamp: string, // UTC timestamp
  capacity: number
}
