import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function EditCategorie({ show, handleClose, cat, handleSave }) {
  const [categorie, setCategorie] = useState(cat || {});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setCategorie(cat || {});
  }, [cat]);

  const handleChange = (e) => {
    setCategorie({ ...categorie, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔹 Si un fichier est uploadé avec FilePond
    if (files.length > 0) {
      const uploadedImage = URL.createObjectURL(files[0].file);
      handleSave({ ...categorie, image: uploadedImage });
    } else {
      handleSave(categorie);
    }
  };

  return (
    <div className="form-container">
      <Modal show={show} onHide={handleClose} centered>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier Catégorie</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                value={categorie.nom || ""}
                onChange={handleChange}
                className="form-control"
                placeholder="Nom de la catégorie"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={categorie.description || ""}
                onChange={handleChange}
                className="form-control"
                placeholder="Description"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="famille">Famille</label>
              <select
                id="famille"
                value={categorie.famille || ""}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="visage">Visage</option>
                <option value="cheveux">Cheveux</option>
                <option value="huile végétale">Huile végétale</option>
                <option value="homme">Homme</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Image</label>
              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                name="file"
                labelIdle='Glissez & Déposez votre image ou <span class="filepond--label-action"> Parcourir </span>'
              />
              {categorie.image && (
                <div className="mt-2">
                  <img
                    src={categorie.image}
                    alt="Preview"
                    style={{ width: "80px", borderRadius: "5px" }}
                  />
                </div>
              )}
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
              Enregistrer
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default EditCategorie;
