/*
  Warnings:

  - You are about to drop the `_TaskLabels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaskLabels" DROP CONSTRAINT "_TaskLabels_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskLabels" DROP CONSTRAINT "_TaskLabels_B_fkey";

-- DropTable
DROP TABLE "_TaskLabels";

-- CreateTable
CREATE TABLE "task_labels" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "label_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "task_labels_task_id_label_id_key" ON "task_labels"("task_id", "label_id");

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
