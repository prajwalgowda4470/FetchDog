// search.js
// Placeholder for search/filter logic 

// HTTP status codes and descriptions for suggestions
const httpCodes = [
  { code: 100, desc: "Continue" },
  { code: 101, desc: "Switching Protocols" },
  { code: 200, desc: "OK" },
  { code: 201, desc: "Created" },
  { code: 202, desc: "Accepted" },
  { code: 203, desc: "Non-Authoritative Information" },
  { code: 204, desc: "No Content" },
  { code: 205, desc: "Reset Content" },
  { code: 206, desc: "Partial Content" },
  { code: 301, desc: "Moved Permanently" },
  { code: 302, desc: "Found" },
  { code: 400, desc: "Bad Request" },
  { code: 401, desc: "Unauthorized" },
  { code: 403, desc: "Forbidden" },
  { code: 404, desc: "Not Found" },
  { code: 418, desc: "I'm a teapot" },
  { code: 500, desc: "Internal Server Error" },
  // ...add more as needed
];

const filterInput = document.getElementById('filterInput');
const suggestions = document.getElementById('suggestions');

function showDogImage(code) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div style='text-align:center;'><img src='https://http.dog/${code}.jpg' alt='Dog for ${code}' style='width:200px; border-radius:10px; box-shadow:0 2px 8px #ccc;'><div>${code}</div></div>`;
}

function showDogImagesForCodes(codes) {
    const resultsDiv = document.getElementById('results');
    if (codes.length === 0) {
        resultsDiv.innerHTML = '<div style="text-align:center;">No matching codes found.</div>';
        return;
    }
    resultsDiv.innerHTML = `
        <div style='display:flex; flex-wrap:wrap; gap:20px; justify-content:center;'>
            ${codes.map(code => `
                <div style='text-align:center;'>
                    <img src='https://http.dog/${code}.jpg' alt='Dog for ${code}' style='width:120px; border-radius:10px; box-shadow:0 2px 8px #ccc;'>
                    <div>${code}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function getMatchingCodes(pattern) {
    // e.g. 2xx, 20x, 203
    if (/^\d{3}$/.test(pattern)) {
        // Exact 3-digit code
        return httpCodes.filter(item => item.code.toString() === pattern).map(item => item.code);
    } else if (/^\d{1,2}x{1,2}$/.test(pattern)) {
        // Wildcard patterns like 2xx, 20x
        const regex = new RegExp('^' + pattern.replace(/x/g, '\\d') + '$');
        return httpCodes.filter(item => regex.test(item.code.toString())).map(item => item.code);
    } else if (/^\d+$/.test(pattern)) {
        // Partial code, e.g. 2, 20
        return httpCodes.filter(item => item.code.toString().startsWith(pattern)).map(item => item.code);
    }
    return [];
}

filterInput.addEventListener('input', function() {
    const value = this.value.trim();
    if (!value) {
        suggestions.style.display = 'none';
        document.getElementById('results').innerHTML = '';
        return;
    }
    const filtered = httpCodes.filter(item =>
        item.code.toString().startsWith(value) ||
        item.desc.toLowerCase().includes(value.toLowerCase())
    );
    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        document.getElementById('results').innerHTML = '';
        return;
    }
    suggestions.innerHTML = filtered.map(item =>
        `<li style="padding:8px; cursor:pointer;" data-code="${item.code}">${item.code} - ${item.desc}</li>`
    ).join('');
    suggestions.style.display = 'block';
    // Show images for wildcards or exact
    const codes = getMatchingCodes(value);
    if (codes.length > 0) showDogImagesForCodes(codes);
    else document.getElementById('results').innerHTML = '';
});

suggestions.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        filterInput.value = e.target.getAttribute('data-code');
        suggestions.style.display = 'none';
        showDogImagesForCodes([e.target.getAttribute('data-code')]);
    }
});

document.addEventListener('click', function(e) {
    if (e.target !== filterInput) {
        suggestions.style.display = 'none';
    }
});

async function saveListToBackend(name, codes) {
    // Get image links for codes
    const images = codes.map(code => `https://http.dog/${code}.jpg`);
    // Get token or credentials if needed (for now, assume session)
    const res = await fetch('http://localhost:8082/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send cookies if using session auth
        body: JSON.stringify({ name, codes: codes.map(String), images })
    });
    return res.json();
}

const saveBtn = document.getElementById('saveListBtn');
const listNameInput = document.getElementById('listNameInput');
const saveMsg = document.getElementById('saveMsg');
let lastCodes = [];

function updateLastCodes(codes) {
    lastCodes = codes;
}

// Patch showDogImagesForCodes to update lastCodes
const origShowDogImagesForCodes = showDogImagesForCodes;
showDogImagesForCodes = function(codes) {
    updateLastCodes(codes);
    origShowDogImagesForCodes(codes);
}

saveBtn.addEventListener('click', async function() {
    const name = listNameInput.value.trim();
    if (!name) {
        saveMsg.innerHTML = '<span style="color:#d8000c;">Please enter a list name.</span>';
        return;
    }
    if (!lastCodes || lastCodes.length === 0) {
        saveMsg.innerHTML = '<span style="color:#d8000c;">No dog images to save. Please search and select images first.</span>';
        return;
    }
    try {
        const res = await saveListToBackend(name, lastCodes);
        if (res.message) {
            saveMsg.innerHTML = `<span style='color:#4F8A10;'>${res.message}</span>`;
        } else if (res.error) {
            saveMsg.innerHTML = `<span style='color:#d8000c;'>${res.error}</span>`;
        } else {
            saveMsg.innerHTML = `<span style='color:#d8000c;'>Unknown error occurred.</span>`;
        }
    } catch (err) {
        saveMsg.innerHTML = `<span style='color:#d8000c;'>Failed to save list. Please try again.</span>`;
    }
}); 