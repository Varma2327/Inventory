router.delete('/', async (req, res) => {
  try {
    await Item.deleteMany({});
    res.status(200).json({ message: 'All items cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
