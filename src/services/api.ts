// API Service for connecting to the Rezo Backend
// Updated to support Card Transactions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.26.40.36:3000';

// Card Transaction interface (supports both new card fields and legacy fields)
export interface Transaction {
  txId: string;

  // Card-specific fields (NEW)
  rrn?: string;              // Retrieval Reference Number
  stan?: string;             // System Trace Audit Number
  maskedPan?: string;        // Card number masked (e.g., 506105****1234)

  // Parties (supports both old and new field names)
  acquirerCode?: string;     // Acquirer institution code (NEW)
  issuerCode?: string;       // Issuer institution code (NEW)
  payerOrg?: string;         // Legacy field (maps to acquirerCode)
  payeeOrg?: string;         // Legacy field (maps to issuerCode)

  // Merchant info (NEW)
  terminalId?: string;       // POS/ATM Terminal ID
  merchantId?: string;       // Merchant identifier
  merchantName?: string;     // Merchant name

  // Transaction details
  amount: number;
  currency: string;
  txType?: string;           // PURCHASE, WITHDRAWAL, REFUND, TRANSFER (NEW)

  // Auth info (NEW)
  authCode?: string;         // Authorization code from issuer
  responseCode?: string;     // ISO 8583 response code (00 = approved)

  // Status
  status: 'PENDING' | 'SETTLED' | 'DISPUTED' | 'APPROVED' | 'DECLINED';
  timestamp: string;
  settlementTimestamp?: string;  // When settled (NEW)

  // Metadata
  metadata?: string;
}

export interface Balance {
  orgMSPID: string;
  balance: number;
  currency?: string;
}

// Net position between acquirer and issuer
export interface NetPosition {
  acquirerCode: string;
  issuerCode: string;
  transactionCount: number;
  grossAmount: number;
  netAmount: number;
  currency: string;
  settlementDate?: string;
}

export interface Analytics {
  totalTransactions: number;
  totalVolume: number;
  settledCount: number;
  pendingCount: number;
  disputedCount?: number;
  volumeByCurrency: Record<string, number>;
  volumeByTxType?: Record<string, { count: number; volume: number }>;
  volumeByParticipant: Record<string, { sent: number; received: number; asAcquirer?: number; asIssuer?: number }>;
  netPositions?: NetPosition[];
  currency?: string;
}

export interface SettlementResult {
  status: string;
  txIds: string[];
  netPositions?: NetPosition[];
}

export interface ClearResult {
  clearedCount: number;
  cleared: string[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async health(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  // Get all transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return this.request('/transactions');
  }

  // Get transaction by ID
  async getTransaction(txId: string): Promise<Transaction> {
    return this.request(`/transactions/${encodeURIComponent(txId)}`);
  }

  // Get transaction by RRN (NEW)
  async getTransactionByRRN(rrn: string): Promise<Transaction> {
    return this.request(`/transactions/rrn/${encodeURIComponent(rrn)}`);
  }

  // Get transactions by acquirer (NEW)
  async getTransactionsByAcquirer(acquirerCode: string): Promise<Transaction[]> {
    return this.request(`/transactions/acquirer/${encodeURIComponent(acquirerCode)}`);
  }

  // Get transactions by issuer (NEW)
  async getTransactionsByIssuer(issuerCode: string): Promise<Transaction[]> {
    return this.request(`/transactions/issuer/${encodeURIComponent(issuerCode)}`);
  }

  // Get transactions by date (NEW)
  async getTransactionsByDate(date: string): Promise<Transaction[]> {
    return this.request(`/transactions/date/${encodeURIComponent(date)}`);
  }

  // Get transactions in time window
  async getTransactionsInWindow(startTime: string, endTime: string): Promise<Transaction[]> {
    const params = new URLSearchParams({ startTime, endTime });
    return this.request(`/transactions/window?${params}`);
  }

  // Get bank transactions (for the connected org)
  async getBankTransactions(): Promise<Transaction[]> {
    return this.request('/bank/transactions');
  }

  // Get bank balance
  async getBankBalance(orgMSPID: string): Promise<Balance> {
    return this.request(`/bank/balance/${encodeURIComponent(orgMSPID)}`);
  }

  // Get net position between acquirer and issuer (NEW)
  async getNetPosition(acquirerCode: string, issuerCode: string): Promise<NetPosition> {
    const params = new URLSearchParams({ acquirerCode, issuerCode });
    return this.request(`/settlement/netposition?${params}`);
  }

  // Get participants
  async getParticipants(): Promise<string[]> {
    return this.request('/participants');
  }

  // Get analytics
  async getAnalytics(): Promise<Analytics> {
    return this.request('/analytics');
  }

  // Submit new card transaction (NEW - primary method)
  async submitCardTransaction(data: {
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
  }): Promise<{ success: boolean; message: string; rrn?: string }> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Submit transaction (backward compatible - legacy method)
  async submitTransaction(data: {
    payerOrg: string;
    payeeOrg: string;
    amount: number;
    currency?: string;
    metadata?: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Raise dispute on a transaction (NEW)
  async raiseDispute(txId: string, reason: string): Promise<{ success: boolean; message: string }> {
    return this.request('/transactions/dispute', {
      method: 'POST',
      body: JSON.stringify({ txId, reason }),
    });
  }

  // Finalize settlement
  async finalizeSettlement(windowStart: string, windowEnd: string): Promise<SettlementResult> {
    return this.request('/settlement/finalize', {
      method: 'POST',
      body: JSON.stringify({ windowStart, windowEnd }),
    });
  }

  // Clear transactions
  async clearTransactions(txIds: string[]): Promise<ClearResult> {
    return this.request('/settlement/clear', {
      method: 'POST',
      body: JSON.stringify({ txIds }),
    });
  }

  // Initialize ledger
  async initLedger(): Promise<{ success: boolean; message: string }> {
    return this.request('/ledger/init', {
      method: 'POST',
    });
  }

  // Get auto-settlement status
  async getAutoSettlementStatus(): Promise<{ enabled: boolean; interval: number; running: boolean }> {
    return this.request('/settlement/auto/status');
  }

  // Start auto-settlement
  async startAutoSettlement(): Promise<{ success: boolean; message: string; interval: number }> {
    return this.request('/settlement/auto/start', { method: 'POST' });
  }

  // Stop auto-settlement
  async stopAutoSettlement(): Promise<{ success: boolean; message: string }> {
    return this.request('/settlement/auto/stop', { method: 'POST' });
  }
}

export const api = new ApiService();
export default api;
