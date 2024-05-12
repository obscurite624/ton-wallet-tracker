import { createClient } from '@supabase/supabase-js';

// Crear un cliente Supabase para interactuar con su base de datos
export const supabase = createClient(
  'https://rrkndkkqauqbhhzgwdiv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJya25ka2txYXVxYmhoemd3ZGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMjM5MDgsImV4cCI6MjAyOTg5OTkwOH0.pWQZzMMQ84PSIoXn46o9mcWLRk_n8KZy-xnaG-1yehU'
);
