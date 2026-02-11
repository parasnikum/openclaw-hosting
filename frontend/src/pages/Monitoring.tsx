import { Activity, Cpu, HardDrive, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const metrics = [
  { name: 'Production Bot', cpu: 12, memory: 45, requests: 1250, uptime: '99.9%' },
  { name: 'Dev Bot', cpu: 0, memory: 0, requests: 0, uptime: '-' },
  { name: 'Test Bot', cpu: 8, memory: 32, requests: 340, uptime: '98.5%' },
];

export default function Monitoring() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg CPU</p>
                <p className="text-lg font-semibold">6.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <HardDrive className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Memory</p>
                <p className="text-lg font-semibold">25.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Requests</p>
                <p className="text-lg font-semibold">1,590</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-success/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Uptime</p>
                <p className="text-lg font-semibold">99.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Instance Metrics</CardTitle>
          <CardDescription>Resource usage per instance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.map((instance) => (
              <div key={instance.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{instance.name}</span>
                  <span className="text-xs text-muted-foreground">{instance.uptime} uptime</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CPU</span>
                      <span>{instance.cpu}%</span>
                    </div>
                    <Progress value={instance.cpu} className="h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Memory</span>
                      <span>{instance.memory}%</span>
                    </div>
                    <Progress value={instance.memory} className="h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Requests</span>
                      <span>{instance.requests.toLocaleString()}</span>
                    </div>
                    <Progress value={(instance.requests / 2000) * 100} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
