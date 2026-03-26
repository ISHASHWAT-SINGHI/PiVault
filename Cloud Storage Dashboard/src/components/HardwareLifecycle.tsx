import { HardDrive, Cpu, MemoryStick, Thermometer, Activity, AlertTriangle } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export default function HardwareLifecycle() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [storageHealth, setStorageHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, healthRes] = await Promise.all([
          api.get('/dashboard/status'),
          api.get('/storage/health')
        ]);

        setSystemStatus(statusRes.data || statusRes);
        setStorageHealth(healthRes.data || healthRes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch hardware data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const systemMetrics = systemStatus ? [
    {
      label: 'CPU Usage',
      value: systemStatus.cpuUsage || 0,
      icon: Cpu,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      label: 'RAM Usage',
      value: systemStatus.ramPercent || 0,
      icon: MemoryStick,
      color: 'from-purple-500 to-pink-400',
    },
    {
      label: 'Average Temperature',
      value: storageHealth?.temperature ? parseInt(storageHealth.temperature) : 40,
      icon: Thermometer,
      color: 'from-orange-500 to-red-400',
      unit: '°C',
    },
  ] : [];

  const drives = systemStatus?.disks?.map((disk: any) => ({
    name: disk.drive || disk.mount,
    type: disk.drive?.includes(':') ? 'Windows Drive' : 'Physical Drive',
    model: systemStatus.cpuModel || 'Generic Processor Drive',
    health: storageHealth?.status === 'Healthy' ? 100 : 80,
    temperature: storageHealth?.temperature ? parseInt(storageHealth.temperature) : 40,
    usage: disk.usage ? parseInt(disk.usage) : (disk.usedGB / disk.totalGB * 100) || 0,
    totalWrites: 'N/A',
    powerOnHours: storageHealth?.powerOnHours || 'N/A',
    status: storageHealth?.status?.toLowerCase() || 'healthy',
  })) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching hardware metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-semibold">Failed to load hardware status</p>
        <p className="text-slate-500 text-sm max-w-md text-center">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-blue-600 dark:text-blue-400 mb-2">Hardware Lifecycle</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor your {systemStatus?.platform || 'NAS'} hardware health and performance</p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {systemMetrics.map((metric: any) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-slate-900 dark:text-white font-bold">
                {metric.value}
                {metric.unit || '%'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-3">{metric.label}</p>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </div>

      {/* Hardware Drives */}
      <div className="space-y-4">
        <h2 className="text-slate-900 dark:text-white font-bold">Storage Drives</h2>

        {drives.length > 0 ? drives.map((drive: any) => (
          <div
            key={drive.name}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white mb-1">{drive.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-[200px]">{drive.model}</p>
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                  >
                    {drive.type}
                  </Badge>
                </div>
              </div>
              <Badge
                variant={drive.status === 'healthy' ? 'default' : 'secondary'}
                className={
                  drive.status === 'healthy'
                    ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
                }
              >
                {drive.status === 'healthy' && <Activity className="w-3 h-3 mr-1" />}
                {drive.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {drive.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-slate-500 dark:text-slate-500 text-sm mb-2">Health Status</p>
                <div className="flex items-center gap-2">
                  <Progress value={drive.health} className="h-2 flex-1" />
                  <span className="text-slate-900 dark:text-white text-sm">{drive.health}%</span>
                </div>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-500 text-sm mb-2">Storage Usage</p>
                <div className="flex items-center gap-2">
                  <Progress value={drive.usage} className="h-2 flex-1" />
                  <span className="text-slate-900 dark:text-white text-sm">{Math.round(drive.usage)}%</span>
                </div>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-500 text-sm mb-2">Temperature</p>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-slate-900 dark:text-white">{drive.temperature}°C</span>
                </div>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-500 text-sm mb-2">Power On Hours</p>
                <span className="text-slate-900 dark:text-white font-medium">{drive.powerOnHours.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-dashed text-center text-slate-500">
            No physical drives detected
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-6 border border-blue-200 dark:border-blue-500/30 shadow-sm">
        <h3 className="text-slate-900 dark:text-white mb-3 font-bold">System Status</h3>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-start gap-2">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <span>Server is online. Uptime: {systemStatus?.uptime || 'N/A'}.</span>
          </li>
          {storageHealth?.status === 'Healthy' ? (
            <li className="flex items-start gap-2">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <span>All storage systems are operating optimally.</span>
            </li>
          ) : (
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <span>Storage check suggested. Current status: {storageHealth?.status || 'Unknown'}.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}