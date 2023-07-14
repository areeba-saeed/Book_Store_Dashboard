import "../../style/datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { categoryColumns } from "../../datatablesource";
import axios from "axios";
import PopupAlert from "../../components/popupalert/popupAlert";

const DatatableCategory = () => {
  const [categories, setcategories] = useState([]);
  const [name, setname] = useState("");
  const [image, setImage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [popUpShow, setPopupshow] = useState(false);
  const [popUpText, setPopupText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories")
      .then((response) => {
        setcategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    axios
      .post("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories", formData)
      .then((res) => {
        console.log(res.data);
        setcategories(res.data);
        setPopupText(`Category Added`);
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    axios
      .patch(`https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories/${id}`, formData)
      .then((res) => {
        setPopupText(`Category Updated`);
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
    axios
      .delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories/" + id)
      .then((response) => {
        console.log(response.data);
        setPopupshow(true);
        setPopupText("Category Deleted");
        setTimeout(() => {
          setPopupshow(false);
        }, 2000);
      });
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach((row) => {
      axios
        .delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories/" + row)
        .then((response) => {
          setcategories(response.data);
          setPopupshow(true);
          setPopupText(`${selectedRows.length} Categories Deleted`);
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
      field: "image",
      headerName: "Image",
      width: 200,
      renderCell: (params) => {
        const imageUrl = `https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories/images/${params.row.image}`;
        return (
          <img
            src={imageUrl}
            alt={params.row.image}
            style={{ width: 40, height: 40 }}
          />
        );
      },
    },
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
        Categories
        <div
          className="link-new"
          onClick={() => {
            setOpenModal(true);
            setname("");
          }}>
          Add Category
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
                  placeholder="Category Name"
                  className="category-form"
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
                <input
                  type="file"
                  className="category-image"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
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
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(selectedRow);
                }}>
                <input
                  type="text"
                  placeholder="Category Name"
                  className="category-form"
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
                <input
                  type="file"
                  className="category-image"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
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
        rows={categories}
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

export default DatatableCategory;
