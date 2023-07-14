import "../../style/datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { categoryColumns } from "../../datatablesource";
import axios from "axios";
import PopupAlert from "../../components/popupalert/popupAlert";

const DatatableAuthors = () => {
  const [authors, setauthors] = useState([]);
  const [name, setname] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [popUpShow, setPopupshow] = useState(false);
  const [popUpText, setPopupText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors")
      .then((response) => {
        setauthors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [authors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name: name };

    axios
      .post("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors", data)
      .then((res) => {
        setPopupText(`Author Added`);
        setname("");
        setPopupshow(true);
        setOpenModal(false);
        setErrorMessage(false);
        setTimeout(() => {
          setPopupshow(false);
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          setErrorMessage(err.response.data);
        }
      });
  };
  const handleUpdate = (id) => {
    const data = { name: name };

    axios
      .patch(`https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors/${id}`, data)
      .then((res) => {
        setPopupText(`Author Updated`);
        setname("");
        setPopupshow(true);
        setOpenModal(false);
        setErrorMessage(false);
        setTimeout(() => {
          setPopupshow(false);
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios.delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors/" + id).then((response) => {
      console.log(response.data);
      setPopupshow(true);
      setPopupText("Authors Deleted");
      setTimeout(() => {
        setPopupshow(false);
      }, 2000);
    });
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach((row) => {
      axios
        .delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors/" + row)
        .then((response) => {
          setauthors(response.data);
          setPopupshow(true);
          setPopupText(`${selectedRows.length} Authors Deleted`);
        });
    });
    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
    setSelectedRows([]);
  };

  const actionColumn = [
    { field: "name", headerName: "Name", width: 200 },

    {
      field: "action",
      headerName: "Action",
      width: 500,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => {
                setOpenUpdateModal(true);
                setname(params.row.name);
                setSelectedRow(params.row._id);
              }}>
              Update
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
      <div className="datatableTitle">
        Authors
        <div
          className="link-new"
          onClick={() => {
            setOpenModal(true);
            setname("");
          }}>
          Add Authors
        </div>
      </div>
      {selectedRows.length > 0 ? (
        <button
          onClick={() => {
            handleDeleteSelectedRows();
          }}>
          Delete Selected Rows
        </button>
      ) : null}

      {/*Add*/}
      {openModal ? (
        <div className="modal">
          <div className="modalInner">
            <p
              className="closeModal"
              onClick={() => {
                setOpenModal(false);
                setErrorMessage(false);
              }}>
              X
            </p>
            <div style={{ margin: 40 }}>
              <div style={{ color: "red", fontSize: 15 }}>{errorMessage}</div>

              <form className="category-new" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Authors Name"
                  className="category-form"
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />

                <button className="createButton">Add</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/*Update*/}
      {openUpdateModal ? (
        <div className="modal">
          <div className="modalInner">
            <p
              className="closeModal"
              onClick={() => {
                setOpenUpdateModal(false);
                setname("");
                setErrorMessage("");
              }}>
              X
            </p>
            <div style={{ margin: 40 }}>
              <form
                className="category-new"
                onSubmit={() => {
                  handleUpdate(selectedRow);
                }}>
                <input
                  type="text"
                  placeholder="Authors Name"
                  className="category-form"
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />

                <button className="createButton">Update</button>
              </form>
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
              popUpShow && popUpText === "Authors Added"
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
        rows={authors}
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

export default DatatableAuthors;
