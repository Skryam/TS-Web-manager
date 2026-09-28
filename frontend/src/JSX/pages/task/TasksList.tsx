import { useState, useCallback, SetStateAction } from 'react';

import {
  TaskFilterInput,
} from '../../../graphql/queries';
import { TaskFilters } from './TaskFilters';
import TasksTable from './TaskTable';

export default function TasksList() {
  const [activeFilters, setActiveFilters] = useState<TaskFilterInput>({});

  const onApply = useCallback((data: SetStateAction<TaskFilterInput>) => {
    setActiveFilters(data)
  }, [])

  return (
    <div>
      <TaskFilters onApply={onApply} />
      <TasksTable activeFilters={activeFilters} />
    </div>
  )
}
