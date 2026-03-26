import { useState, useEffect } from 'react';
import { HardDrive, Cpu, MemoryStick, Thermometer, Activity, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import api from '../services/api';

interface DriveInfo {
  name: string;
  type: string;
  model: string;
  health: number;
  temperature: number;
  usage: number;
  powerOnHours: string | number;
  status: string;
}

export default function HardwareLifecycle() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [storageHealth, setStorageHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, healthRes] = await Promise.all([
          api.get('/dashboard/status'),
          api.get('/storage/health').catch(() => ({ data: { status: 'Unknown', temperature: 40 } }))
        ]);
        setSystemStatus(statusRes.data?.data || statusRes.data || {});
        setStorageHealth(healthRes.data?.data || healthRes.data || {});
      } catch (err: any) {
        setError(err.message || 'Failed to fetch hardware data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-red-50 p-6 rounded-2xl max-w-lg mx-auto border border-red-100 mt-10 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-700 mt-2">Data Unreachable</h2>
        <p className="text-slate-600">Failed to load hardware status from the backend.</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white border-0">Retry</Button>
      </div>
    );
  }

  const systemMetrics = [
    { label: 'CPU Usage', value: systemStatus?.cpuUsage || 0, icon: Cpu, color: 'from-blue-500 to-cyan-400', unit: '%' },
    { label: 'RAM Usage', value: systemStatus?.ramPercent || 0, icon: MemoryStick, color: 'from-purple-500 to-fuchsia-400', unit: '%' },
    { label: 'Avg Temperature', value: storageHealth?.temperature ? parseInt(storageHealth.temperature) : 40, icon: Thermometer, color: 'from-orange-500 to-red-400', unit: '°C' },
  ];

  const disks = systemStatus?.disks || [];
  const drives: DriveInfo[] = disks.map((disk: any) => {
    let usageVal = 0;
    if (disk.usage) {
      usageVal = parseInt(disk.usage);
    } else if (disk.usedGB && disk.totalGB) {
      usageVal = (disk.usedGB / disk.totalGB) * 100;
    } else if (disk.used && disk.total) { // Linux df -h parser
      const parseSize = (str: string) => parseFloat(str.replace(/[^\d.]/g, '')) || 0;
      const u = parseSize(disk.used);
      const t = parseSize(disk.total);
      if (t > 0) usageVal = (u / t) * 100;
    }

    return {
      name: disk.mount || disk.drive || 'Unknown Drive',
      type: disk.drive?.includes(':') ? 'Windows Drive' : 'Physical Drive',
      model: systemStatus?.cpuModel || 'Generic Processor Drive',
      health: storageHealth?.status === 'Healthy' ? 100 : 80,
      temperature: storageHealth?.temperature ? parseInt(storageHealth.temperature) : 40,
      usage: usageVal || 0,
      powerOnHours: storageHealth?.powerOnHours || 'N/A',
      status: storageHealth?.status?.toLowerCase() || 'healthy',
    };
  }) || [];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Hardware Lifecycle</h1>
        <p className="text-slate-600">Monitor your {systemStatus?.platform || 'NAS'} hardware health and performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {systemMetrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-slate-900 font-bold text-xl">
                {metric.value}{metric.unit}
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-3 font-medium">{metric.label}</p>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 pt-4">Storage Drives</h2>
        {drives.length > 0 ? drives.map((drive) => (
          <div key={drive.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <HardDrive className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-lg leading-tight">{drive.name}</h3>
                  <p className="text-slate-500 text-sm truncate max-w-[200px] mb-2">{drive.model}</p>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0">{drive.type}</Badge>
                </div>
              </div>
              <Badge 
                variant={drive.status === 'healthy' ? 'default' : 'secondary'} 
                className={drive.status === 'healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
              >
                {drive.status === 'healthy' ? <Activity className="w-3 h-3 mr-1.5" /> : <AlertTriangle className="w-3 h-3 mr-1.5" />}
                {drive.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm mb-2 font-medium">Health Status</span>
                <div className="flex items-center gap-3">
                  <Progress value={drive.health} className="flex-1" />
                  <span className="text-slate-900 font-semibold text-sm">{drive.health}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm mb-2 font-medium">Storage Usage</span>
                <div className="flex items-center gap-3">
                  <Progress value={drive.usage} className="flex-1" />
                  <span className="text-slate-900 font-semibold text-sm">{Math.round(drive.usage)}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm mb-2 font-medium">Temperature</span>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <span className="text-slate-900 font-semibold">{drive.temperature}°C</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 text-sm mb-2 font-medium">Power On Hours</span>
                <span className="text-slate-900 font-semibold">{drive.powerOnHours.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center">
            <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No physical drives detected</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm mt-8">
        <h3 className="text-slate-900 font-bold mb-3 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" /> System Status
        </h3>
        <ul className="space-y-3 mt-4">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-slate-700">Server is online. Uptime: <span className="font-semibold text-slate-900">{systemStatus?.uptime || 'N/A'}</span>.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full ${storageHealth?.status === 'Healthy' ? 'bg-emerald-100' : 'bg-amber-100'} flex items-center justify-center shrink-0 mt-0.5`}>
              <div className={`w-2 h-2 rounded-full ${storageHealth?.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            </div>
            <span className="text-slate-700">Storage System Status: <span className="font-semibold text-slate-900">{storageHealth?.status || 'Unknown'}</span>.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
