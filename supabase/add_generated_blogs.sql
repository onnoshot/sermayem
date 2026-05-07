-- Table for AI-generated daily blog posts
CREATE TABLE IF NOT EXISTS generated_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  published_at date NOT NULL DEFAULT CURRENT_DATE,
  read_time integer NOT NULL DEFAULT 7,
  category text NOT NULL DEFAULT 'Genel',
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE generated_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read generated blogs"
  ON generated_blog_posts FOR SELECT
  USING (true);
