import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';

// INTERNAL IMPORT 
import tracking from "../context/Tracking.json";
const ContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ContractABI = tracking.abi;

const fetchContract = 
    (signerOrProvider) => new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
    const DappName = "Product Tracking Dapp";
    const [currentUser, setCurrentUser] = useState("");

    const createShipment = async (items) => {
        console.log(items);
        const { receiver, pickupTime, distance, price } = items;

        try {
            const web3Modal = new Web3Modal();
            const connections = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connections);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const createItem = await contract.createShipment(
                receiver,
                new Date(pickupTime).getTime(),
                distance,
                ethers.utils.parseUnits(price, 18),
                {
                    value: ethers.utils.parseUnits(price, 18),
                }
            );
            await createItem.wait();
            console.log(createItem);
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    const getAllShipment = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);

            const shipments = await contract.getAllTransactions();
            const allShipments = shipments.map((shipment) => ({
                sender: shipment.sender,
                receiver: shipment.receiver,
                price: ethers.utils.formatEther(shipment.price.toString()),
                pickupTime: shipment.pickupTime.toNumber(),
                deliveryTime: shipment.deliveryTime.toNumber(),
                distance: shipment.distance.toNumber(),
                isPaid: shipment.isPaid,
                status: shipment.status
            }));

            return allShipments;
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    const getShipmentCount = async () => {
        try {
            if(!window.ethereum) return "Install metamask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipmentCount = await ConstructorFragment.getShipmentCount(accounts[0]);
            return shipmentCount.toNumber();
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    const completeShipment = async (completeShip) => {
        console.log(completeShip);

        const { receiver, index } = completeShip;
        try {
            if(!window.ethereum) return "Install metamask";
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const web3Modal = new Web3Modal();
            const connections = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connections);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.completeShipment(
                accounts[0],
                receiver,
                index,
                {
                    gasLimit: 300000,
                }
            );

            transaction.wait();
            console.log(transaction);
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    const getShipment = async (index) => {
        console.log(index);
        try {
            if(!window.ethereum) return "Install metamask";
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipment = await ConstructorFragment.getShipment(accounts[0], index);
            
            const SingleShipment = {
                sender: shipment[0],
                receiver: shipment[1],
                pickupTime: shipment[2],
                deliveryTime: shipment[3],
                distance: shipment[4],
                price: ethers.utils.formatEther(shipment[5].toString()),
                status: shipment[6],
                isPaid: shipment[7],
            };

            return SingleShipment;
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    const startShipment = async (getProduct) => {
        const { receiver, index } = getProduct;

        try {
            if(!window.ethereum) return "Install metamask";
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const web3Modal = new Web3Modal();
            const connections = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connections);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const shipment = await contract.startShipment(
                accounts[0],
                receiver,
                index * 1
            );

            shipment.wait();

            console.log(shipment);
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    const checkIfWalletConnected = async () => {
        try {
            if(!window.ethereum) return "Install metamask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length) {
                setCurrentUser(accounts[0]);
            } else {
                return "No Account";
            }
        } catch (error) {
            console.log("Not Connected");
        }
    };

    const connectWallet = async () => {
        try {
            if(!window.ethereum) return "Install metamask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            setCurrentUser(accounts[0]);
        } catch (error) {
            console.log("Some want wrong", error);
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    return (
        <TrackingContext.Provider
            value={{
                connectWallet,
                createShipment,
                getAllShipment,
                completeShipment,
                getShipment,
                startShipment,
                getShipmentCount,
                DappName,
                currentUser,
            }}
        >
            {children}
        </TrackingContext.Provider>
    );
}