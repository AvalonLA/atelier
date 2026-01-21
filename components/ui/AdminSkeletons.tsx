import React from "react";

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-neutral-800">
      <td className="px-6 py-4">
        <div className="h-10 w-10 bg-neutral-800 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-neutral-800 rounded w-32 mb-2"></div>
        <div className="h-3 bg-neutral-800 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="h-4 bg-neutral-800 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="h-4 bg-neutral-800 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-8 w-8 bg-neutral-800 rounded ml-auto"></div>
      </td>
    </tr>
  );
};
