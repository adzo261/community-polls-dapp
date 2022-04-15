import React, { Fragment, useState } from "react";
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PollIcon from '@mui/icons-material/Poll'
import CloseIcon from '@mui/icons-material/Close';
import ChainAccess from "../../api/chain-access"
import "./CreatePoll.css";


const CreatePoll = () => {
    const [pollPanelStatus, setPollPanelStatus] = useState(false);
    const [question, setQuestion] = useState();
    const [duration, setDuration] = useState();
    const [option1, setOption1] = useState();
    const [option2, setOption2] = useState();
    const [option3, setOption3] = useState();
    const [option4, setOption4] = useState();
    const [pollStatus, setPollStatus] = useState({published: false, error: undefined});

    const textFieldStyles = {
        marginBottom: "0.5rem;"
    }

    const onOptionChange = event => {
        switch(event.target.id) {
            case "option1":
                setOption1(event.target.value);
                break;
            case "option2":
                setOption2(event.target.value);
                break;
            case "option3":
                setOption3(event.target.value);
                break;
            case "option4":
                setOption4(event.target.value);
                break;
            default:
                break;
        }
    }

    const onQuestionChange = event => {
        setQuestion(event.target.value);
    }

    const onDurationChange = event => {
        setDuration(event.target.value);
    }

    const publishPoll = async () => {
        if (!(question && option1 && option2 && option3 && option4 && duration)) {
            setPollStatus({published: false, error: "Please fill all the fields"});
            return;
        }
        let startTime = Math.floor(Date.now()/1000);
        let endTime = startTime + duration*60;
        await ChainAccess.createPoll(
            question,
            startTime, 
            endTime,
            [{option: option1, votes: 0}, 
            {option: option2, votes: 0}, 
            {option: option3, votes: 0}, 
            {option: option4, votes: 0}]
        )
        resetPollStates();
        setPollStatus({published: true});
        togglePollPanel();
    }

    const resetPollStates = () => {
        setQuestion("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setDuration(0);
    }

    const closeSnackbar =() => {
        setPollStatus({published: false});
    }

    const togglePollPanel = () => {
        setPollPanelStatus(!pollPanelStatus);
    }

    return (
        <Fragment>
             
            {   !pollPanelStatus &&
                 <Button
                    onClick={togglePollPanel} 
                    variant="contained" sx={{
                        background: "no-repeat center linear-gradient(to right top, #9caabe, #84c0d5, #70d7d3, #8ee8b5, #d2f08d)",
                        ":hover": {
                            background: "no-repeat center linear-gradient(to right top, #9caabe, #84c0d5, #70d7d3, #8ee8b5, #d2f08d)"
                        },
                        }}>
                    <PollIcon/>
                    <span style={{marginLeft: "0.2rem"}}>Create Poll</span>
                </Button>
            }   
            {   pollPanelStatus &&
                <Container maxWidth="md">
                <Paper variant="elevation" 
                    sx={{
                        padding: "1rem 2rem 2rem 2rem",
                        background:"linear-gradient(to right top, #ecd2e1, #e8d2e6, #e2d3ea, #dcd4ee, #d4d5f1, #cdd8f5, #c7dcf7, #c0dff8, #bbe5f9, #b8eaf8, #b8f0f5, #bbf4f0)",
                    }}>
                    
                    <Grid container justifyContent={"space-between"}>
                        <h3>Create a new poll</h3>
                        <IconButton sx={{color: "#eb2f5b", ":hover": {background: "none"},}} onClick={togglePollPanel}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            id="poll-question"
                            multiline
                            rows={1}
                            label="Which is the most popular choice?"
                            variant="standard"
                            sx={textFieldStyles}
                            value={question}
                            onChange={onQuestionChange}
                            required
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    id="option1"
                                    multiline
                                    rows={1}
                                    label="A"
                                    variant="standard"
                                    sx={textFieldStyles}
                                    value={option1}
                                    onChange= {onOptionChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    id="option2"
                                    label="B"
                                    variant="standard"
                                    sx={textFieldStyles}
                                    value={option2}
                                    onChange= {onOptionChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    id="option3"
                                    label="C"
                                    variant="standard"
                                    sx={textFieldStyles}
                                    value={option3}
                                    onChange= {onOptionChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    id="option4"
                                    label="D"
                                    variant="standard"
                                    sx={textFieldStyles}
                                    value={option4}
                                    onChange= {onOptionChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Poll duration in mins"
                            variant="standard"
                            type="number"
                            sx={{...textFieldStyles, width: "11rem"}}
                            value={duration}
                            onChange={onDurationChange}
                            required
                        />
                        <Button variant="contained"  
                        sx={{
                            width: "8rem", 
                            marginTop: "0.8rem",
                            background: "no-repeat center linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
                            ":hover": {
                                background: "no-repeat center linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
                            },
                        }} 
                        onClick={publishPoll}>
                            Publish
                        </Button>
                        
                    </FormControl> 
                </Paper>
                </Container>
            }
            <Snackbar open={pollStatus.published === true} autoHideDuration={2000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
                    Poll Published Successfully!
                </Alert>
            </Snackbar>
            
            <Snackbar open={pollStatus.error} autoHideDuration={2000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: '100%' }}>
                    {pollStatus.error}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default CreatePoll;