import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertTriangle, Loader2, CreditCard, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TransactionDetailsDialog from "./TransactionDetailsDialog";
import { useTransactions, formatAmount, formatTimestamp, getOrgDisplayName, getTxTypeDisplayName, getAcquirer, getIssuer } from "@/hooks/useTransactions";
import type { Transaction } from "@/services/api";

const statusConfig = {
  PENDING: { icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  SETTLED: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Settled" },
  APPROVED: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Approved" },
  DECLINED: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Declined" },
  DISPUTED: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Disputed" },
};

interface TransactionListProps {
  limit?: number;
}

export default function TransactionList({ limit }: TransactionListProps) {
  const { data: transactions, isLoading, error } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sort transactions by timestamp descending (newest first)
  const sortedTransactions = transactions
    ? [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];
  const displayTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-8">
        <div className="text-center text-destructive">
          <p>Error loading transactions</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            {sortedTransactions.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {sortedTransactions.length} total
              </span>
            )}
          </div>

          {!displayTransactions || displayTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayTransactions.map((tx) => {
                // Determine status from responseCode if available
                let statusKey = tx.status;
                if (tx.responseCode) {
                  statusKey = (tx.responseCode === '00' || tx.responseCode === '10' || tx.responseCode === '11')
                    ? 'APPROVED'
                    : 'DECLINED';
                }
                const status = statusConfig[statusKey] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                const acquirer = getAcquirer(tx);
                const issuer = getIssuer(tx);
                const isCardTx = !!tx.rrn || !!tx.maskedPan;

                return (
                  <div
                    key={tx.txId}
                    onClick={() => handleTransactionClick(tx)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30 cursor-pointer"
                  >
                    <div className={`rounded-full p-2 ${isCardTx ? "bg-primary/10" : "bg-muted/50"}`}>
                      {isCardTx ? (
                        <CreditCard className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {tx.rrn ? (
                          <p className="text-sm font-semibold text-foreground truncate">
                            RRN: {tx.rrn}
                          </p>
                        ) : (
                          <p className="text-sm font-semibold text-foreground truncate">
                            {tx.txId.substring(0, 16)}...
                          </p>
                        )}
                        {tx.txType && (
                          <Badge variant="outline" className="text-xs">
                            {getTxTypeDisplayName(tx.txType)}
                          </Badge>
                        )}
                        {tx.maskedPan && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {tx.maskedPan}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {getOrgDisplayName(acquirer)} → {getOrgDisplayName(issuer)}
                        {tx.merchantName && ` • ${tx.merchantName}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {formatAmount(tx.amount, tx.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${status.bg} border ${status.border}`}>
                      <StatusIcon className={`h-3 w-3 ${status.color}`} />
                      <span className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                        {tx.responseCode && tx.responseCode !== '00' && ` (${tx.responseCode})`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
