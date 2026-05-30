import * as XLSX from 'xlsx'

export function exportTasksToExcel(tasks, subTasks, members, labels) {
  const taskRows = tasks.map(t => ({
    'ID': t.id,
    'Title': t.title,
    'Stage': t.stage,
    'Priority': t.priority,
    'Assignee': t.assignee || '',
    'Start Date': t.startDate || '',
    'Due Date': t.dueDate || '',
    'Labels': (t.labelIds || []).map(id => labels.find(l => l.id === id)?.name || id).join(', '),
    'Key Task': t.isKeyTask ? 'Yes' : 'No',
    'Description': t.desc || '',
  }))

  const subTaskRows = subTasks.map(s => {
    const task = tasks.find(t => t.id === s.taskId || String(t.id) === String(s.taskId))
    return {
      'Task': task?.title || s.taskId,
      'SubTask': s.title,
      'Done': s.done ? 'Yes' : 'No',
      'Assignee': s.assignee || '',
      'Due Date': s.dueDate || '',
    }
  })

  const memberRows = members.map(m => ({
    'Name': m.name,
    'Email': m.email,
    'Role': m.role,
    'Job Title': m.jobTitle || '',
    'Responsibilities': m.responsibilities || '',
    'Work Style': m.workStyle || '',
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(taskRows.length ? taskRows : [{}]), 'Tasks')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(subTaskRows.length ? subTaskRows : [{}]), 'SubTasks')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(memberRows.length ? memberRows : [{}]), 'Members')

  XLSX.writeFile(wb, `TaskFlow_Export_${new Date().toISOString().split('T')[0]}.xlsx`)
}
