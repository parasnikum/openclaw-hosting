import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowRight, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('name') || 'Your Instance';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95">
        <CardContent className="pt-12 pb-10 px-8 text-center space-y-6">
          <div className="h-20 w-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/20 rotate-3">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Payment Received!</h1>
            <p className="text-muted-foreground italic">
              Configuration for <b>{projectName}</b> is being deployed to the cluster.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
              onClick={() => navigate('/instances')}
            >
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" className="w-full rounded-2xl" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" /> Back Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CheckoutFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2.5rem] animate-in slide-in-from-top-4">
        <CardContent className="pt-12 pb-10 px-8 text-center space-y-6">
          <div className="h-20 w-20 bg-destructive rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-destructive/20 -rotate-3">
            <XCircle className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Payment Failed</h1>
            <p className="text-muted-foreground italic">
              Your bank declined the transaction. No charges were made.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              variant="destructive"
              className="w-full h-14 rounded-2xl font-bold text-lg"
              onClick={() => navigate('/create')}
            >
              <RefreshCcw className="mr-2 h-5 w-5" /> Try Again
            </Button>
            <Button variant="ghost" className="w-full rounded-2xl" onClick={() => navigate('/instances')}>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CheckoutPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2.5rem]">
        <CardContent className="pt-12 pb-10 px-8 text-center space-y-6">
          <div className="h-20 w-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <Clock className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Processing...</h1>
            <p className="text-muted-foreground italic">
              We are waiting for confirmation from your provider. This usually takes a few seconds.
            </p>
          </div>

          <Button variant="outline" className="w-full h-14 rounded-2xl" disabled>
             Checking Status...
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}