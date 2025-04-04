-- Enable the UUID generation extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Create the links table
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), -- Explicitly use the extensions schema
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE, -- Ensure URLs are unique
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Use standard NOW() for default timestamp
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Add an updated_at timestamp

  -- **IMPORTANT**: Add user_id if links belong to specific users
  user_id UUID, -- Define column type, constraint defined below
  -- Add other columns as needed, e.g., tags, clicks, etc.

  -- Define foreign key constraint separately
  CONSTRAINT fk_links_user FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_links_url ON public.links(url);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id); -- Index if you add user_id

-- Optional: Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Optional: Trigger to call the function before updates
CREATE TRIGGER update_links_updated_at
BEFORE UPDATE ON public.links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- == Row Level Security (RLS) - uncomment and adjust if needed ==

-- 1. Enable RLS on the table
-- ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 2. Create policies (EXAMPLES - Adjust to your needs)

-- Example: Allow public read access to all links
-- CREATE POLICY "Public links are viewable by everyone"
--   ON public.links FOR SELECT
--   USING (true);

-- Example: Allow users to view their own links (Requires user_id column)
-- CREATE POLICY "Users can view their own links"
--   ON public.links FOR SELECT
--   USING (auth.uid() = user_id);

-- Example: Allow users to insert links for themselves (Requires user_id column)
-- CREATE POLICY "Users can insert their own links"
--   ON public.links FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- Example: Allow users to update their own links (Requires user_id column)
-- CREATE POLICY "Users can update their own links"
--   ON public.links FOR UPDATE
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- Example: Allow users to delete their own links (Requires user_id column)
-- CREATE POLICY "Users can delete their own links"
--   ON public.links FOR DELETE
--   USING (auth.uid() = user_id);
