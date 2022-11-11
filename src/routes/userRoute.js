const express = require("express");

const upload = require("../middlewares/upload");
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/userControllers");

const router = express.Router();

router.get("/orders", authenticate, userController.getUserOrder);
router.get("/:id", userController.getUserProduct);
router.patch("/orders/:id", authenticate, userController.updateOrderDelivery);
router.patch(
  "/",
  upload.single("profileImage"),
  authenticate,
  userController.updateUser
);

module.exports = router;
