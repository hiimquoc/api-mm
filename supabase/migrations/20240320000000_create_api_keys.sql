-- Add max_usage to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS max_usage INTEGER DEFAULT 1000;

-- Remove max_usage from api_keys table
ALTER TABLE api_keys DROP COLUMN IF EXISTS max_usage;

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  key TEXT NOT NULL,
  usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys(user_id);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own API keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own API keys
CREATE POLICY "Users can insert their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own API keys
CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own API keys
CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate API key usage
CREATE OR REPLACE FUNCTION validate_api_key_usage()
RETURNS TRIGGER AS $$
DECLARE
  user_max_usage INTEGER;
BEGIN
  -- Get user's max_usage
  SELECT max_usage INTO user_max_usage
  FROM public.users
  WHERE id = NEW.user_id;

  -- Check if this is a usage increment
  IF NEW.usage > OLD.usage THEN
    -- Check if incrementing usage would exceed user's max_usage
    IF NEW.usage > user_max_usage THEN
      RAISE EXCEPTION 'API key usage limit exceeded. Maximum allowed: %', user_max_usage;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to validate API key usage before updates
CREATE TRIGGER validate_api_key_usage_trigger
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION validate_api_key_usage(); 