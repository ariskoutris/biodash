import { DataArray } from '../../types/data';
import axiosClient from '../apiClient'

/**
 * get the data points through a post request
 * @param id the identifier of the point array
*/
export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `${id}`
  const promise = axiosClient.get<DataArray>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function sendData(id: string): Promise<DataArray | undefined> {
  const data = {
    "biometric_data": {
        "weight": 70.0,
        "muscle_mass_perc": 55.0,
        "fat_mass_perc": 45.0,
        "fitness_age": 30
    },
    "training_data": [
        {
            "exercise": "GOAL exercise in time",
            "equipment": "Synchro",
            "date": "2024-04-03",
            "duration": 900,
            "calories": 163,
            "mets_min": 7.1
        },
        {
            "exercise": "Quick Start",
            "equipment": "Synchro Excite Compact",
            "date": "2024-04-03",
            "duration": 892,
            "calories": 125,
            "mets_min": 6.1
        },
        {
            "exercise": "Crunch",
            "equipment": "Abdominal Crunch Sel",
            "date": "2024-04-03",
            "duration": 324,
            "calories": 28,
            "mets_min": 3.3
        }
    ]
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const url = `${id}`
  const promise = axiosClient.post<DataArray>(url, data, config)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function getPredictions(id: string, duration: number): Promise<DataArray | undefined> {
  const url = `data/radar/${id}/${duration}`
  const promise = axiosClient.get<DataArray>(url)
  console.log('console logged');
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}