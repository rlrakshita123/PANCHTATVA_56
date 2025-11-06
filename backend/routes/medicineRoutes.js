import express from "express";
import { handleSearch } from "../controllers/medicineController.js";

const router = express.Router();

router.post("/search", handleSearch);

export default router;
