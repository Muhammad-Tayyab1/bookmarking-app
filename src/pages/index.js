import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';


// This query is executed at run time by Apollo.
const BookMarkingQuery = gql`
{
  bookmarks{
    id
    url
    desc
  }
}
`;
const AddBookMarkMutation = gql `
  mutation addBookMark($url:String!, $desc: String!){
    addBookMark(url: $url, desc: $desc){
      url
    }
  }
`
export default function Home() {
  const { loading, error, data } = useQuery(BookMarkingQuery);
  const [addBookMark] = useMutation(AddBookMarkMutation)
let textfield;
let desc;
const submitBookmark = () =>{
  addBookMark({
    variables:{
      url:textfield.value,
      desc: desc.value
    },
    refetchQueries: [{query:BookMarkingQuery}],
  })
  console.log("textFiels", textfield.value);
  console.log("Description", desc.value);
}
  return (
    <div>
      
       <p>{JSON.stringify(data)}</p>
    <div>
      <input type="text" placeholder="URL" ref={node => textfield=node}/>
      <input type="text" placeholder="Description" ref={node => desc=node}/>

      <button onClick={submitBookmark}>BookMark</button>
    </div>
    </div>
  );

}