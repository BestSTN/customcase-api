const express = require("express");

const upload = require("../middlewares/upload");
const productController = require("../controllers/productControllers");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", productController.getAllProduct);
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.createProduct
);
router.patch(
  "/:id",
  authenticate,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.updateProduct
);
router.delete("/:id", authenticate, productController.deleteProduct);

module.exports = router;
