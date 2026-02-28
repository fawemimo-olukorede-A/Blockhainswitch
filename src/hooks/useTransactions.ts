import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { Transaction, NetPosition } from '@/services/api';

// Query keys
export const queryKeys = {
  transactions: ['transactions'] as const,
  transaction: (id: string) => ['transaction', id] as const,
  transactionByRRN: (rrn: string) => ['transactionByRRN', rrn] as const,
  transactionsByAcquirer: (code: string) => ['transactionsByAcquirer', code] as const,
  transactionsByIssuer: (code: string) => ['transactionsByIssuer', code] as const,
  transactionsByDate: (date: string) => ['transactionsByDate', date] as const,
  analytics: ['analytics'] as const,
  participants: ['participants'] as const,
  balance: (orgId: string) => ['balance', orgId] as const,
  bankTransactions: ['bankTransactions'] as const,
  netPosition: (acquirer: string, issuer: string) => ['netPosition', acquirer, issuer] as const,
  autoSettlementStatus: ['autoSettlementStatus'] as const,
};

// Hook to fetch all transactions
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => api.getAllTransactions(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Hook to fetch a single transaction
export function useTransaction(txId: string) {
  return useQuery({
    queryKey: queryKeys.transaction(txId),
    queryFn: () => api.getTransaction(txId),
    enabled: !!txId,
  });
}

// Hook to fetch transaction by RRN (NEW)
export function useTransactionByRRN(rrn: string) {
  return useQuery({
    queryKey: queryKeys.transactionByRRN(rrn),
    queryFn: () => api.getTransactionByRRN(rrn),
    enabled: !!rrn,
  });
}

// Hook to fetch transactions by acquirer (NEW)
export function useTransactionsByAcquirer(acquirerCode: string) {
  return useQuery({
    queryKey: queryKeys.transactionsByAcquirer(acquirerCode),
    queryFn: () => api.getTransactionsByAcquirer(acquirerCode),
    enabled: !!acquirerCode,
  });
}

// Hook to fetch transactions by issuer (NEW)
export function useTransactionsByIssuer(issuerCode: string) {
  return useQuery({
    queryKey: queryKeys.transactionsByIssuer(issuerCode),
    queryFn: () => api.getTransactionsByIssuer(issuerCode),
    enabled: !!issuerCode,
  });
}

// Hook to fetch transactions by date (NEW)
export function useTransactionsByDate(date: string) {
  return useQuery({
    queryKey: queryKeys.transactionsByDate(date),
    queryFn: () => api.getTransactionsByDate(date),
    enabled: !!date,
  });
}

// Hook to fetch analytics
export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: () => api.getAnalytics(),
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

// Hook to fetch participants
export function useParticipants() {
  return useQuery({
    queryKey: queryKeys.participants,
    queryFn: () => api.getParticipants(),
  });
}

// Hook to fetch balance for an org
export function useBalance(orgMSPID: string) {
  return useQuery({
    queryKey: queryKeys.balance(orgMSPID),
    queryFn: () => api.getBankBalance(orgMSPID),
    enabled: !!orgMSPID,
  });
}

// Hook to fetch bank transactions
export function useBankTransactions() {
  return useQuery({
    queryKey: queryKeys.bankTransactions,
    queryFn: () => api.getBankTransactions(),
  });
}

// Hook to fetch net position between acquirer and issuer (NEW)
export function useNetPosition(acquirerCode: string, issuerCode: string) {
  return useQuery({
    queryKey: queryKeys.netPosition(acquirerCode, issuerCode),
    queryFn: () => api.getNetPosition(acquirerCode, issuerCode),
    enabled: !!acquirerCode && !!issuerCode,
  });
}

// Hook to get auto-settlement status (NEW)
export function useAutoSettlementStatus() {
  return useQuery({
    queryKey: queryKeys.autoSettlementStatus,
    queryFn: () => api.getAutoSettlementStatus(),
    refetchInterval: 30000,
  });
}

// Hook to submit a new card transaction (NEW)
export function useSubmitCardTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      rrn?: string;
      stan?: string;
      maskedPan?: string;
      acquirerCode: string;
      issuerCode: string;
      terminalId?: string;
      merchantId?: string;
      merchantName?: string;
      amount: number;
      currency?: string;
      txType?: string;
      authCode?: string;
      responseCode?: string;
      metadata?: string;
    }) => api.submitCardTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

// Hook to submit a new transaction (legacy - backward compatible)
export function useSubmitTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      payerOrg: string;
      payeeOrg: string;
      amount: number;
      currency?: string;
      metadata?: string;
    }) => api.submitTransaction(data),
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

// Hook to raise dispute (NEW)
export function useRaiseDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ txId, reason }: { txId: string; reason: string }) =>
      api.raiseDispute(txId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

// Hook to finalize settlement
export function useFinalizeSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ windowStart, windowEnd }: { windowStart: string; windowEnd: string }) =>
      api.finalizeSettlement(windowStart, windowEnd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

// Hook to clear transactions
export function useClearTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (txIds: string[]) => api.clearTransactions(txIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

// Helper to format amount
export function formatAmount(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Helper to format timestamp
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper to get org display name (supports card transaction codes)
export function getOrgDisplayName(mspId: string | undefined): string {
  if (!mspId) return 'Unknown';

  const names: Record<string, string> = {
    // Legacy MSP IDs
    switchorgMSP: 'Switch (Interswitch)',
    alphamorganorgMSP: 'Alpha Morgan Bank',
    bytaorgMSP: 'Byta Bank',

    // Card transaction acquirer/issuer codes
    ISW: 'Interswitch',
    PSK: 'Paystack',
    FLW: 'Flutterwave',

    // Nigerian bank codes
    '011': 'First Bank',
    '014': 'Mainstreet Bank',
    '023': 'Citibank Nigeria',
    '032': 'Union Bank',
    '033': 'UBA',
    '035': 'Wema Bank',
    '039': 'Stanbic IBTC',
    '044': 'Access Bank',
    '050': 'Ecobank',
    '057': 'Zenith Bank',
    '058': 'GTBank',
    '063': 'Diamond Bank',
    '070': 'Fidelity Bank',
    '076': 'Polaris Bank',
    '082': 'Keystone Bank',
    '101': 'Providus Bank',
    '214': 'FCMB',
    '215': 'Unity Bank',
    '232': 'Sterling Bank',
    '301': 'Jaiz Bank',
  };

  return names[mspId] || mspId.replace('MSP', '').replace('org', ' ').trim();
}

// Helper to get transaction type display name (NEW)
export function getTxTypeDisplayName(txType: string | undefined): string {
  if (!txType) return 'Transfer';

  const types: Record<string, string> = {
    PURCHASE: 'Purchase',
    WITHDRAWAL: 'Withdrawal',
    REFUND: 'Refund',
    REVERSAL: 'Reversal',
    TRANSFER: 'Transfer',
    BALANCE_INQUIRY: 'Balance Inquiry',
  };

  return types[txType] || txType;
}

// Helper to get status color class (NEW)
export function getStatusColor(status: string): { text: string; bg: string; border: string } {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    PENDING: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    SETTLED: { text: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    DISPUTED: { text: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
  };

  return colors[status] || colors.PENDING;
}

// Helper to get acquirer/issuer from transaction (handles both old and new field names)
export function getAcquirer(tx: Transaction): string {
  return tx.acquirerCode || tx.payerOrg || 'Unknown';
}

export function getIssuer(tx: Transaction): string {
  return tx.issuerCode || tx.payeeOrg || 'Unknown';
}
