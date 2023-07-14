import "./widget.scss";
import PersonIcon from "@mui/icons-material/Person";
import MedicationIcon from "@mui/icons-material/Medication";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CountUp from "react-countup";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const Widget = ({ type }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  console.log(books);

  useEffect(() => {
    axios
      .get(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books"
      )
      .then((response) => {
        setBooks(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/users"
      )
      .then((response) => {
        setUsers(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories"
      )
      .then((response) => {
        setCategories(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors"
      )
      .then((response) => {
        setAuthors(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/orders"
      )
      .then((response) => {
        const newOrdersFind = response.data.filter(
          (row) => row.status === "New Order"
        );
        setNewOrders(newOrdersFind.length);
        const completedOrdersFind = response.data.filter(
          (row) => row.status === "Completed"
        );
        setCompletedOrders(completedOrdersFind.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [books, users, categories, authors, newOrders, completedOrders]);
  let data;

  //temporary
  // const diff = 20;

  switch (type) {
    case "books":
      data = {
        title: "TOTAL BOOKS",
        isMoney: false,
        amount: <CountUp start={0} end={books} duration={3} />,

        // link: "See all users",
        icon: (
          <PersonIcon
            className="icon"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
          />
        ),
      };
      break;
    case "authors":
      data = {
        title: "TOTAL AUTHORS",
        isMoney: false,
        amount: <CountUp start={0} end={authors} duration={3} />,

        // link: "See all users",
        icon: (
          <PersonIcon
            className="icon"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
          />
        ),
      };
      break;
    case "categories":
      data = {
        title: "TOTAL CATEGORIES",
        isMoney: false,
        amount: <CountUp start={0} end={categories} duration={3} />,

        // link: "View all orders",
        icon: (
          <MedicationIcon
            className="icon"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
          />
        ),
      };
      break;

    case "users":
      data = {
        title: "TOTAL USERS",
        isMoney: false,
        amount: <CountUp start={0} end={users} duration={3} />,
        // link: "View all orders",
        icon: (
          <LocationCityIcon
            className="icon"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
          />
        ),
      };
      break;
    case "new":
      data = {
        title: "TOTAL NEW ORDERS",
        isMoney: false,
        amount: <CountUp start={0} end={newOrders} duration={3} />,
        // link: "View all orders",
        icon: (
          <MedicationIcon
            className="icon"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
          />
        ),
      };
      break;
    case "completed":
      data = {
        title: "TOTAL COMPLETED ORDERS",
        isMoney: false,
        amount: <CountUp start={0} end={completedOrders} duration={3} />,
        // link: "View all orders",
        icon: (
          <MedicationIcon
            className="icon"
            style={{
              backgroundColor: "white",
              color: "black",
            }}
          />
        ),
      };
      break;

    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">{data.icon}</div>

      <div className="right">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
      </div>
    </div>
  );
};

export default Widget;
