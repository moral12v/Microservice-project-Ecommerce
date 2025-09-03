import fs from "fs-extra";
import path from "path";
import { POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from "../config";

const prismaFolder = path.resolve(__dirname, "../prisma");
const modelsFolder = path.resolve(prismaFolder, "models");
const outputFile = path.resolve(prismaFolder, "schema.prisma");


const generateSchema = async () => {
  try {
    if (!fs.existsSync(modelsFolder)) {
      throw new Error(`Models folder does not exist: ${modelsFolder}`);
    }

    const modelFiles = await fs.readdir(modelsFolder);
    const modelSchemas = await Promise.all(
      modelFiles.map((file) =>
        fs.readFile(path.join(modelsFolder, file), "utf-8")
      )
    );

    const dbUrl = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?schema=public`;

    const schemaContent = `
      generator client {
        provider = "prisma-client-js"
      }

      datasource db {
        provider = "postgresql"
        url      = "${dbUrl}"
      }

      ${modelSchemas.join("\n")}
    `;
    console.log("Generated schema content:\n", schemaContent);
    await fs.writeFile(outputFile, schemaContent);
    console.log("Prisma schema generated successfully.");
  } catch (err) {
    console.error("Error generating Prisma schema:", err);
  }
};

generateSchema();
