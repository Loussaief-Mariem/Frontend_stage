import api from "./api";

export const sendFactureEmail = async (commandeId) => {
  const response = await api.post(`/email/send-facture/${commandeId}`);
  return response.data;
};
