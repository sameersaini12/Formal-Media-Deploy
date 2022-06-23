import "./Profile.css"
import React, { useState, useEffect } from "react";
import Post from "./Post";
import FlipMove from "react-flip-move";
import { FormalMediaContractAddress } from './config.js';
import {ethers} from 'ethers';
import FormalMedia from './utils/formalMediaAbi.json'
import ProfileBox from "./ProfileBox";

const Profile = ({currentAccount}) => {

    const [posts, setPosts] = useState([]);

  const getUpdatedTweets = (allTweets, address) => {
    let updatedTweets = [];
    // Here we set a personal flag around the tweets
    for(let i=0; i<allTweets.length; i++) {
      if(allTweets[i].username.toLowerCase() === address.toLowerCase()) {
        let tweet = {
          'id': allTweets[i].id,
          'tweetText': allTweets[i].tweetText,
          'isDeleted': allTweets[i].isDeleted,
          'username': allTweets[i].username,
          'personal': true,
          'ddata' : allTweets[i].ddata
        };
        updatedTweets.push(tweet);
      } 
    }
    return updatedTweets;
  }

  const getAllTweets = async() => {
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FormalMediaContract = new ethers.Contract(
          FormalMediaContractAddress,
          FormalMedia.abi,
          signer
        )

        let allTweets = await FormalMediaContract.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTweets();
  },[]);

  const deleteTweet = key => async() => {
    // console.log(key);

    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FormalMediaContract = new ethers.Contract(
          FormalMediaContractAddress,
          FormalMedia.abi,
          signer
        );

        // let deleteTweetTx = await FormalMediaContract.deleteTweet(key, true);
        let allTweets = await FormalMediaContract.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }

    } catch(error) {
      console.log(error);
    }
  }

    return (
        <div className="profile">
        <div className="profile__header">
          <h2>Profile</h2>
        </div>

        <ProfileBox currentAccount={currentAccount} />
  
        <FlipMove>
          {posts.map((post) => (
            <Post
              key={post.id}
              displayName={post.username}
              text={post.tweetText}
              personal={post.personal}
              onClick={deleteTweet(post.id)}
              postImgSrc = {post.ddata}
            />
          ))}
        </FlipMove>
      </div>
    )

}

export default Profile