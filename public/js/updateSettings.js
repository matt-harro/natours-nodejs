import axios from 'axios';
import { showAlert } from './alerts';

export async function updateSettings(data, type) {
  try {
    const query =
      type == 'data'
        ? '/api/v1/users/updateMe'
        : '/api/v1/users/updateMyPassword';
    const url = `${location.origin}${query}`;
    const res = await axios({
      url,
      method: 'PATCH',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }

    return res.data.status === 'success';
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
