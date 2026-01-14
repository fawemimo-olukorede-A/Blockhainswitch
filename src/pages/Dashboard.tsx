import { Activity, TrendingUp, Users, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";
import TransactionList from "@/components/TransactionList";
import { Card } from "@/components/ui/card";
import networkBg from "@/assets/blockchain-network-bg.jpg";

export default function Dashboard() {
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
                <span className="text-sm font-medium text-secondary-foreground">Multi-chain Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Volume (24h)"
          value="₦2.4B"
          change="+12.5% from yesterday"
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Active Transactions"
          value="1,247"
          change="156 pending"
          trend="neutral"
          icon={Activity}
        />
        <StatCard
          title="Connected Nodes"
          value="48"
          change="3 banks, 12 fintechs, 33 merchants"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Avg. Settlement Time"
          value="4.2s"
          change="-2.1s improvement"
          trend="up"
          icon={Zap}
        />
      </div>

      {/* Recent Transactions */}
      <TransactionList limit={4} />
    </div>
  );
}
