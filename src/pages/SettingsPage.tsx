import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { electronService, AppSettings } from '@/services/electron.service';
import { Settings as SettingsIcon, Monitor, Bell, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = React.useState<AppSettings>({
    theme: 'system',
    notifications: true
  });
  const [appVersion, setAppVersion] = React.useState('1.0.0');
  const [platform, setPlatform] = React.useState<string>('');

  React.useEffect(() => {
    // Get app info
    electronService.getAppVersion().then(setAppVersion);
    electronService.getPlatform().then(setPlatform);
    electronService.getSettings().then(setSettings);
  }, []);

  const handleUpdateSetting = async (key: string, value: unknown) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await electronService.updateSettings(updated);
  };

  const themeOptions = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  return (
    <div className="flex flex-col h-full bg-background/30 p-4 space-y-4 max-w-lg mx-auto overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-2 p-1">
        <SettingsIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">App Settings</h2>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-500" />
            Appearance
          </CardTitle>
          <CardDescription className="text-xs">Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Theme"
            options={themeOptions}
            value={settings.theme}
            onChange={(val) => handleUpdateSetting('theme', val)}
          />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-500" />
            Notifications
          </CardTitle>
          <CardDescription className="text-xs">Manage system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Toggle
            label="Enable Notifications"
            description="Receive system-level notifications"
            checked={settings.notifications}
            onChange={(e) => handleUpdateSetting('notifications', e.target.checked)}
          />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Version</span>
            <span className="font-bold">{appVersion}</span>
          </div>
          <div className="flex justify-between text-xs pt-1 border-t border-border/50">
            <span className="text-muted-foreground font-medium">Platform</span>
            <span className="font-bold uppercase">{platform || 'Web (Dev Mode)'}</span>
          </div>
          <div className="flex justify-between text-xs pt-1 border-t border-border/50">
            <span className="text-muted-foreground font-medium">Electron Environment</span>
            <span className="font-bold text-primary">{electronService.isElectron() ? 'YES' : 'NO'}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
           <p className="text-[10px] text-center w-full text-muted-foreground">
             © 2026 Electron Menubar Boilerplate
           </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;
