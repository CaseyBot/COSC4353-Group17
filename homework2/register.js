import React from 'react';
import { useFormik } from 'formik';
import { makeStyles } from "@material-ui/core";
import { Typography, Grid, TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root:{
    padding: theme.spacing(1),
    width: "50ch",
    position: "fixed",
    top: "25%",
    left: "501%",
    textAlign: "center",
    transform: "translate(-50%, -50%)",
    marginTop: theme.spacing(2),

  },

  formTitle:{
      marginTop:"20px",
      margin:"auto",
      fontWeight:"bold",
      textTransform:"uppercase",
  },
  label:{
      width:"50px",
      display:"inline-block",
      textAlign:"center",
      fontSize:"20px",
  },
  registration:{
      float:"left",
  },
  
}));

 function register() {
  const classes = useStyles();



  const validate = (values) => {
      let errors = {};
      if (!values.username) {
        errors.username = "Required";
      }
      if (values.password.length < 4) {
        errors.password = "Minimum 4 characters";
      }
      return errors;
    };
   
    
  return (
    <Grid  container spacing={4} direction="column" classname={classes.root}>
    <Typography className={classes.formTitle} style={{fontSize:"22px"}}>Registration</Typography>

    <Grid style={{display:"flex", margin:"auto"}}item xs={10}>
      <label style={{textAlign:"center" ,marginRight:"10px", fontSize:"18px"}}>Username</label>
        <TextField
            id="username"
            name="username"
            variant="outlined"
           style={{width:"100%"}}
        />
    </Grid>

<Grid style={{display:"flex" , margin:"auto"  }}  item xs={10}>
  <label style={{fontSize:"18px" ,marginRight:"10px"}}>Password</label>
    <TextField
    id="password"
    name="password"
    variant="outlined"
    style={{width:"100%"}}
    />
</Grid>
<Button 
    style={{margin:"auto", width:"50%"}}

    variant="contained"
    size="large"
    color="primary">
    Register
</Button>
</Grid>
  );
}

export default register;