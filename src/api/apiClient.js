// API Client for Ruby Round
// Handles all HTTP requests to the backend server

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Token storage keys
const USER_TOKEN_KEY = 'rubyround_user_token';
const ADMIN_TOKEN_KEY = 'rubyround_admin_token';
const ADMIN_INFO_KEY = 'rubyround_admin_info';

// Get stored tokens
const getUserToken = () => localStorage.getItem(USER_TOKEN_KEY);
const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
const getAdminInfo = () => {
  try {
    const info = localStorage.getItem(ADMIN_INFO_KEY);
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
};

// Store tokens
const setUserToken = (token) => localStorage.setItem(USER_TOKEN_KEY, token);
const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
const setAdminInfo = (admin) => localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(admin));

// Remove tokens
const removeUserToken = () => localStorage.removeItem(USER_TOKEN_KEY);
const removeAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_INFO_KEY);
};

// Base fetch function with error handling
const apiFetch = async (endpoint, options = {}, useAdminToken = false) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = useAdminToken ? getAdminToken() : getUserToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 errors (token expired)
      if (response.status === 401) {
        if (useAdminToken) {
          removeAdminToken();
        } else {
          removeUserToken();
        }
      }
      throw new ApiError(data.error || 'API 요청에 실패했습니다.', response.status, data.code);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('서버에 연결할 수 없습니다.', 0, 'NETWORK_ERROR');
  }
};

// Custom error class
class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

// ==================== AUTH API ====================

