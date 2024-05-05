export const getCustomers = () => {
    const apiUrl = "https://customerrestservice-personaltraining.rahtiapp.fi/api/customers";
    return fetch(apiUrl)
    .then(response => {
        if (!response.ok)
            throw new Error("Error in fetch: " + response.statusText);

        return response.json();
    })
}
