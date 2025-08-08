import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient()

// createBiodata function to handle Biodata creation
export async function createBiodata(request, response) {
  const body = request.body;

  //validate Biodata input, for example, check if email is provided, email is not empty, etc.
  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  if (!body.nim || body.nim.trim() === "") {
    return response.status(400).json({ error: "NIM is required" });
  }

  if (!body.tanggal_lahir || body.tanggal_lahir.trim() === "") {
    return response
      .status(400)
      .json({ error: "Tanggal lahir cannot be empty" });
  }

  if (!body.alamat || body.alamat.trim() === "") {
    return response.status(400).json({ error: "Alamat cannot be empty" });
  }

  if (!body.sudah_menikah || body.sudah_menikah.trim() === "") {
    return response.status(400).json({ error: "Status cannot be empty" });
  }

  let status = body.sudah_menikah;

  if (body.sudah_menikah === "true") {
    status = "Sudah";
  } else if (body.sudah_menikah === "false") {
    status = "Belum";
  }

  try {
    //create a new Biodata in the database
    const biodataData = {
      name: body.name,
      nim: body.nim,
      tanggal_lahir: new Date(body.tanggal_lahir),
      alamat: body.alamat,
      sudah_menikah: status,
      userId: request.user.userId
    };

    // Create the Biodata in the database using Prisma
    const biodata = await prisma.biodata.create({
      data: biodataData,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export async function getBiodatas(request, response) {
  try {
    // Create the Biodata in the database using Prisma
    const biodata = await prisma.biodata.findMany();

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating biodata:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export async function getBiodataByNim(request, response) {
  const nim = request.params.nim;

  try {
    // Create the Biodata in the database using Prisma
    const where = {
      nim: nim,
    };

    const biodata = await prisma.biodata.findUnique({
      where: where,
    });

        console.log(request.user.userId + " !=== " + biodata.userId) ;

    if(biodata.userId !== request.user.userId){
      return response.status(500).json({ error: "Unknown authorize" });
    }

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteBiodata(request, response) {
  const nim = request.params.nim;

  try {
    // Create the Biodata in the database using Prisma
    const where = {
     nim: nim,
    };

     const biodataUserId = await prisma.biodata.findUnique({
      where: where
    });

    if(biodataUserId.userId !== request.user.userId){
      return response.status(500).json({ error: "Unknown authorize" });
    }

    const biodata = await prisma.biodata.delete({
      where: where,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export async function updateBiodata(request, response) {
  const nim = request.params.nim;
  const body = request.body;

  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  // if (!body.nim || body.nim.trim() === "") {
  //   return response.status(400).json({ error: "NIM is required" });
  // }

  if (!body.tanggal_lahir || body.tanggal_lahir.trim() === "") {
    return response
      .status(400)
      .json({ error: "Tanggal lahir cannot be empty" });
  }

  if (!body.alamat || body.alamat.trim() === "") {
    return response.status(400).json({ error: "Alamat cannot be empty" });
  }

  if (!body.sudah_menikah || body.sudah_menikah.trim() === "") {
    return response.status(400).json({ error: "Status cannot be empty" });
  }

  let status = body.sudah_menikah;

  if (body.sudah_menikah === "true") {
    status = "Sudah";
  } else if (body.sudah_menikah === "false") {
    status = "Belum";
  }

  try {
    const where = {
      nim: nim,
    };
    //create a new Biodata in the database
    const biodataData = {
      name: body.name,
      nim: body.nim,
      tanggal_lahir: new Date(body.tanggal_lahir),
      alamat: body.alamat,
      sudah_menikah: status,
      userId: request.user.userId
    };

    const biodataUserId = await prisma.biodata.findUnique({
      where: where
    });

    if(biodataUserId.userId !== request.user.userId){
      return response.status(500).json({ error: "Unknown authorize" });
    }

    // Create the Biodata in the database using Prisma
    const biodata = await prisma.biodata.update({
      where: where,
      data: biodataData,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}