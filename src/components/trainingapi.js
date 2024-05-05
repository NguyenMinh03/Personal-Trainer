export const getTraining = () => {
    const apiUrl = "https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings";
    return fetch(apiUrl)
    .then(response => {
        if (!response.ok)
            throw new Error("Error in fetch: " + response.statusText);

        return response.json();
    })
}
export const addTraining = (trainingData) => {
    const apiUrl = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings';
    return fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingData)
    })
    .then(response => response.json())
    .catch(err => console.error('Failed to add training:', err));
};
