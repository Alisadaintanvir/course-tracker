"use client";

import { X } from "lucide-react";
import { CompletionRecord } from "@/app/types/course";

interface CompletionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  completionHistory: CompletionRecord[];
}

export default function CompletionHistoryModal({
  isOpen,
  onClose,
  courseTitle,
  completionHistory,
}: CompletionHistoryModalProps) {
  if (!isOpen) return null;

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Completion History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {courseTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {completionHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No completion records yet
            </p>
          ) : (
            <div className="space-y-4">
              {completionHistory
                .sort((a, b) => {
                  const dateA =
                    a.completedAt instanceof Date
                      ? a.completedAt
                      : new Date(a.completedAt);
                  const dateB =
                    b.completedAt instanceof Date
                      ? b.completedAt
                      : new Date(b.completedAt);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((record, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {record.moduleName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {record.sectionName}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(record.completedAt)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
