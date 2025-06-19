import * as Device from 'expo-device';
import { Platform } from 'react-native';

export class UpdateService {
  static async checkForUpdate() {
    try {
      const currentVersion = Device.osVersion(); 
      const response = await fetch('https://your-api.com/version', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!_response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { latestVersion, minimumVersion, updateUrl, releaseNotes } = await response.json();

      const isUpdateAvailable = compareVersions(currentVersion, minimumVersion);
      const isUpdateMandatory = compareVersions(currentVersion, minimumVersion);

      return {
        isUpdateAvailable,
        isUpdateMandatory,
        updateUrl: Platform.OS === 'ios' ? updateUrl.ios : updateUrl.android,
        releaseNotes,
        latestVersion,
      };
    } catch (error) {
      console.warn('Update check failed:', error);
      return { isUpdateAvailable: false, isUpdateMandatory: false };
    }
  }
}

const compareVersions = (current, latest) => {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < currentParts.length && i < latestParts.length; i++) {
    const a = currentParts[i] || 0;
    const b = latestParts[i] || 0;
    if (a < b) return -1;
    if (a > b) return 1;
    }
  return 0;
};

export default UpdateService;