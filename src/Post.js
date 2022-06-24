import React, { forwardRef , useState, useEffect } from "react";
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import DeleteIcon from '@material-ui/icons/Delete';
import { FormalMediaContractAddress } from './config.js';
import {ethers} from 'ethers';
import FormalMedia from './utils/formalMediaAbi.json'

const Post = forwardRef(
  ({ displayName, text, personal, onClick , postImgSrc}, ref) => {

    const [name ,setName ] = useState(displayName)

    const getName = async() => {
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
  
          let updatedName = await FormalMediaContract.getProfile(displayName);
          setName(updatedName);
        } else {
          console.log("Ethereum object doesn't exist");
        }
      } catch(error) {
        console.log(error);
      }
    }

    useEffect(() => {
      getName();
    }, []);

    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar
            style={{ width: '60px', height: '60px' }}
            avatarStyle='Circle'
            {...generateRandomAvatarOptions() }
          />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <div style={{fontWeight : "800" , fontSize : "18px" , marginTop : "20px"}}>
                {name}
              </div>
              <div style={{fontSize : "15px" , color : "gray"}}>
                @{displayName}{" "}
              </div>
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
            <img src={postImgSrc} alt="postImage" style={{height : "auto" , width: "500px" }} />
          </div>
          <div className="post__footer">
            <ChatBubbleOutlineIcon fontSize="small" />
            <RepeatIcon fontSize="small" />
            <FavoriteBorderIcon fontSize="small" />
            {personal ? (
              <DeleteIcon style={{cursor : "pointer"}} fontSize="small" onClick={onClick}/>
            ) : ("")}
          </div>
        </div>
      </div>
    );
  }
);

export default Post;