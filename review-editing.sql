-- Run these in Supabase -> SQL Editor, ONE AT A TIME (click Run after each).

-- 1) Users can see their own reviews (including ones still pending approval)
CREATE POLICY "Users read own reviews" ON review FOR SELECT USING (auth.uid() = reviewer_id);

-- 2) Users can edit their own reviews (banned users can't)
CREATE POLICY "Users edit own reviews" ON review FOR UPDATE USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_banned = true));

-- 3) Safety function: stops regular users from changing anything except rating/comment,
--    and sends any edit back to "pending approval". Admins and the SQL editor are exempt.
CREATE OR REPLACE FUNCTION review_edit_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN IF auth.uid() IS NULL THEN RETURN NEW; END IF; IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN RETURN NEW; END IF; NEW.reviewer_id := OLD.reviewer_id; NEW.reviewer_name := OLD.reviewer_name; NEW.ref_id := OLD.ref_id; NEW.event_id := OLD.event_id; NEW.date := OLD.date; NEW.created_at := OLD.created_at; IF NEW.rating IS DISTINCT FROM OLD.rating OR NEW.comment IS DISTINCT FROM OLD.comment THEN NEW.approved := false; ELSE NEW.approved := OLD.approved; END IF; RETURN NEW; END; $$;

-- 4) Attach the safety function to the review table
CREATE TRIGGER review_edit_guard_trg BEFORE UPDATE ON review FOR EACH ROW EXECUTE FUNCTION review_edit_guard();
