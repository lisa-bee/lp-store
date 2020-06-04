import React from "react";
import "./UploadProduct.css"
import { Box, Button, Form, FormField, TextInput } from "grommet";
import { Link } from "react-router-dom";

class UploadProduct extends React.Component {
  constructor() {
    super()
      this.state = {
          image: "",
          artist: "",
          album: "",
          description: "",
          price: "",
          stock_quantity: "",
          genre: "",
          errorMessage: ""
        }      
    }
    handleInput = (event) => {
      const {name, value} = event.target
      this.setState({
          [name]: value
      }) 
    }

    handleChange = (event) => {
      this.setState({
        image: event.target.files[0]
      })
    }

    submit = async() => {
      const isValidated = this.validateInput()
      if(isValidated){

        const fd = new FormData();
        fd.append('image', this.state.image);
    
        // `POST` image
        fetch('http://localhost:5000/uploads/', {
            method: 'POST',
            body: fd
        })
        .then((response) => {
          console.log(response)
            if(response.message){
                this.setState({
                    errorMessage: response.message,
                })
            }
            else{
              this.setState({
                image: ""
              })
            }
        })

        // `POST` album
        const data = {
            "artist": this.state.artist,
            "album": this.state.album,
            "description": this.state.description,
            "price": parseInt(this.state.price),
            "stock_quantity": parseInt(this.state.stock_quantity),
            "image": "test",
            "genre": this.state.genre
          }
           fetch(`http://localhost:5000/products`,{
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .catch((err) => {
                console.log(err)
        })
        .then((response) => {
            if(response.message){
                this.setState({
                    errorMessage: response.message,
                })
            }
            else{
              this.setState({
                errorMessage: "The album is uploaded",
                artist: "", album: "", description: "", price: "", stock_quantity: "", genre: ""
            })
            }
        })
      }
    }

    validateInput = () => {
      let isCorrect = true
      const price = parseInt(this.state.price)
      const stock_quantity = parseInt(this.state.stock_quantity)
      const image = this.state.image;

      if(this.state.artist === "" ||
        this.state.album === "" ||
        this.state.artist === "" ||
        this.state.description === "" ||
        this.state.price === "" ||
        this.state.stock_quantity === "" ||
        this.state.genre === ""
      ){
        isCorrect = false
        this.setState({
          errorMessage: "Some data is missing",
        })
      } else if(
        isNaN(price) ||
        isNaN(stock_quantity)
      ){
        isCorrect = false
        this.setState({
          errorMessage: "Not a number",
        })
      } else if(image === ""){
        this.setState({
          errorMessage: 'Missing album cover'
        })
      } else if(!['image/jpeg', 'image/gif', 'image/png'].includes(image.type)) {
        this.setState({
          errorMessage: 'Only images are allowed.'
        })
      } else if(image.size > 2 * 1024 * 1024) { // check file size (< 2MB)
        this.setState({
          errorMessage: 'File must be less than 2MB.'
        })
      }
      return isCorrect
    }
  
    render() {
      return (
        <Box className="uploadBox">
          <Link to="/admin">
            <h1>←</h1>
          </Link>
          <Form>
            <FormField label="Album Cover">
              <input type="file" name="image" onChange={this.handleChange}/>
            </FormField>
            <FormField label="Artist">
              <TextInput name="artist" 
                        value={this.state.artist} 
                        onChange={this.handleInput} 
                      />
            </FormField>
            <FormField label="Album" >
              <TextInput name="album" 
                        value={this.state.album} 
                        onChange={this.handleInput} 
                      />
            </FormField>
            <FormField label="Description" >
              <TextInput name="description" 
                        value={this.state.description} 
                        onChange={this.handleInput} 
                      />
            </FormField>
            <FormField label="Price" >
              <TextInput name="price" 
                        value={this.state.price} 
                        onChange={this.handleInput} 
                      />
            </FormField>
            <FormField label="Stock Quantity" >
              <TextInput name="stock_quantity" 
                        value={this.state.stock_quantity} 
                        onChange={this.handleInput} 
                      />
            </FormField>
            <FormField label="Genre" >
              <TextInput name="genre" 
                        value={this.state.genre} 
                        onChange={this.handleInput} 
                      />
            </FormField>
            <p style={{color: "red"}}>{this.state.errorMessage}</p>
            <Button type="submit" label="Submit" onClick={this.submit}/>
          </Form>
        </Box>
      );
    }
  }
  
  export default UploadProduct;