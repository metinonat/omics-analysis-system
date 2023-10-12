let lastRequestTime: number | undefined = undefined;

// Function to rate-limit the API requests
export const rateLimitedApiRequest = (apiRequest: () => void) => {
  // Check if it's been at least 5 seconds since the last request
  if (!lastRequestTime || Date.now() - lastRequestTime >= 5000) {
    lastRequestTime = Date.now();
    apiRequest();
  }
};
