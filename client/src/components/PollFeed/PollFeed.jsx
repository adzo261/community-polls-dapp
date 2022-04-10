import React, { Fragment, useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PollIcon from '@mui/icons-material/Poll';
import "./PollFeed.css";
import ChainAccess from "../../api/chain-access";
import Poll from "./Poll/Poll"

const PollFeed = () => {
    const [polls, setPolls] = useState();
    
    useEffect(async () => {
        let pollResp = await ChainAccess.getAllPolls();
        setPolls(pollResp);
    },
    []);

    //Listen to PollCreated event
    ChainAccess.contract.events.PollCreated(async (error, event) => {
        if (error) {
            console.log(error);
        } else {
            console.log(event);
            let pollResp = await ChainAccess.getAllPolls();
            setPolls(pollResp);
        }
    });

    //Listen to PollVoted event
    ChainAccess.contract.events.PollVoted(async (error, event) => {
        if (error) {
            console.log(error);
        } else {
            console.log(event);
            let pollResp = await ChainAccess.getAllPolls();
            setPolls(pollResp);
        }
    });

    return (
        <Fragment>
            {   polls &&
                polls.map(poll => <Poll key={poll.id} poll={poll} />) 
            }
            {
                !polls &&
                <h2>Loading...</h2>
            }
        </Fragment>
    );
}

export default PollFeed;