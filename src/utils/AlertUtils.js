import { store } from '../redux/store';
import { setAlertMessage, setAlertSeverity, setAlertOpen } from '../redux/alert/alertSlice';

/**
 * Show an alert displayed on bottom center
 * 
 * @param {string} message Message displayed in alert
 * @param {string} severity Define the background color and icon displayed
 *                       Possible values: success, error, warning, info
 */
export const showAlert = (message, severity) => {
  // If the severity isn't known, we will put info by default
  const isKnownSeverity = ['success', 'error', 'warning', 'info'].includes(severity);

  Promise.all([
    store.dispatch(setAlertMessage(message)),
    store.dispatch(setAlertSeverity(isKnownSeverity ? severity : 'info'))
  ]).then(store.dispatch(setAlertOpen(true)));
}