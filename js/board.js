function noTasksPlaceholder(colID, colTitle) {
  let content = document.getElementById(colID);

  if (content.innerHTML === "") {
    content.innerHTML = `
    <div class="placeholder">No tasks ${colTitle}</div>
`;
  }
}
