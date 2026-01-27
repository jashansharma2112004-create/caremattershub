import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, ArrowRight, Briefcase, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { trackFormSubmission } from '@/lib/analytics';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  position: z.string().min(1, 'Please select a position'),
  workExperience: z.string().min(10, 'Please describe your work experience'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const positions = [
  'Support Worker',
  'Enrolled Nurse',
  'Registered Nurse',
  'Other',
];

const Careers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      position: '',
      workExperience: '',
      message: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) {
      setResumeFile(null);
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 5MB');
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const removeFile = () => {
    setResumeFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      let attachmentData: { base64: string; mimeType: string; filename: string } | undefined;

      // Upload resume if provided
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);

        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke('upload-resume', {
          body: formData,
        });

        if (uploadError) {
          throw new Error('Failed to upload resume');
        }

        // Use file data for email attachment
        if (uploadResult?.fileData) {
          attachmentData = {
            base64: uploadResult.fileData.base64,
            mimeType: uploadResult.fileData.mimeType,
            filename: uploadResult.fileData.originalName,
          };
        }
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'job_application',
          data: {
            ...data,
          },
          attachment: attachmentData,
        },
      });

      if (emailError) {
        throw emailError;
      }

      // Track form submission
      trackFormSubmission('Job Application Form', 'job_application', {
        position: data.position,
        has_resume: !!resumeFile,
      });

      setIsSubmitted(true);
      toast({
        title: 'Application Submitted',
        description: 'Thank you for applying! We will review your application and get back to you.',
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom px-4 md:px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Application Received!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your interest in joining Care Matters Hub. We've received your application 
                and will review it carefully. You'll hear from us within 5-7 business days.
              </p>
              <Button asChild>
                <a href="/">Return to Home</a>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="NDIS Jobs Melbourne | Support Worker & Nursing Careers"
        description="Join Care Matters Hub in Melbourne. We're hiring NDIS support workers, enrolled nurses, and registered nurses. Flexible hours, training, and career growth opportunities."
        canonical="/careers"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Careers', url: '/careers' },
        ]}
      />

      {/* Hero Section */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Join Our Team</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              We're always looking for passionate individuals who want to make a difference in people's lives. 
              Join Care Matters Hub and be part of a caring community.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">Why Work With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At Care Matters Hub, we believe in investing in our team members and creating a supportive work environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-healthcare text-center">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Flexible Hours</h3>
              <p className="text-muted-foreground text-sm">Work-life balance with flexible scheduling options</p>
            </div>
            <div className="card-healthcare text-center">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Career Growth</h3>
              <p className="text-muted-foreground text-sm">Training and development opportunities</p>
            </div>
            <div className="card-healthcare text-center">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Supportive Team</h3>
              <p className="text-muted-foreground text-sm">Work alongside experienced professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="card-healthcare">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Job Application Form</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+61 4XX XXX XXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Applying For *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card">
                            {positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Experience *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your relevant work experience, including previous roles, responsibilities, and years of experience..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us why you'd like to join our team..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <FormLabel>Resume (Optional)</FormLabel>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-upload"
                      />
                      {!resumeFile ? (
                        <label
                          htmlFor="resume-upload"
                          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">
                            Upload PDF or Word document (max 5MB)
                          </span>
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm text-foreground truncate max-w-[80%]">
                            {resumeFile.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {fileError && (
                        <p className="text-sm text-destructive">{fileError}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, you agree to be contacted by Care Matters Hub regarding your job application.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
