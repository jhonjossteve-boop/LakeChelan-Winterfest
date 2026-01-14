import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://dvdnimgcuudybfwkzmlh.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJiNjc5MzY5LTYwNmQtNDE2ZS04YTIwLWI5YzM1Y2YyOWFjZCJ9.eyJwcm9qZWN0SWQiOiJkdmRuaW1nY3V1ZHliZndrem1saCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY4MzY1NzIzLCJleHAiOjIwODM3MjU3MjMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.LM7etzgx4SJqa2lAYbIxgyF7_JRk7sVWIn6rRQl04-k';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };