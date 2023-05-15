import React, { useEffect, useState, useContext } from "react";

// retrieve user with context
import { UserContext } from "../App";

function Post({ singlePost }) {
  const [likeCount, setLikeCount] = useState(singlePost.likes.length);
  const [userLiked, setUserLiked] = useState(false);
  const { state, dispatch } = useContext(UserContext);

  const likePost = async (id) => {
    try {
      // fetch call to '/like' route to like a post
      const likeData = await fetch("/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      const likeResponse = await likeData.json();

      // set like count to length of likes array & set userLiked to 'true'
      setLikeCount(likeResponse.likes.length);
      setUserLiked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const unlikePost = async (id) => {
    try {
      // fetch call to '/unlike' route to like a post
      const unlikeData = await fetch("/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      const unlikeResponse = await unlikeData.json();

      // set like count to length of likes array & set userLiked to 'false'
      setLikeCount(unlikeResponse.likes.length);
      setUserLiked(false);
    } catch (err) {
      console.error(err);
    }
  };

  // set the post to 'liked' if user already liked the post
  useEffect(() => {
    if (singlePost.likes.includes(state._id)) setUserLiked(true);
  }, []);

  // display 'singlePost' data with 'Post' component
  return (
    <div className="card home-card">
      <h5>{singlePost.postedBy.name}</h5>
      <div className="card-image">
        {/* conditional if post is an image */}
        {singlePost.type === "Image" ? (
          <img src={singlePost.asset} alt="background" />
        ) : (
          <div></div>
        )}
        {/* conditional if post is a video */}
        {singlePost.type === "Video" ? (
          <video width="500px" height="500px" controls="controls">
            {/* video */}
            <source src={singlePost.asset} type="video/mp4" />
          </video>
        ) : (
          <div></div>
        )}
        <div className="card-content">
          {/* icon from materialize */}
          <i className="material-icons" style={{ color: "red" }}>
            favorite
          </i>
          {userLiked ? (
            <i
              className="material-icons unlike"
              onClick={() => unlikePost(singlePost._id)}
            >
              thumb_down
            </i>
          ) : (
            <i
              className="material-icons like"
              onClick={() => likePost(singlePost._id)}
            >
              thumb_up
            </i>
          )}
          <h6>{likeCount} likes</h6>
          <h6>{singlePost.title}</h6>
          <p>{singlePost.body}</p>
          <input type="text" placeholder="add a comment" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // initialize 'posts data' variable
  const [postsdata, setPostsData] = useState([]);

  // retrieve 'posts' data from DB
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // check if user data is valid
        if (!("error" in result) && result.length !== 0) {
          // latest go on top
          result.posts.reverse();
        }
        setPostsData(result.posts);
      });
  }, []);

  return (
    <React.Fragment>
      <div className="home">
        {/* iterate through posts data to display */}
        {postsdata.map((singlePost) => (
          <div key={singlePost._id}>
            <Post singlePost={singlePost} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
