-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- e.g., 'follow', 'like', 'comment'
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NULL, -- Nullable for 'follow' type
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications are viewable by recipient." ON public.notifications FOR SELECT USING (auth.uid() = recipient_user_id);
CREATE POLICY "Users can insert their own notifications." ON public.notifications FOR INSERT WITH CHECK (auth.uid() = sender_user_id OR auth.uid() = recipient_user_id);
CREATE POLICY "Recipients can update their own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = recipient_user_id);
CREATE POLICY "Recipients can delete their own notifications." ON public.notifications FOR DELETE USING (auth.uid() = recipient_user_id);

-- Add notifications table to Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
