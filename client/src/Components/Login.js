import React from "react"
import { Container } from "react-bootstrap";
import axiosInstance from "../axiosConfig";



export default function Login() {


 
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href="http://localhost:8000/login" >
        Login With Spotify
      </a>
    </Container>
  )
}