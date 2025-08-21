const API = '';

async function fetchTree() {
  const res = await fetch(`${API}/api/tree`);
  const data = await res.json();
  const container = document.getElementById('tree');
  container.innerHTML = '';
  container.appendChild(renderNodes(data));
}

function renderNodes(nodes) {
  const ul = document.createElement('ul');
  nodes.forEach(n => {
    const li = document.createElement('li');
    li.textContent = `${n.name} (b. ${n.birthYear}) [${n.id}]`;
    if (n.children && n.children.length) {
      li.appendChild(renderNodes(n.children));
    }
    ul.appendChild(li);
  });
  return ul;
}

document.getElementById('member-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const birthYear = parseInt(document.getElementById('birthYear').value, 10);
  await fetch(`${API}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, birthYear })
  });
  e.target.reset();
  fetchTree();
});

document.getElementById('relation-form').addEventListener('submit', async e => {
  e.preventDefault();
  const parentId = document.getElementById('parentId').value;
  const childId = document.getElementById('childId').value;
  await fetch(`${API}/api/relations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parentId, childId })
  });
  e.target.reset();
  fetchTree();
});

fetchTree();
