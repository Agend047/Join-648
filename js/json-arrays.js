let user = {
  name: "Vorname Nachname",
  email: "email@email.de",
  password: "test123",
};

let contact = {
  startingLetter: "A",
  name: "Anja Schulz",
  e_mail: "schulz@hotmail.com",
  phone: 9102423513,
  initials: "AS",
  color: "#FF7A00",
  id: 1,
};

let taskList = {
  title: "title",
  description: "längerer Text",
  dueDate: "dd/mm/yyyy",
  priority: "urgent",
  category: "user story",
  assignedTo: [
    {
      startingLetter: "A",
      name: "Anja Schulz",
      e_mail: "schulz@hotmail.com",
      phone: 9102423513,
      initials: "AS",
      color: "#FF7A00",
    },
  ],
  subtasks: [
    {
      text: "subtask1",
      status: "done" / "todo",
    },
  ],
};

let task2 = {
  title: "title",
  description: "längerer Text",
  dueDate: "dd/mm/yyyy",
  prio: "urgent",
  category: "user story",
  assignedTo: [3, 6, 10],
  subtasks: ["subtask1", "subtask2"],
};
