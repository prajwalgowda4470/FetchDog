// lists.js
// Placeholder for lists page logic 

// Demo: Display a sample list of response codes with dog images from http.dog

async function fetchLists() {
    const res = await fetch('http://localhost:8082/lists', {
        method: 'GET',
        credentials: 'include', // send cookies if using session auth
    });
    return res.json();
}

async function deleteList(id) {
    const res = await fetch(`http://localhost:8082/lists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
}

async function updateList(id, newName) {
    const res = await fetch(`http://localhost:8082/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newName })
    });
    return res.json();
}

function showListDetails(list, refreshLists) {
    const detailsDiv = document.getElementById('listDetails');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = `
        <h2 contenteditable="true" id="editListName">${list.name}</h2>
        <div style="font-size:12px; color:#888; margin-bottom:10px;">Created: ${list.createdAt ? list.createdAt.replace('T', ' ').slice(0, 19) : ''}</div>
        <div style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">
            ${list.responseCodes.map((code, i) => `
                <div style="display:inline-block; margin:10px; text-align:center;">
                    <img src="${list.imageLinks[i]}" alt="Dog for ${code}" style="width:120px; border-radius:10px; box-shadow:0 2px 8px #ccc;">
                    <div>${code}</div>
                </div>
            `).join('')}
        </div>
        <div style='margin-top:20px;'>
            <button id='saveEditBtn' style='margin-right:10px;'>Save Name</button>
            <button id='deleteListBtn' style='background:#d8000c;'>Delete List</button>
            <span id='editMsg' style='margin-left:10px;'></span>
        </div>
    `;
    document.getElementById('saveEditBtn').onclick = async function() {
        const newName = document.getElementById('editListName').innerText.trim();
        if (!newName) {
            document.getElementById('editMsg').innerHTML = "<span style='color:#d8000c;'>Name cannot be empty.</span>";
            return;
        }
        const res = await updateList(list.id, newName);
        if (res.message) {
            document.getElementById('editMsg').innerHTML = `<span style='color:#4F8A10;'>${res.message}</span>`;
            if (refreshLists) refreshLists();
        } else {
            document.getElementById('editMsg').innerHTML = `<span style='color:#d8000c;'>${res.error || 'Update failed.'}</span>`;
        }
    };
    document.getElementById('deleteListBtn').onclick = async function() {
        if (!confirm('Delete this list?')) return;
        const res = await deleteList(list.id);
        if (res.message) {
            detailsDiv.style.display = 'none';
            if (refreshLists) refreshLists();
        } else {
            document.getElementById('editMsg').innerHTML = `<span style='color:#d8000c;'>${res.error || 'Delete failed.'}</span>`;
        }
    };
}

function showLists(lists) {
    const listsContainer = document.getElementById('listsContainer');
    if (!lists.length) {
        listsContainer.innerHTML = '<div style="text-align:center; color:#888;">No saved lists found.</div>';
        return;
    }
    listsContainer.innerHTML = lists.map((list, idx) => `
        <div class="list-item" style="cursor:pointer;" data-idx="${idx}">
            <span>${list.name}</span>
            <span style="font-size:12px; color:#888;">${list.createdAt ? list.createdAt.replace('T', ' ').slice(0, 19) : ''}</span>
        </div>
    `).join('');
    // Add click listeners
    Array.from(document.getElementsByClassName('list-item')).forEach(item => {
        item.onclick = function() {
            const idx = this.getAttribute('data-idx');
            showListDetails(lists[idx], async () => {
                const updatedLists = await fetchLists();
                showLists(updatedLists);
            });
        };
    });
}

window.onload = async function() {
    const lists = await fetchLists();
    showLists(lists);
}; 