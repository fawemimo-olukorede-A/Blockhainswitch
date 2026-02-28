import { TrendingUp, DollarSign, Clock, Activity, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { useAnalytics, formatAmount, getOrgDisplayName } from "@/hooks/useTransactions";

export default function Analytics() {
  const { data: analytics, isLoading, error } = useAnalytics();

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
        <p>Error loading analytics</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  const successRate = analytics?.totalTransactions
    ? ((analytics.settledCount / analytics.totalTransactions) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and insights from the blockchain</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Volume"
          value={formatAmount(analytics?.totalVolume || 0)}
          change={`${analytics?.totalTransactions || 0} transactions`}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Settlement Rate"
          value={`${successRate}%`}
          change={`${analytics?.settledCount || 0} settled`}
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Pending"
          value={String(analytics?.pendingCount || 0)}
          change="Awaiting settlement"
          trend={analytics?.pendingCount === 0 ? "up" : "neutral"}
          icon={Clock}
        />
        <StatCard
          title="Total Transactions"
          value={String(analytics?.totalTransactions || 0)}
          change="All time"
          trend="neutral"
          icon={Activity}
        />
      </div>

      {/* Volume by Currency */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Volume by Currency</h3>
        <div className="space-y-4">
          {analytics?.volumeByCurrency && Object.entries(analytics.volumeByCurrency).map(([currency, volume]) => {
            const percentage = analytics.totalVolume ? (volume / analytics.totalVolume) * 100 : 0;
            return (
              <div key={currency}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{currency}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatAmount(volume, currency)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          {(!analytics?.volumeByCurrency || Object.keys(analytics.volumeByCurrency).length === 0) && (
            <p className="text-center text-muted-foreground py-4">No data available</p>
          )}
        </div>
      </Card>

      {/* Volume by Participant */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Volume by Participant</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Sent</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Received</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Net Position</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.volumeByParticipant && Object.entries(analytics.volumeByParticipant).map(([org, data]) => {
                const net = data.received - data.sent;
                return (
                  <tr key={org} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {getOrgDisplayName(org)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-destructive">
                      -{formatAmount(data.sent)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-success">
                      +{formatAmount(data.received)}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${net >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {net >= 0 ? '+' : ''}{formatAmount(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!analytics?.volumeByParticipant || Object.keys(analytics.volumeByParticipant).length === 0) && (
            <p className="text-center text-muted-foreground py-8">No participant data available</p>
          )}
        </div>
      </Card>

      {/* Settlement Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Settlement Rate</h3>
          <p className="text-3xl font-bold text-foreground mb-1">{successRate}%</p>
          <p className="text-xs text-success">
            {analytics?.settledCount || 0} of {analytics?.totalTransactions || 0} settled
          </p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Volume</h3>
          <p className="text-3xl font-bold text-foreground mb-1">
            {analytics?.pendingCount || 0}
          </p>
          <p className="text-xs text-warning">Transactions awaiting settlement</p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Network</h3>
          <p className="text-3xl font-bold text-foreground mb-1">Hyperledger</p>
          <p className="text-xs text-success">Fabric v2.5</p>
        </Card>
      </div>
    </div>
  );
}
