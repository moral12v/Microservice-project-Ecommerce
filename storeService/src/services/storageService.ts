import {
  BlobServiceClient,
  ContainerClient,
  RestError,
} from "@azure/storage-blob";
import { AZURE_STORAGE_CONNECTION_STRING, CONTAINER_NAME } from "../config";

class AzureBlobService {
  static uploadFile(buffer: Buffer, fileName: string) {
    throw new Error('Method not implemented.');
  }
  private static blobServiceClient = BlobServiceClient.fromConnectionString(
   "https://ctbstorage.blob.core.windows.net/;QueueEndpoint=https://ctbstorage.queue.core.windows.net/;FileEndpoint=https://ctbstorage.file.core.windows.net/;TableEndpoint=https://ctbstorage.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-01-01T15:11:10Z&st=2024-07-17T07:11:10Z&spr=https,http&sig=tVzM3eZX9LAwjGavTHJRmv0g5%2BNAbBRi9taNdUMvBY8%3D"
  );
  private static containerClient: ContainerClient | undefined;

  private static async ensureContainerExists(): Promise<void> {
    if (!this.containerClient) {
      this.containerClient =
        this.blobServiceClient.getContainerClient(CONTAINER_NAME);

      try {
        await this.containerClient.getProperties();
      } catch (error) {
        if (error instanceof RestError && error.statusCode === 404) {
          await this.containerClient.create();
          console.log(`Container '${CONTAINER_NAME}' created successfully.`);
        } else {
          throw error;
        }
      }
    }
  }

  async uploadFile(buffer: Buffer, fileName: string): Promise<void> {
    await AzureBlobService.ensureContainerExists();
    const blockBlobClient =
      AzureBlobService.containerClient!.getBlockBlobClient(fileName);

    console.log(`Uploading to Azure storage as blob:\n\t${fileName}`);

    const uploadBlobResponse = await blockBlobClient.uploadData(buffer);
    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
  }


  // https://ctbstorage.blob.core.windows.net/dev/1721220324576_1721142271506.png
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

export default AzureBlobService;
