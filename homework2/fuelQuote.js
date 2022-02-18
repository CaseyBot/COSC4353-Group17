import React from 'react';
import { useFormik } from 'formik';
import { makeStyles } from "@material-ui/core";
import { Typography, Grid, TextField, Button } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({

  root:{
        position:"fixed",
        textAlign:"center",
        margin:"auto",
        padding:"10px",
        display:"inline-block",
        color:"primary",
        width: "50ch",
        left: "25%",

  },

    label:{
    width:"75%",
    diplay:"inline-block",
    padding:"10px ",
    marginRight:"10px",
    fontSize:"16px",
    textAlign:"center",
  },
  input:{
    margin:"10px auto",
    padding:"5px",
    width:"75%",
    alignText:"center",
  },

  div:{
    margin:" auto",

  }
}));
function calculate(gallons){
  var theForm = document.forms["fuel"];
  var quantity = document.getElementById('gallons').value;
  var price = 15;
  var amount=quantity.value + price;

  return amount;
}
function getTotal(){
  var total=calculate();
  return total;
}

 function fuelQuote() {
  const classes = useStyles();

  return (

    <body className={classes.root}>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <form  action="" onsubmit="return false;" id="fuel">
    <h1>Fuel Quote</h1>
    <div className={classes.div}class="field">
        <label class="amount"className={classes.label} for="gallons">Gallons Requested: </label>
        <input className={classes.input}type="number" id="gallons" name="gallons"  required />
        <small></small>
      </div>
      <div class="field">
        <label className={classes.label} for="address">Delivery Address: </label>
        <input className={classes.input}type="text" id="address" name="address" />
        <small></small>
      </div>
      <div class="field">
        <label className={classes.label} for="date">Delivery Date: </label>
        <input className={classes.input}type="date" id="date" name="date"  />
        <small></small>
      </div>
      <div class="field">
        <label style={{marginBottom:"40px" ,fontSize:"13pt",padding:"20px"}}className={classes.label} for="suggestedGallon">Suggested Price: $15.00</label>
        <span style={{marginBottom:"40px" ,fontSize:"13pt",padding:"20px"}} className={classes.input}type="number" id="suggestedGallon" name="suggestedGallon" value="15.00" />
        <small></small>
      </div>
      <div class="field">
        <label style={{marginBottom:"40px" ,fontSize:"13pt",padding:"20px"}} for="total_value">Total Amount Due:</label>
        <span style={{marginBottom:"40px" ,fontSize:"13pt",padding:"20px"}}id="total_value"></span>
        <small></small>
      </div>
      <button style={{margin:"20px"}} type="submit">Get Quote</button>
    </form>

    </body>
  );
};
export default fuelQuote;