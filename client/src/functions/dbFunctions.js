
export const fetchRatingAndComments = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/movies/${id}`);
    const {reviews, rating, ratingCount, ratingTotal} = await res.json();
    return {reviews, rating, ratingCount, ratingTotal};
};

export const addReview = async (details) => {

    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    const data = await res.json();
    return data;

};

export const deleteReview = async (id, email, comment) => {

    const details = {
        id,
        email,
        comment
    };
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/movies`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    const updatedMovie = await res.json();
    return updatedMovie.reviews;

};

export const updateReviews = async (id, updatedDetails) => {
    
    const details = {
        id, 
        updates: updatedDetails
    };
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/movies/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    const updatedMovie = await res.json();
    return updatedMovie;
};


export const updateWatchList = async (email, id, action) => {

    const endpoint = action === 'remove' ? 'user/remove-from-watchlist' : 'user/add-to-watchlist'
    const body = {
        email, id
    };
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const { watchList } = await res.json();
    return watchList;

};