-- Ruby Round Database Schema
-- Version: 1.0.0
-- Character Set: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. USERS TABLE (사용자)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(20) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  profile_image VARCHAR(500) NULL,

  -- Social login info
  social_provider ENUM('email', 'kakao', 'google') DEFAULT 'email',
  social_id VARCHAR(255) NULL,

  -- Adult verification
  is_adult_verified BOOLEAN DEFAULT FALSE,
  adult_verified_at DATETIME NULL,
  adult_verification_method VARCHAR(50) NULL,
  verification_ci VARCHAR(255) NULL,

  -- Status and timestamps
  status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_social (social_provider, social_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. ADMINS TABLE (관리자)
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('ceo', 'cs_manager', 'cs_staff') NOT NULL DEFAULT 'cs_staff',
  status ENUM('active', 'inactive') DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. EXCHANGE_BALANCES TABLE (교환금 잔액)
-- =====================================================
CREATE TABLE IF NOT EXISTS exchange_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  total_balance BIGINT DEFAULT 0,
  available_balance BIGINT DEFAULT 0,
  hold_balance BIGINT DEFAULT 0,
  used_balance BIGINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_balance (available_balance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. EXCHANGE_LEDGERS TABLE (교환금 원장)
-- =====================================================
CREATE TABLE IF NOT EXISTS exchange_ledgers (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  type ENUM('credit', 'debit') NOT NULL,
  amount BIGINT NOT NULL,
  balance_before BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  reason VARCHAR(50) NOT NULL,
  description TEXT NULL,
  related_type VARCHAR(50) NULL,
  related_id VARCHAR(50) NULL,
  created_by VARCHAR(100) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_reason (reason),
  INDEX idx_created (created_at),
  INDEX idx_related (related_type, related_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. EXCHANGE_APPLICATIONS TABLE (교환 신청)
-- =====================================================
CREATE TABLE IF NOT EXISTS exchange_applications (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_phone VARCHAR(20) NULL,

  -- Category and specifications
  category ENUM('ring', 'necklace', 'bracelet', 'earring', 'other') NOT NULL,
  specifications JSON NULL,
  requested_amount BIGINT NOT NULL,
  request_note TEXT NULL,

  -- Status
  status ENUM('received', 'cs_consulting', 'consultation_confirmed', 'approved',
              'in_production', 'ready_to_ship', 'shipping', 'delivered', 'completed', 'cancelled')
         DEFAULT 'received',

  -- Consultation
  consultation_final_spec TEXT NULL,
  consultation_final_amount BIGINT NULL,
  consultation_note TEXT NULL,
  consultation_customer_confirmed BOOLEAN DEFAULT FALSE,
  consulted_at DATETIME NULL,
  consulted_by VARCHAR(100) NULL,

  -- Approval
  approved_at DATETIME NULL,
  approved_by VARCHAR(100) NULL,
  deducted_amount BIGINT NULL,
  ledger_entry_id VARCHAR(20) NULL,

  -- Delivery info (stored in separate table)

  -- Cancellation
  cancelled_at DATETIME NULL,
  cancelled_by VARCHAR(100) NULL,
  cancel_reason TEXT NULL,

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_email (user_email),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. EXCHANGE_STATUS_HISTORY TABLE (상태 변경 이력)
-- =====================================================
CREATE TABLE IF NOT EXISTS exchange_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id VARCHAR(20) NOT NULL,
  from_status VARCHAR(50) NULL,
  to_status VARCHAR(50) NOT NULL,
  actor VARCHAR(100) NOT NULL,
  note TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (application_id) REFERENCES exchange_applications(id) ON DELETE CASCADE,
  INDEX idx_application (application_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. DELIVERIES TABLE (배송 정보)
-- =====================================================
CREATE TABLE IF NOT EXISTS deliveries (
  id VARCHAR(20) PRIMARY KEY,
  application_id VARCHAR(20) NOT NULL,

  -- Recipient info
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  postal_code VARCHAR(10) NULL,
  address VARCHAR(500) NOT NULL,
  address_detail VARCHAR(200) NULL,
  delivery_memo TEXT NULL,

  -- Shipping info
  courier VARCHAR(50) NULL,
  tracking_number VARCHAR(100) NULL,

  -- Status
  status ENUM('pending', 'ready', 'shipped', 'delivered', 'returned') DEFAULT 'pending',

  -- Timestamps
  shipped_at DATETIME NULL,
  delivered_at DATETIME NULL,
  received_confirmed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_application (application_id),
  FOREIGN KEY (application_id) REFERENCES exchange_applications(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_tracking (tracking_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. SEASONS TABLE (시즌)
-- =====================================================
CREATE TABLE IF NOT EXISTS seasons (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,

  -- Amount settings
  total_amount BIGINT DEFAULT 0,
  round_amount BIGINT DEFAULT 0,

  -- Duration
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Status
  status ENUM('upcoming', 'active', 'ended', 'settled') DEFAULT 'upcoming',

  -- Settlement info
  is_settled BOOLEAN DEFAULT FALSE,
  settled_at DATETIME NULL,
  settlement_id VARCHAR(20) NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. ROUNDS TABLE (라운드)
-- =====================================================
CREATE TABLE IF NOT EXISTS rounds (
  id VARCHAR(20) PRIMARY KEY,
  season_id VARCHAR(20) NOT NULL,
  round_number INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,

  -- Value
  round_value BIGINT NOT NULL,

  -- Duration
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Status
  status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',

  -- Result
  is_winner BOOLEAN DEFAULT FALSE,
  winning_value VARCHAR(50) NULL,
  result_confirmed_at DATETIME NULL,
  result_confirmed_by VARCHAR(100) NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  INDEX idx_season (season_id),
  INDEX idx_status (status),
  INDEX idx_round_number (season_id, round_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. ROUND_PAYMENTS TABLE (라운드 결제)
-- =====================================================
CREATE TABLE IF NOT EXISTS round_payments (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  season_id VARCHAR(20) NOT NULL,
  round_id VARCHAR(20) NOT NULL,

  -- Payment info
  amount BIGINT NOT NULL,
  payment_key VARCHAR(100) NULL,
  order_id VARCHAR(100) NOT NULL,

  -- Status
  status ENUM('success', 'cancelled', 'refunded') DEFAULT 'success',

  -- Toss payment data
  payment_data JSON NULL,

  -- Timestamps
  paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  cancelled_at DATETIME NULL,
  refunded_at DATETIME NULL,

  UNIQUE KEY uk_order (order_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_season (season_id),
  INDEX idx_round (round_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. SEASON_SETTLEMENTS TABLE (시즌 정산)
-- =====================================================
CREATE TABLE IF NOT EXISTS season_settlements (
  id VARCHAR(20) PRIMARY KEY,
  season_id VARCHAR(20) NOT NULL,

  -- Settlement type
  settlement_type ENUM('with_winner', 'no_winner') NOT NULL,
  winning_round_id VARCHAR(20) NULL,
  winning_value VARCHAR(50) NULL,

  -- Statistics
  total_customers INT DEFAULT 0,
  winner_count INT DEFAULT 0,
  non_winner_count INT DEFAULT 0,
  zero_amount_count INT DEFAULT 0,
  total_paid_amount BIGINT DEFAULT 0,
  total_credit_amount BIGINT DEFAULT 0,

  -- Settlement data
  customer_results JSON NULL,

  created_by VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_season (season_id),
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  INDEX idx_type (settlement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. ADULT_VERIFICATIONS TABLE (성인 인증)
-- =====================================================
CREATE TABLE IF NOT EXISTS adult_verifications (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(100) NOT NULL,

  -- Verification data
  method ENUM('pass', 'phone', 'ipin', 'card', 'manual') NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',

  -- Identity info (masked)
  verified_name VARCHAR(100) NULL,
  verified_birth_date VARCHAR(20) NULL,
  verified_gender ENUM('M', 'F') NULL,
  ci VARCHAR(255) NULL,
  di VARCHAR(255) NULL,

  -- Admin action
  processed_by VARCHAR(100) NULL,
  processed_at DATETIME NULL,
  reject_reason TEXT NULL,

  -- Expiration
  expires_at DATETIME NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_email (user_email),
  INDEX idx_status (status),
  INDEX idx_ci (ci)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. REWARDS TABLE (보상/당첨)
-- =====================================================
CREATE TABLE IF NOT EXISTS rewards (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  round_id VARCHAR(20) NULL,
  season_id VARCHAR(20) NULL,

  -- Reward info
  reward_type ENUM('ruby', 'exchange_credit', 'coupon', 'gift') NOT NULL,
  reward_value BIGINT NULL,
  reward_description TEXT NULL,

  -- Configuration
  configuration JSON NULL,

  -- Status
  status ENUM('pending', 'confirmed', 'processing', 'completed', 'exception', 'cancelled') DEFAULT 'pending',

  -- Processing info
  processed_by VARCHAR(100) NULL,
  processed_at DATETIME NULL,
  exception_reason TEXT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_round (round_id),
  INDEX idx_status (status),
  INDEX idx_type (reward_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. COUPONS TABLE (쿠폰 템플릿)
-- =====================================================
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(20) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,

  -- Coupon type and value
  coupon_type ENUM('percentage', 'fixed', 'free_shipping', 'bonus_credit') NOT NULL,
  discount_value BIGINT NULL,
  min_order_amount BIGINT DEFAULT 0,
  max_discount_amount BIGINT NULL,

  -- Usage limits
  total_quantity INT NULL,
  used_quantity INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,

  -- Duration
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,

  -- Status
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active',

  created_by VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 15. COUPON_USAGES TABLE (쿠폰 사용 이력)
-- =====================================================
CREATE TABLE IF NOT EXISTS coupon_usages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  coupon_id VARCHAR(20) NOT NULL,
  user_id VARCHAR(20) NOT NULL,

  -- Usage info
  status ENUM('issued', 'used', 'expired', 'cancelled') DEFAULT 'issued',
  discount_amount BIGINT NULL,
  related_order_id VARCHAR(50) NULL,

  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME NULL,
  issued_by VARCHAR(100) NULL,

  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_coupon (coupon_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 16. AUDIT_LOGS TABLE (감사 로그)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(20) PRIMARY KEY,

  -- Actor info
  actor_type ENUM('user', 'admin', 'system') NOT NULL,
  actor_id VARCHAR(50) NULL,
  actor_name VARCHAR(100) NULL,
  actor_email VARCHAR(255) NULL,

  -- Action info
  action ENUM('create', 'update', 'delete', 'approve', 'reject', 'login', 'logout', 'export', 'status_change') NOT NULL,

  -- Target info
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(50) NULL,
  target_name VARCHAR(200) NULL,

  -- Details
  description TEXT NULL,
  old_value JSON NULL,
  new_value JSON NULL,
  ip_address VARCHAR(50) NULL,
  user_agent TEXT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_actor (actor_type, actor_id),
  INDEX idx_action (action),
  INDEX idx_target (target_type, target_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 17. SYSTEM_SETTINGS TABLE (시스템 설정)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSON NOT NULL,
  description TEXT NULL,
  updated_by VARCHAR(100) NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 18. CONSULTATION_MODAL_CONTENT TABLE (상담 모달 컨텐츠)
-- =====================================================
CREATE TABLE IF NOT EXISTS consultation_modal_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content JSON NOT NULL,
  updated_by VARCHAR(100) NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 19. CONTACT_INQUIRIES TABLE (문의)
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- Response
  status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
  response TEXT NULL,
  responded_by VARCHAR(100) NULL,
  responded_at DATETIME NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 20. ROUND_RESULTS TABLE (라운드 결과)
-- =====================================================
CREATE TABLE IF NOT EXISTS round_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  round_id VARCHAR(20) NOT NULL,

  -- Result data
  result_value VARCHAR(100) NULL,
  is_winner BOOLEAN DEFAULT FALSE,

  -- Status
  status ENUM('pending', 'processing', 'confirmed', 'locked') DEFAULT 'pending',

  -- Confirmation
  confirmed_by VARCHAR(100) NULL,
  confirmed_at DATETIME NULL,
  locked_by VARCHAR(100) NULL,
  locked_at DATETIME NULL,

  -- Additional data
  result_data JSON NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_round (round_id),
  FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE CASCADE,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 21. USER_SESSIONS TABLE (사용자 세션)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  device_info VARCHAR(255) NULL,
  ip_address VARCHAR(50) NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 22. ADMIN_SESSIONS TABLE (관리자 세션)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(50) NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_admin (admin_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 23. VERIFICATION_EVIDENCE TABLE (인증 증빙)
-- =====================================================
CREATE TABLE IF NOT EXISTS verification_evidence (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(20) NOT NULL,
  verification_id VARCHAR(20) NOT NULL,

  -- Evidence data (encrypted)
  evidence_type VARCHAR(50) NOT NULL,
  evidence_data TEXT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_verification (verification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default admin accounts (passwords will be hashed by the application)
-- Placeholder - actual insert will be done by the application

-- Default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('minimum_exchange_amount', '300000', '최소 교환 신청 금액'),
('site_name', '"루비라운드"', '사이트 이름'),
('site_description', '"프리미엄 보석 교환 서비스"', '사이트 설명'),
('contact_email', '"support@rubyround.net"', '고객 문의 이메일'),
('contact_phone', '"02-1234-5678"', '고객 문의 전화번호')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Default consultation modal content
INSERT INTO consultation_modal_content (content) VALUES
('{"title":"상담 접수 안내","subtitle":"접수 전 확인해주세요","items":[{"id":1,"icon":"📋","title":"상담 접수","description":"본 신청은 상담 접수이며, 교환금이 즉시 차감되지 않습니다."},{"id":2,"icon":"💬","title":"전문 상담사 확인","description":"전문 상담사가 연락드려 상세 내용을 확인하고 최종 사양을 협의합니다."},{"id":3,"icon":"✅","title":"내부 승인 후 차감","description":"내부 승인 완료 시 교환금이 차감되고 제작이 시작됩니다."},{"id":4,"icon":"⚠️","title":"취소 안내","description":"내부 승인 전까지는 취소가 가능하지만, 승인 이후에는 취소가 불가합니다."}],"confirmButtonText":"확인하고 접수하기","cancelButtonText":"다시 확인하기"}')
ON DUPLICATE KEY UPDATE content = VALUES(content);
