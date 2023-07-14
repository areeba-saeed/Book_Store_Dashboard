import "../../style/datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupAlert from "../../components/popupalert/popupAlert";

const DatableContact = () => {
  const [contact, setcontact] = useState([]);
  const [popUpShow, setPopupshow] = useState(false);
  const [popUpText, setPopupText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [state, setState] = useState("");

  useEffect(() => {
    axios
      .get("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/contact")
      .then((response) => {
        setcontact(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contact]);

  const handleStatus = (id, status) => {
    axios
      .patch(`https://bookeriaapi-4c4e83f96829.herokuapp.com/api/contact/${id}`, { status: status })
      .then((response) => {
        console.log(response.data);
        // setPopupText("Stauts changed");
        // setPopupshow(true);

        // setTimeout(() => {
        //   setPopupshow(false);
        // }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDelete = (id) => {
    axios.delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/contact/" + id).then((response) => {
      console.log(response.data);
    });
    setPopupText("Contact Deleted");
    setPopupshow(true);

    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach((row) => {
      axios
        .delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/contact/" + row)
        .then((response) => {
          console.log(response.data);
          const filteredcontact = response.data.filter(
            (contact) => contact.status[0] === "Completed"
          );
          setcontact(filteredcontact);
          setPopupshow(true);
          setPopupText(`${selectedRows.length} contact Deleted`);
        });
    });
    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
    setSelectedRows([]);
  };

  const actionColumn = [
    {
      field: "name",
      headerName: "Name",
      width: 180,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
    },
    {
      field: "message",
      headerName: "Message",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => {
        if (params.row.status === "Pending") {
          return (
            <div className="cellAction">
              <p style={{ color: "red" }}>{params.row.status}</p>
            </div>
          );
        } else {
          return (
            <div className="cellAction">
              <p style={{ color: "green" }}>{params.row.status}</p>
            </div>
          );
        }
      },
    },
    {
      field: "actionStatus",
      headerName: "Change Status",
      width: 180,
      renderCell: (params) => {
        return (
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              handleStatus(params.row._id, e.target.value);
            }}>
            <option value="Pending">Pending</option>
            <option value="Answered">Answered</option>
          </select>
        );
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
      <div className="datatableTitle">Contacts</div>
      {selectedRows.length > 0 ? (
        <button
          onClick={() => {
            handleDeleteSelectedRows();
          }}>
          Delete Selected Rows
        </button>
      ) : null}

      {popUpShow ? (
        <div className="Popupmodal">
          <div
            className="popupInner"
            style={
              popUpShow && popUpText === "Category Added"
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
        rows={contact}
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

export default DatableContact;
