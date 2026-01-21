// GitHub Pages base URL (your repo URL)
const directoryUrl = "https://nika-somkhishvili.github.io/project-mpl/images";

// Global items array
let items = [];

// Helper: highlight matching text
function highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

// Load JSON data and prepend directoryUrl to each image
async function loadData() {
    const res = await fetch("data/items.json");
    const data = await res.json();

    // Make image URLs absolute
    items = data.map((item) => ({
        ...item,
        image: `${directoryUrl}/${item.image}`,
    }));

    render(items);
}
function render(list, query = "") {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (const item of list) {
        const card = document.createElement("div");
        card.className = "card";

        const tagsText = item.tags.join(", ");

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
            <div class="name">${highlight(item.name, query)}</div>
            <div class="info">
                <div><strong>Category:</strong> ${highlight(item.category, query)}</div>
                <div><strong>Tags:</strong> ${highlight(tagsText, query)}</div>
                <div><strong>ID:</strong> ${highlight(item.id, query)}</div>
            </div>

            <div class="card-buttons">
                <button class="download">Download</button>
                <button class="copy">Copy URL</button>
            </div>
        `;

        // --- Copy URL ---
        card.querySelector(".copy").addEventListener("click", () => {
            // Fallback if navigator.clipboard not available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard
                    .writeText(item.image)
                    .then(() => alert("URL copied!"))
                    .catch(() => fallbackCopy(item.image));
            } else {
                fallbackCopy(item.image);
            }
        });

        function fallbackCopy(text) {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed"; // prevent scrolling
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
                console.log("URL copied!");
            } catch {
                alert("Failed to copy URL.");
            }
            document.body.removeChild(textarea);
        }

        // --- Download image via fetch + blob (forces download even cross-origin)
        card.querySelector(".download").addEventListener("click", async () => {
            try {
                const response = await fetch(item.image);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = item.image.split("/").pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Free memory
                URL.revokeObjectURL(url);
            } catch (err) {
                alert(
                    "Failed to download image. Try right-click → Save image.",
                );
                console.error(err);
            }
        });

        grid.appendChild(card);
    }
}

// Search by all fields
document.getElementById("search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();

    const filtered = items.filter((item) => {
        const tagsText = item.tags.join(" ");
        return (
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            tagsText.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q)
        );
    });

    render(filtered, q);
});

// Initialize
loadData();
