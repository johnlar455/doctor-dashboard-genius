
-- Create a doctor feedback table to store patient feedback about doctors
CREATE TABLE IF NOT EXISTS public.doctor_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  punctuality NUMERIC(3, 1) NOT NULL CHECK (punctuality >= 1 AND punctuality <= 5),
  knowledge NUMERIC(3, 1) NOT NULL CHECK (knowledge >= 1 AND knowledge <= 5),
  communication NUMERIC(3, 1) NOT NULL CHECK (communication >= 1 AND communication <= 5),
  friendliness NUMERIC(3, 1) NOT NULL CHECK (friendliness >= 1 AND friendliness <= 5),
  overall NUMERIC(3, 1) NOT NULL CHECK (overall >= 1 AND overall <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(doctor_id, patient_id)
);

-- Create an index for faster lookups
CREATE INDEX doctor_feedback_doctor_id_idx ON public.doctor_feedback (doctor_id);
CREATE INDEX doctor_feedback_patient_id_idx ON public.doctor_feedback (patient_id);
