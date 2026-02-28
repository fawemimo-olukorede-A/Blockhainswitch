import { Building2, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParticipants, useAnalytics, formatAmount, getOrgDisplayName } from "@/hooks/useTransactions";

export default function Network() {
  const { data: participants, isLoading, error } = useParticipants();
  const { data: analytics } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        <p>Error loading network data</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  // Categorize participants (supports MSP IDs and bank codes)
  const getParticipantType = (code: string): "switch" | "bank" => {
    const switches = ["switchorgMSP", "ISW", "PSK", "FLW"];
    if (switches.includes(code) || code.toLowerCase().includes("switch")) return "switch";
    return "bank";
  };

  const typeConfig = {
    switch: { icon: Wallet, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Switch" },
    bank: { icon: Building2, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", label: "Bank" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Network Participants</h1>
        <p className="text-muted-foreground">Connected organizations on the Hyperledger Fabric network</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Switch Operators</p>
              <p className="text-2xl font-bold text-foreground">
                {participants?.filter(p => getParticipantType(p) === "switch").length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Building2 className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Banks</p>
              <p className="text-2xl font-bold text-foreground">
                {participants?.filter(p => getParticipantType(p) === "bank").length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-bold text-foreground">{participants?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Participants List */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Active Participants</h3>
            <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
              {participants?.length || 0} Connected
            </Badge>
          </div>

          {!participants || participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No participants found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => {
                const type = getParticipantType(participant);
                const config = typeConfig[type];
                const TypeIcon = config.icon;
                const participantData = analytics?.volumeByParticipant?.[participant];

                return (
                  <div
                    key={participant}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                  >
                    <div className={`rounded-lg p-3 ${config.bg} border ${config.border}`}>
                      <TypeIcon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">
                          {getOrgDisplayName(participant)}
                        </p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        MSP ID: {participant}
                      </p>
                    </div>

                    <div className="hidden sm:block text-right">
                      {participantData ? (
                        <>
                          <p className="text-sm font-semibold text-foreground">
                            {formatAmount((participantData.sent || 0) + (participantData.received || 0))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total volume
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No transactions</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-xs font-medium text-success hidden md:inline">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Network Info */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Network Configuration</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Network Type</p>
            <p className="text-lg font-semibold text-foreground">Hyperledger Fabric</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Channel</p>
            <p className="text-lg font-semibold text-foreground">mychannel</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Chaincode</p>
            <p className="text-lg font-semibold text-foreground">settlementv3</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Consensus</p>
            <p className="text-lg font-semibold text-foreground">Raft</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
