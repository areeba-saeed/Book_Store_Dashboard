import "../../style/datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { orderColumns } from "../../datatablesource";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupAlert from "../../components/popupalert/popupAlert";
import { green } from "@mui/material/colors";

const DatatableOrders = () => {
  const [orders, setorders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [popUpShow, setPopupshow] = useState(false);
  const [popUpText, setPopupText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/orders"
      )
      .then((response) => {
        setorders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [orders]);

  const handleDelete = (id) => {
    axios
      .delete(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/orders/" +
          id
      )
      .then((response) => {
        console.log(response.data);
      });
    setPopupText("Order Deleted");
    setPopupshow(true);

    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
  };

  const handleUpdateStatus = (status, id) => {
    const updatedStatus = {
      status: status,
    };
    axios
      .patch(
        "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/orders/" +
          id,
        updatedStatus
      )
      .then((response) => {
        console.log(response.data);
      });
    setPopupText("Status Updated");
    setPopupshow(true);
    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach((row) => {
      axios
        .delete(
          "https://bookeriaapi-4c4e83f96829.herokuapp.com/api/orders/" +
            row
        )
        .then((response) => {
          console.log(response.data);
          setorders(response.data);
          setPopupshow(true);
          setPopupText(`${selectedRows.length} Orders Deleted`);
        });
    });
    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
    setSelectedRows([]);
  };

  const actionColumn = [
    {
      field: "userId.name",
      headerName: "Username",
      width: 220,
      valueGetter: (params) => params.row.userId.name,
    },
    {
      field: "email.name",
      headerName: "Email",
      width: 250,
      valueGetter: (params) => params.row.userId.email,
    },
    {
      field: "totalPrice",
      headerName: "Total prcie",
      width: 150,
    },

    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => {
        let statusColor = "";

        if (params.row.status === "New Order") {
          statusColor = "blue";
        } else if (params.row.status === "Completed") {
          statusColor = "green";
        } else if (params.row.status === "Cancelled") {
          statusColor = "red";
        } else if (params.row.status === "On the way") {
          statusColor = "#FFBA0D";
        } else {
          statusColor = "grey";
        }

        return (
          <div className="cellAction">
            <p style={{ color: statusColor }}>{params.row.status}</p>
          </div>
        );
      },
    },

    {
      field: "actionState",
      headerName: "Change status",
      width: 180,
      renderCell: (params) => {
        if (
          params.row.status === "Cancelled" ||
          params.row.status === "Completed"
        ) {
          return (
            <div className="cellAction">
              <p>Cannot changed completed or cancelled order</p>
            </div>
          );
        } else {
          return (
            <div className="cellAction">
              <select
                className="input-form"
                defaultValue={params.row.status || "Pending"}
                multiple={false}
                onChange={(e) =>
                  handleUpdateStatus(e.target.value, params.row._id)
                }>
                <option value="New Order">New Order</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On the way">On the way</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          );
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => {
                setSelectedRow(params.row);
                setOpenModal(true);
              }}>
              View
            </div>

            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">New Orders</div>
      {selectedRows.length > 0 ? (
        <button
          onClick={() => {
            handleDeleteSelectedRows();
          }}>
          Delete Selected Rows
        </button>
      ) : null}
      {openModal ? (
        <div className="modal">
          <div className="modalInnerExpanded">
            <p className="closeModal" onClick={() => setOpenModal(false)}>
              &times;
            </p>
            <div
              style={{
                marginLeft: 20,
                marginRight: 20,
                width: 500,
                marginTop: 50,
                marginBottom: 40,
              }}>
              <div className="textWrapper">
                <p className="totalText"> Username: </p>
                <p className="totalText"> {selectedRow.userId.name}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Email: </p>
                <p className="totalText"> {selectedRow.userId.email}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Mobile number: </p>
                <p className="totalText"> {selectedRow.userId.phoneNo}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Address: </p>
                <p className="totalText"> {selectedRow.userId.address}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Address 2: </p>
                <p className="totalText"> {selectedRow.userId.address2}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Country: </p>
                <p className="totalText"> {selectedRow.userId.country}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> State: </p>
                <p className="totalText"> {selectedRow.userId.state}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Zip: </p>
                <p className="totalText"> {selectedRow.userId.zip}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Name on card: </p>
                <p className="totalText"> {selectedRow.userId.nameOnCard}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Credit card number: </p>
                <p className="totalText"> {selectedRow.userId.creditNumber}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Cvv: </p>
                <p className="totalText"> {selectedRow.userId.cvv}</p>
              </div>
              <div className="textWrapper">
                <p className="totalText"> Expiration: </p>
                <p className="totalText"> {selectedRow.userId.expiration}</p>
              </div>

              <div className="textWrapper">
                <p className="totalText"> Status: </p>
                <p className="statusPending"> {selectedRow.status}</p>
              </div>
              <div>
                {selectedRow.items.map((data, index) => {
                  const imageUrl = `https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/images/${data.productId.image}`;
                  return (
                    <div style={{ margin: "30px 0px" }}>
                      <div className="modalOrder" key={index}>
                        <div className="rowInfo">
                          <img
                            src={imageUrl}
                            width={"50"}
                            height={"50"}
                            className="img"
                          />
                          <p className="modalText ">
                            {data.productId.name} ({data.quantity})
                          </p>
                        </div>

                        <p className="modalText">
                          {data.productId.price * data.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="textWrapper">
                <p className="totalText"> Total Price + Shipping: </p>
                <p className="total"> {selectedRow.totalPrice} PKR</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {popUpShow ? (
        <div className="Popupmodal">
          <div
            className="popupInner"
            style={
              popUpShow && popUpText === "Order Status Updated"
                ? {
                    backgroundColor: "#8AFF8A",
                    borderWidth: 1,
                    borderColor: "#007500",
                  }
                : { backgroundColor: "red", borderWidth: 1, borderColor: "red" }
            }>
            <PopupAlert popUpText={popUpText} />
          </div>
        </div>
      ) : (
        ""
      )}
      <DataGrid
        className="datagrid"
        rows={orders}
        columns={actionColumn}
        checkboxSelection={true}
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
        }}
        getRowId={(row) => {
          return row._id;
        }}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />
    </div>
  );
};

export default DatatableOrders;
