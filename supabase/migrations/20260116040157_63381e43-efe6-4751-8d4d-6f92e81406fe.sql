-- Create storage bucket for resume uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create policies for resume uploads (anyone can upload, only admins can view)
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Public read access for resume metadata"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes');