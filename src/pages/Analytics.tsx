import { TrendingUp, DollarSign, Clock, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Processed"
          value="$24.8M"
          change="+18.2% this month"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Success Rate"
          value="99.4%"
          change="+0.3% improvement"
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Avg. Processing Time"
          value="3.8s"
          change="-1.2s faster"
          trend="up"
          icon={Clock}
        />
        <StatCard
          title="Peak TPS"
          value="284"
          change="Transactions per second"
          trend="neutral"
          icon={Activity}
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Volume (7 Days)</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chart visualization</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Network Distribution</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chart visualization</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Network Performance</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Ethereum Network</span>
              <span className="text-sm font-semibold text-foreground">94%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "94%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Polygon Network</span>
              <span className="text-sm font-semibold text-foreground">87%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "87%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">BSC Network</span>
              <span className="text-sm font-semibold text-foreground">76%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "76%" }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Settlement Efficiency */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Instant Settlements</h3>
          <p className="text-3xl font-bold text-foreground mb-1">68%</p>
          <p className="text-xs text-success">+5% from last week</p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Failed Transactions</h3>
          <p className="text-3xl font-bold text-foreground mb-1">0.6%</p>
          <p className="text-xs text-success">-0.3% improvement</p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Reconciliation Time</h3>
          <p className="text-3xl font-bold text-foreground mb-1">12m</p>
          <p className="text-xs text-success">-8m faster</p>
        </Card>
      </div>
    </div>
  );
}
