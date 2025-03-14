exports.addToCart = (req, res) => {
  const { id, name, price, quantity } = req.body;

  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex >= 0) {
    cart[itemIndex].quantity += quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }

  res.json({ cart });
};

exports.removeFromCart = (req, res) => {
  const { id } = req.params;

  cart = cart.filter((item) => item.id !== id);

  res.json({ success: true, cart });
};

exports.getCart = (req, res) => {
  res.json({ cart });
};
