import { Building2, Wallet, Store, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkNode {
  id: string;
  name: string;
  type: "bank" | "fintech" | "merchant";
  status: "active" | "inactive";
  transactions: number;
  volume: string;
  lastActive: string;
}

const nodes: NetworkNode[] = [
  {
    id: "N001",
    name: "FirstBank Digital",
    type: "bank",
    status: "active",
    transactions: 1248,
    volume: "$2.4M",
    lastActive: "Just now",
  },
  {
    id: "N002",
    name: "GlobalBank Corp",
    type: "bank",
    status: "active",
    transactions: 987,
    volume: "$1.8M",
    lastActive: "2 mins ago",
  },
  {
    id: "N003",
    name: "TechPay Fintech",
    type: "fintech",
    status: "active",
    transactions: 2341,
    volume: "$3.2M",
    lastActive: "Just now",
  },
  {
    id: "N004",
    name: "SmartPay Gateway",
    type: "fintech",
    status: "active",
    transactions: 1876,
    volume: "$2.1M",
    lastActive: "5 mins ago",
  },
  {
    id: "N005",
    name: "Merchant Solutions",
    type: "merchant",
    status: "active",
    transactions: 3421,
    volume: "$4.5M",
    lastActive: "1 min ago",
  },
  {
    id: "N006",
    name: "Retail Merchants",
    type: "merchant",
    status: "inactive",
    transactions: 0,
    volume: "$0",
    lastActive: "2 hours ago",
  },
];

const typeConfig = {
  bank: { icon: Building2, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  fintech: { icon: Wallet, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  merchant: { icon: Store, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
};

export default function Network() {
  const activeNodes = nodes.filter((n) => n.status === "active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Network Participants</h1>
        <p className="text-muted-foreground">Connected banks, fintechs, and merchants</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Banks</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Wallet className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fintechs</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <Store className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Merchants</p>
              <p className="text-2xl font-bold text-foreground">33</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Nodes List */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Active Participants</h3>
            <Badge variant="outline" className="bg-success/10 border-success/20 text-success-foreground">
              {activeNodes} Active
            </Badge>
          </div>

          <div className="space-y-3">
            {nodes.map((node) => {
              const TypeIcon = typeConfig[node.type].icon;
              return (
                <div
                  key={node.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                >
                  <div className={`rounded-lg p-3 ${typeConfig[node.type].bg} border ${typeConfig[node.type].border}`}>
                    <TypeIcon className={`h-5 w-5 ${typeConfig[node.type].color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{node.name}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {node.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ID: {node.id} • Last active: {node.lastActive}
                    </p>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-foreground">{node.volume}</p>
                    <p className="text-xs text-muted-foreground">{node.transactions} transactions</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {node.status === "active" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-xs font-medium text-success-foreground hidden md:inline">Active</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground hidden md:inline">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
