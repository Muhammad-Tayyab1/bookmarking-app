import React, { useState } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";
import {Grid } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const GET_BOOKMARKS = gql`
{
  bookmarks {
    id,
    title,
    url
  }
}
`;

const ADD_BOOKMARK = gql`
    mutation addBookmar($title: String!, $url: String!){
        addBookmark(title: $title, url: $url){
            id
            title
            url
        }
    }
`
const REMOVE_BOOKMARK = gql`
  mutation removeBookmark($id: ID!) {
    removeBookmark(id: $id) {
      id
    }
  }
`;

export default function Home() {
  const [title, setTitle] = useState("");
  const [siteUrl, setSiteURl] = useState("");
  const { error, loading, data } = useQuery(GET_BOOKMARKS);
  const [addBookmark] = useMutation(ADD_BOOKMARK);
  const [removeBookmark] = useMutation(REMOVE_BOOKMARK);
  const handleSubmit = () => {
    console.log(title)
    console.log(siteUrl)
    addBookmark({
      variables: {
        title: title,
        url: siteUrl,
      },
      refetchQueries: [{ query: GET_BOOKMARKS }]
    })
  };
  const remove = (id) => {
    removeBookmark({
      variables: {
        id: id,
      },
      refetchQueries: [{ query: GET_BOOKMARKS }],
    });
  };


  if (loading)
    return <h3>Loading...</h3>

  if (error)
    return <h3>{error.message}</h3>
  return(
   <div className="container">
    <div className="form">
      <h2>Add New Bookmark</h2>
      <form>
        <label htmlFor="Title">
          Enter Bookmark Title: <br />
          <input type="text" className="input" required placeholder="Title..." onChange={(e) => setTitle(e.target.value)} />
        </label>

        <br />
        <label htmlFor="URL">

          Enter Bookmark Url:
                <br />
          <input type="text" className="input" required placeholder="URL..." onChange={(e) => setSiteURl(e.target.value)} />
        </label>

        <br />
        <br />
        <button className="btn" onClick={handleSubmit}>Add Bookmark</button>
      </form> </div>
    
      <h2 className="book">Bookmark List</h2>
      <div className="data-container">
        <Grid  className="card-container">
          {data && data.bookmarks.map((d) => 
            
              <Grid  key={d.id}>
                <div className="dataList">
                  
                  <div className="listBtn">
                   <h3 >{d.title}</h3>
                   <Delete className="deletebtn" onClick={() => remove(d.id)} />
                         
                </div>
                
                <div>
                  <a href={d.url} className="title">{d.url}</a>
                </div>
                  

                 
                </div>
              </Grid>
            
          )}
        </Grid>
        
      </div>

  </div>
  )
}