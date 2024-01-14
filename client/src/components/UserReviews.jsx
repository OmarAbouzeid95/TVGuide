import { useContext } from "react";
import { userContext } from "../contexts/contexts";
import { Link } from "react-router-dom";
import { posterPath } from "../info";
import defaultPoster from "../media/defaultPoster.png";


import { deleteReview } from "../functions/dbFunctions";
import { updateUser } from "../functions/userFunctions";
import { toast } from "react-toastify";

const UserReviews = () => {

    const { userData, setUserData } = useContext(userContext);

    async function removeReview(id, email, review) {
        const updatedReviews = await deleteReview(id, email, review);
        if(updatedReviews.error) {
            toast.error('Something went wrong', {
                autoClose: 3000,
                theme: 'dark'
            });
        }
    };

    async function removeUserReview(id, title, comment) {

        const res = await updateUser(userData.email, {id, title, comment}, 'delete-review');
        if(res.err) {
            toast.error('Something went wrong', {
                autoClose: 3000,
                theme: 'dark'
            });
        } else {
            const updatedUser = res;
            setUserData(updatedUser);
            sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        }  

    };
    
    return (
        <div className="reviews-outlet">
            <div className="reviews-outlet-content">
            {
                userData?.reviews?.length === 0 ? 
                (
                    <div style={{textAlign:'center'}}>
                        <h2>You don't have any reviews yet.</h2>
                        <h3>Head to <Link style={{color:'white'}} to={'/'}>Explore</Link></h3>
                    </div>
                ) :
                (
                    <div>
                        {userData?.reviews?.map((review, index) => {
                            const poster = !review.poster_path ? defaultPoster : posterPath + review.poster_path;
                            return (
                                <div className="user-review-container" key={index}>
                                    <img className="movie-poster-dt" src={poster} alt="movie poster"></img>
                                    <div className="user-review-info">
                                        <h3>{review.title}</h3>
                                        <h4>Your comment</h4>
                                        <p>{review.comment}</p>
                                        <button onClick={() => {
                                            removeReview(review.id, userData.email, review.comment);
                                            removeUserReview(review.id, review.title, review.comment);
                                        }}>Remove</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )    
            }
            </div>
        </div>
    );
}

export default UserReviews;