import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../css/loginAndRegister.css'
const Register = () => {
  return (
    <>
    <div class='form-container' >
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="First Name" variant="outlined" />
        <TextField id="outlined-basic" label="Last Name" variant="outlined" />
        <TextField id="outlined-basic" label="User Name" variant="outlined" />
        <TextField id="outlined-basic" label="Password" variant="outlined" />
        <Button style={{width:'200px',height:'55px', color:'grey' }} variant="outlined" color="inherit" >Register</Button>
      </Box>
    </div>
    </>
  )
}

export default Register