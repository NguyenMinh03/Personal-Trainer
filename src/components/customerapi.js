export const getCustomers = async () => {
    const apiUrl = "https://customerrestservice-personaltraining.rahtiapp.fi/api/customers";
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error in fetch: ${response.statusText}, Details: ${errorDetails}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        throw error; // Rethrow after logging or handle accordingly
    }
}
