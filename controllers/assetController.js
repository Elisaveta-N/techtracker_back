const { getAssets, getAsset, createAsset, patchAsset } = require("../repo/asset");
const {getEmployees, getEmployee} = require('../repo/employee')

const getAssetById = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }
  const dbRes = await getAsset({where: { id }});
  if (dbRes === null) {
    return res.status(400).json({ message: `Asset ID ${id} not found` });
  }
  return res.status(dbRes.code).json(dbRes.data);
};

const getAssetByEmployeeId = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Employee id should be a number" });
  }
  const dbRes = await getAssets({where: { employeeId: id }});
  if (dbRes === null) {
    return res
      .status(400)
      .json({ message: `Assets for employee ID ${id} not found` });
  }
  return res.status(dbRes.code).json(dbRes.data);
};

const getAssetByDepartmentId = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Department id should be a number" });
  }
  const dbRes = await getEmployees({
    where: { departmentId: 1 },
    include: {
      asset: true, // Include the assets related to this user
    },
  });
  if (dbRes === null) {
    return res
      .status(400)
      .json({ message: `Assets for Department ID ${id} not found` });
  }
  return res.status(dbRes.code).json(dbRes.data);
};

const getAllAssets = async function (req, res) {
  const dbRes = await getAssets({});
  if (dbRes === null) {
    return res.status(500).json({ message: `Assets not found` });
  }
  return res.status(dbRes.code).json(dbRes.data);
};

const postAsset = async function (req, res) {
  const asset = req.body.asset;
  if(asset === null) {
    return res.status(400).json({ message: `Assets not specified` });
  }

  let dbRes = await getAssets({where: { assetInvenrotyNumber: asset.assetInvenrotyNumber }});
  if(dbRes.data.length !== 0) {
    return res.status(409).json({ message: `Asset should have unique inventory number` });
  }

  dbRes = await createAsset(asset);
  return res.status(dbRes.code).json(dbRes.data);
};

const changeAsset = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }

  let dbRes = await getAsset({where: { id }});
  if (dbRes === null) {
    return res.status(400).json({ message: `Asset ID ${id} not found` });
  }

  let asset = req.body.asset;
  if(asset === null) {
    return res.status(400).json({ message: `Assets not specified` });
  }

  asset.id = id
  dbRes = await patchAsset(asset);
  return res.status(dbRes.code).json(dbRes.data);
};

module.exports = { getAssetById, getAssetByEmployeeId, getAllAssets, getAssetByDepartmentId, postAsset, changeAsset};
