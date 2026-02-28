import { Activity, TrendingUp, Users, Zap, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import TransactionList from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import networkBg from "@/assets/blockchain-network-bg.jpg";
import { useAnalytics, useParticipants, formatAmount } from "@/hooks/useTransactions";

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: participants } = useParticipants();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${networkBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Blockchain Transaction
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Switching Backbone
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Seamlessly route transactions across banks, fintechs, and merchants with improved transparency,
              reduced disputes, and full blockchain-fiat interoperability.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
                <span className="text-sm font-medium text-primary-foreground">Real-time Settlement</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <Zap className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-secondary-foreground">Hyperledger Fabric</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsLoading ? (
          <Card className="col-span-4 p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </Card>
        ) : (
          <>
            <StatCard
              title="Total Volume"
              value={formatAmount(analytics?.totalVolume || 0)}
              change={`${analytics?.totalTransactions || 0} transactions`}
              trend="up"
              icon={TrendingUp}
            />
            <StatCard
              title="Pending Transactions"
              value={String(analytics?.pendingCount || 0)}
              change={`${analytics?.settledCount || 0} settled`}
              trend="neutral"
              icon={Activity}
            />
            <StatCard
              title="Network Participants"
              value={String(participants?.length || 0)}
              change="Banks & Organizations"
              trend="up"
              icon={Users}
            />
            <StatCard
              title="Settlement Status"
              value={analytics?.pendingCount === 0 ? "Clear" : "Pending"}
              change={analytics?.pendingCount === 0 ? "All settled" : `${analytics?.pendingCount} to settle`}
              trend={analytics?.pendingCount === 0 ? "up" : "neutral"}
              icon={Zap}
            />
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <TransactionList limit={5} />
    </div>
  );
}
