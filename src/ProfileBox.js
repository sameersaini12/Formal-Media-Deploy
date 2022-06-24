import "./ProfileBox.css";
import { generateRandomAvatarOptions } from './avatar';
import Avatar from 'avataaars';
import React, { useState , useEffect } from "react";
import coverProfilePhoto from "./coverPhoto.jpg"
import { Button } from "@material-ui/core";
import Popup from "./Pop";
import { FormalMediaContractAddress } from './config.js';
import {ethers} from 'ethers';
import FormalMedia from './utils/formalMediaAbi.json'




const ProfileBox = ({currentAccount}) => {

    const [avatarOptions, setAvatarOptions] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [updateName , setUpdateName ] = useState("");
    const [name , setName ] = useState(currentAccount)

    const updateProfile = async () => {
        let name = updateName; 
    
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
    
            let formalMediaTx = await FormalMediaContract.setUpProfile(currentAccount , name);
    
            console.log(formalMediaTx);
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch(error) {
          console.log("Error submitting new Tweet", error);
        }
      }

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateProfile();
        setUpdateName("");
    }; 

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
    
            let updatedName = await FormalMediaContract.getProfile(currentAccount);
            setName(updatedName);
          } else {
            console.log("Ethereum object doesn't exist");
          }
        } catch(error) {
          console.log(error);
        }
      }

    const togglePopup = () => {
        setIsOpen(!isOpen);
      }



    useEffect(() => {
        let avatar = generateRandomAvatarOptions();
        setAvatarOptions(avatar);
        getName();
      }, []);


    return (
        <div className="profileBox">
            <div style={{backgroundColor : "lightgray" , width: "100%" , height : "200px" }}>
                <img src={coverProfilePhoto} alt="coverPhoto"  style={{ width: "100%" , height : "200px"}} />
            </div>
            <Avatar
            style={{ height: "150px" , width: "150px" , marginTop: "-80px" , marginLeft: "3%" }}
            avatarStyle='Circle'
            {...avatarOptions }
            />
            <Button
            type="submit"
            className="profileBox__tweetButton"
            style={{marginTop : "-90px" , padding : "8px 14px 8px 14px"}}
            onClick={togglePopup}
                >
            SetUp Profile
            </Button>

            {isOpen && <Popup
            content={<>
                <div style={{ height : "60vh", display : "flex" , flexDirection : "column" , justifyContent : "space-between" , padding : "5% 15% 5% 15%" , lineHeight : "30px"}}>
                    <div>
                        <div style={{fontSize: "35px" , fontWeight : "600"}}>Change your Name</div>
                        <div style={{color : "gray" }}>What name you want to be your identity</div>
                        <input 
                        type="text"
                         placeholder="Your name" 
                         style={{width: "90%" , height : "40px" , border: "2px solid #50b7f5" , outline : "none",borderRadius : "8px" , paddingLeft : "10px"}} 
                         onChange={(e) => setUpdateName(e.target.value)}
                         value={updateName}
                         />
                        <br />
                        <br />
                        <div style={{fontSize: "35px" , fontWeight : "600"}}>Add Bio</div>
                        <div style={{color : "gray"}} >What makes you special? Don't think too hard, just have fun with it.</div>
                        <textarea style={{width: "90%" , height : "40px" , border: "2px solid #50b7f5" , outline : "none",borderRadius : "8px" , padding : "10px"}}></textarea>
                    </div>
                    <div>
                    <Button
                        type="submit"
                        style={{marginTop : "-90px" , width: "95%"  , backgroundColor : " #50b7f5" , border : "none" , color : "white" ,fontWeight : "700 " , borderRadius : "30px"}}
                        onClick={handleUpdateProfile}
                            >
                        SetUp Profile
                     </Button>
                    </div>
                </div>
            </>}
            handleClose={togglePopup}
            />}

           <div style={{marginLeft : "3%"}}>
            <div style={{fontWeight: "800" , fontSize : "19px"}}>
                {(name==="") ?
                currentAccount :
                name }
            </div>
            <div style={{fontWeigth : "400" , color : "gray"}}>
                @{currentAccount}
            </div>
           </div>
            <div ></div>
        </div>
    )
}

export default ProfileBox;