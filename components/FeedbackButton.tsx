"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/hooks/useAuth';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        feedback: feedback.trim(),
        createdAt: new Date().toISOString(),
        status: 'new'
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset after dialog closes
        setTimeout(() => {
          setSubmitted(false);
          setFeedback('');
        }, 300);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="fixed bottom-4 right-4 bg-[#B87D3B] hover:bg-[#96652F] text-white border-none"
        >
          Give Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Help us improve your experience. Share your thoughts, suggestions, or report issues.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-4">
            <p className="text-green-500">Thank you for your feedback!</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="bg-neutral-800 border-neutral-700 focus:border-[#B87D3B] min-h-[150px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !feedback.trim()}
              className="bg-[#B87D3B] hover:bg-[#96652F]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 