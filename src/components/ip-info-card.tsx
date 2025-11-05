
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IpInfo, DnsRecord } from "@/lib/types";
import { Globe, Server, Dna, MapPin, Building, Wifi, Smartphone, Shield } from 'lucide-react';

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
    <div className="info-card flex flex-col p-4 bg-card/80 border-primary/20 rounded-xl">
        <div className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
            <span className="text-accent">{icon}</span>
            {label}
        </div>
        <div className="text-lg font-bold font-display text-foreground">{value || 'N/A'}</div>
    </div>
);

type StatusRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: boolean;
}

const StatusRow: React.FC<StatusRowProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-card/80 border-primary/20 rounded-xl">
    <span className={value ? "text-primary" : "text-muted-foreground"}>{icon}</span>
    <span className={`font-medium ${value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    <span className={`ml-auto font-bold text-sm px-2 py-0.5 rounded-full ${value ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
      {value ? 'Yes' : 'No'}
    </span>
  </div>
);

function getFlagEmoji(countryCode: string) {
  if(!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function IpDnsCard({ ipInfo, dnsRecords }: { ipInfo: IpInfo; dnsRecords: DnsRecord[] }) {
  return (
    <Card className="liquid-glass h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-primary">
          <Globe />
          IP & DNS Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow icon={<Server className="w-4 h-4" />} label="IP Address" value={ipInfo.ip} />
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={`${ipInfo.city}, ${ipInfo.country}`} />
        </div>
        <InfoRow icon={<span className="text-xl">{getFlagEmoji(ipInfo.countryCode)}</span>} label="Country" value={ipInfo.country} />
        <InfoRow icon={<Building className="w-4 h-4" />} label="Organization" value={ipInfo.org} />
        
        {dnsRecords.length > 0 && (
          <>
            <Separator className="my-4 bg-primary/20" />
            <div className="space-y-3">
              <h4 className="flex items-center gap-3 text-sm font-medium text-foreground">
                <Dna className="w-4 h-4 text-accent" />
                DNS Records
              </h4>
              <div className="pl-7 space-y-2">
                {dnsRecords.map(record => (
                  <div key={`${record.type}-${record.value}`} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">{record.type}</span>
                    <span className="font-mono text-muted-foreground break-all">{record.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
      
export function NetworkStatusCard({ ipInfo }: { ipInfo: IpInfo }) {
    return (
        <Card className="liquid-glass">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-primary">
                <Shield />
                Network Status
            </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusRow icon={<Wifi className="w-5 h-5"/>} label="Hosting" value={ipInfo.hosting} />
                <StatusRow icon={<Shield className="w-5 h-5"/>} label="Proxy" value={ipInfo.proxy} />
                <StatusRow icon={<Smartphone className="w-5 h-5"/>} label="Mobile" value={ipInfo.mobile} />
            </CardContent>
        </Card>
    );
}
