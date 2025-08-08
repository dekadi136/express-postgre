import exp from "express";
import { authenticationTokenMiddleware } from "../controller/authenticationToken.js";
import { createBiodata,getBiodataByNim, getBiodatas, deleteBiodata, updateBiodata } from "../controller/biodata.js";

const router = exp.Router();


// Route to create a new biodata
router.post("/biodatas", authenticationTokenMiddleware, createBiodata);
router.get("/biodatas", authenticationTokenMiddleware, getBiodatas);
router.get("/biodatas/:nim", authenticationTokenMiddleware, getBiodataByNim);
router.delete("/biodatas/:nim", authenticationTokenMiddleware, deleteBiodata);
router.put("/biodatas/:nim", authenticationTokenMiddleware, updateBiodata);

export default router;