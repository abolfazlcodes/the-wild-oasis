import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://kwrsejlojvcoqzbhdxdh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cnNlamxvanZjb3F6YmhkeGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyOTg3NDEsImV4cCI6MjAwODg3NDc0MX0.v-zlEhRzPI5_17UvS8zgrKHP-KF6cfeCKhQ20thjuwA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
