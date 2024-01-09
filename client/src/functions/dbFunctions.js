
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
    console.log('updatedMovie: ', updatedMovie);
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
    console.log('updatedMovie: ', updatedMovie);
    return updatedMovie;
};