// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { faUser, faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import styles from "@styles/nav.module.scss";
// import { Web3Provider } from "@metamask/providers";
// import { ethers } from "ethers";

// function Navbar() {
//   const [connected, toggleConnect] = useState(false);
//   const [currAddress, updateAddress] = useState("0xaa36a7");

//   async function getAddress() {
//     //const ethers = require("ethers");
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const addr = await signer.getAddress();
//     console.log(addr);
//     updateAddress(addr);
//   }

//   function updateButton() {
//     console.log(styles.enableEthereumButton);
//     const ethereumButton = document.querySelector(
//       `.${styles.enableEthereumButton}`
//     );
//     console.log(ethereumButton);
//     ethereumButton.textContent = "Connected";
//     ethereumButton.classList.remove("hover:bg-blue-70");
//     ethereumButton.classList.remove("bg-blue-500");
//     ethereumButton.classList.add("hover:bg-green-70");
//     ethereumButton.classList.add("bg-green-500");
//   }

//   async function connectWebsite() {
//     const chainId = await window.ethereum.request({ method: "eth_chainId" });
//     if (chainId !== "0x33") {
//       //alert('Incorrect network! Switch your metamask network to Rinkeby');
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: "0x33" }],
//       });
//     }
//     await window.ethereum
//       .request({ method: "eth_requestAccounts" })
//       .then(() => {
//         updateButton();
//         getAddress();
//         YourComponent();
//         toggleConnect(true);
//         window.location.replace(location.pathname);
//       });
//   }

//   async function YourComponent() {
//     const connectToMetaMask = async () => {
//       try {
//         // Request MetaMask to connect
//         const provider = new Web3Provider(window.ethereum);
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         console.log("Connected to MetaMask");

//         // Access connected account's address
//         const accounts = await provider.send("eth_accounts", []);
//         console.log("Connected account address:", accounts[0]);

//         // Now you can use ethers.js for Ethereum interactions using the provider
//         // For example, to get the balance of the connected account
//         const balance = await provider.getBalance(accounts[0]);
//         console.log("Balance:", ethers.utils.formatEther(balance));
//       } catch (error) {
//         console.error("Error connecting to MetaMask:", error);
//       }
//     };
//   }

//   useEffect(() => {
//     //changed !!!
//     if (window.ethereum == undefined) return;
//     let val = window.ethereum.isConnected();
//     if (val) {
//       getAddress();
//       toggleConnect(val);
//       updateButton();
//     }

//     window.ethereum.on("accountsChanged", function (accounts) {
//       //  window.location.replace(location.pathname)
//     });
//   });
//   return (
//     <>
//       <div id={styles.nav}>
//         <nav>
//           <ul>
//             <li>
//               <a href="/" className="title">
//                 Certificate Validator
//               </a>
//             </li>
//             <li className="link">
//               <Link to="/">
//                 <FontAwesomeIcon
//                   icon={faUsersBetweenLines}
//                   style={{ color: "#ebecf0" }}
//                 />
//                 Organisation
//               </Link>
//             </li>
//             <li className="link">
//               <FontAwesomeIcon icon={faUser} style={{ color: "#ebecf0" }} />
//               <Link to="/user">User</Link>
//             </li>
//             <li>
//               <button
//                 className={styles.enableEthereumButton}
//                 onClick={connectWebsite}
//               >
//                 {connected ? "Connected" : "Connect Wallet"}
//               </button>
//             </li>
//           </ul>

//           <button
//             className={styles.enableEthereumButton}
//             onClick={connectWebsite}
//           >
//             {connected ? "Connected" : "Connect Wallet"}{" "}
//           </button>
//           <button onClick={connectToMetaMask}>Connect To Metamask</button>
//           <p>
//             {currAddress !== "0xaa36a7"
//               ? "Connected to"
//               : "Not Connected. Please login"}{" "}
//             {currAddress !== "0xaa36a7"
//               ? currAddress.substring(0, 15) + "..."
//               : ""}
//           </p>
//         </nav>
//       </div>
//     </>
//   );
// }

// export default Navbar;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faUser, faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@styles/nav.module.scss";
import { Web3Provider } from "@metamask/providers";
import { ethers } from "ethers";

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const [currAddress, updateAddress] = useState("0xaa36a7");

  async function getAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    console.log(addr);
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(
      `.${styles.enableEthereumButton}`
    );
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x33") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x33" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        getAddress();
        toggleConnect(true);
        window.location.replace(location.pathname);
      });
  }

  async function connectToMetaMask() {
    try {
      const provider = new Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected to MetaMask");
      const accounts = await provider.send("eth_accounts", []);
      console.log("Connected account address:", accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      console.log("Balance:", ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }

  useEffect(() => {
    if (window.ethereum == undefined) return;
    let val = window.ethereum.isConnected();
    if (val) {
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      //  window.location.replace(location.pathname)
    });
  });

  return (
    <>
      <div id={styles.nav}>
        <nav>
          <ul>
            <li>
              <a href="/" className="title">
                Certificate Validator
              </a>
            </li>
            <li className="link">
              <Link to="/">
                <FontAwesomeIcon
                  icon={faUsersBetweenLines}
                  style={{ color: "#ebecf0" }}
                />
                Organisation
              </Link>
            </li>
            <li className="link">
              <FontAwesomeIcon icon={faUser} style={{ color: "#ebecf0" }} />
              <Link to="/user">User</Link>
            </li>
            <li>
              <button
                className={styles.enableEthereumButton}
                onClick={connectWebsite}
              >
                {connected ? "Connected" : "Connect Wallet"}
              </button>
            </li>
          </ul>

          <button
            className={styles.enableEthereumButton}
            onClick={connectWebsite}
          >
            {connected ? "Connected" : "Connect Wallet"}{" "}
          </button>
          <button onClick={connectToMetaMask}>Connect To Metamask</button>
          <p>
            {currAddress !== "0xaa36a7"
              ? "Connected to"
              : "Not Connected. Please login"}{" "}
            {currAddress !== "0xaa36a7"
              ? currAddress.substring(0, 15) + "..."
              : ""}
          </p>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
