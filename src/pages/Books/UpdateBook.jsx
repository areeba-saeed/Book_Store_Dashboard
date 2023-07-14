import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PopupAlert from "../../components/popupalert/popupAlert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdateBook = ({ title }) => {
  const location = useLocation();
  const data = location.state.data;
  const [name, setName] = useState(data.name);
  const [category, setCategory] = useState(data.category._id);
  const [description, setDescription] = useState(data.description);
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState(data.author._id);
  const [price, setPrice] = useState(data.price);
  const [allCategories, setAllCategories] = useState([]);
  const [popUpShow, setPopupshow] = useState(false);
  const [popUpText, setPopupText] = useState("");
  const [allAuthors, setAllAuthors] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/categories")
      .then((response) => {
        setAllCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("https://bookeriaapi-4c4e83f96829.herokuapp.com/api/authors")
      .then((response) => {
        setAllAuthors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("author", author);

    axios
      .patch(`https://bookeriaapi-4c4e83f96829.herokuapp.com/api/books/${id}`, formData)
      .then((res) => {
        console.log(res.data);
        setPopupshow(true);
        setPopupText("Book Updated");
        setTimeout(() => {
          setPopupshow(false);
          navigate("/books");
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top-new">
          <h1 className="heading-top">{title}</h1>
        </div>
        {popUpShow ? (
          <div className="Popupmodal">
            <div
              className="popupInner"
              style={{
                backgroundColor: "#8AFF8A",
                borderWidth: 1,
                borderColor: "#007500",
              }}>
              <PopupAlert popUpText={popUpText} />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="bottom">
          <div className="right">
            <form className="form-new" onSubmit={handleUpdate}>
              <div className="formInput">
                <label className="label-form">Book Name</label>
                <input
                  type="text"
                  className="input-form"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="label-form">Book Price</label>
                <input
                  type="number"
                  className="input-form"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <label className="label-form">Book Author</label>
                <select
                  className="input-form"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                  }}>
                  <option value="">Choose a author</option>
                  {allAuthors.map((data) => {
                    return (
                      <option value={data._id} key={data._id}>
                        {data.name}
                      </option>
                    );
                  })}
                </select>
                <label className="label-form">Book Category</label>
                <select
                  className="input-form"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}>
                  {allCategories.map((data) => {
                    return (
                      <option value={data._id} key={data._id}>
                        {data.name}
                      </option>
                    );
                  })}
                </select>
                <label className="label-form">Book Description</label>
                <ReactQuill
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
                <label className="label-form">Book Image</label>
                <input
                  type="file"
                  className="category-image"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
                <button className="createButton">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
