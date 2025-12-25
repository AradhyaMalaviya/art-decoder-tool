import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Client for user authentication
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Service role client for accessing protected data and audit logging
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const { trainer_id } = await req.json();
    if (!trainer_id) {
      return new Response(
        JSON.stringify({ error: 'trainer_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching contact for trainer:', trainer_id);

    // Get user's profile ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the trainer is assigned to this user
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('assigned_trainers')
      .select('id, user_id')
      .eq('id', trainer_id)
      .single();

    if (assignmentError || !assignment) {
      console.error('Assignment not found:', assignmentError);
      return new Response(
        JSON.stringify({ error: 'Trainer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check authorization - user can only access their assigned trainer
    if (assignment.user_id !== profile.id) {
      console.error('User not authorized to view this trainer contact');
      
      // Log unauthorized access attempt
      await supabaseAdmin.from('audit_logs').insert({
        user_id: profile.id,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        resource_type: 'trainer_contact',
        resource_id: trainer_id,
        metadata: { reason: 'User attempted to access trainer not assigned to them' },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'
      });

      return new Response(
        JSON.stringify({ error: 'Not authorized to view this trainer contact' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch sensitive data using service role
    const { data: sensitiveData, error: sensitiveError } = await supabaseAdmin
      .from('trainer_sensitive_data')
      .select('email, phone')
      .eq('trainer_id', trainer_id)
      .single();

    if (sensitiveError) {
      console.error('Error fetching sensitive data:', sensitiveError);
      return new Response(
        JSON.stringify({ error: 'Contact information not available' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log successful access
    const { error: auditError } = await supabaseAdmin.from('audit_logs').insert({
      user_id: profile.id,
      action: 'VIEW_CONTACT',
      resource_type: 'trainer_contact',
      resource_id: trainer_id,
      metadata: { 
        trainer_id,
        accessed_fields: ['email', 'phone']
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'
    });

    if (auditError) {
      console.error('Error logging audit:', auditError);
      // Continue even if audit fails - don't block user
    }

    console.log('Successfully returned trainer contact for user:', profile.id);

    return new Response(
      JSON.stringify({ 
        email: sensitiveData.email,
        phone: sensitiveData.phone
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-trainer-contact:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
