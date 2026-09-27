import { AlertController } from '@ionic/angular';

/**
 * Shows a confirm dialog and resolves to true when the user picks the
 * destructive action. Callers act after the promise resolves (inside Angular's
 * zone) rather than in an alert button handler, which may run outside it.
 */
export async function confirmAction(
  alerts: AlertController,
  header: string,
  message: string,
  confirmText: string,
): Promise<boolean> {
  const alert = await alerts.create({
    header,
    message,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: confirmText, role: 'destructive' },
    ],
  });
  await alert.present();
  const { role } = await alert.onDidDismiss();
  return role === 'destructive';
}
