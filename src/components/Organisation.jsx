import { useState } from "react";
import './css/org.css';
import domtoimage from 'dom-to-image';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../ABI/abi.json';
//const ethers = require("ethers");
import {ethers} from "ethers";

const data = [
    {"image" : "https://i.imgur.com/idG3CLO.png"},
    {"image" : "https://i.imgur.com/RFeCLoi.png"},
    {"image" : "https://i.imgur.com/XmfD44T.png"},
    {"image" : "https://i.imgur.com/oTYOlAM.png"},
];

function Organisation() {
    let [name , setName] = useState();
    let [description , setDescription] = useState();
    let [date , setDate] = useState();
    let [sign , setSign] = useState(null);
    let [index , setIndex] = useState(0);
    let [receiverAddress , setReceiverAddress] = useState();
    let [img , setImage] = useState("");
    const [fileURL, setFileURL] = useState(null);
    const [message, updateMessage] = useState('');
    
    async function OnChangeFile(e)
    {
        if(!img) {console.log("image not set");return;}
        updateMessage("Uploading image Please wait");
        try{
            const response = await uploadFileToIPFS(img);
            if(response.success === true)
            {
                updateMessage("Uploaded Img Successfully");
                setFileURL(response.pinataURL);
            }
        }
        catch(err)
        {
            updateMessage("Failed to upload image please try again");
            console.log("error during file upload : " , err);
        }

    }
    async function uploadMetadataToIPFS()
    {
        if(!name || !fileURL)
        {
            updateMessage("Please try again");
            console.log("name or fileURL not set", name , fileURL);
            return;
        }

        const nftJSON = {
            name , image: fileURL
        };
        try{
            updateMessage("uploading json to IPFS")
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true)
            {
                console.log("Uploaded json to pinata" , response);
                return response.pinataURL;
            }
        }
        catch(e)
        {
            updateMessage("Error uploading JSON metadata")
            console.log("Error uploading JSON metadata" , e);
        }
    }
    async function listNFT(e)
    {
        e.preventDefault();
        try{
            const metadataURL = await uploadMetadataToIPFS();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            updateMessage("Please wait....");

            let contract = new ethers.Contract(Marketplace.address , Marketplace.abi , signer);
            
            let transection = await contract.createToken(metadataURL , receiverAddress);
            
            console.log(transection);
            await transection.wait();
            alert("Successfully sent the certificate");
            updateMessage("");
            //window.location.replace("/");
        }
        catch(e)
        {
            updateMessage("Please try again");
            console.log("upload error" , e);
        }
    }
    function dataURLtoFile(dataurl, filename) {// to convert base64 to img
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }
    async function MintSend(e){
        e.preventDefault();
        await domtoimage.toJpeg(document.getElementById("img-cer")).then(function (data){
        var file = dataURLtoFile(data, 'a.png');
        setImage(file);
        updateMessage("Information saved")
    })

    }
    function setSample(e ,index){
        //document.getElementById("highlight-selected").style.border = "2px solid black";
        setIndex(index);
    }
  return (
    <>
    <div id="org">
    {/* Certificate information edit preview section */}
    <div id="meta-data">
        {/*<h1>Certificate</h1>*/}
        <p>Enter Name</p>
        <input type="text" value={name} placeholder="Enter the name" 
        onChange={(e)=>{setName(e.target.value)}}></input>
        <br></br>
        
        <p>Enter Description</p>
        <textarea rows="3" cols="40" type="text" value={description} placeholder="Enter the Description" 
        onChange={(e)=>{setDescription(e.target.value)}}></textarea>
        <br></br>
        <p>Enter Date</p>
        <input type="text" value={date} placeholder="Enter the Date" 
        onChange={(e)=>{setDate(e.target.value)}}></input>
        <br></br>
        <label  htmlFor="image">Upload Signature (&lt;500 KB)</label>
        <br></br>
        <input type={"file"} onChange={(e)=>{setSign(URL.createObjectURL(e.target.files[0]))}}></input>
        
        <br></br>
        <button onClick={(e)=>MintSend(e)}>Save Information</button>
        <br></br>
        <button onClick={(e)=> OnChangeFile(e)}>Upload Certificate</button>
        <br></br>
        <p>Enter public address of user</p>
        <input type="text" value={receiverAddress} placeholder="Enter the address" 
        onChange={(e)=>{setReceiverAddress(e.target.value)}}></input>
        <br></br>
        <button onClick={(e)=> listNFT(e)}>Send</button>
        <br></br>
        <p>{message}</p>
    </div>
    {/* show data on selected certificate */}
    <div id="img-cer">
        <input type = "text" value={name} disabled="disabled" className="data-name"></input>
        <textarea type = "text" value={description} disabled="disabled" className="data-des"></textarea>
        <input type = "text" value={date} disabled="disabled" className="data-date"></input>
        {sign && <img id="sign" src={sign}></img>}
        <img id="cer-data" src = {data[index].image}></img>
    </div>

    </div>
    {/* Select design section */}
    <h1>Select a Design</h1>
    <div id="sample-img">
        {data.map((value , index)=>{
            {/*console.log(data[index].image);*/}
            return<img id="highlight-selected" onClick={(e) =>{setSample(e , index)}} src={value.image}></img>
        })}
    </div>
    </>
  );
}

export default Organisation;
