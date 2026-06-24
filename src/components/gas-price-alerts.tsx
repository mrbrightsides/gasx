'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Alert {
  id: string;
  threshold: number;
  enabled: boolean;
  lastTriggered?: Date;
  triggeredCount: number;
}

interface GasPriceAlertsProps {
  currentGasPrice: number;
}

export function GasPriceAlerts({ currentGasPrice }: GasPriceAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newThreshold, setNewThreshold] = useState<string>('15');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [recentAlerts, setRecentAlerts] = useState<Array<{ time: Date; message: string }>>([]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Load alerts from localStorage
      const saved = localStorage.getItem('gasAlerts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAlerts(parsed.map((a: Alert) => ({
          ...a,
          lastTriggered: a.lastTriggered ? new Date(a.lastTriggered) : undefined
        })));
      }
      
      // Load notifications enabled state
      const notifEnabled = localStorage.getItem('notificationsEnabled');
      if (notifEnabled) {
        setNotificationsEnabled(JSON.parse(notifEnabled));
      }
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem('gasAlerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  // Monitor gas price and trigger alerts
  useEffect(() => {
    if (!notificationsEnabled || permission !== 'granted') return;

    alerts.forEach(alert => {
      if (alert.enabled && currentGasPrice <= alert.threshold) {
        const now = new Date();
        const lastTriggered = alert.lastTriggered;
        
        // Only trigger if not triggered in last 5 minutes
        if (!lastTriggered || (now.getTime() - lastTriggered.getTime()) > 5 * 60 * 1000) {
          triggerNotification(alert.threshold, currentGasPrice);
          
          // Update alert
          setAlerts(prev => prev.map(a => 
            a.id === alert.id 
              ? { ...a, lastTriggered: now, triggeredCount: a.triggeredCount + 1 }
              : a
          ));
          
          // Add to recent alerts
          setRecentAlerts(prev => [{
            time: now,
            message: `Gas price dropped to ${currentGasPrice.toFixed(2)} Gwei (target: ${alert.threshold} Gwei)`
          }, ...prev.slice(0, 4)]);
        }
      }
    });
  }, [currentGasPrice, alerts, notificationsEnabled, permission]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', JSON.stringify(true));
      }
    }
  };

  const triggerNotification = (threshold: number, current: number) => {
    if (permission === 'granted') {
      new Notification('⚡ Gas Price Alert!', {
        body: `Gas price dropped to ${current.toFixed(2)} Gwei (below your ${threshold} Gwei threshold). Time to transact!`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'gas-alert',
        requireInteraction: false,
      });
    }
  };

  const addAlert = () => {
    const threshold = parseFloat(newThreshold);
    if (isNaN(threshold) || threshold <= 0) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      threshold,
      enabled: true,
      triggeredCount: 0,
    };

    setAlerts(prev => [...prev, newAlert]);
    setNewThreshold('15');
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled && permission !== 'granted') {
      requestNotificationPermission();
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      localStorage.setItem('notificationsEnabled', JSON.stringify(newState));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500 dark:bg-blue-600">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Live Gas Price Alerts
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Get notified when gas prices drop below your target
                </CardDescription>
              </div>
            </div>
            <Badge variant={notificationsEnabled ? "default" : "secondary"} className="text-sm px-3 py-1">
              {notificationsEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Current Gas Price */}
      <Card>
        <CardHeader>
          <CardTitle>Current Gas Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Live Gas Price</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {currentGasPrice.toFixed(8)} Gwei
              </p>
            </div>
            <TrendingDown className="h-12 w-12 text-blue-500 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Enable browser notifications to receive real-time alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission === 'denied' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Notifications are blocked. Please enable them in your browser settings.
              </AlertDescription>
            </Alert>
          )}
          
          {permission === 'default' && (
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Click the switch below to enable browser notifications.
              </AlertDescription>
            </Alert>
          )}

          {permission === 'granted' && notificationsEnabled && (
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                Notifications are enabled! You'll receive alerts when gas prices drop.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? (
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Browser Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={toggleNotifications}
              disabled={permission === 'denied'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>
            Set a gas price threshold to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="threshold">Gas Price Threshold (Gwei)</Label>
              <Input
                id="threshold"
                type="number"
                step="0.1"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                placeholder="e.g., 15"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addAlert} className="w-full">
                Add Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Alerts ({alerts.length})</CardTitle>
            <CardDescription>
              Manage your gas price alert thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                  alert.enabled 
                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Switch
                    checked={alert.enabled}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <div>
                    <p className="font-medium">
                      Alert at {alert.threshold.toFixed(2)} Gwei
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alert.triggeredCount > 0 
                        ? `Triggered ${alert.triggeredCount} time${alert.triggeredCount !== 1 ? 's' : ''}`
                        : 'Not triggered yet'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentGasPrice <= alert.threshold && alert.enabled && (
                    <Badge variant="default" className="bg-green-500">
                      Active
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Your notification history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    {alert.message}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {alert.time.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
