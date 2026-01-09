import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Bell, Shield, Palette, Zap } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: false,
      soundEffects: true,
    },
    bulk: {
      confirmationThreshold: '10',
      autoSelectPending: false,
    },
    display: {
      defaultView: 'pending',
      cardsPerPage: '25',
      showConfidenceScore: true,
    },
  });

  const handleSave = () => {
    toast.success('Settings saved', {
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you receive alerts about new actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-alerts">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for pending actions
              </p>
            </div>
            <Switch
              id="email-alerts"
              checked={settings.notifications.emailAlerts}
              onCheckedChange={(checked) =>
                setSettings((s) => ({
                  ...s,
                  notifications: { ...s.notifications, emailAlerts: checked },
                }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Browser push notifications for urgent actions
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings((s) => ({
                  ...s,
                  notifications: { ...s.notifications, pushNotifications: checked },
                }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds on approve/reject actions
              </p>
            </div>
            <Switch
              id="sound-effects"
              checked={settings.notifications.soundEffects}
              onCheckedChange={(checked) =>
                setSettings((s) => ({
                  ...s,
                  notifications: { ...s.notifications, soundEffects: checked },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <CardTitle>Bulk Actions</CardTitle>
          </div>
          <CardDescription>
            Configure bulk action behavior and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="confirmation-threshold">
              Confirmation Threshold
            </Label>
            <p className="text-sm text-muted-foreground">
              Show confirmation dialog when selecting this many or more actions
            </p>
            <Select
              value={settings.bulk.confirmationThreshold}
              onValueChange={(value) =>
                setSettings((s) => ({
                  ...s,
                  bulk: { ...s.bulk, confirmationThreshold: value },
                }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 actions</SelectItem>
                <SelectItem value="10">10 actions</SelectItem>
                <SelectItem value="25">25 actions</SelectItem>
                <SelectItem value="50">50 actions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-select">Auto-select Pending</Label>
              <p className="text-sm text-muted-foreground">
                Automatically select all pending actions on load
              </p>
            </div>
            <Switch
              id="auto-select"
              checked={settings.bulk.autoSelectPending}
              onCheckedChange={(checked) =>
                setSettings((s) => ({
                  ...s,
                  bulk: { ...s.bulk, autoSelectPending: checked },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>Display</CardTitle>
          </div>
          <CardDescription>
            Customize the appearance and layout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="default-view">Default View</Label>
            <Select
              value={settings.display.defaultView}
              onValueChange={(value) =>
                setSettings((s) => ({
                  ...s,
                  display: { ...s.display, defaultView: value },
                }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="approved">Approved Only</SelectItem>
                <SelectItem value="rejected">Rejected Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="cards-per-page">Actions Per Page</Label>
            <Select
              value={settings.display.cardsPerPage}
              onValueChange={(value) =>
                setSettings((s) => ({
                  ...s,
                  display: { ...s.display, cardsPerPage: value },
                }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 actions</SelectItem>
                <SelectItem value="25">25 actions</SelectItem>
                <SelectItem value="50">50 actions</SelectItem>
                <SelectItem value="100">100 actions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="confidence-score">Show Confidence Score</Label>
              <p className="text-sm text-muted-foreground">
                Display AI confidence score in action cards
              </p>
            </div>
            <Switch
              id="confidence-score"
              checked={settings.display.showConfidenceScore}
              onCheckedChange={(checked) =>
                setSettings((s) => ({
                  ...s,
                  display: { ...s.display, showConfidenceScore: checked },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Security and access settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="session-timeout">Session Timeout</Label>
            <p className="text-sm text-muted-foreground">
              Automatically log out after inactivity
            </p>
            <Select defaultValue="30">
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
