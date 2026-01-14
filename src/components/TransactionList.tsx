import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

interface Transaction {
  id: string;
  type: "inbound" | "outbound";
  amount: string;
  currency: string;
  from: string;
  to: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  network: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TX-2024-001",
    type: "inbound",
    amount: "25,000,000.00",
    currency: "NGN",
    from: "First Bank Nigeria",
    to: "Paystack",
    status: "completed",
    timestamp: "2 mins ago",
    network: "Ethereum",
  },
  {
    id: "TX-2024-002",
    type: "outbound",
    amount: "15,750,500.00",
    currency: "NGN",
    from: "Flutterwave",
    to: "Zenith Bank",
    status: "pending",
    timestamp: "5 mins ago",
    network: "Polygon",
  },
  {
    id: "TX-2024-003",
    type: "inbound",
    amount: "42,100,000.00",
    currency: "NGN",
    from: "GTBank",
    to: "Kuda MFB",
    status: "completed",
    timestamp: "12 mins ago",
    network: "Ethereum",
  },
  {
    id: "TX-2024-004",
    type: "outbound",
    amount: "8,250,000.00",
    currency: "NGN",
    from: "OPay",
    to: "UBA",
    status: "failed",
    timestamp: "18 mins ago",
    network: "BSC",
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

export default function TransactionList({ limit }: { limit?: number }) {
  const transactions = limit ? mockTransactions.slice(0, limit) : mockTransactions;
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  return (
    <>
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((tx) => {
              const StatusIcon = statusConfig[tx.status].icon;
              return (
                <div
                  key={tx.id}
                  onClick={() => handleTransactionClick(tx)}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30 cursor-pointer"
                >
                <div className={`rounded-full p-2 ${tx.type === "inbound" ? "bg-success/10" : "bg-primary/10"}`}>
                  {tx.type === "inbound" ? (
                    <ArrowDownLeft className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{tx.id}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {tx.from} → {tx.to}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {tx.amount} {tx.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                </div>

                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${statusConfig[tx.status].bg} border ${statusConfig[tx.status].border}`}>
                  <StatusIcon className={`h-3 w-3 ${statusConfig[tx.status].color}`} />
                  <span className={`text-xs font-medium capitalize ${statusConfig[tx.status].color}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
}
