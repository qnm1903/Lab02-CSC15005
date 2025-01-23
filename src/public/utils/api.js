const baseURL = 'http://localhost:3000'

class api {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async get(ENDPOINT) {
        const newURL = this.baseURL + ENDPOINT;
        try {
            const res = await fetch(newURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            })

            const result = await res.json();

            if (!res.success) {
                return { success: false, message: result.message };
            }

            return { success: true, data: result.data, message: result.message };
        } catch (error) {
            console.error('Error during get request', error.message);
            return { success: false, message: 'Get request failed' };
        }
    }

    async post(ENDPOINT, data) {
        const newURL = this.baseURL + ENDPOINT;

        try {
            const isFormData = data instanceof FormData;

            const res = await fetch(newURL, {
                method: 'POST',
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                },
                body: isFormData ? data : JSON.stringify(data)
            });

            const result = await res.json();

            if (!result.success) {
                return result;
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Post request failed' };
        }
    }

}

export default new api(baseURL);