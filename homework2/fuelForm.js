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

  return (

    <body >
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <form  action="" onsubmit="return false;" id="fuel">
    <h1>Fuel Quote</h1>
    <div >
        <label class="amount" for="gallons">Gallons Requested: </label>
        <input type="number" id="gallons" name="gallons"  required />
        <small></small>
      </div>
      <div class="field">
        <label for="address">Delivery Address: </label>
        <input type="text" id="address" name="address" />
        <small></small>
      </div>
      <div class="field">
        <label  for="date">Delivery Date: </label>
        <input type="date" id="date" name="date"  />
        <small></small>
      </div>
      <div class="field">
        <label style={{marginBottom:"40px" ,fontSize:"13pt",padding:"20px"}} for="suggestedGallon">Suggested Price: $15.00</label>
        <span style={{marginBottom:"40px" ,fontSize:"13pt",padding:"20px"}} type="number" id="suggestedGallon" name="suggestedGallon" value="15.00" />
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