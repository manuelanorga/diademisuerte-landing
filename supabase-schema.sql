-- ════════════════════════════════════════════════
-- Día de mi Suerte — Supabase Schema
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ════════════════════════════════════════════════

-- Tabla de suscriptores
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  doc_type TEXT DEFAULT 'DNI Peruano',
  doc_number TEXT,
  first_name TEXT,
  last_name TEXT,
  country TEXT DEFAULT 'PERU',
  district TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'monthly' CHECK (plan IN ('monthly', 'quarterly', 'biannual')),
  status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'active', 'cancelled', 'expired')),
  niubiz_subscription_id TEXT,
  subscribed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: usuarios solo ven/editan su propia data
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON subscribers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON subscribers FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON subscribers FOR UPDATE
  USING (auth.uid() = id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_plan ON subscribers(plan);
