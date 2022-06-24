import React , {useState , useEffect} from "react";
import "./Sidebar.css";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
// import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
// import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { generateRandomAvatarOptions } from './avatar';
import Avatar from 'avataaars';
import { FormalMediaContractAddress } from './config.js';
import {ethers} from 'ethers';
import FormalMedia from './utils/formalMediaAbi.json'

function Sidebar({currentAccount}) {

  const [avatarOptions, setAvatarOptions] = useState("");
  const [name , setName ] = useState(currentAccount)

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

  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
    getName();
  }, []);

  return (
    <div className="sidebar" style={{display : "flex" , flexDirection : "column"  , justifyContent : "space-between"}}>
      <div>
        <TwitterIcon className="sidebar__twitterIcon" />
        <Link to="/" style={{textDecoration : "none" , color : "black"}}> <SidebarOption Icon={HomeIcon} text="Home" /> </Link>
        <Link to="explore" style={{textDecoration : "none" , color : "black"}}><SidebarOption Icon={SearchIcon} text="Explore" /></Link>
        <Link to="notification" style={{textDecoration : "none" , color : "black"}}><SidebarOption Icon={NotificationsNoneIcon} text="Notifications" /></Link>
        <Link to="message" style={{textDecoration : "none" , color : "black"}}><SidebarOption Icon={MailOutlineIcon} text="Messages" /></Link>
        <Link to="bookmarks" style={{textDecoration : "none" , color : "black"}}><SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" /></Link>
        <Link to="profile" style={{textDecoration : "none" , color : "black"}}><SidebarOption Icon={PermIdentityIcon} text="Profile"/></Link>
        <Link to="/" style={{textDecoration : "none" , color : "black"}}><Button variant="outlined" className="sidebar__tweet" fullWidth>
          Tweet
        </Button></Link>
      </div>
      <div style={{display : "flex" , flexDirection : "row" , marginLeft: "10px"}}>
        <div>
        <Avatar
            style={{ height: "50px" , width: "50px" }}
            avatarStyle='Circle'
            {...avatarOptions }
        />
        </div>
        <div style={{marginLeft : "17px"}}>
          <div style={{fontWeight: "700"}}>
            {name===currentAccount ? 
            `${currentAccount.substring(0,7)}...${currentAccount.substring(currentAccount.length-7,currentAccount.length)}`
            : name}
          </div>
          <div>@{currentAccount.substring(0,7)}...{currentAccount.substring(currentAccount.length-7,currentAccount.length)}</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;