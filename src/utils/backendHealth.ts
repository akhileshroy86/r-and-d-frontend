export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3002/api/v1/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const testStaffEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/v1/staff');
    console.log('Staff endpoint status:', response.status);
    const data = await response.json();
    console.log('Staff endpoint response:', data);
    return response.ok;
  } catch (error) {
    console.error('Staff endpoint test failed:', error);
    return false;
  }
};