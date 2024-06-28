import React from 'react'
import { Divider, Text} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';

const ConfigureAndTestStepper = () => {
    const classes = useStyles();
    return (
      <div className={classes.stepperContainer}>
      <div className={classes.completedStep}>
        <span style={{fontSize:"20px",color:"#fff"}} className="material-symbols-outlined">done</span>
      </div>
      <Text className={classes.currentText}>Upload Document</Text>
      <Divider style={{width:"56px",margin:"0px"}} />
      <div className={classes.currentStep}>{" "}</div>
      <Text className={classes.currentText}>Configure & Test</Text>
  </div>
    )
}

export default ConfigureAndTestStepper;

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
    completedStep:{
        borderRadius:"50px",
        backgroundColor:" #1b3764",
        height:"22px",
        width:"22px",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
  }));