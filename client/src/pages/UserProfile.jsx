import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import {
  retrieveUserProfilePosts,
  followUser,
  unfollowUser,
} from "../utils/APICalls/UserProfileAPICalls";
import UserPosts from "../components/ProfilePages/UserPosts";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(false);
  // retrieve user data from context
  const { state, dispatch } = useContext(UserContext);
  // retrieve userId from URL param
  const { userId } = useParams();

  useEffect(() => {
    // retrieve profile post from any user for their user page
    retrieveUserProfilePosts(userId, setUserProfile);
  }, []);

  // see if user is already following
  useEffect(() => {
    if (userProfile && userProfile.oneUser.followers.includes(state._id)) {
      setShowFollow(true);
    }
  }, [userProfile]);

  return (
    <>
      {userProfile ? (
        <div className="max-w-5xl mx-auto my-0">
          <div className="flex justify-around mx-0 my-5 border-b-2 border-b-gray-300 p-5">
            <div>
              <img
                className="w-40 h-40 rounded-full"
                src={
                  userProfile && userProfile.oneUser.profilePicURL
                    ? userProfile.oneUser.profilePicURL
                    : "https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg"
                }
                alt=""
              />
            </div>
            <div>
              <h4>{userProfile.oneUser.name}</h4>
              <h4>{userProfile.oneUser.email}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                {userProfile.userPosts.length === 1 ? (
                  <h6>{userProfile.userPosts.length} post</h6>
                ) : (
                  <h6>{userProfile.userPosts.length} posts</h6>
                )}
                {userProfile.oneUser.followers.length === 1 ? (
                  <h6>{userProfile.oneUser.followers.length} follower</h6>
                ) : (
                  <h6>{userProfile.oneUser.followers.length} followers</h6>
                )}
                <h6>{userProfile.oneUser.following.length} following</h6>

                {/* follow/unfollow button */}
                {showFollow ? (
                  // follow button
                  <button
                    className="btn waves-effect waves-light #448aff blue darken-1"
                    type="submit"
                    name="action"
                    onClick={() =>
                      unfollowUser(
                        userId,
                        dispatch,
                        setUserProfile,
                        setShowFollow
                      )
                    }
                  >
                    {/* unfollow button */}
                    Unfollow User
                  </button>
                ) : (
                  <button
                    className="btn waves-effect waves-light #448aff blue darken-1"
                    type="submit"
                    name="action"
                    onClick={() =>
                      followUser(
                        userId,
                        dispatch,
                        setUserProfile,
                        setShowFollow
                      )
                    }
                  >
                    {/* follow button */}
                    Follow User
                  </button>
                )}
              </div>
            </div>
          </div>

          <UserPosts posts={userProfile.userPosts} />
        </div>
      ) : (
        <h2>Loading... </h2>
      )}
    </>
  );
}
