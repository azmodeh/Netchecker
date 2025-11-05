
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IpInfo, DnsRecord } from "@/lib/types";
import { Globe, Server, Dna, MapPin as MapPinIcon, Building } from 'lucide-react';

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="font-medium text-foreground">{value || 'N/A'}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default function IpInfoCard({ ipInfo, dnsRecords }: { ipInfo: IpInfo; dnsRecords: DnsRecord[] }) {
  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Globe />
          IP & DNS Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow icon={<Server className="w-4 h-4" />} label="IP Address" value={ipInfo.ip} />
        <InfoRow icon={<MapPinIcon className="w-4 h-4" />} label="Location" value={`${ipInfo.city}, ${ipInfo.country}`} />
        <InfoRow icon={<Building className="w-4 h-4" />} label="Organization" value={ipInfo.org} />
        
        {dnsRecords.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h4 className="flex items-center gap-3 text-sm font-medium text-foreground">
                <Dna className="w-4 h-4 text-muted-foreground" />
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
