
export const fetchRatingAndComments = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/movies/${id}`);
    const data = await res.json();
    return { 
        reviews: data?.reviews,
        dbRating: data?.rating,
        dbRatingCount: data?.ratingCount,
        dbRatingTotal: data?.ratingTotal
    };
};