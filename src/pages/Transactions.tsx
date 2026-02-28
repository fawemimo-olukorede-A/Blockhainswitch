import { useState } from "react";
import { Search, Download, Copy, CheckCircle2, Clock, Info, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionDetailsDialog from "@/components/TransactionDetailsDialog";
import { useTransactions, useAnalytics, useParticipants, useSubmitTransaction, useSubmitCardTransaction, formatAmount, formatTimestamp, getOrgDisplayName, getTxTypeDisplayName, getAcquirer, getIssuer } from "@/hooks/useTransactions";
import type { Transaction } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, AlertTriangle } from "lucide-react";

const statusConfig = {
  PENDING: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  SETTLED: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  DISPUTED: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function Transactions() {
  const { toast } = useToast();
  const { data: transactions, isLoading, error } = useTransactions();
  const { data: analytics } = useAnalytics();
  const { data: participants } = useParticipants();
  const submitTransaction = useSubmitTransaction();
  const submitCardTransaction = useSubmitCardTransaction();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTxOpen, setNewTxOpen] = useState(false);

  // New card transaction form state
  const [acquirerCode, setAcquirerCode] = useState("");
  const [issuerCode, setIssuerCode] = useState("");
  const [amount, setAmount] = useState("");
  const [txType, setTxType] = useState("PURCHASE");
  const [maskedPan, setMaskedPan] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [metadata, setMetadata] = useState("");

  const filteredTransactions = transactions?.filter(
    (tx) =>
      tx.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.rrn && tx.rrn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.maskedPan && tx.maskedPan.toLowerCase().includes(searchQuery.toLowerCase())) ||
      getAcquirer(tx).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getIssuer(tx).toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.metadata?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", duration: 2000 });
  };

  const handleSubmitTransaction = async () => {
    if (!acquirerCode || !issuerCode || !amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      await submitCardTransaction.mutateAsync({
        acquirerCode,
        issuerCode,
        amount: parseFloat(amount),
        currency: "NGN",
        txType,
        maskedPan: maskedPan || undefined,
        merchantName: merchantName || undefined,
        metadata: metadata || undefined,
      });
      toast({ title: "Success", description: "Card transaction submitted successfully" });
      setNewTxOpen(false);
      setAcquirerCode("");
      setIssuerCode("");
      setAmount("");
      setTxType("PURCHASE");
      setMaskedPan("");
      setMerchantName("");
      setMetadata("");
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

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
        <p>Error loading transactions</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">Monitor and manage all transaction flows</p>
        </div>
        <Dialog open={newTxOpen} onOpenChange={setNewTxOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Submit Card Transaction
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Acquirer Code *</Label>
                  <Select value={acquirerCode} onValueChange={setAcquirerCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select acquirer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ISW">ISW - Interswitch</SelectItem>
                      <SelectItem value="PSK">PSK - Paystack</SelectItem>
                      <SelectItem value="FLW">FLW - Flutterwave</SelectItem>
                      <SelectItem value="011">011 - First Bank</SelectItem>
                      <SelectItem value="044">044 - Access Bank</SelectItem>
                      <SelectItem value="057">057 - Zenith Bank</SelectItem>
                      <SelectItem value="058">058 - GTBank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Issuer Code *</Label>
                  <Select value={issuerCode} onValueChange={setIssuerCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issuer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="011">011 - First Bank</SelectItem>
                      <SelectItem value="033">033 - UBA</SelectItem>
                      <SelectItem value="044">044 - Access Bank</SelectItem>
                      <SelectItem value="057">057 - Zenith Bank</SelectItem>
                      <SelectItem value="058">058 - GTBank</SelectItem>
                      <SelectItem value="070">070 - Fidelity Bank</SelectItem>
                      <SelectItem value="214">214 - FCMB</SelectItem>
                      <SelectItem value="232">232 - Sterling Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (NGN) *</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select value={txType} onValueChange={setTxType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PURCHASE">Purchase</SelectItem>
                      <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                      <SelectItem value="REFUND">Refund</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Masked PAN (optional)</Label>
                  <Input
                    placeholder="506105****1234"
                    value={maskedPan}
                    onChange={(e) => setMaskedPan(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Merchant Name (optional)</Label>
                  <Input
                    placeholder="Merchant name"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Metadata (optional)</Label>
                <Input
                  placeholder="Additional transaction info"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSubmitTransaction}
                disabled={submitCardTransaction.isPending}
              >
                {submitCardTransaction.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Submit Card Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground">{analytics?.totalTransactions || 0}</p>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <p className="text-sm text-muted-foreground">Total Volume</p>
          <p className="text-2xl font-bold text-foreground">{formatAmount(analytics?.totalVolume || 0)}</p>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground">{analytics?.pendingCount || 0}</p>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, sender, or recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30 border-border/50"
          />
        </div>
        <Button variant="outline" className="bg-muted/30 border-border/50 gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      {/* Transaction Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>Showing {filteredTransactions.length} of {transactions?.length || 0} transactions</span>
      </div>

      {/* Transactions Table */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Reference</TableHead>
                <TableHead className="text-muted-foreground font-medium">Acquirer</TableHead>
                <TableHead className="text-muted-foreground font-medium">Issuer</TableHead>
                <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                <TableHead className="text-muted-foreground font-medium">Time</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const status = statusConfig[tx.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                const acquirer = getAcquirer(tx);
                const issuer = getIssuer(tx);
                const isCardTx = !!tx.rrn || !!tx.maskedPan;
                return (
                  <TableRow
                    key={tx.txId}
                    className="border-border/30 hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleTransactionClick(tx)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isCardTx && <CreditCard className="h-4 w-4 text-primary" />}
                        <div>
                          {tx.rrn ? (
                            <span className="text-primary font-mono text-sm">{tx.rrn}</span>
                          ) : (
                            <span className="text-primary font-mono text-sm">
                              {tx.txId.substring(0, 12)}...
                            </span>
                          )}
                          {tx.maskedPan && (
                            <p className="text-xs text-muted-foreground font-mono">{tx.maskedPan}</p>
                          )}
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(tx.rrn || tx.txId);
                              }}
                            >
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy Reference</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm">{getOrgDisplayName(acquirer)}</span>
                        <p className="text-xs text-muted-foreground">{acquirer}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm">{getOrgDisplayName(issuer)}</span>
                        <p className="text-xs text-muted-foreground">{issuer}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getTxTypeDisplayName(tx.txType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatTimestamp(tx.timestamp)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {formatAmount(tx.amount, tx.currency)}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${status.bg}`}>
                        <StatusIcon className={`h-3 w-3 ${status.color}`} />
                        <span className={`text-xs font-medium capitalize ${status.color}`}>
                          {tx.status.toLowerCase()}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
