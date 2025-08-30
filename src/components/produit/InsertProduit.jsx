import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { getAllCategories } from "../../services/categorieService";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function InsertProduit({ show, handleClose, handleSave }) {
  const [produit, setProduit] = useState({
    nom: "",
    description: "",
    prix: "",
    stock: "",
    volume: "",
    seuilAlertStock: "",
    TVA: 19,
    categorieId: "",
    image: "",
  });
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await getAllCategories();
    setCategories(cats);
  };

  const handleChange = (e) => {
    setProduit({ ...produit, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let prodToSave = { ...produit };
    if (files.length > 0) {
      const uploadedImage = URL.createObjectURL(files[0].file);
      prodToSave.image = uploadedImage;
    }
    handleSave(prodToSave);
    // reset
    setProduit({
      nom: "",
      description: "",
      prix: "",
      stock: "",
      volume: "",
      seuilAlertStock: "",
      TVA: 19,
      categorieId: "",
      image: "",
    });
    setFiles([]);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter Produit</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Nom */}
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              value={produit.nom}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group mt-3">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={produit.description}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Prix */}
          <div className="form-group mt-3">
            <label htmlFor="prix">Prix (TND)</label>
            <input
              type="number"
              id="prix"
              value={produit.prix}
              onChange={handleChange}
              className="form-control"
              step="0.01"
              required
            />
          </div>

          {/* Stock */}
          <div className="form-group mt-3">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              value={produit.stock}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Volume */}
          <div className="form-group mt-3">
            <label htmlFor="volume">Volume</label>
            <input
              type="text"
              id="volume"
              value={produit.volume}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Seuil alerte */}
          <div className="form-group mt-3">
            <label htmlFor="seuilAlertStock">Seuil d’alerte stock</label>
            <input
              type="number"
              id="seuilAlertStock"
              value={produit.seuilAlertStock}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* TVA */}
          <div className="form-group mt-3">
            <label htmlFor="TVA">TVA (%)</label>
            <input
              type="number"
              id="TVA"
              value={produit.TVA}
              onChange={handleChange}
              className="form-control"
              min="0"
              step="1"
            />
          </div>

          {/* Catégorie */}
          <div className="form-group mt-3">
            <label htmlFor="categorieId">Catégorie</label>
            <select
              id="categorieId"
              value={produit.categorieId}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">-- Sélectionner --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div className="form-group mt-3">
            <label>Image</label>
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              name="file"
              labelIdle='Glissez & Déposez ou <span class="filepond--label-action"> Parcourir </span>'
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Ajouter
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default InsertProduit;
