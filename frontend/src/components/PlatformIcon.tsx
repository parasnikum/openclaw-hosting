import { MessageCircle, Send, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const platforms = {
  whatsapp: { icon: Phone, label: 'WhatsApp', color: 'text-green-600' },
  telegram: { icon: Send, label: 'Telegram', color: 'text-blue-500' },
  discord: { icon: MessageCircle, label: 'Discord', color: 'text-indigo-500' },
};

interface PlatformIconProps {
  platform: keyof typeof platforms;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function PlatformIcon({ platform, size = 'sm', showLabel = false }: PlatformIconProps) {
  const config = platforms[platform];
  const Icon = config.icon;
  
  return (
    <div className={cn("flex items-center gap-1", config.color)}>
      <Icon className={size === 'sm' ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {showLabel && <span className="text-xs">{config.label}</span>}
    </div>
  );
}

interface PlatformIconsProps {
  platforms: (keyof typeof platforms)[];
}

export function PlatformIcons({ platforms: platformList }: PlatformIconsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {platformList.map((platform) => (
        <PlatformIcon key={platform} platform={platform} />
      ))}
    </div>
  );
}
