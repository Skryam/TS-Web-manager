const task =
[
  {
    "id": "10",
    "name": "wada",
    "description": "awd",
    "status": {
        "name": "111",
        "__typename": "Status"
    },
    "executor": {
        "firstName": "ыыы",
        "lastName": "ыыы",
        "__typename": "User"
    },
    "creator": {
        "firstName": "цв",
        "lastName": "фцв",
        "__typename": "User"
    },
    "labels": [],
    "createdAt": "1784703924712",
    "__typename": "Task"
  }
]

const va = task.map(({ id, name, description, status, executor, creator, labels }) => ({
  id,
  name,
  description,
  status: status.name,
  executor: `${executor.firstName} ${executor.lastName}`,
  creator: `${creator.firstName} ${creator.lastName}`,
  labels
}))

console.log(va)