import React, { useState } from 'react';
import { Bell, Mail, Shield, Save, Moon, Sun } from 'lucide-react';
import Button from '../../components/Button';
import Toast from '../../components/Toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
    darkMode: false,
  });
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const handleSave = () => {
    localStorage.setItem('registrarSettings', JSON.stringify(settings));
    setToast({ isOpen: true, message: 'Settings saved successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Registrar Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates for new requests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive browser notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            Security
          </h3>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </h3>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch between light and dark theme</p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default Settings;