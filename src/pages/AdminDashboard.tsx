import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  LogOut, 
  Check, 
  X, 
  Trash2, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminDashboard = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [authLoading, user, isAdmin, navigate]);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch testimonials',
        variant: 'destructive',
      });
    } else {
      setTestimonials(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchTestimonials();
    }
  }, [user, isAdmin]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    const { error } = await supabase
      .from('testimonials')
      .update({ 
        status, 
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id 
      })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${status === 'approved' ? 'approve' : 'reject'} testimonial`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Testimonial ${status}`,
      });
      fetchTestimonials();
    }
    setActionLoading(null);
  };

  const deleteTestimonial = async () => {
    if (!deleteId) return;
    
    setActionLoading(deleteId);
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Deleted',
        description: 'Testimonial removed',
      });
      fetchTestimonials();
    }
    setDeleteId(null);
    setActionLoading(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || (!user && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container-custom px-4 md:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage testimonials</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom px-4 md:px-8 py-8">
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Testimonials</h2>
              <p className="text-sm text-muted-foreground">
                {testimonials.filter(t => t.status === 'pending').length} pending review
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchTestimonials} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No testimonials found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="min-w-[300px]">Testimonial</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{testimonial.name}</p>
                          {testimonial.email && (
                            <p className="text-xs text-muted-foreground">{testimonial.email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {testimonial.text}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(testimonial.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {testimonial.status !== 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => updateStatus(testimonial.id, 'approved')}
                              disabled={actionLoading === testimonial.id}
                            >
                              {actionLoading === testimonial.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {testimonial.status !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => updateStatus(testimonial.id, 'rejected')}
                              disabled={actionLoading === testimonial.id}
                            >
                              {actionLoading === testimonial.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteId(testimonial.id)}
                            disabled={actionLoading === testimonial.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The testimonial will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTestimonial} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
