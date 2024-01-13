
export const deleteUser = async (email) => {

    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });
    const data = await res.json();
    return data;

};

export const updateUser = async (email, updates, type) => {

    let endpoint;
    switch(type) {
        case('add-review'):
            endpoint = 'user/add-review';
            break;
        case('delete-review'):
            endpoint = 'user/delete-review';
            break;
        default:
            endpoint = 'user/update';
            break;
    }
    const body = {
        email,
        updates
    };
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    return data;

};