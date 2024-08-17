import React, { useState, useEffect, useContext } from 'react';

import {
    Table,
    Form,
    Services,
    Profile,
    CompleteShipment,
    GetShipment,
    StarShipment,
} from "../Components/index";
import { TrackingContext } from "../context/TrackingContext";

const index = () => {
    const {
        currentUser,
        createShipment,
        getAllShipment,
        CompleteShipment,
        GetShipment,
        StartShipment,
        getShipmentsCount,
    } = useContext(TrackingContext);

    const [createShipmentModel, setCreateShipmentModel] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [startModal, setStartModal] = useState(false);
    const [completeModal, setCompleteModal] = useState(false);
    const [getModel, setGetModel] = useState(false);
    const [allShipmentsdata, setallShipmentsdata] = useState();

    useEffect(() => {
        const getCampaignsData = getAllShipment();
        return async() => {
            const allData = await getCampaignsData;
            setallShipmentsdata(allData)
        };
    }, []);

    return (
        <>
            <Services
                setOpenProfile={setOpenProfile} 
                setCompleteModal={setCompleteModal}
                setGetModel={setGetModel}
                setStartModal={setStartModal}
            />
            <Table
                setCreateShipmentModel={setCreateShipmentModel}
                getAllShipmentsdata={allShipmentsdata}
            />
            <Form
                createShipmentModel={createShipmentModel}
                createShipment={createShipment}
                setCreateShipmentModel={setCreateShipmentModel}
            />
            <Profile
                openProfile={openProfile}
                setOpenProfile={setOpenProfile}
                currentUser={currentUser}
                getShipmentsCount={getShipmentsCount}
            />
            <CompleteShipment
                completeModal={completeModal}
                setCompleteModal={setCompleteModal}
                CompleteShipment={CompleteShipment}
            />
            <GetShipment
                getModel={getModel}
                setGetModel={setGetModel}
                GetShipment={GetShipment}
            />
            <StarShipment
                startModal={startModal}
                setStartModal={setStartModal}
                StarShipment={StartShipment}
            />
        </>
    );
};

export default index;