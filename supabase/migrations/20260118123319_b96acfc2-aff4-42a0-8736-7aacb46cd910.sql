-- Fix resume bucket security: Remove overly permissive policies and add restricted ones

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for resume metadata" ON storage.objects;

-- Create more restrictive upload policy with file type validation
-- Only allow specific file extensions and require proper path format
CREATE POLICY "Restricted resume uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resumes'
  AND (storage.extension(name) = 'pdf' 
       OR storage.extension(name) = 'doc' 
       OR storage.extension(name) = 'docx')
  AND length(name) < 255
  AND name ~ '^[0-9]+-[a-zA-Z0-9_\-\.\s]+\.(pdf|doc|docx)$'
);

-- Only allow service role (backend/admin) to read resumes - no public access
CREATE POLICY "Service role read access for resumes"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resumes'
  AND auth.role() = 'service_role'
);