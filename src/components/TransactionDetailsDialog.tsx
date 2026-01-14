import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

export default function TransactionDetailsDialog({ transaction, open, onOpenChange }: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const StatusIcon = statusConfig[transaction.status].icon;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction ID & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Transaction ID:</span>
              <span className="font-mono font-semibold text-foreground">{transaction.id}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(transaction.id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig[transaction.status].bg} border ${statusConfig[transaction.status].border}`}>
              <StatusIcon className={`h-4 w-4 ${statusConfig[transaction.status].color}`} />
              <span className={`text-sm font-medium capitalize ${statusConfig[transaction.status].color}`}>
                {transaction.status}
              </span>
            </div>
          </div>

          {/* Transaction Type & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Type</p>
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${transaction.type === "inbound" ? "bg-success/10" : "bg-primary/10"}`}>
                  {transaction.type === "inbound" ? (
                    <ArrowDownLeft className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="font-semibold text-foreground capitalize">{transaction.type}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Amount</p>
              <p className="text-2xl font-bold text-foreground">
                {transaction.amount} {transaction.currency}
              </p>
            </div>
          </div>

          {/* Network */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Network</p>
            <Badge variant="outline" className="text-sm font-medium">
              {transaction.network}
            </Badge>
          </div>

          {/* Transaction Flow */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground mb-3">Transaction Flow</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">From</p>
                <p className="font-semibold text-foreground">{transaction.from}</p>
              </div>
              <div className="flex justify-center">
                <ArrowDownLeft className="h-5 w-5 text-primary rotate-180" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">To</p>
                <p className="font-semibold text-foreground">{transaction.to}</p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Timestamp</p>
            <p className="font-semibold text-foreground">{transaction.timestamp}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
