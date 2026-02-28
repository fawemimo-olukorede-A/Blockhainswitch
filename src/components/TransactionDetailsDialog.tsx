import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertTriangle, Copy, CreditCard, Building2, Store, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Transaction } from "@/services/api";
import { formatAmount, getOrgDisplayName, getTxTypeDisplayName } from "@/hooks/useTransactions";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  SETTLED: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Settled" },
  PENDING: { icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  DISPUTED: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Disputed" },
};

export default function TransactionDetailsDialog({ transaction, open, onOpenChange }: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const status = statusConfig[transaction.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;
  const acquirer = transaction.acquirerCode || transaction.payerOrg || 'Unknown';
  const issuer = transaction.issuerCode || transaction.payeeOrg || 'Unknown';
  const isCardTx = !!transaction.rrn || !!transaction.maskedPan;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            {isCardTx && <CreditCard className="h-6 w-6 text-primary" />}
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction ID & Status */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">TX ID:</span>
              <span className="font-mono text-sm font-semibold text-foreground truncate max-w-[200px]">
                {transaction.txId}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(transaction.txId)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} border ${status.border}`}>
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              <span className={`text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Card Transaction Identifiers */}
          {isCardTx && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {transaction.rrn && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">RRN</p>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="font-mono font-semibold text-foreground">{transaction.rrn}</span>
                  </div>
                </div>
              )}
              {transaction.stan && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">STAN</p>
                  <span className="font-mono font-semibold text-foreground">{transaction.stan}</span>
                </div>
              )}
              {transaction.maskedPan && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Card Number</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-mono font-semibold text-foreground">{transaction.maskedPan}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transaction Type & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Type</p>
              <Badge variant="outline" className="text-sm font-medium">
                {getTxTypeDisplayName(transaction.txType)}
              </Badge>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Amount</p>
              <p className="text-2xl font-bold text-foreground">
                {formatAmount(transaction.amount, transaction.currency)}
              </p>
            </div>
          </div>

          {/* Acquirer & Issuer */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground mb-3">Settlement Flow</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Acquirer</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{getOrgDisplayName(acquirer)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{acquirer}</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground mb-1">Issuer</p>
                <div className="flex items-center justify-end gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{getOrgDisplayName(issuer)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{issuer}</p>
                  </div>
                  <Building2 className="h-4 w-4 text-success" />
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Info (for card transactions) */}
          {(transaction.merchantName || transaction.merchantId || transaction.terminalId) && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-3">Merchant Information</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {transaction.merchantName && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Merchant Name</p>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{transaction.merchantName}</span>
                    </div>
                  </div>
                )}
                {transaction.merchantId && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Merchant ID</p>
                    <span className="font-mono text-sm text-foreground">{transaction.merchantId}</span>
                  </div>
                )}
                {transaction.terminalId && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Terminal ID</p>
                    <span className="font-mono text-sm text-foreground">{transaction.terminalId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Authorization Info */}
          {(transaction.authCode || transaction.responseCode) && (
            <div className="grid grid-cols-2 gap-4">
              {transaction.authCode && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Auth Code</p>
                  <span className="font-mono font-semibold text-success">{transaction.authCode}</span>
                </div>
              )}
              {transaction.responseCode && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Response Code</p>
                  <Badge variant={transaction.responseCode === '00' ? 'default' : 'destructive'} className="font-mono">
                    {transaction.responseCode}
                    {transaction.responseCode === '00' && ' (Approved)'}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Transaction Time</p>
              <p className="font-semibold text-foreground">
                {new Date(transaction.timestamp).toLocaleString('en-NG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
            {transaction.settlementTimestamp && (
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground mb-2">Settlement Time</p>
                <p className="font-semibold text-success">
                  {new Date(transaction.settlementTimestamp).toLocaleString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Network Badge */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Network</p>
            <Badge variant="outline" className="text-sm font-medium">
              Hyperledger Fabric
            </Badge>
          </div>

          {/* Metadata */}
          {transaction.metadata && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Metadata</p>
              <pre className="text-xs text-foreground font-mono bg-background/50 p-2 rounded overflow-x-auto">
                {transaction.metadata}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
