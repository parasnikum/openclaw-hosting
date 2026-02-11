import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  // Updated to include your PG Enum types
  status: 'running' | 'stopped' | 'error' | 'pending' | 'Active' | 'Suspended' | 'Pending' | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Original mappings
  running: { label: 'Running', className: 'bg-success/10 text-success border-success/20' },
  stopped: { label: 'Stopped', className: 'bg-muted text-muted-foreground border-border' },
  error: { label: 'Error', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  
  // Mapping PostgreSQL Enum "service_status" to existing styles
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20' },
  suspended: { label: 'Suspended', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  
  // Fallback for safety
  unknown: { label: 'Unknown', className: 'bg-muted text-muted-foreground border-border opacity-50' }
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  // Normalize to lowercase to handle 'Active' vs 'active'
  const normalizedStatus = status?.toLowerCase() || 'unknown';
  const config = statusConfig[normalizedStatus] || statusConfig.unknown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        size === 'sm' ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        config.className
      )}
    >
      <span className={cn(
        "rounded-full",
        size === 'sm' ? "h-1.5 w-1.5" : "h-2 w-2",
        // Logic for the dot color
        (normalizedStatus === 'running' || normalizedStatus === 'active') && "bg-success animate-pulse",
        normalizedStatus === 'stopped' && "bg-muted-foreground",
        (normalizedStatus === 'error' || normalizedStatus === 'suspended') && "bg-destructive",
        (normalizedStatus === 'pending') && "bg-warning animate-pulse",
        normalizedStatus === 'unknown' && "bg-slate-400"
      )} />
      {config.label}
    </span>
  );
}