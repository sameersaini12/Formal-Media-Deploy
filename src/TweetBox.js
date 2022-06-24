import React, { useState , useEffect } from "react";
import "./TweetBox.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import { Button } from "@material-ui/core";
import { FormalMediaContractAddress } from './config.js';
import {ethers} from 'ethers';
import FormalMedia from './utils/formalMediaAbi.json'
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { create } from 'ipfs-http-client'
// import EmojiPicker from "emoji-picker-react";


const client = create('https://ipfs.infura.io:5001/api/v0')

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [avatarOptions, setAvatarOptions] = useState("");
  const hiddenUploadImage = React.useRef(null);

  const addTweet = async () => {
    let tweet = {
      'tweetText': tweetMessage,
      'isDeleted': false,
      'ddata' : tweetImage
    };

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

        let formalMediaTx = await FormalMediaContract.addTweet(tweet.tweetText, tweet.isDeleted , tweet.ddata);

        console.log(formalMediaTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log("Error submitting new Tweet", error);
    }
  }

  const sendTweet = (e) => {
    e.preventDefault();

    addTweet();

    setTweetMessage("");
    setTweetImage("");
  };

  const postImageChange = async(e)=> {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setTweetImage(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  const handleUploadImage = (e) => {
    e.preventDefault();
    hiddenUploadImage.current.click();
  }

  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar
            style={{ width: '70px', height: '70px' }}
            avatarStyle='Circle'
            {...avatarOptions }
          />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
          />
        </div>
        <hr style={{ width : "100%" , height: "1px" , backgroundColor : "#e6ecf0" , border: "none"}} />
        <div style={{marginLeft : "5%"}}>
          <button onClick={handleUploadImage} style={{background : "transparent" , border : "none" , cursor: "pointer"}}><InsertPhotoOutlinedIcon fontSize="large" style={{}} /></button>
          <input type="file" ref={hiddenUploadImage} onChange={postImageChange} style={{display : "none"}} />
          <button onClick={handleUploadImage} style={{background : "transparent" , border : "none" , cursor: "pointer"}}><GifBoxOutlinedIcon fontSize="large" /></button>
          <SentimentSatisfiedAltIcon fontSize="large" />
        </div>

        {tweetImage && (
          <img src={tweetImage} alt="uploadedTweetImage" style={{width : "500px" , marginLeft : "5%" , height: "auto"}} />
        )}

        <Button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
      </form>
    </div>
  );
}

export default TweetBox;