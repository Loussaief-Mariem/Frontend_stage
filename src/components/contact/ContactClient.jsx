import React, { useState } from "react";
import { addContact } from "../../services/contactService";
import "./Contact.css";

const ContactClient = () => {
  const [formData, setFormData] = useState({
    email: "",
    sujet: "service client",
    message: "",
    clientId: "", // Vous devrez peut-être récupérer cela depuis l'authentification
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail est invalide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addContact(formData);
      setSubmitStatus("success");
      setFormData({
        email: "",
        sujet: "service client",
        message: "",
        clientId: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
      </div>

      <div className="contact-content">
        <div className="company-info">
          <h2>Nawara</h2>
          <p> Sfax, Route Gremda Km 10</p>

          <p>+216 44 123 432</p>
          <p> contact@nawara.tn</p>
        </div>

        <div className="contact-form-container">
          <h2>Contactez-nous</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="sujet">Sujet</label>
              <select
                id="sujet"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
              >
                <option value="service client">Service client</option>
                <option value="webmaster">Webmaster</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? "error" : ""}
                placeholder="Votre message..."
              ></textarea>
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </button>

            {submitStatus === "success" && (
              <div className="success-message">
                Votre message a été envoyé avec succès!
              </div>
            )}

            {submitStatus === "error" && (
              <div className="error-message">
                Une erreur s'est produite lors de l'envoi. Veuillez réessayer.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
