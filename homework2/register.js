
import "./register.css"

 function register() {


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
    <form  container spacing={4} direction="column" >
    <h1 style={{fontSize:"22px"}}>Registration</h1>

    <form style={{display:"flex", margin:"auto"}}item xs={10}>
      <label style={{textAlign:"center" ,marginRight:"10px", fontSize:"18px"}}>Username</label>
      <input
            id="username"
            name="username"
            variant="outlined"
           style={{width:"50%"}}
        />
    </form>

<form style={{display:"flex" , margin:"auto"  }}  item xs={10}>
  <label style={{fontSize:"18px" ,marginRight:"10px"}}>Password</label>
  <input
    id="password"
    name="password"
    variant="outlined"
    style={{width:"50%"}}
    />
</form>
<button 
    style={{margin:"auto", width:"50%"}}

    variant="contained"
    size="large"
    color="primary">
    Register
</button>
</form>
  );
}

export default register;