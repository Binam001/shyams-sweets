import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    handlePreview: (url: string) => void;
    handleDelete?: (id: string) => void;
  }
}
