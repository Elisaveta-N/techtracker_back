const { employee } = require("../lib/prisma");
const {
  getAssets,
  getAsset,
  createAsset,
  patchAsset,
  deleteAsset,
} = require("../repo/asset");
const { findUser } = require("../repo/user");
const { getEmployees, getEmployee } = require("../repo/employee");

const getAssetById = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }
  const dbRes = await getAsset({ where: { id } });
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
  const dbRes = await getAssets({ where: { employeeId: id } });
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
    where: { departmentId: id },
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
  if (asset === null) {
    return res.status(400).json({ message: `Assets not specified` });
  }

  let dbRes = await getAssets({
    where: { assetInvenrotyNumber: asset.assetInvenrotyNumber },
  });
  if (dbRes.data.length !== 0) {
    return res
      .status(409)
      .json({ message: `Asset should have unique inventory number` });
  }

  dbRes = await createAsset(asset);
  return res.status(dbRes.code).json(dbRes.data);
};

const changeAsset = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }

  let dbRes = await getAsset({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Asset ID ${id} not found` });
  }

  let asset = req.body.asset;
  if (asset === null) {
    return res.status(400).json({ message: `Assets not specified` });
  }

  asset.id = id;
  dbRes = await patchAsset(asset);
  return res.status(dbRes.code).json(dbRes.data);
};

const getAllAssetsDto = async function (req, res) {
  let dbAssets = null;

  if (req.roles === "ADMIN") {
    dbAssets = await getAssets({
      include: {
        employee: true,
      },
    });
  } else {
    const dbUser = await findUser({
      where: { username: req.user },
      include: { employee: true },
    });
    if (dbUser === null) {
      return res
        .status(400)
        .json({ message: `User name: ${req.user} not found` });
    }

    if (req.roles === "MANAGER") {
      dbAssets = await getAssets({
        include: {
          employee: true,
        },
        where: {
          employee: {
            departmentId: dbUser.employee.departmentId,
          },
        },
      });
    } else {
      dbAssets = await getAssets({
        include: {
          employee: true,
        },
        where: {
          employee: {
            id: dbUser.employee.id,
          },
        },
      });
    }
  }

  if (dbAssets === null) {
    return res.status(500).json({ message: `Assets not found` });
  }

  const dto = dbAssets.data.map((a) => {
    let ret = {
      id: a.id.toString(),
      assetModel: a.assetModel,
      assetType: a.assetType,
      assetSN: a.assetSN,
      assetStatus: a.assetStatus,
      assetInventoryNumber: a.assetInvenrotyNumber,
    };
    if (a.employee) {
      ret["employee"] = `${a.employee.firstName} ${a.employee.lastName}`;
      ret["employeeId"] = a.employee.id.toString();
      ret["departmentId"] = a.employee.departmentId.toString();
    }
    return ret;
  });

  return res.status(dbAssets.code).json(dto);
};

const getAssetByIdDto = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }
  const dbRes = await getAsset({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Asset ID ${id} not found` });
  }

  let dto = {
    id: dbRes.data.id.toString(),
    assetModel: dbRes.data.assetModel,
    assetType: dbRes.data.assetType,
    assetSN: dbRes.data.assetSN,
    assetStatus: dbRes.data.assetStatus,
    assetInventoryNumber: dbRes.data.assetInvenrotyNumber,
  };
  if (dbRes.data.employee) {
    dto[
      "employee"
    ] = `${dbRes.data.employee.firstName} ${dbRes.data.employee.lastName}`;
    dto["employeeId"] = dbRes.data.employee.id.toString();
    dto["departmentId"] = dbRes.data.employee.departmentId.toString();
  }

  return res.status(dbRes.code).json(dto);
};

const postAssetDto = async function (req, res) {
  const asset = req.body.asset;
  if (asset === null) {
    return res.status(400).json({ message: `Assets not specified` });
  }

  let dbRes = await getAssets({
    where: { assetInvenrotyNumber: asset.assetInvenrotyNumber },
  });
  if (dbRes.data.length !== 0) {
    return res
      .status(409)
      .json({ message: `Asset should have unique inventory number` });
  }

  if (!asset.employeeId) {
    delete asset.employeeId;
  } else {
    asset.employeeId = parseInt(asset.employeeId);
  }

  dbRes = await createAsset(asset);
  if (dbRes.code === 201) {
    let dto = {
      id: dbRes.data.id.toString(),
      assetModel: dbRes.data.assetModel,
      assetType: dbRes.data.assetType,
      assetSN: dbRes.data.assetSN,
      assetStatus: dbRes.data.assetStatus,
      assetInventoryNumber: dbRes.data.assetInvenrotyNumber,
    };
    if (dbRes.data.employeeId) {
      const dbRes2 = await getAsset({
        where: { id: dbRes.data.id },
        include: { employee: true },
      });
      dto[
        "employee"
      ] = `${dbRes2.data.employee.firstName} ${dbRes2.data.employee.lastName}`;
      dto["employeeId"] = dbRes2.data.employee.id.toString();
      dto["departmentId"] = dbRes2.data.employee.departmentId.toString();
    }
    return res.status(dbRes.code).json(dto);
  }

  return res.status(dbRes.code).json(dbRes.data);
};

const removeAsset = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }

  const dbRes = await deleteAsset(id);
  return res.status(dbRes.code).json(dbRes.data);
};

const changeAssetDto = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Asset id should be a number" });
  }

  let dbRes = await getAsset({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Asset ID ${id} not found` });
  }

  if (req.body.asset === null) {
    return res.status(400).json({ message: `Assets not specified` });
  }

  let dto = {};
  dto.id = id;
  dto.assetModel = req.body.asset.assetModel;
  dto.assetType = req.body.asset.assetType;
  dto.assetStatus = req.body.asset.assetStatus;
  dto.assetInvenrotyNumber = req.body.asset.assetInventoryNumber;
  if (req.body.asset.employeeId) {
    dto.employeeId = parseInt(req.body.asset.employeeId);
  } else {
    dto.employeeId = null;
  }
  if (req.body.asset.assetSN) {
    dto.assetSN = req.body.asset.assetSN;
  }

  dbRes = await patchAsset(dto);

  if (dbRes.code.status === 200) {
    let dto = {
      id: dbRes.data.id.toString(),
      assetModel: dbRes.data.assetModel,
      assetType: dbRes.data.assetType,
      assetSN: dbRes.data.assetSN,
      assetStatus: dbRes.data.assetStatus,
      assetInventoryNumber: dbRes.data.assetInvenrotyNumber,
    };
    if (dbRes.data.employeeId) {
      const dbRes2 = await getAsset({
        where: { id: dbRes.data.id },
        include: { employee: true },
      });
      dto[
        "employee"
      ] = `${dbRes2.data.employee.firstName} ${dbRes2.data.employee.lastName}`;
      dto["employeeId"] = dbRes2.data.employee.id.toString();
      dto["departmentId"] = dbRes2.data.employee.departmentId.toString();
    }
    return res.status(dbRes.code).json(dto);
  }

  return res.status(dbRes.code).json(dbRes.data);
};

module.exports = {
  postAssetDto,
  getAssetByIdDto,
  getAllAssetsDto,
  getAssetById,
  getAssetByEmployeeId,
  getAllAssets,
  getAssetByDepartmentId,
  postAsset,
  changeAsset,
  removeAsset,
  changeAssetDto,
};
