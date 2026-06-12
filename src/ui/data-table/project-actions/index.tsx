"use client";

import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { ProjectActionsProps } from "@interfaces/interface-items";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Disarankan menggunakan router
import ModalDelete from "@ui/data/modal-delete";
import { deleteItem } from "@constant/condition/general";
import { useQueryClient } from "./hook";

export function ProjectActions<TData>({ row, path }: ProjectActionsProps<TData>) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter(); // Gunakan router untuk navigasi
  
  const id = row.getValue("id");
  const generatedEditUrl = `/${path}/edit/${id}`;
  const { isLoading, deleteQuery } = useQueryClient();

  const handleDelete = async () => {
    const itemData = row.original as any;
    const itemId = itemData?.id || row.getValue("id");

    if (!itemId) {
      console.error("DEBUG: ID not found in row data", { original: row.original, value: row.getValue("id") });
      return;
    }

    console.log(`DEBUG: Attempting to delete item with ID: ${itemId} from path: ${path}`);

    try {
      await deleteQuery(String(itemId), path, () => {
        setDeleteModalOpen(false);
        router.refresh(); 
      });
    } catch (error) {
      console.error("DEBUG: Exception in handleDelete:", error);
    }
  };

  
  const titleName = deleteItem.find(item => item.key === path) || deleteItem.find(item => item.key === 'not-found');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <Link href={generatedEditUrl}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4 text-green-500" /> Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setDeleteModalOpen(true)} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalDelete
        isOpen={isDeleteModalOpen}
        isLoading={isLoading}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        titleName={titleName?.label}
      />
    </>
  );
}