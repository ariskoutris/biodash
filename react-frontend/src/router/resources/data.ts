import axiosClient from "../apiClient";

/**
 * get the data points through a post request
 * @param id the identifier of the point array
 */
export function postPoints(url: string): Promise<any> {
  const promise = axiosClient.get<any>(url);
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

export function userLogin(user_name: string, password: string): Promise<string | undefined> {
  const user_info = {
    "user_name": user_name,
    "password": password
  }
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const url = "import";
  const promise = axiosClient.post<{ user_id: string }>(url, user_info, config);
  return promise
    .then((res) => {
      return res.data.user_id;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
