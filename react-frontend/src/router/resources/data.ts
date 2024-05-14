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
    "age": 20,
    "gender": "F",
    "biometric_data": 
        [
            {"BiometricName": "Fat mass Perc",
            "MeasuredOnWeek": [19, 39, 46, 50],
            "Value": [40.2, 38.3, 40.6, 39.0]},
            {"BiometricName": "Muscle Mass",
            "MeasuredOnWeek": [19, 39, 46, 50],
            "Value": [53.4, 54.9, 51.7, 53.3]},
            {"BiometricName": "Weight",
            "MeasuredOnWeek": [19, 39, 46, 50],
            "Value": [94.0, 93.7, 91.7, 92.0]}
        ],
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
            "exercise": "Calf raise",
            "equipment": "Barbell",
            "date": "2024-04-03",
            "duration": 360,
            "calories": 65,
            "mets_min": 7.0
        },
        {
            "exercise": "Back extension",
            "equipment": "Lower Back Sel",
            "date": "2024-04-03",
            "duration": 287,
            "calories": 28,
            "mets_min": 3.8
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