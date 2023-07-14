import "../../style/datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { productColumns, productRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupAlert from "../../components/popupalert/popupAlert";

const DatatableBooks = () => {
  const [books, setbooks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [image, setImage] = useState(null);
  const [popUpShow, setPopupshow] = useState(false);
  const [popUpText, setPopupText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books")
      .then((response) => {
        if (response.data.length > 0) {
          setbooks(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/" + id).then((response) => {
      console.log(response.data);
    });

    setbooks(books.filter((el) => el._id !== id));
    setPopupshow(true);
    setPopupText("Category Deleted");
    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach((row) => {
      axios
        .delete("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/" + row)
        .then((response) => {
          setbooks(response.data);
          setPopupshow(true);
          setPopupText(`${selectedRows.length} Books Deleted`);
        });
    });
    setTimeout(() => {
      setPopupshow(false);
    }, 2000);
    setSelectedRows([]);
  };

  const handleImageUpload = (id) => {
    const formData = new FormData();
    formData.append("image", image);
    axios
      .patch(`https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/bookImage/${id}`, formData)
      .then((response) => {
        setImages(response.data);
        setPopupshow(true);
        setPopupText(`Image Added`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const actionColumn = [
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "category.name",
      headerName: "Category",
      width: 200,
      valueGetter: (params) => params.row.category.name,
    },
    {
      field: "author.name",
      headerName: "Author",
      width: 200,
      valueGetter: (params) => params.row.author.name,
    },
    { field: "price", headerName: "Price", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 200,
      renderCell: (params) => {
        const imageUrl = `https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/images/${params.row.image}`;
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
            <Link
              to={`/books/update/${params.id}`}
              state={{ data: params.row }}
              style={{ textDecoration: "none" }}>
              <div className="viewButton">Update</div>
            </Link>
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
        Books
        <Link to="/books/new" className="link-new">
          Add Book
        </Link>
      </div>
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
            <div style={{ margin: 40 }}>
              <h6>Name:</h6>
              <p className="modalText">{selectedRow.name}</p>
              <h6>Price:</h6>
              <p className="modalText">{selectedRow.price}</p>
              <h6>Category:</h6>
              <p className="modalText">{selectedRow.category.name}</p>
              <h6>Description:</h6>
              <div
                className="modalText"
                dangerouslySetInnerHTML={{
                  __html: selectedRow.description,
                }}></div>
              <h6>Image:</h6>

              <div>
                <img
                  src={`https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/images/${selectedRow.image}`}
                  alt={selectedRow.image}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {openImageModal ? (
        <div className="modal">
          <div className="modalInnerExpanded">
            <p className="closeModal" onClick={() => setOpenImageModal(false)}>
              &times;
            </p>
            <div style={{ margin: 40 }}>
              <form onSubmit={handleImageUpload}>
                <h6>File:</h6>
                <input
                  type="file"
                  className="category-image"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
                <button className="createButton">Add</button>
              </form>
              <div>
                {images.map((row) => {
                  const imageUrl = `https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/images/${row}`;
                  return (
                    <div>
                      <img src={imageUrl} alt={row} />
                    </div>
                  );
                })}
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
            style={{
              backgroundColor: "red",
              borderWidth: 1,
              borderColor: "red",
            }}>
            <PopupAlert popUpText={popUpText} />
          </div>
        </div>
      ) : (
        ""
      )}
      <DataGrid
        className="datagrid"
        rows={books}
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

export default DatatableBooks;
