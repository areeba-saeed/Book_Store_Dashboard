import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders")
      .then((response) => {
        if (response.data.length > 0) {
          const filteredOrders = response.data.filter(
            (order) => order.status[0] !== "Completed"
          );
          setNewOrderCount(filteredOrders.length);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [newOrderCount]);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">E-commerce</span>
        </Link>
      </div>
      <hr className="break-sidebar" />
      <div className="center">
        <ul>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Categories</span>
            </li>
          </Link>
          <Link to="/authors" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Authors</span>
            </li>
          </Link>
          <Link to="/books" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Books</span>
            </li>
          </Link>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link
            to="/orders"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>New Orders</span>

              <span
                style={{
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "black",
                  paddingLeft: 4,
                  paddingRight: 4,
                  borderRadius: 10,
                }}>
                {newOrderCount}
              </span>
            </li>
          </Link>
          <Link to="/ordershistory" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Order History</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
