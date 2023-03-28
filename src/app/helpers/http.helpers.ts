const handleErrorResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.indexOf('application/json') !== -1) {
        const errorMessage = await readJSON(response);
        throw new Error(JSON.stringify(errorMessage));
    } else {
        const errorMessage = await readText(response);
        throw new Error(errorMessage);
    }
}

const readJSON = (response: Response) => {
    return response.json();
}

const readText = (response: Response) => {
    return response.text();
}

const handleResponse = (response: Response) => {
    if (!response.ok) {
        return handleErrorResponse(response);
}

const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
        return readJSON(response);
    } else {
        return readText(response);
    }
}

export const getRequest = <T>(url: string, user: any): Promise<T> => {
    if(null != user){
        let headers = new Headers();
        headers.append("SMUSER", user);
        var requestOptions = {
            method: 'GET',
            headers: headers
        };
        return fetch(url, requestOptions).then(handleResponse);
    } else {
        return fetch(url).then(handleResponse);
    }
}