export const authApi = {
  // User registration
  register: async (email, password, name, phone) => {
    const result = await apiFetch('/auth/register', {
      method: 'POST',
      body: { email, password, name, phone },
    });
    if (result.data?.token) {
      setUserToken(result.data.token);
    }
    return result.data;
  },

  // User login
  login: async (email, password) => {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (result.data?.token) {
      setUserToken(result.data.token);
    }
    return result.data;
  },

  // Social login
  socialLogin: async (userData) => {
    const result = await apiFetch('/auth/social', {
      method: 'POST',
      body: userData,
    });
    if (result.data?.token) {
      setUserToken(result.data.token);
    }
    return result.data;
  },

  // Get current user
  getMe: async () => {
    const result = await apiFetch('/auth/me');
    return result.data;
  },

  // Update profile
  updateProfile: async (name, phone) => {
    const result = await apiFetch('/auth/me', {
      method: 'PUT',
      body: { name, phone },
    });
    return result.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const result = await apiFetch('/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
    return result.data;
  },

  // Delete account
  deleteAccount: async () => {
    const result = await apiFetch('/auth/me', { method: 'DELETE' });
    removeUserToken();
    return result.data;
  },

  // Logout
  logout: () => {
    removeUserToken();
  },

  // Check if user is logged in
  isLoggedIn: () => !!getUserToken(),

  // Get verification status
  getVerificationStatus: async () => {
    const result = await apiFetch('/auth/verification/status');
    return result.data;
  },

  // Complete PASS verification
  completePassVerification: async (verificationData) => {
    const result = await apiFetch('/auth/verification/pass', {
      method: 'POST',
      body: verificationData,
    });
    return result.data;
  },

  // Admin login
  adminLogin: async (email, password) => {
    const result = await apiFetch('/auth/admin/login', {
      method: 'POST',
      body: { email, password },
    });
    if (result.data?.token) {
      setAdminToken(result.data.token);
    }
    if (result.data?.admin) {
      setAdminInfo(result.data.admin);
    }
    return result.data;
  },

  // Get current admin
  getAdminMe: async () => {
    const result = await apiFetch('/auth/admin/me', {}, true);
    return result.data;
  },

  // Admin logout
  adminLogout: () => {
    removeAdminToken();
  },

  // Check if admin is logged in
  isAdminLoggedIn: () => !!getAdminToken(),

  // Get stored admin info (synchronous)
  getStoredAdminInfo: () => getAdminInfo(),
};

// ==================== USER API ====================

export const userApi = {
  // Get balance
  getBalance: async () => {
    const result = await apiFetch('/users/balance');
    return result.data;
  },

  // Get ledger
  getLedger: async (page = 1, limit = 20) => {
    const result = await apiFetch(`/users/ledger?page=${page}&limit=${limit}`);
    return result.data;
  },

  // Get profile
  getProfile: async () => {
    const result = await apiFetch('/users/profile');
    return result.data;
  },
};

// ==================== EXCHANGE API ====================

export const exchangeApi = {
  // Create application
  create: async (applicationData) => {
    const result = await apiFetch('/exchange', {
      method: 'POST',
      body: applicationData,
    });
    return result.data;
  },

  // Get my applications
  getMyApplications: async (page = 1, limit = 20) => {
    const result = await apiFetch(`/exchange/my?page=${page}&limit=${limit}`);
    return result.data;
  },

  // Get application detail
  getDetail: async (id) => {
    const result = await apiFetch(`/exchange/${id}`);
    return result.data;
  },

  // Cancel application
  cancel: async (id, reason) => {
    const result = await apiFetch(`/exchange/${id}/cancel`, {
      method: 'POST',
      body: { reason },
    });
    return result.data;
  },
};

// ==================== SEASON API ====================

export const seasonApi = {
  // Get all seasons
  getSeasons: async () => {
    const result = await apiFetch('/seasons');
    return result.data;
  },

  // Get season detail
  getSeasonDetail: async (id) => {
    const result = await apiFetch(`/seasons/${id}`);
    return result.data;
  },

  // Get rounds by season
  getRounds: async (seasonId) => {
    const result = await apiFetch(`/seasons/${seasonId}/rounds`);
    // Transform API response to match frontend expected format
    return (result.data || []).map(round => ({
      ...round,
      number: `Round ${round.round_number}`,
      title: round.name,
      price: round.round_value || 0,
      participants: round.participants || 0,
      seasonId: round.season_id,
    }));
  },

  // Get my payments for a season
  getMySeasonPayments: async (seasonId) => {
    const result = await apiFetch(`/seasons/${seasonId}/payments`);
    return result.data;
  },

  // Create round payment
  createPayment: async (paymentData) => {
    const result = await apiFetch('/seasons/payments', {
      method: 'POST',
      body: paymentData,
    });
    return result.data;
  },

  // Get all my payments
  getMyPayments: async () => {
    const result = await apiFetch('/seasons/my/payments');
    return result.data;
  },

  // Get my ledger
  getMyLedger: async (page = 1, limit = 20) => {
    const result = await apiFetch(`/seasons/my/ledger?page=${page}&limit=${limit}`);
    return result.data;
  },
};

// ==================== PUBLIC API ====================

export const publicApi = {
  // Get consultation modal content
  getConsultationModal: async () => {
    const result = await apiFetch('/public/modal/consultation');
    return result.data;
  },

  // Get public settings
  getSettings: async () => {
    const result = await apiFetch('/public/settings');
    return result.data;
  },

  // Submit contact inquiry
  submitInquiry: async (inquiryData) => {
    const result = await apiFetch('/public/inquiries', {
      method: 'POST',
      body: inquiryData,
    });
    return result.data;
  },
};

// ==================== ADMIN API ====================

export const adminApi = {
  // Applications
  applications: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const result = await apiFetch(`/admin/applications?${params}`, {}, true);
      return result.data;
    },

    getDetail: async (id) => {
      const result = await apiFetch(`/admin/applications/${id}`, {}, true);
      return result.data;
    },

    updateStatus: async (id, status, note) => {
      const result = await apiFetch(`/admin/applications/${id}/status`, {
        method: 'PUT',
        body: { status, note },
      }, true);
      return result.data;
    },

    confirmConsultation: async (id, consultationData) => {
      const result = await apiFetch(`/admin/applications/${id}/consultation`, {
        method: 'POST',
        body: consultationData,
      }, true);
      return result.data;
    },

    approve: async (id) => {
      const result = await apiFetch(`/admin/applications/${id}/approve`, {
        method: 'POST',
      }, true);
      return result.data;
    },

    cancel: async (id, reason) => {
      const result = await apiFetch(`/admin/applications/${id}/cancel`, {
        method: 'POST',
        body: { reason },
      }, true);
      return result.data;
    },

    updateDelivery: async (id, deliveryData) => {
      const result = await apiFetch(`/admin/applications/${id}/delivery`, {
        method: 'PUT',
        body: deliveryData,
      }, true);
      return result.data;
    },

    markDelivered: async (id) => {
      const result = await apiFetch(`/admin/applications/${id}/delivered`, {
        method: 'POST',
      }, true);
      return result.data;
    },

    getStatistics: async () => {
      const result = await apiFetch('/admin/applications/stats/overview', {}, true);
      return result.data;
    },
  },

  // Users
  users: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const result = await apiFetch(`/admin/users?${params}`, {}, true);
      return result.data;
    },

    getDetail: async (id) => {
      const result = await apiFetch(`/admin/users/${id}`, {}, true);
      return result.data;
    },

    getByEmail: async (email) => {
      const result = await apiFetch(`/admin/users/email/${encodeURIComponent(email)}`, {}, true);
      return result.data;
    },

    updateStatus: async (id, status) => {
      const result = await apiFetch(`/admin/users/${id}/status`, {
        method: 'PUT',
        body: { status },
      }, true);
      return result.data;
    },

    chargeBalance: async (id, amount, description) => {
      const result = await apiFetch(`/admin/users/${id}/balance/charge`, {
        method: 'POST',
        body: { amount, description },
      }, true);
      return result.data;
    },

    deductBalance: async (id, amount, description) => {
      const result = await apiFetch(`/admin/users/${id}/balance/deduct`, {
        method: 'POST',
        body: { amount, description },
      }, true);
      return result.data;
    },

    getLedger: async (id, page = 1, limit = 20) => {
      const result = await apiFetch(`/admin/users/${id}/ledger?page=${page}&limit=${limit}`, {}, true);
      return result.data;
    },

    getAllLedgers: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const result = await apiFetch(`/admin/users/ledgers?${params}`, {}, true);
      return result.data;
    },

    getStatistics: async () => {
      const result = await apiFetch('/admin/users/stats/overview', {}, true);
      return result.data;
    },
  },

  // Seasons
  seasons: {
    getAll: async () => {
      const result = await apiFetch('/admin/seasons', {}, true);
      return result.data;
    },

    create: async (seasonData) => {
      const result = await apiFetch('/admin/seasons', {
        method: 'POST',
        body: seasonData,
      }, true);
      return result.data;
    },

    getDetail: async (id) => {
      const result = await apiFetch(`/admin/seasons/${id}`, {}, true);
      return result.data;
    },

    update: async (id, updateData) => {
      const result = await apiFetch(`/admin/seasons/${id}`, {
        method: 'PUT',
        body: updateData,
      }, true);
      return result.data;
    },

    getRounds: async (seasonId) => {
      const result = await apiFetch(`/admin/seasons/${seasonId}/rounds`, {}, true);
      return result.data;
    },

    createRound: async (seasonId, roundData) => {
      const result = await apiFetch(`/admin/seasons/${seasonId}/rounds`, {
        method: 'POST',
        body: roundData,
      }, true);
      return result.data;
    },

    updateRound: async (roundId, updateData) => {
      const result = await apiFetch(`/admin/seasons/rounds/${roundId}`, {
        method: 'PUT',
        body: updateData,
      }, true);
      return result.data;
    },

    getPayments: async (seasonId) => {
      const result = await apiFetch(`/admin/seasons/${seasonId}/payments`, {}, true);
      return result.data;
    },

    getSettlementPreview: async (seasonId, settlementType, winningRoundId, winningValue) => {
      const result = await apiFetch(`/admin/seasons/${seasonId}/settlement/preview`, {
        method: 'POST',
        body: { settlementType, winningRoundId, winningValue },
      }, true);
      return result.data;
    },

    executeSettlement: async (seasonId, settlementType, winningRoundId, winningValue) => {
      const result = await apiFetch(`/admin/seasons/${seasonId}/settlement/execute`, {
        method: 'POST',
        body: { settlementType, winningRoundId, winningValue },
      }, true);
      return result.data;
    },

    getAllSettlements: async () => {
      const result = await apiFetch('/admin/seasons/settlements/all', {}, true);
      return result.data;
    },

    getSettlementDetail: async (id) => {
      const result = await apiFetch(`/admin/seasons/settlements/${id}`, {}, true);
      return result.data;
    },
  },

  // Verification
  verification: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const result = await apiFetch(`/admin/verification?${params}`, {}, true);
      return result.data;
    },

    getDetail: async (id) => {
      const result = await apiFetch(`/admin/verification/${id}`, {}, true);
      return result.data;
    },

    approve: async (id) => {
      const result = await apiFetch(`/admin/verification/${id}/approve`, {
        method: 'POST',
      }, true);
      return result.data;
    },

    reject: async (id, reason) => {
      const result = await apiFetch(`/admin/verification/${id}/reject`, {
        method: 'POST',
        body: { reason },
      }, true);
      return result.data;
    },

    manualVerify: async (userId) => {
      const result = await apiFetch(`/admin/verification/user/${userId}/manual`, {
        method: 'POST',
      }, true);
      return result.data;
    },

    revoke: async (userId, reason) => {
      const result = await apiFetch(`/admin/verification/user/${userId}/revoke`, {
        method: 'POST',
        body: { reason },
      }, true);
      return result.data;
    },

    getUserStatus: async (userId) => {
      const result = await apiFetch(`/admin/verification/user/${userId}/status`, {}, true);
      return result.data;
    },

    getStatistics: async () => {
      const result = await apiFetch('/admin/verification/stats/overview', {}, true);
      return result.data;
    },
  },

  // System
  system: {
    getSettings: async () => {
      const result = await apiFetch('/admin/system/settings', {}, true);
      return result.data;
    },

    saveSettings: async (settings) => {
      const result = await apiFetch('/admin/system/settings', {
        method: 'PUT',
        body: settings,
      }, true);
      return result.data;
    },

    getConsultationModal: async () => {
      const result = await apiFetch('/admin/system/modal/consultation', {}, true);
      return result.data;
    },

    saveConsultationModal: async (content) => {
      const result = await apiFetch('/admin/system/modal/consultation', {
        method: 'PUT',
        body: content,
      }, true);
      return result.data;
    },

    resetConsultationModal: async () => {
      const result = await apiFetch('/admin/system/modal/consultation/reset', {
        method: 'POST',
      }, true);
      return result.data;
    },

    getAuditLogs: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const result = await apiFetch(`/admin/system/audit-logs?${params}`, {}, true);
      return result.data;
    },

    getInquiries: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const result = await apiFetch(`/admin/system/inquiries?${params}`, {}, true);
      return result.data;
    },

    respondToInquiry: async (id, response) => {
      const result = await apiFetch(`/admin/system/inquiries/${id}/respond`, {
        method: 'POST',
        body: { response },
      }, true);
      return result.data;
    },

    updateInquiryStatus: async (id, status) => {
      const result = await apiFetch(`/admin/system/inquiries/${id}/status`, {
        method: 'PUT',
        body: { status },
      }, true);
      return result.data;
    },

    deleteInquiry: async (id) => {
      const result = await apiFetch(`/admin/system/inquiries/${id}`, {
        method: 'DELETE',
      }, true);
      return result.data;
    },
  },
};

// Export utility functions
export { getUserToken, getAdminToken, setUserToken, setAdminToken, removeUserToken, removeAdminToken, ApiError };

// Default export
export default {
  auth: authApi,
  user: userApi,
  exchange: exchangeApi,
  season: seasonApi,
  public: publicApi,
  admin: adminApi,
};
