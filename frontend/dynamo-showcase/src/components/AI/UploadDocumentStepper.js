import React from 'react'
import { Divider, Text} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';

const UploadDocumentStepper = () => {
    const classes = useStyles();
  return (
    <div className={classes.stepperContainer}>
    <div className={classes.currentStep}>{" "}</div>
    <Text className={classes.currentText}>Upload Document</Text>
    <Divider style={{width:"56px",margin:"0px"}} />
    <div className={classes.nextStep}>{" "}</div>
    <Text className={classes.nextText}>Configure & Test</Text>
</div>
  )
}

export default UploadDocumentStepper;

const useStyles = makeStyles(theme => ({
    stepperContainer:{
        marginBottom: '18px !important',
        padding: '24px !important',
        boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
        borderRadius: '5px !important',
        display: 'flex !important',
        gap: '8px !important',
        justifyContent:"center",
        alignItems:"center"
    },
    currentStep:{
        borderRadius:"50px",
        border:"7px solid #1b3764",
        padding:"4px",
        maxHeight:"22px",
        maxWidth:"22px"
    },
    currentText:{
        color:"#333333",
        fontSize:"20px !important",
        fontFamily:'"Roboto Medium", "Roboto", sans-serif !important',
        fontWeight:"700 !important"
    },
    nextStep:{
        borderRadius:"50px",
        border:"4px solid #1b3764",
        maxHeight:"8px",
        maxWidth:"8px"
    },
    nextText:{
        color:"#555555",
        fontSize:"20px !important",
        fontFamily:'"Roboto Medium", "Roboto", sans-serif !important',
        fontWeight:"700 !important"
    },
  }));