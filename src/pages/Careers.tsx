import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, ArrowRight, Upload, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

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
  'Personal Care Assistant',
  'Registered Nurse',
  'Clinical Services Coordinator',
  'Administration Support',
  'Community Support Worker',
  'Other',
];

const Careers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
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
    setResumeError(null);

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setResumeError('Please upload a PDF or Word document');
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError('File size must be less than 5MB');
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!resumeFile) {
      setResumeError('Please upload your resume');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload resume to storage
      const fileName = `${Date.now()}-${resumeFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) {
        throw new Error('Failed to upload resume');
      }

      // Send email notification via edge function
      const { error: emailError } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'job_application',
          data: {
            ...data,
            resumeFileName: fileName,
          },
        },
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the submission if email fails
      }

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

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Resume (PDF/DOC) *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg transition-colors ${
                        resumeFile ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/50'
                      }`}>
                        {resumeFile ? (
                          <>
                            <FileText className="h-6 w-6 text-accent" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{resumeFile.name}</p>
                              <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (Max 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {resumeError && <p className="text-sm text-destructive">{resumeError}</p>}
                  </div>

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
