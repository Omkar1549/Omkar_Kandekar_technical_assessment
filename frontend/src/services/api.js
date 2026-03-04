/**
 * API Service for handling communication with the FastAPI backend.
 */

const BASE_URL = 'http://localhost:8000';

export const parsePipeline = async (nodes, edges) => {
  try {
    const response = await fetch(`${BASE_URL}/pipelines/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to parse pipeline');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Pipeline submission error:", error);
    throw error;
  }
};

// Future API calls can be added here
export const getBackendStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    return await response.json();
  } catch (error) {
    console.error("Status check failed:", error);
    return { status: "offline" };
  }
};