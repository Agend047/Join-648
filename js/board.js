function noTasksPlaceholder(rowID, rowTitle) {
  let content = document.getElementById(rowID);

  if (content.innerHTML === "") {
    content.innerHTML = `
    <div class="placeholder">No tasks ${rowTitle}</div>
`;
  }
}
