import { type MouseEvent } from "react";

function ListGroup() {
  let items = ["option 1", "option 2", "option 3", "option 4"];

  const handleclick = (event: MouseEvent) => console.log(event);
  // items = [];

  // if (items.length === 0)
  //     return <p> length is 0 bro</p>
  return (
    <>
      <h1>List:</h1>
      {items.length === 0 ? <h1>no items found bro</h1> : null}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item} className="list-group-item" onClick={handleclick}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
