export type DocumentSummary = {
  id: string;
  title: string;
  updatedAt: number;
};

export type SavedDocument = DocumentSummary & {
  content: string;
};

export type DocumentPatch = {
  title?: string;
  content?: string;
};
