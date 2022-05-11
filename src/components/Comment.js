import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import closeicon from "../assets/closeicon.png";
import useDeleteComment from "../hooks/useDeleteComment";
import toast from "react-hot-toast";
import {
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    collection,
} from "firebase/firestore";
import { db } from "../firebase";
import hasliked from "../assets/hasliked.png";
import liked from "../assets/liked.png";
import hasdisliked from "../assets/hasdisliked.png";
import disliked from "../assets/disliked.png";

const Comment = ({ comment }) => {
    const [confirmModal, setConfirmModal] = useState(false);
    const { currentUser } = useAuthContext();
    const deleteComment = useDeleteComment(comment?.docId);

    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);

    // Find likes and dislikes

    useEffect(
        () =>
            onSnapshot(
                collection(db, "drinks", comment?.docId, "dislikes"),
                (snapshot) => setDislikes(snapshot.docs)
            ),
        [comment.docId]
    );

    useEffect(
        () =>
            onSnapshot(
                collection(db, "drinks", comment?.docId, "likes"),
                (snapshot) => setLikes(snapshot.docs)
            ),
        [comment.docId]
    );

    useEffect(() => {
        setHasLiked(
            likes.findIndex((like) => like.id === currentUser?.uid) !== -1
        );
    }, [likes, currentUser?.uid]);

    const likeImage = async () => {
        if (hasLiked) {
            await deleteDoc(
                doc(db, "drinks", comment?.docId, "likes", currentUser.uid)
            );
        } else {
            if (hasDisliked)
                deleteDoc(
                    doc(
                        db,
                        "drinks",
                        comment?.docId,
                        "dislikes",
                        currentUser.uid
                    )
                );

                
            await setDoc(
                doc(db, "drinks", comment?.docId, "likes", currentUser.uid),
                {
                    username: currentUser.displayName,
                }
            );
        }
    };

    useEffect(() => {
        setHasDisliked(
            dislikes.findIndex((dislike) => dislike.id === currentUser?.uid) !==
                -1
        );
    }, [dislikes, currentUser?.uid]);

    const dislikeImage = async () => {
        if (hasDisliked) {
            await deleteDoc(
                doc(db, "drinks", comment?.docId, "dislikes", currentUser.uid)
            );
        } else {
            if (hasLiked)
                await deleteDoc(
                    doc(db, "drinks", comment?.docId, "likes", currentUser.uid)
                );
            await setDoc(
                doc(db, "drinks", comment?.docId, "dislikes", currentUser.uid),
                {
                    username: currentUser.displayName,
                }
            );
        }
    };

    const deleteCommentFunction = async () => {
        await deleteComment.mutate().then(
            toast.success("Kommentaren är borttagen", {
                duration: 3000,
            }),
            setConfirmModal(false)
        );
    };

    return (
        <div className="comment">
            <div className="commentTop">
                {" "}
                <h4>
                    {" "}
                    <span> {comment?.created_by}</span>{" "}
                    <span className="gray">{comment?.created_at}</span>{" "}
                    {comment?.creator_uid === currentUser?.uid && (
                        <span
                            className="deleteText"
                            onClick={() => setConfirmModal(true)}
                        >
                            Ta bort
                        </span>
                    )}
                </h4>{" "}
            </div>
            <div className="commentMain">
                {" "}
                <p> {comment.comment} </p>{" "}
                <div className="cardRatings">
                    <>
                        <div>
                            {hasLiked ? (
                                <>
                                    <img
                                        src={hasliked}
                                        width="16px"
                                        height="16px"
                                        onClick={
                                            currentUser
                                                ? likeImage
                                                : () =>
                                                      toast.error(
                                                          "Du måste vara inloggad för att lika en kommentar"
                                                      )
                                        }
                                        alt="has liked"
                                    />
                                </>
                            ) : (
                                <>
                                    <img
                                        src={liked}
                                        width="16px"
                                        height="16px"
                                        onClick={
                                            currentUser
                                                ? likeImage
                                                : () =>
                                                      toast.error(
                                                          "Du måste vara inloggad för att lika en kommentar"
                                                      )
                                        }
                                        alt="like button"
                                    />
                                </>
                            )}
                            {likes?.length > 0 ? (
                                <span> {likes.length} </span>
                            ) : (
                                <span> 0 </span>
                            )}
                        </div>

                        <div className="cardDislike">
                            {hasDisliked ? (
                                <>
                                    <img
                                        src={hasdisliked}
                                        width="16px"
                                        height="16px"
                                        alt="has disliked"
                                        onClick={
                                            currentUser
                                                ? dislikeImage
                                                : () =>
                                                      toast.error(
                                                          "Du måste vara inloggad för att dislika en kommentar"
                                                      )
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <img
                                        src={disliked}
                                        width="16px"
                                        height="16px"
                                        alt="dislike button"
                                        onClick={
                                            currentUser
                                                ? dislikeImage
                                                : () =>
                                                      toast.error(
                                                          "Du måste vara inloggad för att dislika en kommentar"
                                                      )
                                        }
                                    />
                                </>
                            )}
                            {dislikes?.length > 0 ? (
                                <span> {dislikes.length} </span>
                            ) : (
                                <span> 0 </span>
                            )}
                        </div>
                    </>
                </div>
            </div>
            {confirmModal && (
                <div className="confirmModal">
                    <img
                        src={closeicon}
                        onClick={() => setConfirmModal(false)}
                        className="closeIcon"
                        width="20"
                        height="20"
                        alt="Logo"
                    />
                    <div className="modalWrapper">
                        <p className="modalText">
                            Är du säker på att du vill permanent ta bort den här
                            kommentaren?
                        </p>
                        <div className="modalButtons">
                            <div
                                className="deleteButton"
                                onClick={deleteCommentFunction}
                            >
                                {" "}
                                Ta bort{" "}
                            </div>
                            <div
                                className="closeButton"
                                onClick={() => setConfirmModal(false)}
                            >
                                {" "}
                                Avbryt{" "}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comment;
