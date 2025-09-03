

import {
  BlobServiceClient,
  ContainerClient,
  RestError,
} from "@azure/storage-blob";
import { AZURE_STORAGE_CONNECTION_STRING, CONTAINER_NAME } from "../config";

class AzureBlobService {
  private static blobServiceClient: BlobServiceClient;
  private static containerClient: ContainerClient | undefined;

 
  static initialize() {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error("Azure Storage connection string is not defined.");
    }

    try {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );
    } catch (error) {
      console.error("Error creating BlobServiceClient:",error);
      throw new Error("Invalid Azure Storage connection string.");
    }
  }

 
  private static async ensureContainerExists(): Promise<void> {
    if (!this.containerClient) {
      if (!CONTAINER_NAME) {
        throw new Error("Container name is not defined.");
      }

      this.containerClient = this.blobServiceClient.getContainerClient(
        CONTAINER_NAME
      );

      try {
        await this.containerClient.getProperties();
      } catch (error) {
        if (error instanceof RestError && error.statusCode === 404) {
          await this.containerClient.create();
          console.log(`Container '${CONTAINER_NAME}' created successfully.`);
        } else {
          console.error("Error ensuring container exists:",error);
          throw error;
        }
      }
    }
  }

  
  static async uploadFile(buffer: Buffer, fileName: string): Promise<void> {
    await this.ensureContainerExists();
    const blockBlobClient = this.containerClient!.getBlockBlobClient(fileName);

    console.log(`Uploading to Azure storage as blob:\n\t${fileName}`);

    try {
      const uploadBlobResponse = await blockBlobClient.uploadData(buffer);
      console.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
      );
    } catch (error) {
      console.error("Error uploading blob:", error);
      throw error;
    }
  }


  static async getBlobUrl(fileName: string): Promise<string> {
    await this.ensureContainerExists();
    const blockBlobClient = this.containerClient!.getBlockBlobClient(fileName);

    try {
      const exists = await blockBlobClient.exists();
      if (!exists) {
        throw new Error(`Blob '${fileName}' does not exist.`);
      }
      return blockBlobClient.url;
    } catch (error) {
      console.error("Error getting blob URL:", error);
      throw error;
    }
  }
}

AzureBlobService.initialize(); 

export default AzureBlobService;
