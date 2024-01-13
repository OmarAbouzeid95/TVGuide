
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