import { config } from "../config";

import { Request, Response } from "express";

async function getFileInfo(fileId: string) {
  const url = `${config.baseUrl}/files/${fileId}?key=${config.googleApiKey}&supportsAllDrives=true&includeItemsFromAllDrives=true&fields=id,name,size,webContentLink,mimeType`;
  const response = await fetch(url);
  return response.json();
}

async function listFolderContents(folderId: string) {
  const url = `${config.baseUrl}/files?q='${folderId}'+in+parents&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=1000&orderBy=name&fields=files(id,name,size,webContentLink,mimeType)&key=${config.googleApiKey}`;
  const response = await fetch(url);
  return response.json();
}

export const driveController = {
  async extractContent(req: Request, res: Response) {
    const mimeId: string = req.query.mimeId as string;

    if (!mimeId) {
      res.json({ success: false, code: 400, message: "Mime ID is required" });
    }

    try {
      const itemInfo = await getFileInfo(mimeId);

      if (itemInfo.mimeType !== "application/vnd.google-apps.folder") {
        res.json({ success: true, status: 200, data: itemInfo });
      }

      const contents = await listFolderContents(mimeId);
      const items = contents.files || [];

      const processedItems = await Promise.all(
        items.map(async (item: any) => {
          if (item.mimeType === "application/vnd.google-apps.folder") {
            const subfolderContents = await listFolderContents(item.id);
            return {
              type: "folder",
              info: item,
              contents: subfolderContents.files || [],
            };
          }
          return {
            type: "file",
            info: item,
          };
        })
      );

      res.json({
        success: true,
        status: 200,
        info: itemInfo,
        data: processedItems,
      });
    } catch (error) {
      console.error("Error extracting content:", error);
      throw error;
    }
  },
};
