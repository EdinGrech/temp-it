export interface SensorDetails {
  id: number;
  name: string;
  location: string;
  description: string;
  active: boolean;
  favorite?: boolean;
  date_created: string | Date;
  active_alerts: boolean;
  allow_group_admins_to_edit?: boolean;
  high_temp_alert?: number;
  low_temp_alert?: number;
  high_humidity_alert?: number;
  low_humidity_alert?: number;
}

export interface SensorDetailsUpdatable {
  id: number;
  updatable: {
    name: string;
    location: string;
    description: string;
    active: boolean;
    active_alerts: boolean;
    allow_group_admins_to_edit: boolean;
    high_temp_alert?: number;
    low_temp_alert?: number;
    high_humidity_alert?: number;
    low_humidity_alert?: number;
  };
}

export interface SensorReadingData {
  date_time: string | Date;
  temperature: number;
  humidity: number;
}

export interface ReducerSensorData {
  sensorId: number;
  sensorDataValues: SensorReadingData[];
  alertFailIndexes: number[];
  alertsIncreasing: boolean;
}
