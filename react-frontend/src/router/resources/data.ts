import { DataArray } from '../../types/data';
import axiosClient from '../apiClient'

/**
 * get the data points through a post request
 * TODO: change it to a get request
 * @param id the identifier of the point array
*/
export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `get-data?name=${id}`
  const promise = axiosClient.post<DataArray>(url)
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