"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/checkbox";
import { SortableHeader } from "@components/SortableHeader";
import ProjectTextOrdering from "@ui/data-table/project-text-ordering";
import ProjectDesignBadge from "@ui/data-table/project-design-badge";
import ValidasiActions from "./ValidasiActions"; // Kita akan buat komponen aksi khusus ini

// Sesuaikan interface dengan data dari API pendaftaran
export type Pendaftar = {
  id_pendaftaran: number;
  nama_lengkap: string;
  nim: string;
  program_studi: string;
  status_pendaftaran: string;
};

export const columns: ColumnDef<Pendaftar>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-foreground shadow-lg border red-500 data-[state=checked]:border-0 data-[state=checked]:bg-green-500"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-foreground shadow-lg border data-[state=checked]:border-0 data-[state=checked]:bg-green-500"
      >
        {row.getIsSelected() && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 m-auto w-4 h-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Checkbox>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column} title="No" />,
    cell: ({ row }) => <ProjectTextOrdering name={`${row.index + 1}`} width="10" />,
    enableSorting: false,
  },
  {
    accessorKey: "nama_lengkap",
    header: ({ column }) => <SortableHeader column={column} title="Nama Lengkap" />,
    cell: ({ row }) => <ProjectTextOrdering name={row.getValue("nama_lengkap")} width="20" />,
    enableSorting: true,
  },
  {
    accessorKey: "nim",
    header: ({ column }) => <SortableHeader column={column} title="NIM" />,
    cell: ({ row }) => <ProjectTextOrdering name={row.getValue("nim")} width="20" />,
    enableSorting: true,
  },
  {
    accessorKey: "program_studi",
    header: ({ column }) => <SortableHeader column={column} title="Program Studi" />,
    cell: ({ row }) => <ProjectTextOrdering name={row.getValue("program_studi")} width="20" />,
    enableSorting: true,
  },
  {
    accessorKey: "status_pendaftaran",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => <ProjectDesignBadge name={row.getValue("status_pendaftaran")} width="30" />,
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "Aksi",
    // Menggunakan komponen aksi khusus untuk Terima/Tolak
    cell: ({ row }) => <ValidasiActions row={row} />, 
  },
];