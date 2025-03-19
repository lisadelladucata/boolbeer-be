const generateSlug = (name) => {
  return name
    .replace(/'/g, "")
    .normalize("NFD") // elimina gli accenti
    .replace(/[\u0300-\u036f]/g, "") // elimina segni diacritici
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

module.exports = generateSlug;
