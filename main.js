// GitHub Pages base URL (your repo URL)
const directoryUrl = "https://nika-somkhishvili.github.io/project-mpl";

// Global items array
let items = [];

// Load JSON data and prepend directoryUrl to each image
async function loadData() {
    const res = await fetch("data/items.json");
    const data = await res.json();

    // Make image URLs absolute
    items = data.map((item) => ({
        ...item,
        image: `${directoryUrl}/images/${item.image}`,
    }));

    render(items);
}

// Render items to the grid
function render(list) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (const item of list) {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="name">${item.name}</div>
    `;

        grid.appendChild(card);
    }
}

// Search by name
document.getElementById("search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();

    const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(q),
    );

    render(filtered);
});

// Initialize
loadData();
