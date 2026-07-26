/**
 * Entorno de DESARROLLO.
 * useMockData = true  -> la app usa StorageRepository (localStorage), sin backend real.
 * useMockData = false -> la app usa el backend indicado en `backend`:
 *   - 'supabase' -> SupabaseRepository + Supabase Auth (Postgres real, ver supabase/).
 *   - 'aws'      -> HttpRepository, que llama a API Gateway (ver ARQUITECTURA_AWS.md).
 */
export const environment = {
  production: false,
  useMockData: false,
  backend: 'supabase' as 'supabase' | 'aws',
  supabase: {
    url: 'https://dthuwcjtzkdqjnehaepg.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHV3Y2p0emtkcWpuZWhhZXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTY5NzAsImV4cCI6MjEwMDQ5Mjk3MH0.RlHc9M_G0f8oTM7y9QV3Xh3QZ9FCgM7mhmoti_2C2v0'
  },
  aws: {
    region: 'us-east-1',
    apiBaseUrl: 'https://TU-API-ID.execute-api.us-east-1.amazonaws.com/dev',
    cognito: {
      userPoolId: 'us-east-1_XXXXXXXXX',
      userPoolWebClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      identityPoolId: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
    },
    s3: {
      documentsBucket: 'colegio-documentos-dev',
      reportCardsBucket: 'colegio-boletines-dev'
    }
  }
};
