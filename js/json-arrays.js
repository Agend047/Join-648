let user = {
  name: "Vorname Nachname",
  email: "email@email.de",
  password: "test123",
  initials: "VN",
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
  id: 1,
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
      status: "done",
    },
  ],
  status: ["todo", "inprogress", "feedback", "done"] /* nur eine Zuweisung */,
};

let todo = [1, 5, 6];
let inprogress = [3, 4];
let feedback = [7];
let done = [8, 9];

let task2 = {
  title: "title",
  description: "längerer Text",
  dueDate: "dd/mm/yyyy",
  prio: "urgent",
  category: "user story",
  assignedTo: [3, 6, 10],
  subtasks: ["subtask1", "subtask2"],
};
