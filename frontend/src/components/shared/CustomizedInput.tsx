import React from "react";
import TextField  from "@mui/material/TextField";

type Props = {
    name: string,
    type: string,
    label: string
}

const CustomizedInput = (props: Props) => {
    return <TextField 
        InputLabelProps={{style:{color: "white"}}} 
        margin="normal"
        name = {props.name} 
        label = {props.label} 
        type = {props.type} 
        InputProps={{style: {width: "400px", fontSize: 20, borderRadius: 10, color: "white"}}} />
}

export default CustomizedInput