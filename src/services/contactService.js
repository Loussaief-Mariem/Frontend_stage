import api from "./api";

export const getContactsToday = async () => {
  const res = await api.get("/contacts/today");

  // Si l’API renvoie un tableau simple, on l’adapte
  const contactsArray = Array.isArray(res.data)
    ? res.data
    : res.data.list || [];

  return {
    count: contactsArray.length,
    list: contactsArray,
  };
};

// Ajouter une contact
export const addContact = async (contact) => {
  const res = await api.post("/contacts", contact);
  return res.data;
};
// modifier une contact
export const updateContact = async (id, contact) => {
  const res = await api.put(`/contacts/${id}`, contact);
  return res.data;
};
// supprimer une contact
export const deleteContact = async (id) => {
  const res = await api.delete(`/contacts/${id}`);
  return res.data;
};
// Récupérer une contact par ID

export const getContactById = async (id) => {
  const res = await api.get(`/contacts/${id}`);
  return res.data;
};
// Récupérer tous les contacts
export const getAllContacts = async () => {
  const res = await api.get("/contacts");
  return res.data;
};
// Récupérer les contacts par pagination
export const getContactsPagines = async (page = 1, limit = 4) => {
  const res = await api.get(`/contacts/pagines?page=${page}&limit=${limit}`);
  return res.data;
};
