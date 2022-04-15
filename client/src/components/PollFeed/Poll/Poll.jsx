import React, { Fragment, useState } from "react";
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PollIcon from '@mui/icons-material/Poll';
import "./Poll.css";
import ChainAccess from "../../../api/chain-access";
import Countdown from 'react-countdown';
import { withTheme } from "@emotion/react";
import { fontWeight } from "@mui/system";


const Poll = ({poll}) => {

    const [pollExired, setPollExpired] = useState(poll.endTime <= Math.floor(Date.now()/1000));
    const getOptionStyles = (percentage, voted = false) => {
        const color = voted ? "green" : "black";
        return {
            background: `linear-gradient(to right, ${color} 0% ${percentage}%, white ${percentage}% 100%) `,
            height: "15px",
            lineHeight: "30px",
            padding: "0.2rem",
            color: "white",
            cursor: "pointer",
        }
    }

    const optionDivStyles = {
        textAlign: "left",
        marginBottom: "10px",
        color: "black",
        fontWeight: "500",
    }

    const vote = async (pollId, optionIndex) => {
        await ChainAccess.vote(pollId, optionIndex);
    }

    return (
        <Fragment>
             <Container maxWidth="sm" sx={{marginTop: "1.5rem"}}>
                <Paper variant="elevation" 
                    sx={{
                        padding: "2rem",
                        background: "no-repeat center linear-gradient(to right top, #e0f4c3, #aeedc8, #77e3db, #4bd5f1, #58c1ff, #68beff, #77bcff, #85b9ff, #7bcbff, #85dbfa, #9de9f4, #bbf4f0)"
                    }}
                    fullWidth
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <div style={{fontWeight: "500", color: "black"}}>
                                Which is the most popular programming language of 2022?
                            </div> 
                        </Grid>
                        {
                            poll.options.map((option, index) => {
                                return (
                                    <Grid item xs={12} key={index}>
                                        <div style={optionDivStyles}>{option.option}</div>
                                        <Paper variant="elevation" 
                                            sx={getOptionStyles(option.percentage)}
                                            onClick={() => vote(poll.id, index)}
                                        /> 
                                    </Grid>
                                )
                            })
                        }
                        <Grid item xs={12}>
                            <div style={{fontWeight: "400", color: "black"}}>
                                Poll created by {poll.address}
                            </div> 
                        </Grid>
                        {   !pollExired &&
                            <Grid item xs={12}>
                                <div style={{fontWeight: "400", color: "black"}}>
                                    Poll ends in <Countdown 
                                        date={new Date(poll.endTime * 1000)} 
                                        onComplete={() => {setPollExpired(true)}}
                                    />
                                </div> 
                            </Grid>
                        }
                    </Grid>
                </Paper>
                </Container>
          
        </Fragment>
    );
}

export default Poll;